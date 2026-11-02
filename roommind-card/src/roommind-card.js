import { LitElement, html, nothing } from "lit";

import { localize } from "./localize.js";
import { cardStyles } from "./styles.js";
import {
  CARD_TYPE,
  DEFAULTS,
  EDITOR_TYPE,
  OVERRIDE_FOR_PRESET,
  PRESET_FOR_OVERRIDE,
  VERSION,
  durationHours,
  durationLabel,
  fireEvent,
  formatNumber,
  formatRemaining,
  formatTemp,
  formatUntil,
  fromCelsius,
  isOpenState,
  normalizeDuration,
  overrideUntil,
  resolveAreaId,
  roundToStep,
  tempUnit,
  toCelsius,
  toLocalInput,
  windowIcon,
} from "./utils.js";
import "./editor.js";

const POLL_INTERVAL = 30000;
const PRESET_ORDER = ["none", "comfort", "eco", "manual"];
const PRESET_ICONS = {
  none: "mdi:calendar-clock",
  comfort: "mdi:sofa-outline",
  eco: "mdi:leaf",
  manual: "mdi:hand-back-right-outline",
};
const MODE_ORDER = ["off", "heat", "cool", "heat_cool", "auto"];
const MODE_ICONS = {
  off: "mdi:power",
  heat: "mdi:fire",
  cool: "mdi:snowflake",
  heat_cool: "mdi:sun-snowflake-variant",
  auto: "mdi:thermostat-auto",
};
const ACTION_ICONS = {
  heating: "mdi:fire",
  cooling: "mdi:snowflake",
  idle: "mdi:thermostat",
  off: "mdi:power",
  fan: "mdi:fan",
  drying: "mdi:water-percent",
};

