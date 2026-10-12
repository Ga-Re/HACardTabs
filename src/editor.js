import { LitElement, html, css, nothing } from "lit";
import { keyed } from "lit/directives/keyed.js";

import {
  AUTO_CYCLE_DEFAULTS,
  CONDITION_ICONS,
  CONDITION_TYPES,
  DEFAULTS,
  EDITOR_SELECT_EVENT,
  EDITOR_TYPE,
  SCREEN_PRESETS,
  WEEKDAYS,
} from "./const.js";
import { conditionType } from "./conditions.js";
import { localize } from "./localize.js";
import { cssColor, fireEvent, loadHaComponents, toHex } from "./utils.js";

const COLOR_KEYS = ["color", "text_color", "active_text_color", "background_color"];

const asArray = (value) => (value === undefined || value === null ? [] : Array.isArray(value) ? value : [value]);
const isEmpty = (value) =>
  value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);

function schemaKeys(schema) {
  const keys = [];
  for (const item of schema) {
    if (item.type === "grid" || item.type === "expandable") keys.push(...schemaKeys(item.schema));
    else if (item.name) keys.push(item.name);
  }
  return keys;
}

/** Applies form values to an object: empty values (and values equal to the default) are removed. */
function applyValues(target, values, keys, defaults = {}) {
  const result = { ...target };
  for (const key of keys) {
    const value = values[key];
    if (isEmpty(value) || (key in defaults && defaults[key] === value)) delete result[key];
    else result[key] = value;
  }
  return result;
}

