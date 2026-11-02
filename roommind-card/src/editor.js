import { LitElement, html, css, nothing } from "lit";

import { localize } from "./localize.js";
import { ALL_DURATIONS, DEFAULTS, EDITOR_TYPE, durationLabel, fireEvent, normalizeDuration } from "./utils.js";

const SECTION_KEYS = [
  "show_status",
  "show_target",
  "show_presets",
  "show_modes",
  "show_windows",
  "show_toggles",
  "show_climate_control",
  "show_info",
  "show_settings",
  "settings_open",
];

let helpersPromise;
/** ha-form is lazy loaded by Home Assistant; loading the editor of a built-in card makes it available. */
async function ensureHaForm() {
  if (customElements.get("ha-form")) return;
  if (!helpersPromise) helpersPromise = window.loadCardHelpers ? window.loadCardHelpers() : Promise.resolve();
  try {
    const helpers = await helpersPromise;
    if (helpers) {
      helpers.createCardElement({ type: "entities", entities: [] });
      await customElements.whenDefined("hui-entities-card");
      const cls = customElements.get("hui-entities-card");
      if (cls?.getConfigElement) await cls.getConfigElement();
    }
  } catch (_err) {
    // ignore – the dialog usually has it loaded already
  }
}

const durationValue = (d) => String(d);
const sortDurations = (list) => {
  const numbers = [...new Set(list.filter((d) => typeof d === "number"))].sort((a, b) => a - b);
  return [
    ...(list.includes("schedule") ? ["schedule"] : []),
    ...numbers,
    ...(list.includes("permanent") ? ["permanent"] : []),
  ];
};

/** Parses "5; 10; 1,5" (comma as decimal separator between digits) into hours. */
export function parseExtraDurations(text) {
  return String(text || "")
    .replace(/(\d),(\d)/g, "$1.$2")
    .split(/[;,\s]+/)
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isFinite(n) && n > 0 && n <= 999)
    .map((n) => Math.round(n * 1000) / 1000);
}

