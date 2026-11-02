import { LitElement, html, css, nothing } from "lit";

import { localize } from "./localize.js";
import { ALL_DURATIONS, DEFAULTS, EDITOR_TYPE, durationLabel, fireEvent, normalizeDuration } from "./utils.js";

const SECTION_KEYS = [
  "show_status",
  "show_target",
  "show_duration",
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

export class RoomMindCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _ready: { state: true },
  };

  static styles = css`
    .group {
      margin-top: 16px;
    }
    .group-title {
      font-weight: 500;
      margin: 0 0 8px;
      color: var(--primary-text-color);
    }
    .version {
      margin-top: 12px;
      font-size: 0.8em;
      color: var(--secondary-text-color);
      text-align: right;
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
  }

  _t(key) {
    return localize(this.hass, `editor.${key}`);
  }

  get _mainSchema() {
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
    const chosen = this._durations().map(durationValue);
    return [
      {
        name: "durations",
        selector: { select: { multiple: true, mode: "list", options } },
      },
      {
        name: "default_duration",
        selector: {
          select: {
            mode: "dropdown",
            options: options.filter((o) => chosen.includes(o.value)),
          },
        },
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
    return [
      {
        type: "grid",
        name: "",
        schema: [
          { name: "compact", selector: { boolean: {} } },
          { name: "apply_delay", selector: { number: { min: 300, max: 5000, step: 100, mode: "box", unit_of_measurement: "ms" } } },
        ],
      },
      { name: "area_id", selector: { text: {} } },
    ];
  }

  _durations() {
    const list = this._config?.durations ?? DEFAULTS.durations;
    return list.map(normalizeDuration).filter((d) => d !== undefined);
  }

  _computeLabel = (schema) => this._t(schema.name) || schema.name;

  _data() {
    const c = { ...DEFAULTS, ...this._config };
    return {
      ...c,
      durations: this._durations().map(durationValue),
      default_duration: durationValue(normalizeDuration(c.default_duration) ?? "schedule"),
    };
  }

  _changed(ev) {
    ev.stopPropagation();
    const value = { ...ev.detail.value };
    const config = { ...this._config };
    for (const [key, val] of Object.entries(value)) {
      if (key === "durations") {
        // Keep the natural order and store numbers as numbers
        const set = new Set(val);
        config.durations = ALL_DURATIONS.filter((d) => set.has(durationValue(d)));
        continue;
      }
      if (key === "default_duration") {
        const d = normalizeDuration(val);
        if (d === "schedule") delete config.default_duration;
        else if (d !== undefined) config.default_duration = d;
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
    if (config.durations && JSON.stringify(config.durations) === JSON.stringify(DEFAULTS.durations)) {
      delete config.durations;
    }
    if (config.default_duration !== undefined) {
      const list = config.durations ?? DEFAULTS.durations;
      if (!list.includes(config.default_duration)) delete config.default_duration;
    }
    this._config = config;
    fireEvent(this, "config-changed", { config });
  }

  /** Names of all fields in a schema (including nested grids). */
  _names(schema) {
    return schema.flatMap((item) => (item.schema ? this._names(item.schema) : [item.name]));
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
      @value-changed=${this._changed}
    ></ha-form>`;
  }

  render() {
    if (!this.hass || !this._config) return nothing;
    return html`
      ${this._form(this._mainSchema)}
      <div class="group">
        <div class="group-title">${localize(this.hass, "duration.title")}</div>
        ${this._form(this._durationSchema)}
      </div>
      <div class="group">
        <div class="group-title">${this._t("sections")}</div>
        ${this._form(this._sectionSchema)}
      </div>
      <div class="group">
        <div class="group-title">${this._t("appearance")}</div>
        ${this._form(this._advancedSchema)}
      </div>
    `;
  }
}

if (!customElements.get(EDITOR_TYPE)) {
  customElements.define(EDITOR_TYPE, RoomMindCardEditor);
}