export class RoomMindCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _rooms: { state: true },
    _areaId: { state: true },
    _apiOk: { state: true },
    _pending: { state: true },
    _duration: { state: true },
    _busy: { state: true },
    _error: { state: true },
    _draft: { state: true },
    _saved: { state: true },
    _now: { state: true },
    _customOpen: { state: true },
    _customMode: { state: true },
    _customHours: { state: true },
    _customMinutes: { state: true },
    _customUntil: { state: true },
    _customError: { state: true },
  };

  static styles = cardStyles;

  static getConfigElement() {
    return document.createElement(EDITOR_TYPE);
  }

  static getStubConfig(hass) {
    const ids = Object.keys(hass?.states || {});
    const entity =
      ids.find((id) => id.startsWith("climate.roommind_") && !id.endsWith("_override")) ||
      ids.find((id) => id.startsWith("climate.")) ||
      "";
    return { entity };
  }

  constructor() {
    super();
    this._now = Date.now();
    this._apiOk = undefined;
    this._busy = 0;
  }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
    const previous = this._config;
    this._config = { ...DEFAULTS, ...config };
    const durations = (this._config.durations || []).map(normalizeDuration).filter((d) => d !== undefined);
    this._durations = durations.length ? durations : ["schedule"];
    if (!previous || previous.default_duration !== config.default_duration || this._duration === undefined) {
      const wanted = normalizeDuration(this._config.default_duration) ?? "schedule";
      this._duration = wanted;
    }
    if (previous && (previous.entity !== config.entity || previous.area_id !== config.area_id)) {
      this._areaId = undefined;
      this._rooms = undefined;
      this._draft = undefined;
      this._fetchRooms();
    }
  }

  getCardSize() {
    return this._config?.compact ? 5 : 8;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" };
  }

  connectedCallback() {
    super.connectedCallback();
    this._fetchRooms();
    this._poll = setInterval(() => {
      this._now = Date.now();
      this._fetchRooms();
    }, POLL_INTERVAL);
    this._tick = setInterval(() => {
      if (this._overrideActive()) this._now = Date.now();
      // A chosen end time that has passed falls back to the default duration
      const d = this._duration;
      if (d && typeof d === "object" && d.until && d.until <= Date.now() / 1000) {
        this._duration = normalizeDuration(this._config.default_duration) ?? "schedule";
      }
    }, 10000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._poll);
    clearInterval(this._tick);
    clearTimeout(this._applyTimer);
    clearTimeout(this._refetchTimer);
    clearTimeout(this._errorTimer);
  }

  // --- Data ---------------------------------------------------------------------------------

  get _stateObj() {
    return this.hass?.states?.[this._config?.entity];
  }

  get _room() {
    return this._areaId ? this._rooms?.rooms?.[this._areaId] : undefined;
  }

  get _live() {
    return this._room?.live;
  }

  /** Area id used to build the ids of the related RoomMind entities. */
  get _entityArea() {
    if (this._areaId) return this._areaId;
    const match = /^climate\.roommind_(.+)$/.exec(this._config?.entity || "");
    return match ? match[1] : undefined;
  }

  _relatedEntities() {
    const area = this._entityArea;
    const ids = {
      vacation: this._config.vacation_entity || "switch.roommind_vacation",
      climate_control: area ? `switch.roommind_${area}_climate_control` : undefined,
      cover_auto: area ? `switch.roommind_${area}_cover_auto` : undefined,
      cover_paused: area ? `binary_sensor.roommind_${area}_cover_paused` : undefined,
    };
    return ids;
  }

  _watchedEntities() {
    const ids = [this._config?.entity, ...Object.values(this._relatedEntities())];
    for (const id of this._room?.window_sensors || []) ids.push(id);
    return ids.filter(Boolean);
  }

  async _fetchRooms() {
    if (!this.hass || !this._config?.entity || !this.isConnected) return;
    if (this._fetching) {
      this._refetch = true;
      return;
    }
    this._fetching = true;
    try {
      const result = await this.hass.callWS({ type: "roommind/rooms/list" });
      if (!this._areaId) {
        this._areaId = await resolveAreaId(this.hass, this._config.entity, result?.rooms, this._config.area_id);
      }
      this._rooms = result;
      this._apiOk = Boolean(this._areaId && result?.rooms?.[this._areaId]);
    } catch (_err) {
      this._apiOk = false;
    } finally {
      this._fetching = false;
      if (this._refetch) {
        this._refetch = false;
        this._fetchRooms();
      }
    }
  }

  _scheduleFetch(delay = 800) {
    clearTimeout(this._refetchTimer);
    this._refetchTimer = setTimeout(() => this._fetchRooms(), delay);
  }

  shouldUpdate(changed) {
    if (!this._config) return false;
    if (changed.size > 1 || !changed.has("hass")) return true;
    const old = changed.get("hass");
    if (!old || old.locale !== this.hass.locale || old.themes !== this.hass.themes) return true;
    return this._watchedEntities().some((id) => old.states[id] !== this.hass.states[id]);
  }

  willUpdate(changed) {
    if (changed.has("hass")) {
      const old = changed.get("hass");
      const stateObj = this._stateObj;
      const oldState = old?.states?.[this._config.entity];
      if (old && stateObj && oldState && stateObj !== oldState) {
        // The entity changed: refresh RoomMind's live data (override end, window, …)
        this._scheduleFetch();
        if (this._pending && this._appliedAt && this._bandMatches(this._pending)) this._pending = undefined;
      }
      if (!old && this._apiOk === undefined) this._fetchRooms();
    }
  }

  // --- Service helpers ----------------------------------------------------------------------

  async _run(fn) {
    this._busy += 1;
    try {
      await fn();
    } catch (err) {
      this._showError(err);
    } finally {
      this._busy -= 1;
    }
  }

  _showError(err) {
    this._error = localize(this.hass, "error.action", { message: err?.message || err?.code || String(err) });
    clearTimeout(this._errorTimer);
    this._errorTimer = setTimeout(() => {
      this._error = undefined;
    }, 7000);
  }

  _climate(service, data = {}) {
    return this.hass.callService("climate", service, { entity_id: this._config.entity, ...data });
  }

  async _setOverride(type, heatC, coolC, duration) {
    const msg = { type: "roommind/override/set", area_id: this._areaId, override_type: type };
    if (type === "custom") {
      if (heatC !== null && heatC !== undefined) msg.heat = Math.round(heatC * 100) / 100;
      if (coolC !== null && coolC !== undefined) msg.cool = Math.round(coolC * 100) / 100;
    }
    const hours = durationHours(duration);
    if (hours !== undefined) {
      if (hours <= 0) throw new Error(localize(this.hass, "duration.in_past"));
      msg.duration = hours;
    }
    await this.hass.callWS(msg);
    this._scheduleFetch(300);
  }

  _bandMatches(pending) {
    const band = this._currentBand();
    return Object.entries(pending).every(
      ([side, value]) => value === undefined || (band[side] !== undefined && Math.abs(band[side] - value) < 0.01),
    );
  }

  get _hvacMode() {
    return this._stateObj?.state;
  }

  get _isDual() {
    const attrs = this._stateObj?.attributes || {};
    return (
      attrs.target_temp_low !== undefined &&
      attrs.target_temp_low !== null &&
      (attrs.temperature === undefined || attrs.temperature === null)
    );
  }

  /** Current band in display units: { heat, cool } (one side can be undefined). */
  _currentBand() {
    const attrs = this._stateObj?.attributes || {};
    if (this._isDual) return { heat: attrs.target_temp_low, cool: attrs.target_temp_high };
    if (this._hvacMode === "cool" || this._room?.climate_mode === "cool_only") return { cool: attrs.temperature };
    return { heat: attrs.temperature };
  }

  _overrideActive() {
    // The entity reports changes first, RoomMind's live data also knows suppressed overrides
    const preset = this._stateObj?.attributes?.preset_mode;
    return Boolean((preset && preset !== "none") || this._live?.override_active);
  }

  _overridePreset() {
    const preset = this._stateObj?.attributes?.preset_mode;
    if (preset && preset !== "none") return preset;
    const live = this._live;
    if (live?.override_active && live.override_type) return PRESET_FOR_OVERRIDE[live.override_type] || "manual";
    return undefined;
  }

  // --- Actions ------------------------------------------------------------------------------

  _step(side, direction) {
    const attrs = this._stateObj.attributes;
    const step = Number(attrs.target_temp_step) || 0.5;
    const min = Number(attrs.min_temp ?? 5);
    const max = Number(attrs.max_temp ?? 35);
    const band = { ...this._currentBand(), ...(this._pending || {}) };
    const base = band[side] ?? (side === "heat" ? band.cool : band.heat) ?? attrs.current_temperature ?? 20;
    const next = Math.min(max, Math.max(min, roundToStep(Number(base) + direction * step, step)));
    const pending = { ...band, [side]: next };
    // Keep a valid band in auto mode: cooling target never below the heating target
    if (this._isDual && pending.heat !== undefined && pending.cool !== undefined && pending.cool < pending.heat) {
      if (side === "heat") pending.cool = pending.heat;
      else pending.heat = pending.cool;
    }
    this._pending = pending;
    this._appliedAt = undefined;
    clearTimeout(this._applyTimer);
    this._applyTimer = setTimeout(() => this._applyPending(), Number(this._config.apply_delay) || 1200);
  }

  async _applyPending() {
    const pending = this._pending;
    if (!pending) return;
    const duration = this._duration;
    this._appliedAt = Date.now();
    await this._run(async () => {
      if (!this._apiOk || duration === "schedule") {
        if (this._isDual) {
          await this._climate("set_temperature", {
            target_temp_low: pending.heat,
            target_temp_high: pending.cool,
          });
        } else {
          await this._climate("set_temperature", { temperature: pending.heat ?? pending.cool });
        }
      } else {
        await this._setOverride(
          "custom",
          toCelsius(this.hass, pending.heat),
          toCelsius(this.hass, pending.cool),
          duration,
        );
      }
    });
    if (this._pending === pending && this._bandMatches(pending)) this._pending = undefined;
    // Fallback: drop the optimistic value if the entity does not report back
    setTimeout(() => {
      if (this._pending === pending) this._pending = undefined;
    }, 8000);
  }

  _selectPreset(preset) {
    const duration = this._duration;
    clearTimeout(this._applyTimer);
    this._pending = undefined;
    return this._run(async () => {
      if (preset === "none" || !this._apiOk || duration === "schedule") {
        await this._climate("set_preset_mode", { preset_mode: preset });
        return;
      }
      if (preset === "manual") {
        const band = this._currentBand();
        await this._setOverride(
          "custom",
          toCelsius(this.hass, band.heat),
          toCelsius(this.hass, band.cool),
          duration,
        );
        return;
      }
      await this._setOverride(OVERRIDE_FOR_PRESET[preset], null, null, duration);
    });
  }

  /** Picks a duration; with an active override it changes how long that override runs. */
  _selectDuration(duration) {
    this._duration = duration;
    if (!this._overrideActive() || !this._apiOk) return undefined;
    const preset = this._overridePreset() || "manual";
    return this._run(async () => {
      if (duration === "schedule") {
        if (preset === "comfort" || preset === "eco") {
          await this._climate("set_preset_mode", { preset_mode: preset });
        } else {
          // A held band only ends at the schedule change when it is set through the entity
          const band = this._currentBand();
          await this._climate("set_preset_mode", { preset_mode: "none" });
          if (this._isDual) {
            await this._climate("set_temperature", { target_temp_low: band.heat, target_temp_high: band.cool });
          } else {
            await this._climate("set_temperature", { temperature: band.heat ?? band.cool });
          }
        }
        return;
      }
      const { type, heat, cool } = this._activeOverride();
      await this._setOverride(type, heat, cool, duration);
    });
  }

  /** Type and band (°C) of the running override, from RoomMind's live data or else the entity. */
  _activeOverride() {
    const live = this._live || {};
    const type = (live.override_active && live.override_type) || OVERRIDE_FOR_PRESET[this._overridePreset()] || "custom";
    if (live.override_active && (live.override_heat != null || live.override_cool != null)) {
      return { type, heat: live.override_heat, cool: live.override_cool };
    }
    const band = this._currentBand();
    return { type, heat: toCelsius(this.hass, band.heat), cool: toCelsius(this.hass, band.cool) };
  }

  _extendOverride(hours) {
    const until = overrideUntil(this._stateObj, this._live);
    if (!until || !this._apiOk) return undefined;
    const remaining = Math.max(0, until - Date.now() / 1000) / 3600;
    const { type, heat, cool } = this._activeOverride();
    return this._run(() => this._setOverride(type, heat, cool, Math.round((remaining + hours) * 1000) / 1000));
  }

  _endOverride() {
    return this._run(async () => {
      if (this._apiOk) {
        await this.hass.callWS({ type: "roommind/override/clear", area_id: this._areaId });
        this._scheduleFetch(300);
      } else {
        await this._climate("set_preset_mode", { preset_mode: "none" });
      }
    });
  }

  _setMode(mode) {
    return this._run(() => this._climate("set_hvac_mode", { hvac_mode: mode }));
  }

  _toggle(entityId) {
    const domain = entityId.split(".")[0];
    return this._run(async () => {
      await this.hass.callService(domain === "switch" ? "switch" : "homeassistant", "toggle", {
        entity_id: entityId,
      });
      this._scheduleFetch(1500);
    });
  }

  _resumeCovers() {
    return this._run(async () => {
      await this.hass.callWS({ type: "roommind/covers/clear_override", area_id: this._areaId });
      this._scheduleFetch(300);
    });
  }

  _moreInfo(entityId) {
    fireEvent(this, "hass-more-info", { entityId });
  }

  // --- Settings -----------------------------------------------------------------------------

  _settingFields() {
    const room = this._room;
    if (!room) return [];
    const mode = room.climate_mode || "auto";
    const fields = [];
    if (mode !== "cool_only") {
      fields.push({ key: "comfort_heat", temp: true }, { key: "eco_heat", temp: true });
    }
    if (mode !== "heat_only") {
      fields.push({ key: "comfort_cool", temp: true }, { key: "eco_cool", temp: true });
    }
    if ((room.window_sensors || []).length) {
      fields.push({ key: "window_open_delay", seconds: true }, { key: "window_close_delay", seconds: true });
    }
    return fields;
  }

  _settingValue(field) {
    if (this._draft && this._draft[field.key] !== undefined) return this._draft[field.key];
    const raw = this._room?.[field.key];
    if (raw === undefined || raw === null) return field.seconds ? 0 : undefined;
    return field.temp ? roundToStep(fromCelsius(this.hass, raw), 0.5) : raw;
  }

  _changeSetting(field, value) {
    if (value === "" || Number.isNaN(Number(value))) return;
    let num = Number(value);
    if (field.seconds) num = Math.max(0, Math.round(num));
    else num = Math.min(fromCelsius(this.hass, 35), Math.max(fromCelsius(this.hass, 5), num));
    this._draft = { ...(this._draft || {}), [field.key]: num };
    this._saved = false;
  }

  _saveSettings() {
    const draft = this._draft;
    if (!draft || !this._areaId) return undefined;
    const msg = { type: "roommind/rooms/save", area_id: this._areaId };
    for (const field of this._settingFields()) {
      if (draft[field.key] === undefined) continue;
      msg[field.key] = field.temp
        ? Math.round(toCelsius(this.hass, draft[field.key]) * 10) / 10
        : Math.round(draft[field.key]);
    }
    return this._run(async () => {
      await this.hass.callWS(msg);
      this._draft = undefined;
      this._saved = true;
      setTimeout(() => {
        this._saved = false;
      }, 3000);
      await this._fetchRooms();
    });
  }

  // --- Render -------------------------------------------------------------------------------

  render() {
    if (!this._config || !this.hass) return nothing;
    const t = (key, vars) => localize(this.hass, key, vars);
    if (!this._config.entity) {
      return html`<ha-card><div class="message warning">${t("card.no_entity")}</div></ha-card>`;
    }
    const stateObj = this._stateObj;
    if (!stateObj) {
      return html`<ha-card
        ><div class="message warning">${t("card.not_found", { entity: this._config.entity })}</div></ha-card
      >`;
    }
    const unavailable = stateObj.state === "unavailable" || stateObj.state === "unknown";
    const action = unavailable ? "off" : this._action(stateObj);
    const controllable = !unavailable && Number(stateObj.attributes.supported_features || 0) !== 0;
    const c = this._config;

    return html`
      <ha-card class="action-${action} ${c.compact ? "compact" : ""}">
        ${this._busy ? html`<div class="busy"></div>` : nothing} ${this._renderHeader(stateObj, action, unavailable)}
        ${c.show_status ? this._renderChips(stateObj) : nothing}
        ${controllable && c.show_target ? this._renderTargets(stateObj) : nothing}
        ${controllable && (c.show_target || c.show_presets) ? this._renderOverride(stateObj) : nothing}
        ${controllable && c.show_duration ? this._renderDurations() : nothing}
        ${controllable && c.show_presets ? this._renderPresets(stateObj) : nothing}
        ${controllable && c.show_modes ? this._renderModes(stateObj) : nothing}
        ${c.show_windows ? this._renderWindows() : nothing} ${c.show_toggles ? this._renderToggles() : nothing}
        ${c.show_info ? this._renderInfo(stateObj) : nothing}
        ${c.show_settings ? this._renderSettings() : nothing}
        ${this._error ? html`<div class="message error">${this._error}</div>` : nothing}
      </ha-card>
    `;
  }

  _action(stateObj) {
    if (stateObj.state === "off") return "off";
    const action = stateObj.attributes.hvac_action;
    if (action === "heating" || action === "preheating") return "heating";
    if (action === "cooling") return "cooling";
    if (action === "off") return "off";
    return action || "idle";
  }

  _renderHeader(stateObj, action, unavailable) {
    const t = (key, vars) => localize(this.hass, key, vars);
    const attrs = stateObj.attributes;
    const name = this._config.name || attrs.friendly_name || this._config.entity;
    const icon = this._config.icon || attrs.icon || "mdi:home-thermometer";
    const live = this._live;
    let status = unavailable ? t("card.unavailable") : t(`action.${action}`);
    if (!unavailable && action === "heating" && live?.heating_power) status += ` · ${live.heating_power} %`;
    if (!unavailable && attrs.window_open) status += ` · ${t("chip.window_open")}`;
    const humidity = attrs.current_humidity ?? live?.current_humidity;
    return html`
      <div class="header" @click=${() => this._moreInfo(this._config.entity)}>
        <div class="icon-bubble"><ha-icon .icon=${icon}></ha-icon></div>
        <div class="heading">
          <div class="name">${name}</div>
          <div class="status"><span class="dot"></span><span>${status}</span></div>
        </div>
        <div class="current">
          <div class="temp">
            ${formatNumber(this.hass, attrs.current_temperature, 1)}<span class="unit">${tempUnit(this.hass)}</span>
          </div>
          ${humidity !== undefined && humidity !== null
            ? html`<div class="humidity">
                <ha-icon icon="mdi:water-percent"></ha-icon>${formatNumber(this.hass, humidity, 0)} %
              </div>`
            : nothing}
        </div>
      </div>
    `;
  }

  _renderChips(stateObj) {
    const t = (key, vars) => localize(this.hass, key, vars);
    const attrs = stateObj.attributes;
    const live = this._live || {};
    const global = this._rooms || {};
    const chips = [];
    const windows = this._room?.window_sensors || [];
    if (attrs.window_open || live.window_open) {
      chips.push(html`<button class="chip warn clickable" @click=${() => this._scrollTo("windows")}>
        <ha-icon icon="mdi:window-open-variant"></ha-icon>${t("chip.window_open")}
      </button>`);
    } else if (windows.length) {
      chips.push(html`<span class="chip ok"><ha-icon icon="mdi:window-closed-variant"></ha-icon>${t(
        "chip.window_closed",
      )}</span>`);
    }
    if (attrs.vacation || global.vacation_active) {
      const until = global.vacation_until;
      const far = until && until > Date.now() / 1000 + 3650 * 86400;
      chips.push(html`<span class="chip info"><ha-icon icon="mdi:beach"></ha-icon>${
        until && !far ? t("chip.vacation_until", { time: formatUntil(this.hass, until) }) : t("chip.vacation")
      }</span>`);
    }
    if (attrs.presence_away || live.presence_away) {
      chips.push(html`<span class="chip"><ha-icon icon="mdi:home-export-outline"></ha-icon>${t("chip.away")}</span>`);
    }
    if (attrs.occupancy_vacant || live.occupancy_vacant) {
      chips.push(html`<span class="chip"><ha-icon icon="mdi:account-off-outline"></ha-icon>${t("chip.vacant")}</span>`);
    }
    if (live.mold_risk_level && live.mold_risk_level !== "ok") {
      const critical = live.mold_risk_level === "critical";
      chips.push(html`<span class="chip ${critical ? "error" : "warn"}"
        ><ha-icon icon="mdi:alert-circle-outline"></ha-icon>${t(critical ? "chip.mold_critical" : "chip.mold_warning")}</span
      >`);
    }
    if (live.mold_prevention_active && live.mold_prevention_delta) {
      chips.push(html`<span class="chip info"><ha-icon icon="mdi:shield-check-outline"></ha-icon>${t(
        "chip.mold_prevention",
        { delta: `${formatNumber(this.hass, live.mold_prevention_delta, 1)} K` },
      )}</span>`);
    }
    if (global.climate_control_active === false) {
      chips.push(html`<span class="chip warn"><ha-icon icon="mdi:pause-circle-outline"></ha-icon>${t(
        "chip.control_paused",
      )}</span>`);
    }
    if (attrs.hvac_action === "preheating") {
      chips.push(html`<span class="chip"><ha-icon icon="mdi:clock-fast"></ha-icon>${t("chip.preheat")}</span>`);
    }
    return chips.length ? html`<div class="chips">${chips}</div>` : nothing;
  }

  _scrollTo(id) {
    this.renderRoot.querySelector(`#${id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  _renderTargets(stateObj) {
    const t = (key, vars) => localize(this.hass, key, vars);
    const off = stateObj.state === "off";
    const band = this._currentBand();
    const pending = this._pending || {};
    const dual = this._isDual;
    const attrs = stateObj.attributes;
    const min = Number(attrs.min_temp ?? 5);
    const max = Number(attrs.max_temp ?? 35);
    const row = (side, label) => {
      const isPending = pending[side] !== undefined && pending[side] !== band[side];
      const value = pending[side] ?? band[side];
      return html`
        <div class="target ${isPending ? "pending" : ""} ${off ? "disabled" : ""}">
          <button
            class="step ${side}"
            ?disabled=${off || (value !== undefined && value <= min)}
            title=${t("target.decrease")}
            @click=${() => this._step(side, -1)}
          >
            <ha-icon icon="mdi:minus"></ha-icon>
          </button>
          <div class="value">
            <div class="label">${isPending ? t("target.pending") : label}</div>
            <div class="number">
              ${value === undefined || value === null
                ? "–"
                : formatNumber(this.hass, value, 1)}<span class="unit">${tempUnit(this.hass)}</span>
            </div>
          </div>
          <button
            class="step ${side}"
            ?disabled=${off || (value !== undefined && value >= max)}
            title=${t("target.increase")}
            @click=${() => this._step(side, 1)}
          >
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        </div>
      `;
    };
    if (dual) {
      return html`<div class="targets dual">${row("heat", t("target.heat"))} ${row("cool", t("target.cool"))}</div>`;
    }
    const side = band.cool !== undefined && band.heat === undefined ? "cool" : "heat";
    return html`<div class="targets">${row(side, t("target.title"))}</div>`;
  }

  _renderOverride(stateObj) {
    const t = (key, vars) => localize(this.hass, key, vars);
    const active = this._overrideActive();
    if (!active) {
      return html`<div class="override">
        <ha-icon icon="mdi:calendar-clock"></ha-icon>
        <div class="text"><div class="title">${t("override.schedule")}</div></div>
      </div>`;
    }
    const preset = this._overridePreset() || "manual";
    const until = overrideUntil(stateObj, this._live);
    const now = this._now / 1000;
    const suppressed = Boolean(this._live?.override_suppressed);
    let sub;
    if (suppressed) {
      sub = t("override.suppressed");
    } else if (until) {
      sub = `${t("override.remaining", { time: formatRemaining(this.hass, until - now) })} · ${t("override.until", {
        time: formatUntil(this.hass, until),
      })}`;
    } else {
      sub = t("override.permanent");
    }
    const extendBy = typeof this._duration === "number" ? this._duration : 1;
    const canExtend = Boolean(until && this._apiOk);
    return html`
      <div class="override active ${preset}">
        <ha-icon .icon=${PRESET_ICONS[preset] || "mdi:hand-back-right-outline"}></ha-icon>
        <div class="text">
          <div class="title">${t("override.active", { preset: t(`preset.${preset}`) })}</div>
          <div class="sub">${sub}</div>
        </div>
        <div class="actions">
          ${canExtend
            ? html`<button class="small-btn" title=${t("override.extend")} @click=${() => this._extendOverride(extendBy)}>
                +${durationLabel(this.hass, extendBy)}
              </button>`
            : nothing}
          <button class="small-btn" @click=${() => this._endOverride()}>${t("override.end")}</button>
        </div>
      </div>
    `;
  }

  _isCustomDuration(d = this._duration) {
    return (d && typeof d === "object") || (typeof d === "number" && !this._durations.includes(d));
  }

  _renderDurations() {
    const t = (key, vars) => localize(this.hass, key, vars);
    // Without the RoomMind API only "until schedule" can be set (through the climate entity)
    if (!this._apiOk) return nothing;
    const options = this._durations;
    const active = this._overrideActive();
    const showCustom = this._config.show_custom_duration !== false;
    const custom = this._isCustomDuration();
    return html`
      <div>
        <div class="section-title">
          ${t("duration.title")}
          <span class="hint">· ${active ? t("duration.hint_active") : t("duration.hint_idle")}</span>
        </div>
        <div class="durations">
          ${options.map(
            (d) => html`<button
              class="dur ${this._duration === d ? "selected" : ""}"
              @click=${() => {
                this._customOpen = false;
                this._selectDuration(d);
              }}
            >
              ${durationLabel(this.hass, d)}
            </button>`,
          )}
          ${showCustom
            ? html`<button
                class="dur custom-chip ${custom ? "selected" : ""} ${this._customOpen ? "open" : ""}"
                @click=${() => this._toggleCustom()}
              >
                <ha-icon icon="mdi:pencil-outline"></ha-icon>
                ${custom ? durationLabel(this.hass, this._duration) : t("duration.custom")}
              </button>`
            : nothing}
        </div>
        ${showCustom && this._customOpen ? this._renderCustomDuration(active) : nothing}
      </div>
    `;
  }

  _toggleCustom() {
    this._customOpen = !this._customOpen;
    if (!this._customOpen) return;
    this._customError = undefined;
    const d = this._duration;
    if (d && typeof d === "object" && d.until) {
      this._customMode = "until";
      this._customUntil = toLocalInput(new Date(d.until * 1000));
    } else {
      const hours = typeof d === "number" ? d : 2;
      this._customMode = this._customMode || "for";
      this._customHours = Math.floor(hours);
      this._customMinutes = Math.round((hours - Math.floor(hours)) * 60);
    }
    if (!this._customUntil) {
      // Default end: in two hours, rounded up to the next quarter hour
      const date = new Date(Date.now() + 2 * 3600 * 1000);
      date.setMinutes(Math.ceil(date.getMinutes() / 15) * 15, 0, 0);
      this._customUntil = toLocalInput(date);
    }
  }

  _customStep(key, delta) {
    if (key === "hours") {
      this._customHours = Math.max(0, Math.min(999, Number(this._customHours || 0) + delta));
    } else {
      let minutes = Number(this._customMinutes || 0) + delta;
      let hours = Number(this._customHours || 0);
      if (minutes >= 60) {
        minutes -= 60;
        hours += 1;
      } else if (minutes < 0) {
        if (hours > 0) {
          minutes += 60;
          hours -= 1;
        } else {
          minutes = 0;
        }
      }
      this._customHours = hours;
      this._customMinutes = minutes;
    }
    this._customError = undefined;
  }

  _applyCustom() {
    let duration;
    if (this._customMode === "until") {
      const date = new Date(this._customUntil);
      if (!this._customUntil || Number.isNaN(date.getTime()) || date.getTime() <= Date.now() + 30000) {
        this._customError = localize(this.hass, "duration.in_past");
        return undefined;
      }
      duration = { until: Math.floor(date.getTime() / 1000) };
    } else {
      const hours = Number(this._customHours || 0) + Number(this._customMinutes || 0) / 60;
      if (!(hours >= 1 / 60)) {
        this._customError = localize(this.hass, "duration.too_short");
        return undefined;
      }
      duration = Math.round(hours * 1000) / 1000;
    }
    this._customError = undefined;
    this._customOpen = false;
    return this._selectDuration(duration);
  }

  _renderCustomDuration(active) {
    const t = (key, vars) => localize(this.hass, key, vars);
    const mode = this._customMode || "for";
    const numberField = (key, label, value, max, step) => html`<label class="field">
      ${label}
      <div class="input">
        <button type="button" @click=${() => this._customStep(key, -step)}>−</button>
        <input
          type="number"
          inputmode="numeric"
          min="0"
          max=${max}
          .value=${String(value ?? 0)}
          @change=${(ev) => {
            const v = Math.max(0, Math.round(Number(ev.target.value) || 0));
            if (key === "hours") this._customHours = Math.min(999, v);
            else this._customMinutes = Math.min(59, v);
            this._customError = undefined;
          }}
        />
        <button type="button" @click=${() => this._customStep(key, step)}>+</button>
      </div>
    </label>`;
    return html`
      <div class="custom">
        <div class="custom-modes">
          <button class="dur ${mode === "for" ? "selected" : ""}" @click=${() => (this._customMode = "for")}>
            ${t("duration.custom_for")}
          </button>
          <button class="dur ${mode === "until" ? "selected" : ""}" @click=${() => (this._customMode = "until")}>
            ${t("duration.custom_until")}
          </button>
        </div>
        ${mode === "for"
          ? html`<div class="custom-fields">
              ${numberField("hours", t("duration.custom_hours"), this._customHours, 999, 1)}
              ${numberField("minutes", t("duration.custom_minutes"), this._customMinutes, 59, 15)}
            </div>`
          : html`<label class="field">
              ${t("duration.custom_end")}
              <div class="input">
                <input
                  type="datetime-local"
                  .value=${this._customUntil || ""}
                  min=${toLocalInput(new Date())}
                  @input=${(ev) => {
                    this._customUntil = ev.target.value;
                    this._customError = undefined;
                  }}
                />
              </div>
            </label>`}
        ${this._customError ? html`<div class="message error">${this._customError}</div>` : nothing}
        <div class="custom-actions">
          <span class="note">${active ? t("duration.custom_hint_active") : t("duration.custom_hint_idle")}</span>
          <button class="small-btn primary" @click=${() => this._applyCustom()}>
            ${active ? t("duration.apply_active") : t("duration.apply")}
          </button>
        </div>
      </div>
    `;
  }

  _presetTemp(preset) {
    const room = this._room;
    if (!room || (preset !== "comfort" && preset !== "eco")) return undefined;
    const coolOnly = room.climate_mode === "cool_only";
    const key = `${preset}_${coolOnly ? "cool" : "heat"}`;
    const value = room[key] ?? (preset === "comfort" ? room.comfort_temp : room.eco_temp);
    return value === undefined || value === null ? undefined : fromCelsius(this.hass, value);
  }

  _renderPresets(stateObj) {
    const t = (key, vars) => localize(this.hass, key, vars);
    const modes = stateObj.attributes.preset_modes || [];
    if (!modes.length) return nothing;
    const current = this._overrideActive() ? this._overridePreset() || "manual" : "none";
    const ordered = [...PRESET_ORDER.filter((p) => modes.includes(p)), ...modes.filter((p) => !PRESET_ORDER.includes(p))];
    return html`
      <div class="segments">
        ${ordered.map((preset) => {
          const temp = this._presetTemp(preset);
          return html`<button
            class="seg ${preset} ${current === preset ? "active" : ""}"
            ?disabled=${stateObj.state === "off"}
            @click=${() => this._selectPreset(preset)}
          >
            <ha-icon .icon=${PRESET_ICONS[preset] || "mdi:tune-variant"}></ha-icon>
            <span class="seg-label">${t(`preset.${preset}`)}</span>
            ${temp !== undefined ? html`<span class="seg-sub">${formatTemp(this.hass, temp, 1)}</span>` : nothing}
          </button>`;
        })}
      </div>
    `;
  }

  _renderModes(stateObj) {
    const t = (key, vars) => localize(this.hass, key, vars);
    const modes = stateObj.attributes.hvac_modes || [];
    if (modes.length < 2) return nothing;
    const ordered = [...MODE_ORDER.filter((m) => modes.includes(m)), ...modes.filter((m) => !MODE_ORDER.includes(m))];
    return html`
      <div class="segments">
        ${ordered.map(
          (mode) => html`<button
            class="seg ${mode} ${stateObj.state === mode ? "active" : ""}"
            @click=${() => this._setMode(mode)}
          >
            <ha-icon .icon=${MODE_ICONS[mode] || "mdi:thermostat"}></ha-icon>
            <span class="seg-label">${t(`hvac.${mode}`)}</span>
          </button>`,
        )}
      </div>
    `;
  }

  _renderWindows() {
    const t = (key, vars) => localize(this.hass, key, vars);
    const room = this._room;
    if (!room) return nothing;
    const sensors = room.window_sensors || [];
    if (!sensors.length) return nothing;
    const anyOpen = Boolean(this._live?.window_open || this._stateObj?.attributes?.window_open);
    const openDelay = room.window_open_delay || 0;
    const closeDelay = room.window_close_delay || 0;
    return html`
      <div id="windows">
        <div class="section-title">${t("windows.title")}</div>
        <div class="rows">
          ${sensors.map((id) => {
            const st = this.hass.states[id];
            const open = st ? isOpenState(st.state) : false;
            const state = !st || st.state === "unavailable" || st.state === "unknown"
              ? t("windows.unknown")
              : open
                ? t("windows.open")
                : t("windows.closed");
            return html`<div class="row ${open ? "on" : ""}" @click=${() => this._moreInfo(id)}>
              <ha-icon .icon=${windowIcon(st, open)}></ha-icon>
              <span class="row-name">${st?.attributes?.friendly_name || id}</span>
              <span class="row-state">${state}</span>
            </div>`;
          })}
        </div>
        ${anyOpen ? html`<div class="note">${t("windows.paused")}</div>` : nothing}
        ${openDelay || closeDelay
          ? html`<div class="note">
              ${t("windows.delays", { open: `${openDelay} s`, close: `${closeDelay} s` })}
            </div>`
          : nothing}
      </div>
    `;
  }

  _renderToggles() {
    const t = (key, vars) => localize(this.hass, key, vars);
    const ids = this._relatedEntities();
    const rows = [];
    const toggleRow = (id, label, icon) => {
      const st = this.hass.states[id];
      if (!st) return;
      const on = st.state === "on";
      rows.push(html`<div class="row toggle ${on ? "on" : ""}" @click=${() => this._toggle(id)}>
        <ha-icon .icon=${icon}></ha-icon>
        <span class="row-name">${label}</span>
        <span class="switch ${on ? "on" : ""}" role="switch" aria-checked=${on ? "true" : "false"}></span>
      </div>`);
    };
    if (this._config.show_climate_control && ids.climate_control) {
      toggleRow(ids.climate_control, t("toggle.climate_control"), "mdi:thermostat");
    }
    toggleRow(ids.vacation, t("toggle.vacation"), "mdi:beach");
    if (ids.cover_auto) toggleRow(ids.cover_auto, t("toggle.cover_auto"), "mdi:blinds-horizontal");
    const paused = ids.cover_paused && this.hass.states[ids.cover_paused]?.state === "on";
    if (paused || this._live?.cover_auto_paused) {
      rows.push(html`<div class="row" @click=${() => this.hass.states[ids.cover_paused] && this._moreInfo(ids.cover_paused)}>
        <ha-icon icon="mdi:hand-back-right"></ha-icon>
        <span class="row-name">${t("toggle.cover_paused")}</span>
        ${this._apiOk
          ? html`<button
              class="small-btn"
              @click=${(ev) => {
                ev.stopPropagation();
                this._resumeCovers();
              }}
            >
              ${t("toggle.cover_resume")}
            </button>`
          : nothing}
      </div>`);
    }
    if (!rows.length) return nothing;
    return html`<div class="rows">${rows}</div>`;
  }

  _renderInfo(stateObj) {
    const t = (key, vars) => localize(this.hass, key, vars);
    const live = this._live || {};
    const items = [];
    if (live.heating_power && stateObj.attributes.hvac_action !== "idle") {
      items.push(html`<span><ha-icon icon="mdi:gauge"></ha-icon>${t("info.power")} <b>${live.heating_power} %</b></span>`);
    }
    if (live.device_setpoint !== undefined && live.device_setpoint !== null) {
      items.push(html`<span
        ><ha-icon icon="mdi:radiator"></ha-icon>${t("info.device")}
        <b>${formatTemp(this.hass, fromCelsius(this.hass, live.device_setpoint), 1)}</b></span
      >`);
    }
    const outdoor = this._rooms?.outdoor_temp;
    if (outdoor !== undefined && outdoor !== null) {
      items.push(html`<span
        ><ha-icon icon="mdi:home-thermometer-outline"></ha-icon>${t("info.outdoor")}
        <b>${formatTemp(this.hass, fromCelsius(this.hass, outdoor), 1)}</b></span
      >`);
    }
    return items.length ? html`<div class="info">${items}</div>` : nothing;
  }

  _renderSettings() {
    const t = (key, vars) => localize(this.hass, key, vars);
    const fields = this._settingFields();
    if (!fields.length || !this._apiOk) return nothing;
    const unit = tempUnit(this.hass);
    return html`
      <details ?open=${this._config.settings_open}>
        <summary>
          <ha-icon icon="mdi:tune-variant"></ha-icon>${t("settings.title")}
          <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
        </summary>
        <div class="settings">
          ${fields.map((field) => {
            const value = this._settingValue(field);
            const step = field.seconds ? 30 : 0.5;
            return html`<label class="field">
              ${t(`settings.${field.key}`)}
              <div class="input">
                <button type="button" @click=${() => this._changeSetting(field, Number(value || 0) - step)}>−</button>
                <input
                  type="number"
                  inputmode="decimal"
                  .value=${value === undefined ? "" : String(value)}
                  step=${step}
                  @change=${(ev) => this._changeSetting(field, ev.target.value)}
                />
                <span class="suffix">${field.seconds ? t("settings.seconds") : unit}</span>
                <button type="button" @click=${() => this._changeSetting(field, Number(value || 0) + step)}>+</button>
              </div>
            </label>`;
          })}
          <div class="settings-actions">
            ${this._saved ? html`<span>${t("settings.saved")}</span>` : nothing}
            <button class="small-btn primary" ?disabled=${!this._draft} @click=${() => this._saveSettings()}>
              ${t("settings.save")}
            </button>
          </div>
        </div>
      </details>
    `;
  }
}

if (!customElements.get(CARD_TYPE)) {
  customElements.define(CARD_TYPE, RoomMindCard);
}

window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === CARD_TYPE)) {
  window.customCards.push({
    type: CARD_TYPE,
    name: "RoomMind Card",
    description: "Steuert RoomMind-Räume: Zieltemperatur, Laufzeit, Presets, Modus, Fenster & Schalter.",
    preview: true,
    documentationURL: "https://github.com/Ga-Re/HACardTabs/tree/main/roommind-card",
  });
}

console.info(
  `%c ROOMMIND-CARD %c v${VERSION} `,
  "color:#fff;background:#ff8100;font-weight:700;border-radius:4px 0 0 4px;padding:2px 4px",
  "color:#ff8100;background:#fff3e6;font-weight:700;border-radius:0 4px 4px 0;padding:2px 4px",
);