export class RoomMindCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _ready: { state: true },
    _rooms: { state: true },
  };

  static styles = css`
    .group {
      margin-top: 20px;
    }
    .group-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      margin: 0 0 8px;
      color: var(--primary-text-color);
      --mdc-icon-size: 20px;
    }
    .group-title ha-icon {
      color: var(--secondary-text-color);
    }
    .hint {
      font-size: 0.85em;
      color: var(--secondary-text-color);
      margin: -4px 0 8px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    ensureHaForm().then(() => {
      this._ready = true;
    });
  }

  setConfig(config) {
    this._config = config;
    // Keep what the user is typing unless the config was changed elsewhere (e.g. in YAML)
    if (this._extraText !== undefined) {
      const typed = parseExtraDurations(this._extraText).filter((d) => !ALL_DURATIONS.includes(d));
      if (JSON.stringify(sortDurations(typed)) !== JSON.stringify(this._extraDurations())) this._extraText = undefined;
    }
  }

  updated(changed) {
    if (changed.has("hass") && this.hass && this._rooms === undefined) {
      this._rooms = null;
      this.hass
        .callWS({ type: "roommind/rooms/list" })
        .then((res) => {
          this._rooms = res?.rooms || {};
        })
        .catch(() => {
          this._rooms = {};
        });
    }
  }

  _t(key, vars) {
    return localize(this.hass, `editor.${key}`, vars);
  }

  _durations() {
    const list = this._config?.durations ?? DEFAULTS.durations;
    return list.map(normalizeDuration).filter((d) => d !== undefined);
  }

  _extraDurations() {
    return this._durations().filter((d) => typeof d === "number" && !ALL_DURATIONS.includes(d));
  }

  // --- Schemas ----------------------------------------------------------------------------

  get _roomSchema() {
    return [
      {
        name: "entity",
        required: true,
        selector: { entity: { domain: "climate", integration: "roommind" } },
      },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "name", selector: { text: {} } },
          { name: "icon", selector: { icon: {} }, context: { icon_entity: "entity" } },
        ],
      },
    ];
  }

  get _durationSchema() {
    const options = ALL_DURATIONS.map((d) => ({ value: durationValue(d), label: durationLabel(this.hass, d) }));
    const chosen = this._durations();
    const defaultOptions = chosen.map((d) => ({ value: durationValue(d), label: durationLabel(this.hass, d) }));
    return [
      { name: "show_duration", selector: { boolean: {} } },
      {
        name: "durations",
        selector: { select: { multiple: true, mode: "dropdown", options } },
      },
      { name: "extra_durations", selector: { text: {} } },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "default_duration", selector: { select: { mode: "dropdown", options: defaultOptions } } },
          { name: "show_custom_duration", selector: { boolean: {} } },
        ],
      },
    ];
  }

  get _sectionSchema() {
    return [
      {
        type: "grid",
        name: "",
        column_min_width: "220px",
        schema: SECTION_KEYS.map((name) => ({ name, selector: { boolean: {} } })),
      },
    ];
  }

  get _advancedSchema() {
    const rooms = this._rooms || {};
    const roomOptions = Object.entries(rooms).map(([id, room]) => ({
      value: id,
      label: room.display_name ? `${room.display_name} (${id})` : id,
    }));
    return [
      {
        type: "grid",
        name: "",
        schema: [
          { name: "compact", selector: { boolean: {} } },
          {
            name: "apply_delay",
            selector: { number: { min: 300, max: 5000, step: 100, mode: "box", unit_of_measurement: "ms" } },
          },
        ],
      },
      roomOptions.length
        ? {
            name: "area_id",
            selector: { select: { mode: "dropdown", custom_value: true, options: roomOptions } },
          }
        : { name: "area_id", selector: { text: {} } },
      {
        name: "vacation_entity",
        selector: { entity: { domain: "switch" } },
      },
    ];
  }

  // --- Labels -----------------------------------------------------------------------------

  _computeLabel = (schema) => this._t(schema.name) || schema.name;

  _computeHelper = (schema) => {
    const key = `helper_${schema.name}`;
    const text = this._t(key);
    return text === `editor.${key}` ? undefined : text;
  };

  // --- Data -------------------------------------------------------------------------------

  _data() {
    const c = { ...DEFAULTS, ...this._config };
    return {
      ...c,
      durations: this._durations()
        .filter((d) => ALL_DURATIONS.includes(d))
        .map(durationValue),
      extra_durations:
        this._extraText ??
        this._extraDurations()
          .map((n) => String(n).replace(".", localize(this.hass, "editor.decimal")))
          .join("; "),
      default_duration: durationValue(normalizeDuration(c.default_duration) ?? "schedule"),
      area_id: c.area_id || "",
      vacation_entity: c.vacation_entity || "",
    };
  }

  /** Names of all fields in a schema (including nested grids). */
  _names(schema) {
    return schema.flatMap((item) => (item.schema ? this._names(item.schema) : [item.name]));
  }

  _changed(ev) {
    ev.stopPropagation();
    const value = { ...ev.detail.value };
    const config = { ...this._config };
    let durations = this._durations();

    if ("durations" in value) {
      const set = new Set(value.durations || []);
      durations = [...ALL_DURATIONS.filter((d) => set.has(durationValue(d))), ...this._extraDurations()];
    }
    if ("extra_durations" in value) {
      this._extraText = value.extra_durations || "";
      const extras = parseExtraDurations(value.extra_durations).filter((d) => !ALL_DURATIONS.includes(d));
      durations = [...durations.filter((d) => ALL_DURATIONS.includes(d) || typeof d !== "number"), ...extras];
    }
    durations = sortDurations(durations);
    if (JSON.stringify(durations) === JSON.stringify(DEFAULTS.durations)) delete config.durations;
    else config.durations = durations;

    for (const [key, val] of Object.entries(value)) {
      if (key === "durations" || key === "extra_durations") continue;
      if (key === "default_duration") {
        const d = normalizeDuration(val);
        if (d === undefined || d === "schedule") delete config.default_duration;
        else config.default_duration = d;
        continue;
      }
      if (val === "" || val === undefined || val === null) {
        delete config[key];
        continue;
      }
      if (key in DEFAULTS && DEFAULTS[key] === val) {
        delete config[key];
        continue;
      }
      config[key] = val;
    }
    // The default duration must be one of the offered durations
    if (config.default_duration !== undefined && !durations.includes(config.default_duration)) {
      delete config.default_duration;
    }
    this._config = config;
    fireEvent(this, "config-changed", { config });
  }

  _form(schema) {
    // Each form only gets (and reports back) its own fields
    const all = this._data();
    const data = Object.fromEntries(this._names(schema).filter((n) => n in all).map((n) => [n, all[n]]));
    return html`<ha-form
      .hass=${this.hass}
      .data=${data}
      .schema=${schema}
      .computeLabel=${this._computeLabel}
      .computeHelper=${this._computeHelper}
      @value-changed=${this._changed}
    ></ha-form>`;
  }

  _group(icon, title, content, hint) {
    return html`<div class="group">
      <div class="group-title"><ha-icon .icon=${icon}></ha-icon>${title}</div>
      ${hint ? html`<div class="hint">${hint}</div>` : nothing} ${content}
    </div>`;
  }

  render() {
    if (!this.hass || !this._config) return nothing;
    return html`
      ${this._group("mdi:home-thermometer-outline", this._t("group_room"), this._form(this._roomSchema))}
      ${this._group(
        "mdi:timer-outline",
        localize(this.hass, "duration.title"),
        this._form(this._durationSchema),
        this._t("hint_duration"),
      )}
      ${this._group("mdi:view-dashboard-outline", this._t("sections"), this._form(this._sectionSchema))}
      ${this._group("mdi:cog-outline", this._t("appearance"), this._form(this._advancedSchema))}
    `;
  }
}

if (!customElements.get(EDITOR_TYPE)) {
  customElements.define(EDITOR_TYPE, RoomMindCardEditor);
}
