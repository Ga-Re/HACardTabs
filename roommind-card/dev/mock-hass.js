/* Simulated Home Assistant + RoomMind backend for developing the card outside of Home Assistant. */
(() => {
  const define = (name, cls) => customElements.get(name) || customElements.define(name, cls);
  define(
    "ha-card",
    class extends HTMLElement {
      connectedCallback() {
        if (this.shadowRoot) return;
        const root = this.attachShadow({ mode: "open" });
        root.innerHTML = `<style>:host{display:block;background:var(--ha-card-background,var(--card-background-color));
          border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,.15);}</style><slot></slot>`;
      }
    },
  );
  define(
    "ha-icon",
    class extends HTMLElement {
      set icon(value) {
        this._icon = value;
        this.render();
      }
      get icon() {
        return this._icon;
      }
      static get observedAttributes() {
        return ["icon"];
      }
      attributeChangedCallback(_n, _o, value) {
        this.icon = value;
      }
      render() {
        const name = String(this._icon || "").replace(/^mdi:/, "");
        const key = `mdi${name.replace(/(^|-)([a-z0-9])/g, (_m, _d, c) => c.toUpperCase())}`;
        const path = window.MDI?.[key];
        this.style.display = "inline-flex";
        this.style.width = "var(--mdc-icon-size, 24px)";
        this.style.height = "var(--mdc-icon-size, 24px)";
        const root = this.shadowRoot || this.attachShadow({ mode: "open" });
        root.innerHTML = path
          ? `<svg viewBox="0 0 24 24" width="100%" height="100%"><path fill="currentColor" d="${path}"/></svg>`
          : `<span style="width:100%;height:100%;border-radius:50%;background:currentColor;opacity:.5"></span>`;
      }
    },
  );

  const now = () => Date.now() / 1000;
  const st = (entity_id, state, attributes = {}) => ({
    entity_id,
    state,
    attributes,
    last_changed: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  });

  const store = {
    settings: { vacation_until: null, vacation_temp: 15, climate_control_active: true },
    rooms: {
      arbeitszimmer: {
        area_id: "arbeitszimmer",
        climate_mode: "heat_only",
        comfort_heat: 21,
        eco_heat: 17,
        comfort_cool: 24,
        eco_cool: 27,
        window_sensors: ["binary_sensor.fenster_arbeitszimmer", "binary_sensor.tuer_arbeitszimmer"],
        window_open_delay: 30,
        window_close_delay: 120,
        covers: ["cover.rollo_arbeitszimmer"],
        override_heat: null,
        override_cool: null,
        override_until: null,
        override_type: null,
        schedule_temp: 17,
      },
      wohnzimmer: {
        area_id: "wohnzimmer",
        climate_mode: "auto",
        comfort_heat: 21.5,
        eco_heat: 18,
        comfort_cool: 24,
        eco_cool: 27,
        window_sensors: [],
        override_heat: null,
        override_cool: null,
        override_until: null,
        override_type: null,
        schedule_temp: 20,
      },
    },
  };

  const overrideActive = (r) => r.override_heat != null || r.override_cool != null;

  function climateState(area, hvacOverride) {
    const r = store.rooms[area];
    const auto = r.climate_mode === "auto";
    const active = overrideActive(r) && (!r.override_until || r.override_until > now());
    const heat = active ? r.override_heat : r.schedule_temp;
    const cool = active ? r.override_cool : 24;
    const preset = active ? { boost: "comfort", eco: "eco", custom: "manual" }[r.override_type] : "none";
    const winOpen = r.window_sensors.some((id) => window.__hass?.states[id]?.state === "on");
    const state = hvacOverride || (r.off ? "off" : auto ? "heat_cool" : "heat");
    const current = area === "arbeitszimmer" ? 21.1 : 20.4;
    return st(`climate.roommind_${area}`, state, {
      hvac_modes: auto ? ["off", "heat", "cool", "heat_cool"] : ["off", "heat"],
      min_temp: 5,
      max_temp: 35,
      target_temp_step: 0.5,
      preset_modes: ["none", "comfort", "eco", "manual"],
      current_temperature: current,
      ...(auto ? { target_temp_low: heat, target_temp_high: cool, temperature: null } : { temperature: heat }),
      current_humidity: area === "arbeitszimmer" ? 51.595 : 48.2,
      hvac_action: state === "off" ? "off" : winOpen ? "idle" : heat > current ? "heating" : "idle",
      preset_mode: preset,
      override_until: active && r.override_until ? new Date(r.override_until * 1000).toISOString() : null,
      window_open: winOpen,
      presence_away: false,
      vacation: Boolean(store.settings.vacation_until && store.settings.vacation_until > now()),
      icon: area === "arbeitszimmer" ? "mdi:home-thermometer" : "mdi:sofa",
      friendly_name: area === "arbeitszimmer" ? "Arbeitszimmer" : "Wohnzimmer",
      supported_features: auto ? 403 : 401,
    });
  }

  function buildStates() {
    const states = {
      "binary_sensor.fenster_arbeitszimmer": st("binary_sensor.fenster_arbeitszimmer", "off", {
        device_class: "window",
        friendly_name: "Fenster Arbeitszimmer",
      }),
      "binary_sensor.tuer_arbeitszimmer": st("binary_sensor.tuer_arbeitszimmer", "off", {
        device_class: "door",
        friendly_name: "Balkontür",
      }),
      "switch.roommind_vacation": st("switch.roommind_vacation", "off", { friendly_name: "Vacation Mode" }),
      "switch.roommind_arbeitszimmer_climate_control": st("switch.roommind_arbeitszimmer_climate_control", "on"),
      "switch.roommind_arbeitszimmer_cover_auto": st("switch.roommind_arbeitszimmer_cover_auto", "on"),
      "binary_sensor.roommind_arbeitszimmer_cover_paused": st("binary_sensor.roommind_arbeitszimmer_cover_paused", "off"),
    };
    return states;
  }

  const listeners = [];
  window.onHassUpdate = (fn) => listeners.push(fn);

  function publish(mutate) {
    const states = { ...window.__hass.states };
    if (mutate) mutate(states);
    for (const area of Object.keys(store.rooms)) {
      states[`climate.roommind_${area}`] = climateState(area, null);
    }
    window.__hass = { ...window.__hass, states };
    listeners.forEach((fn) => fn(window.__hass));
  }
  window.publishMock = publish;
  window.mockStore = store;

  const calls = [];
  window.mockCalls = calls;

  async function callService(domain, service, data) {
    calls.push({ domain, service, data });
    await new Promise((r) => setTimeout(r, 120));
    if (domain === "climate") {
      const area = data.entity_id.replace("climate.roommind_", "");
      const r = store.rooms[area];
      if (service === "set_temperature") {
        r.override_heat = data.temperature ?? data.target_temp_low ?? r.override_heat;
        r.override_cool = data.target_temp_high ?? null;
        r.override_type = "custom";
        r.override_until = now() + 3 * 3600; // "next schedule change"
      } else if (service === "set_preset_mode") {
        if (data.preset_mode === "none") {
          r.override_heat = r.override_cool = r.override_until = r.override_type = null;
        } else if (data.preset_mode === "manual") {
          r.override_heat = r.schedule_temp;
          r.override_type = "custom";
          r.override_until = now() + 3 * 3600;
        } else {
          r.override_type = data.preset_mode === "comfort" ? "boost" : "eco";
          r.override_heat = data.preset_mode === "comfort" ? r.comfort_heat : r.eco_heat;
          r.override_cool = r.climate_mode === "auto" ? (data.preset_mode === "comfort" ? r.comfort_cool : r.eco_cool) : null;
          r.override_until = now() + 3 * 3600;
        }
      } else if (service === "set_hvac_mode") {
        r.off = data.hvac_mode === "off";
        if (data.hvac_mode === "heat") r.climate_mode = r.climate_mode === "auto" ? "heat_only" : r.climate_mode;
        if (data.hvac_mode === "heat_cool") r.climate_mode = "auto";
      }
      publish();
    } else if (domain === "switch") {
      publish((states) => {
        const s = states[data.entity_id];
        states[data.entity_id] = { ...s, state: s.state === "on" ? "off" : "on" };
        if (data.entity_id === "switch.roommind_vacation") {
          store.settings.vacation_until = s.state === "on" ? null : now() + 5 * 86400;
        }
      });
    }
  }

  async function callWS(msg) {
    calls.push({ ws: msg });
    await new Promise((r) => setTimeout(r, 80));
    const room = store.rooms[msg.area_id];
    switch (msg.type) {
      case "roommind/rooms/list": {
        const rooms = {};
        for (const [id, r] of Object.entries(store.rooms)) {
          const active = overrideActive(r);
          rooms[id] = {
            ...r,
            live: {
              current_temp: id === "arbeitszimmer" ? 21.1 : 20.4,
              current_humidity: 51.6,
              heating_power: 45,
              device_setpoint: 23.5,
              window_open: r.window_sensors.some((w) => window.__hass.states[w]?.state === "on"),
              override_active: active,
              override_type: active ? r.override_type : null,
              override_heat: active ? r.override_heat : null,
              override_cool: active ? r.override_cool : null,
              override_until: active ? r.override_until : null,
              override_suppressed: false,
              presence_away: false,
              occupancy_vacant: false,
              mold_risk_level: window.__mold || "ok",
              mold_prevention_active: false,
              cover_auto_paused: false,
            },
          };
        }
        const vac = store.settings.vacation_until;
        return {
          rooms,
          outdoor_temp: 8.4,
          vacation_active: Boolean(vac && vac > now()),
          vacation_until: vac,
          climate_control_active: true,
        };
      }
      case "config/entity_registry/get":
        throw { code: "unauthorized", message: "nope" };
      case "roommind/override/set": {
        if (msg.override_type === "custom") {
          room.override_heat = msg.heat ?? null;
          room.override_cool = msg.cool ?? null;
        } else {
          room.override_heat = msg.override_type === "boost" ? room.comfort_heat : room.eco_heat;
          room.override_cool = room.climate_mode === "auto" ? (msg.override_type === "boost" ? room.comfort_cool : room.eco_cool) : null;
        }
        room.override_type = msg.override_type;
        room.override_until = msg.duration ? now() + msg.duration * 3600 : null;
        publish();
        return { success: true };
      }
      case "roommind/override/clear":
        room.override_heat = room.override_cool = room.override_until = room.override_type = null;
        publish();
        return { success: true };
      case "roommind/rooms/save": {
        const { type, area_id, ...rest } = msg;
        Object.assign(room, rest);
        return { room };
      }
      default:
        throw { code: "unknown_command", message: msg.type };
    }
  }

  window.createMockHass = () => {
    window.__hass = {
      states: buildStates(),
      language: "de",
      locale: { language: "de" },
      config: { unit_system: { temperature: "°C" } },
      themes: {},
      callService,
      callWS,
    };
    publish();
    return window.__hass;
  };
})();