export class HACardTabsEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    lovelace: { attribute: false },
    _config: { state: true },
    _page: { state: true },
    _selectedTab: { state: true },
    _tabPage: { state: true },
    _selectedCard: { state: true },
    _guiMode: { state: true },
    _guiModeAvailable: { state: true },
    _loaded: { state: true },
    _users: { state: true },
  };

  constructor() {
    super();
    this._page = "tabs";
    this._selectedTab = 0;
    this._tabPage = "general";
    this._selectedCard = 0;
    this._guiMode = true;
    this._guiModeAvailable = true;
    this._loaded = false;
  }

  setConfig(config) {
    this._config = { ...config, tabs: Array.isArray(config?.tabs) ? config.tabs : [] };
    const count = this._config.tabs.length;
    if (this._selectedTab >= count) this._selectedTab = Math.max(0, count - 1);
  }

  connectedCallback() {
    super.connectedCallback();
    loadHaComponents()
      .catch(() => {})
      .then(() => {
        this._loaded = true;
      });
    this._syncPreview();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    delete window.__hacardTabsEditorSelection;
  }

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */

  _t(key, vars) {
    return localize(this.hass, `editor.${key}`, vars);
  }

  get _tabs() {
    return this._config?.tabs || [];
  }

  _tabName(tab, index) {
    return tab?.name || this._t("new_tab", { n: index + 1 });
  }

  _commit(config) {
    this._config = config;
    fireEvent(this, "config-changed", { config });
    this._syncPreview();
  }

  _syncPreview() {
    if (!this._config) return;
    window.__hacardTabsEditorSelection = {
      key: JSON.stringify(this._config.tabs || []),
      index: this._selectedTab,
    };
    // Give Home Assistant time to hand the new config to the preview first.
    setTimeout(() => window.dispatchEvent(new CustomEvent(EDITOR_SELECT_EVENT)), 0);
  }

  _setTabs(tabs, extra = {}) {
    this._commit({ ...this._config, ...extra, tabs });
  }

  _updateTab(index, updater) {
    const tabs = [...this._tabs];
    tabs[index] = updater({ ...(tabs[index] || {}) });
    this._setTabs(tabs);
  }

  _iconButton(icon, label, handler, disabled = false, extraClass = "") {
    return html`
      <button
        class="icon-btn ${extraClass}"
        type="button"
        title=${label}
        aria-label=${label}
        ?disabled=${disabled}
        @click=${handler}
      >
        <ha-icon .icon=${icon}></ha-icon>
      </button>
    `;
  }

  _computeLabel = (schema) => {
    const map = { media_query: "media_query", value_template: "value_template" };
    return this._t(map[schema.name] || schema.name);
  };

  _computeHelper = (schema) => {
    if (schema.name === "state") return this._t("state_helper");
    return undefined;
  };

  /* ------------------------------------------------------------------ */
  /* Render                                                              */
  /* ------------------------------------------------------------------ */

  render() {
    if (!this.hass || !this._config) return nothing;
    const pages = [
      ["tabs", "mdi:tab"],
      ["appearance", "mdi:palette-outline"],
      ["behavior", "mdi:cog-outline"],
    ];
    return html`
      <div class="pages" role="tablist">
        ${pages.map(
          ([page, icon]) => html`
            <button
              type="button"
              role="tab"
              class="page-btn ${this._page === page ? "active" : ""}"
              aria-selected=${this._page === page ? "true" : "false"}
              @click=${() => {
                this._page = page;
              }}
            >
              <ha-icon .icon=${icon}></ha-icon>
              <span>${this._t(`page_${page}`)}</span>
            </button>
          `,
        )}
      </div>
      ${this._page === "tabs"
        ? this._renderTabsPage()
        : this._page === "appearance"
          ? this._renderAppearancePage()
          : this._renderBehaviorPage()}
    `;
  }

  /* ---------- Tabs page ---------- */

  _renderTabsPage() {
    const tabs = this._tabs;
    return html`
      <div class="chips">
        ${tabs.map(
          (tab, index) => html`
            <button
              type="button"
              class="chip ${index === this._selectedTab ? "active" : ""}"
              style=${cssColor(tab.color) ? `--chip-color: ${cssColor(tab.color)}` : ""}
              @click=${() => this._selectTab(index)}
            >
              ${tab.icon ? html`<ha-icon .icon=${tab.icon}></ha-icon>` : nothing}
              <span>${this._tabName(tab, index)}</span>
              ${asArray(tab.conditions).length
                ? html`<ha-icon class="mini" icon="mdi:eye-check-outline"></ha-icon>`
                : nothing}
            </button>
          `,
        )}
        <button type="button" class="chip add" @click=${this._addTab}>
          <ha-icon icon="mdi:plus"></ha-icon>
          <span>${this._t("add_tab")}</span>
        </button>
      </div>
      ${tabs.length ? this._renderTabEditor(this._selectedTab) : html`<div class="hint">${this._t("no_tabs")}</div>`}
    `;
  }

  _renderTabEditor(index) {
    const tab = this._tabs[index] || {};
    const conditionCount = asArray(tab.conditions).length;
    const cardCount = asArray(tab.cards).length;
    const pages = [
      ["general", "mdi:form-textbox"],
      ["cards", "mdi:cards-outline"],
      ["conditions", "mdi:eye-check-outline"],
      ["style", "mdi:palette-swatch-outline"],
    ];
    return html`
      <div class="tab-editor">
        <div class="toolbar">
          <div class="subnav">
            ${pages.map(
              ([page, icon]) => html`
                <button
                  type="button"
                  class="sub-btn ${this._tabPage === page ? "active" : ""}"
                  @click=${() => {
                    this._tabPage = page;
                  }}
                >
                  <ha-icon .icon=${icon}></ha-icon>
                  <span>${this._t(`tab_${page}`)}</span>
                  ${page === "cards" ? html`<span class="count">${cardCount}</span>` : nothing}
                  ${page === "conditions" && conditionCount
                    ? html`<span class="count">${conditionCount}</span>`
                    : nothing}
                </button>
              `,
            )}
          </div>
          <div class="actions">
            ${this._iconButton("mdi:arrow-left", this._t("move_left"), () => this._moveTab(index, -1), index === 0)}
            ${this._iconButton(
              "mdi:arrow-right",
              this._t("move_right"),
              () => this._moveTab(index, 1),
              index === this._tabs.length - 1,
            )}
            ${this._iconButton("mdi:content-duplicate", this._t("duplicate"), () => this._duplicateTab(index))}
            ${this._iconButton("mdi:delete-outline", this._t("delete"), () => this._deleteTab(index), false, "danger")}
          </div>
        </div>
        <div class="tab-body">
          ${this._tabPage === "general"
            ? this._renderTabGeneral(index, tab)
            : this._tabPage === "cards"
              ? this._renderTabCards(index, tab)
              : this._tabPage === "conditions"
                ? this._renderTabConditions(index, tab)
                : this._renderTabStyle(index, tab)}
        </div>
      </div>
    `;
  }

  _renderTabGeneral(index, tab) {
    const schema = [
      {
        type: "grid",
        name: "",
        schema: [
          { name: "name", selector: { text: {} } },
          { name: "icon", selector: { icon: {} } },
        ],
      },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "badge_entity", selector: { entity: {} } },
          { name: "columns", selector: { number: { min: 1, max: 6, mode: "box" } } },
        ],
      },
    ];
    if (this._config.auto_cycle?.enabled) {
      schema.push({
        type: "grid",
        name: "",
        schema: [
          {
            name: "cycle_duration",
            selector: { number: { min: 1, max: 86400, mode: "box", unit_of_measurement: "s" } },
          },
          { name: "skip_cycle", selector: { boolean: {} } },
        ],
      });
    }
    const keys = schemaKeys(schema);
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${{ columns: 1, ...tab }}
        .schema=${schema}
        .computeLabel=${this._computeLabel}
        @value-changed=${(ev) => {
          ev.stopPropagation();
          const values = { ...ev.detail.value };
          if (values.columns !== undefined) values.columns = Number(values.columns) || undefined;
          this._updateTab(index, (current) => applyValues(current, values, keys, { columns: 1, skip_cycle: false }));
        }}
      ></ha-form>
    `;
  }

  _renderTabStyle(index, tab) {
    return html`
      <div class="hint">${this._t("tab_colors_helper")}</div>
      ${COLOR_KEYS.map((key) =>
        this._renderColorField(key, tab[key], (value) =>
          this._updateTab(index, (current) => applyValues(current, { [key]: value }, [key])),
        ),
      )}
      <div class="hint small">${this._t("color_helper")}</div>
    `;
  }

  _renderColorField(key, value, onChange) {
    const css = cssColor(value);
    return html`
      <div class="color-field">
        <label
          class="swatch ${css ? "" : "empty"}"
          title=${this._t("pick_color")}
          style=${css ? `background: ${css}` : ""}
        >
          <input
            type="color"
            .value=${toHex(value)}
            @change=${(ev) => onChange(ev.target.value)}
            aria-label=${this._t("pick_color")}
          />
          ${css ? nothing : html`<ha-icon icon="mdi:palette-outline"></ha-icon>`}
        </label>
        <ha-form
          class="grow"
          .hass=${this.hass}
          .data=${{ [key]: value ?? "" }}
          .schema=${[{ name: key, selector: { text: {} } }]}
          .computeLabel=${this._computeLabel}
          @value-changed=${(ev) => {
            ev.stopPropagation();
            onChange(ev.detail.value[key]);
          }}
        ></ha-form>
        ${value ? this._iconButton("mdi:close", this._t("clear"), () => onChange(undefined)) : nothing}
      </div>
    `;
  }

  /* ---------- Cards ---------- */

  _renderTabCards(index, tab) {
    const cards = asArray(tab.cards);
    const selected = Math.min(this._selectedCard, cards.length);
    if (!this._loaded) return html`<div class="hint">${this._t("loading")}</div>`;
    return html`
      <div class="chips small">
        ${cards.map(
          (card, cardIndex) => html`
            <button
              type="button"
              class="chip small ${cardIndex === selected ? "active" : ""}"
              title=${card?.type || ""}
              @click=${() => this._selectCard(cardIndex)}
            >
              <span>${cardIndex + 1}</span>
              <span class="card-type">${String(card?.type || "").replace(/^custom:/, "")}</span>
            </button>
          `,
        )}
        <button
          type="button"
          class="chip small add ${selected === cards.length ? "active" : ""}"
          @click=${() => this._selectCard(cards.length)}
        >
          <ha-icon icon="mdi:plus"></ha-icon>
          <span>${this._t("add_card")}</span>
        </button>
      </div>
      ${selected < cards.length
        ? html`
            <div class="card-toolbar">
              <div class="actions">
                ${this._iconButton(
                  this._guiMode ? "mdi:code-braces" : "mdi:list-box-outline",
                  this._t("toggle_editor"),
                  this._toggleCardMode,
                  this._guiMode && !this._guiModeAvailable,
                )}
                ${this._iconButton(
                  "mdi:arrow-up",
                  this._t("move_up"),
                  () => this._moveCard(index, selected, -1),
                  selected === 0,
                )}
                ${this._iconButton(
                  "mdi:arrow-down",
                  this._t("move_down"),
                  () => this._moveCard(index, selected, 1),
                  selected === cards.length - 1,
                )}
                ${this._iconButton("mdi:content-copy", this._t("copy"), () => this._copyCard(index, selected))}
                ${this._tabs.length > 1
                  ? html`
                      <select
                        class="move-select"
                        title=${this._t("move_to_tab")}
                        @change=${(ev) => {
                          const target = Number(ev.target.value);
                          ev.target.value = "";
                          if (!Number.isNaN(target)) this._moveCardToTab(index, selected, target);
                        }}
                      >
                        <option value="">${this._t("move_to_tab")}</option>
                        ${this._tabs.map((other, otherIndex) =>
                          otherIndex === index
                            ? nothing
                            : html`<option value=${otherIndex}>${this._tabName(other, otherIndex)}</option>`,
                        )}
                      </select>
                    `
                  : nothing}
                ${this._iconButton(
                  "mdi:delete-outline",
                  this._t("delete"),
                  () => this._deleteCard(index, selected),
                  false,
                  "danger",
                )}
              </div>
            </div>
            ${keyed(
              `${index}-${selected}`,
              html`
                <hui-card-element-editor
                  .hass=${this.hass}
                  .lovelace=${this.lovelace}
                  .value=${cards[selected]}
                  @config-changed=${(ev) => this._cardChanged(ev, index, selected)}
                  @GUImode-changed=${this._guiModeChanged}
                ></hui-card-element-editor>
              `,
            )}
          `
        : html`
            <hui-card-picker
              .hass=${this.hass}
              .lovelace=${this.lovelace}
              @config-changed=${(ev) => this._cardPicked(ev, index)}
            ></hui-card-picker>
          `}
    `;
  }

  _selectCard(cardIndex) {
    this._selectedCard = cardIndex;
    this._guiMode = true;
    this._guiModeAvailable = true;
  }

  _toggleCardMode = () => {
    this.renderRoot.querySelector("hui-card-element-editor")?.toggleMode?.();
  };

  _guiModeChanged = (ev) => {
    ev.stopPropagation();
    this._guiMode = ev.detail.guiMode;
    this._guiModeAvailable = ev.detail.guiModeAvailable;
  };

  _cardChanged(ev, tabIndex, cardIndex) {
    ev.stopPropagation();
    const config = ev.detail?.config;
    if (ev.detail && "guiModeAvailable" in ev.detail) this._guiModeAvailable = ev.detail.guiModeAvailable;
    if (!config) return;
    this._updateTab(tabIndex, (tab) => {
      const cards = [...asArray(tab.cards)];
      cards[cardIndex] = config;
      return { ...tab, cards };
    });
  }

  _cardPicked(ev, tabIndex) {
    ev.stopPropagation();
    const config = ev.detail?.config;
    if (!config) return;
    const cards = [...asArray(this._tabs[tabIndex]?.cards), config];
    this._updateTab(tabIndex, (tab) => ({ ...tab, cards }));
    this._selectCard(cards.length - 1);
  }

  _moveCard(tabIndex, cardIndex, direction) {
    const target = cardIndex + direction;
    this._updateTab(tabIndex, (tab) => {
      const cards = [...asArray(tab.cards)];
      if (target < 0 || target >= cards.length) return tab;
      [cards[cardIndex], cards[target]] = [cards[target], cards[cardIndex]];
      return { ...tab, cards };
    });
    this._selectedCard = target;
  }

  _copyCard(tabIndex, cardIndex) {
    this._updateTab(tabIndex, (tab) => {
      const cards = [...asArray(tab.cards)];
      cards.splice(cardIndex + 1, 0, structuredClone(cards[cardIndex]));
      return { ...tab, cards };
    });
    this._selectCard(cardIndex + 1);
  }

  _deleteCard(tabIndex, cardIndex) {
    this._updateTab(tabIndex, (tab) => {
      const cards = [...asArray(tab.cards)];
      cards.splice(cardIndex, 1);
      return { ...tab, cards };
    });
    this._selectCard(Math.max(0, cardIndex - 1));
  }

  _moveCardToTab(tabIndex, cardIndex, targetTab) {
    const tabs = this._tabs.map((tab) => ({ ...tab }));
    const source = [...asArray(tabs[tabIndex].cards)];
    const [card] = source.splice(cardIndex, 1);
    tabs[tabIndex].cards = source;
    tabs[targetTab].cards = [...asArray(tabs[targetTab].cards), card];
    this._setTabs(tabs);
    this._selectCard(Math.max(0, cardIndex - 1));
  }

  /* ---------- Conditions ---------- */

  _renderTabConditions(index, tab) {
    const conditions = asArray(tab.conditions);
    if (!this._users) this._loadUsers();
    return html`
      <div class="hint">${this._t("conditions_helper")}</div>
      ${conditions.length > 1
        ? html`
            <ha-form
              .hass=${this.hass}
              .data=${{ condition_mode: tab.condition_mode || "all" }}
              .schema=${[
                {
                  name: "condition_mode",
                  selector: {
                    select: {
                      mode: "dropdown",
                      options: [
                        { value: "all", label: this._t("condition_mode_all") },
                        { value: "any", label: this._t("condition_mode_any") },
                      ],
                    },
                  },
                },
              ]}
              .computeLabel=${this._computeLabel}
              @value-changed=${(ev) => {
                ev.stopPropagation();
                const mode = ev.detail.value.condition_mode;
                this._updateTab(index, (current) =>
                  applyValues(current, { condition_mode: mode }, ["condition_mode"], { condition_mode: "all" }),
                );
              }}
            ></ha-form>
          `
        : nothing}
      ${conditions.map((condition, conditionIndex) => this._renderCondition(index, condition, conditionIndex))}
      <div class="add-condition">
        <div class="label">${this._t("add_condition")}</div>
        <div class="chips small">
          ${CONDITION_TYPES.map(
            (type) => html`
              <button type="button" class="chip small" @click=${() => this._addCondition(index, type)}>
                <ha-icon .icon=${CONDITION_ICONS[type]}></ha-icon>
                <span>${this._t(`cond_${type}`)}</span>
              </button>
            `,
          )}
        </div>
      </div>
    `;
  }

  _renderCondition(tabIndex, condition, conditionIndex) {
    const type = conditionType(condition);
    const schema = this._conditionSchema(type, condition);
    return html`
      <div class="condition">
        <div class="condition-header">
          <ha-icon .icon=${CONDITION_ICONS[type] || "mdi:help-circle-outline"}></ha-icon>
          <span>${CONDITION_ICONS[type] ? this._t(`cond_${type}`) : type || "?"}</span>
          ${this._iconButton(
            "mdi:delete-outline",
            this._t("delete"),
            () => this._removeCondition(tabIndex, conditionIndex),
            false,
            "danger",
          )}
        </div>
        ${schema
          ? html`
              <ha-form
                .hass=${this.hass}
                .data=${this._conditionToForm(type, condition)}
                .schema=${schema}
                .computeLabel=${this._computeLabel}
                .computeHelper=${this._computeHelper}
                @value-changed=${(ev) => {
                  ev.stopPropagation();
                  this._setCondition(tabIndex, conditionIndex, this._formToCondition(type, ev.detail.value));
                }}
              ></ha-form>
            `
          : html`
              <div class="hint small">${this._t("cond_yaml_only")}</div>
              <pre>${JSON.stringify(condition, null, 2)}</pre>
            `}
      </div>
    `;
  }

  _conditionSchema(type, condition) {
    switch (type) {
      case "state":
        return [
          { name: "entity", selector: { entity: {} } },
          { name: "attribute", selector: { attribute: { entity_id: condition.entity } } },
          {
            type: "grid",
            name: "",
            schema: [
              {
                name: "operator",
                selector: {
                  select: {
                    mode: "dropdown",
                    options: [
                      { value: "is", label: this._t("op_is") },
                      { value: "is_not", label: this._t("op_is_not") },
                    ],
                  },
                },
              },
              { name: "state", selector: { text: {} } },
            ],
          },
        ];
      case "numeric_state":
        return [
          { name: "entity", selector: { entity: {} } },
          { name: "attribute", selector: { attribute: { entity_id: condition.entity } } },
          {
            type: "grid",
            name: "",
            schema: [
              { name: "above", selector: { number: { mode: "box", step: "any" } } },
              { name: "below", selector: { number: { mode: "box", step: "any" } } },
            ],
          },
        ];
      case "user": {
        const options = [...(this._users || [])];
        for (const id of asArray(condition.users)) {
          if (!options.some((option) => option.value === id)) options.push({ value: id, label: id });
        }
        return [{ name: "users", selector: { select: { mode: "list", multiple: true, options } } }];
      }
      case "screen":
        return [
          {
            name: "media_query",
            selector: {
              select: {
                mode: "dropdown",
                custom_value: true,
                options: Object.entries(SCREEN_PRESETS).map(([key, query]) => ({
                  value: query,
                  label: this._t(`screen_${key}`),
                })),
              },
            },
          },
        ];
      case "time":
        return [
          {
            type: "grid",
            name: "",
            schema: [
              { name: "after", selector: { time: {} } },
              { name: "before", selector: { time: {} } },
            ],
          },
          {
            name: "weekdays",
            selector: {
              select: {
                mode: "list",
                multiple: true,
                options: WEEKDAYS.map((day) => ({ value: day, label: this._t(day) })),
              },
            },
          },
        ];
      case "template":
        return [{ name: "value_template", selector: { template: {} } }];
      default:
        return undefined;
    }
  }

  _conditionToForm(type, condition) {
    if (type === "state") {
      const negated = condition.state === undefined && condition.state_not !== undefined;
      return {
        entity: condition.entity,
        attribute: condition.attribute,
        operator: negated ? "is_not" : "is",
        state: asArray(negated ? condition.state_not : condition.state).join(", "),
      };
    }
    return { ...condition };
  }

  _formToCondition(type, values) {
    const condition = { condition: type };
    if (type === "state") {
      const states = String(values.state ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter((value) => value !== "");
      if (values.entity) condition.entity = values.entity;
      if (values.attribute) condition.attribute = values.attribute;
      if (states.length) {
        condition[values.operator === "is_not" ? "state_not" : "state"] = states.length === 1 ? states[0] : states;
      } else if (values.operator === "is_not") {
        condition.state_not = "";
      } else {
        condition.state = "";
      }
      return condition;
    }
    for (const [key, value] of Object.entries(values)) {
      if (key === "condition" || isEmpty(value)) continue;
      condition[key] = value;
    }
    return condition;
  }

  _addCondition(tabIndex, type) {
    const defaults = {
      state: { condition: "state", entity: "", state: "on" },
      numeric_state: { condition: "numeric_state", entity: "" },
      user: { condition: "user", users: this.hass?.user?.id ? [this.hass.user.id] : [] },
      screen: { condition: "screen", media_query: SCREEN_PRESETS.desktop },
      time: { condition: "time", after: "08:00:00", before: "20:00:00" },
      template: { condition: "template", value_template: "{{ true }}" },
    };
    this._updateTab(tabIndex, (tab) => ({
      ...tab,
      conditions: [...asArray(tab.conditions), defaults[type] || { condition: type }],
    }));
  }

  _setCondition(tabIndex, conditionIndex, condition) {
    this._updateTab(tabIndex, (tab) => {
      const conditions = [...asArray(tab.conditions)];
      conditions[conditionIndex] = condition;
      return { ...tab, conditions };
    });
  }

  _removeCondition(tabIndex, conditionIndex) {
    this._updateTab(tabIndex, (tab) => {
      const conditions = [...asArray(tab.conditions)];
      conditions.splice(conditionIndex, 1);
      const result = { ...tab, conditions };
      if (!conditions.length) {
        delete result.conditions;
        delete result.condition_mode;
      }
      return result;
    });
  }

  async _loadUsers() {
    if (this._usersLoading) return;
    this._usersLoading = true;
    try {
      const users = await this.hass.callWS({ type: "config/auth/list" });
      this._users = users
        .filter((user) => !user.system_generated && user.is_active !== false)
        .map((user) => ({ value: user.id, label: user.name || user.id }));
    } catch (_err) {
      this._users = this.hass?.user ? [{ value: this.hass.user.id, label: this.hass.user.name }] : [];
    }
  }

  /* ---------- Tab operations ---------- */

  _selectTab(index) {
    this._selectedTab = index;
    this._selectedCard = 0;
    this._guiMode = true;
    this._guiModeAvailable = true;
    this._syncPreview();
  }

  _addTab = () => {
    const tabs = [...this._tabs];
    tabs.push({ name: this._t("new_tab", { n: tabs.length + 1 }), icon: "mdi:tab", cards: [] });
    this._selectedTab = tabs.length - 1;
    this._selectedCard = 0;
    this._tabPage = "general";
    this._setTabs(tabs);
  };

  _moveTab(index, direction) {
    const target = index + direction;
    const tabs = [...this._tabs];
    if (target < 0 || target >= tabs.length) return;
    [tabs[index], tabs[target]] = [tabs[target], tabs[index]];
    const extra = {};
    const defaultTab = Number(this._config.default_tab) || 0;
    if (defaultTab === index) extra.default_tab = target;
    else if (defaultTab === target) extra.default_tab = index;
    this._selectedTab = target;
    this._setTabs(tabs, this._cleanDefaultTab(extra));
  }

  _duplicateTab(index) {
    const tabs = [...this._tabs];
    tabs.splice(index + 1, 0, structuredClone(tabs[index]));
    const extra = {};
    const defaultTab = Number(this._config.default_tab) || 0;
    if (defaultTab > index) extra.default_tab = defaultTab + 1;
    this._selectedTab = index + 1;
    this._setTabs(tabs, extra);
  }

  _deleteTab(index) {
    const tab = this._tabs[index];
    if (!window.confirm(this._t("delete_tab_confirm", { name: this._tabName(tab, index) }))) return;
    const tabs = [...this._tabs];
    tabs.splice(index, 1);
    const extra = {};
    const defaultTab = Number(this._config.default_tab) || 0;
    if (defaultTab === index) extra.default_tab = 0;
    else if (defaultTab > index) extra.default_tab = defaultTab - 1;
    this._selectedTab = Math.max(0, Math.min(index, tabs.length - 1));
    this._selectedCard = 0;
    this._setTabs(tabs, this._cleanDefaultTab(extra));
  }

  _cleanDefaultTab(extra) {
    if (extra.default_tab === 0) {
      const config = { ...this._config };
      delete config.default_tab;
      this._config = config;
      delete extra.default_tab;
    }
    return extra;
  }

  /* ---------- Appearance page ---------- */

  _select(name, values) {
    return {
      name,
      selector: {
        select: {
          mode: "dropdown",
          options: values.map(([value, key]) => ({ value, label: this._t(key) })),
        },
      },
    };
  }

  _renderAppearancePage() {
    const schema = [
      {
        type: "grid",
        name: "",
        schema: [
          this._select("tab_position", [
            ["top", "pos_top"],
            ["bottom", "pos_bottom"],
            ["left", "pos_left"],
            ["right", "pos_right"],
          ]),
          this._select("tab_style", [
            ["underline", "style_underline"],
            ["pills", "style_pills"],
            ["buttons", "style_buttons"],
            ["segmented", "style_segmented"],
          ]),
        ],
      },
      {
        type: "grid",
        name: "",
        schema: [
          this._select("tab_alignment", [
            ["start", "align_start"],
            ["center", "align_center"],
            ["end", "align_end"],
            ["stretch", "align_stretch"],
          ]),
          this._select("tab_content", [
            ["icon_name", "content_icon_name"],
            ["icon", "content_icon"],
            ["name", "content_name"],
          ]),
        ],
      },
      {
        type: "grid",
        name: "",
        schema: [
          this._select("icon_position", [
            ["start", "icon_start"],
            ["top", "icon_top"],
          ]),
          this._select("animation", [
            ["none", "anim_none"],
            ["fade", "anim_fade"],
            ["slide", "anim_slide"],
          ]),
        ],
      },
      { name: "card_gap", selector: { number: { min: 0, max: 48, mode: "slider", unit_of_measurement: "px" } } },
      { name: "card_background", selector: { boolean: {} } },
      { name: "inner_cards_background", selector: { boolean: {} } },
      { name: "hide_single_tab", selector: { boolean: {} } },
    ];
    const keys = schemaKeys(schema);
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${{ ...DEFAULTS, ...this._config }}
        .schema=${schema}
        .computeLabel=${this._computeLabel}
        @value-changed=${(ev) => {
          ev.stopPropagation();
          this._commit(applyValues(this._config, ev.detail.value, keys, DEFAULTS));
        }}
      ></ha-form>
      <h3>${this._t("global_colors")}</h3>
      ${COLOR_KEYS.map((key) =>
        this._renderColorField(key, this._config[key], (value) =>
          this._commit(applyValues(this._config, { [key]: value }, [key])),
        ),
      )}
      <div class="hint small">${this._t("color_helper")}</div>
    `;
  }

  /* ---------- Behavior page ---------- */

  _renderBehaviorPage() {
    const tabOptions = this._tabs.map((tab, index) => ({ value: String(index), label: this._tabName(tab, index) }));
    const schema = [
      ...(tabOptions.length
        ? [{ name: "default_tab", selector: { select: { mode: "dropdown", options: tabOptions } } }]
        : []),
      { name: "remember_tab", selector: { boolean: {} } },
      { name: "swipe", selector: { boolean: {} } },
      {
        name: "return_to_default",
        selector: { number: { min: 0, max: 86400, mode: "box", unit_of_measurement: "s" } },
      },
    ];
    const keys = schemaKeys(schema);
    const autoCycle = { ...AUTO_CYCLE_DEFAULTS, ...(this._config.auto_cycle || {}) };
    const cycleSchema = [{ name: "enabled", selector: { boolean: {} } }];
    if (autoCycle.enabled) {
      cycleSchema.push(
        {
          type: "grid",
          name: "",
          schema: [
            { name: "interval", selector: { number: { min: 1, max: 86400, mode: "box", unit_of_measurement: "s" } } },
            {
              name: "pause_on_interaction",
              selector: { number: { min: 0, max: 86400, mode: "box", unit_of_measurement: "s" } },
            },
          ],
        },
        { name: "pause_on_hover", selector: { boolean: {} } },
        { name: "show_progress", selector: { boolean: {} } },
      );
    }
    const cycleKeys = schemaKeys(cycleSchema);
    const data = { ...DEFAULTS, ...this._config };
    data.default_tab = String(Number(data.default_tab) || 0);

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${schema}
        .computeLabel=${this._computeLabel}
        @value-changed=${(ev) => {
          ev.stopPropagation();
          const values = { ...ev.detail.value };
          if (values.default_tab !== undefined) values.default_tab = Number(values.default_tab) || 0;
          this._commit(applyValues(this._config, values, keys, DEFAULTS));
        }}
      ></ha-form>
      <h3>${this._t("auto_cycle")}</h3>
      <ha-form
        .hass=${this.hass}
        .data=${autoCycle}
        .schema=${cycleSchema}
        .computeLabel=${(item) => this._t(item.name === "enabled" ? "auto_cycle_enabled" : item.name)}
        @value-changed=${(ev) => {
          ev.stopPropagation();
          const next = applyValues(this._config.auto_cycle || {}, ev.detail.value, cycleKeys, AUTO_CYCLE_DEFAULTS);
          const config = { ...this._config, auto_cycle: next };
          if (!Object.keys(next).length) delete config.auto_cycle;
          this._commit(config);
        }}
      ></ha-form>
      <div class="hint small">${this._t("auto_cycle_helper")}</div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      --hct-radius: 10px;
    }
    .pages {
      display: flex;
      gap: 4px;
      padding: 4px;
      margin-bottom: 16px;
      border-radius: 12px;
      background: rgba(var(--rgb-primary-text-color, 33, 33, 33), 0.06);
    }
    button {
      font: inherit;
      color: inherit;
    }
    .page-btn {
      flex: 1 1 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 10px;
      border: none;
      border-radius: 9px;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-weight: 500;
    }
    .page-btn.active {
      background: var(--card-background-color, #fff);
      color: var(--primary-color);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    }
    .page-btn ha-icon,
    .sub-btn ha-icon,
    .chip ha-icon {
      --mdc-icon-size: 18px;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 12px;
    }
    .chip {
      --chip-color: var(--primary-color);
      display: inline-flex;
      align-items: center;
      gap: 6px;
      max-width: 100%;
      padding: 6px 12px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 999px;
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .chip span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .chip.active {
      border-color: var(--chip-color);
      background: var(--chip-color);
      color: var(--text-primary-color, #fff);
    }
    .chip.add {
      border-style: dashed;
      color: var(--primary-color);
    }
    .chip.add.active {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.15);
      color: var(--primary-color);
      border-color: var(--primary-color);
    }
    .chip.small {
      padding: 4px 10px;
      font-size: 13px;
    }
    .chip .card-type {
      opacity: 0.7;
      font-size: 12px;
    }
    .chip .mini {
      --mdc-icon-size: 14px;
      opacity: 0.8;
    }
    .tab-editor {
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: var(--hct-radius);
      overflow: hidden;
    }
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
      padding: 4px 8px;
      background: rgba(var(--rgb-primary-text-color, 33, 33, 33), 0.04);
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    }
    .subnav {
      display: flex;
      flex-wrap: wrap;
      gap: 2px;
    }
    .sub-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 8px 10px;
      border: none;
      border-bottom: 2px solid transparent;
      background: none;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-weight: 500;
    }
    .sub-btn.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }
    .count {
      min-width: 18px;
      padding: 0 5px;
      border-radius: 9px;
      font-size: 11px;
      line-height: 18px;
      text-align: center;
      background: rgba(var(--rgb-primary-text-color, 33, 33, 33), 0.1);
    }
    .actions {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 2px;
    }
    .icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: none;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    .icon-btn:hover:not([disabled]) {
      background: rgba(var(--rgb-primary-text-color, 33, 33, 33), 0.08);
      color: var(--primary-text-color);
    }
    .icon-btn[disabled] {
      opacity: 0.35;
      cursor: default;
    }
    .icon-btn.danger:hover:not([disabled]) {
      color: var(--error-color, #db4437);
    }
    .tab-body {
      padding: 12px;
    }
    .card-toolbar {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 8px;
    }
    .move-select {
      height: 32px;
      max-width: 180px;
      padding: 0 6px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 8px;
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 13px;
    }
    .hint {
      margin: 0 0 12px;
      color: var(--secondary-text-color);
      line-height: 1.4;
    }
    .hint.small {
      font-size: 12px;
      margin-top: 8px;
    }
    h3 {
      margin: 24px 0 8px;
      font-size: 15px;
      font-weight: 500;
    }
    .color-field {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .color-field .grow {
      flex: 1 1 auto;
      min-width: 0;
    }
    .swatch {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.2));
      cursor: pointer;
      overflow: hidden;
      color: var(--secondary-text-color);
    }
    .swatch input {
      position: absolute;
      inset: 0;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      border: none;
      padding: 0;
    }
    .condition {
      margin-bottom: 12px;
      padding: 8px 12px 12px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: var(--hct-radius);
    }
    .condition-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
      font-weight: 500;
    }
    .condition-header span {
      flex: 1 1 auto;
    }
    .add-condition .label {
      margin: 8px 0 6px;
      font-weight: 500;
    }
    pre {
      margin: 0;
      padding: 8px;
      overflow: auto;
      font-size: 12px;
      border-radius: 6px;
      background: rgba(var(--rgb-primary-text-color, 33, 33, 33), 0.06);
    }
    ha-form {
      display: block;
    }
  `;
}

if (!customElements.get(EDITOR_TYPE)) {
  customElements.define(EDITOR_TYPE, HACardTabsEditor);
}
