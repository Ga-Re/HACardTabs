import { LitElement, html, nothing } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { keyed } from "lit/directives/keyed.js";

import { AUTO_CYCLE_DEFAULTS, CARD_TYPE, DEFAULTS, EDITOR_SELECT_EVENT, EDITOR_TYPE, VERSION } from "./const.js";
import { collectConditions, conditionType, tabVisible } from "./conditions.js";
import { localize } from "./localize.js";
import { cardStyles } from "./styles.js";
import { cssColor, fireEvent, getCardHelpers } from "./utils.js";
import "./editor.js";

const SWIPE_BLOCKERS =
  "input, textarea, select, [role='slider'], ha-slider, ha-control-slider, ha-control-circular-slider, " +
  "ha-control-select, ha-map, ha-chart-base, ha-more-info-control-select-container, .tabbar";

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
}

export class HACardTabs extends LitElement {
  static properties = {
    _config: { state: true },
    _active: { state: true },
  };

  static styles = cardStyles;

  static getConfigElement() {
    return document.createElement(EDITOR_TYPE);
  }

  static getStubConfig(hass) {
    return {
      tabs: [
        {
          name: localize(hass, "card.stub_tab_1"),
          icon: "mdi:home",
          cards: [{ type: "markdown", content: localize(hass, "card.stub_text_1") }],
        },
        {
          name: localize(hass, "card.stub_tab_2"),
          icon: "mdi:star",
          cards: [{ type: "markdown", content: localize(hass, "card.stub_text_2") }],
        },
      ],
    };
  }

  constructor() {
    super();
    this._sections = new Map();
    this._templates = new Map();
    this._templateSubs = new Map();
    this._watchers = [];
    this._visibility = [];
    this._shown = [];
    this._editMode = false;
    this._preview = false;
    this._buildToken = 0;
    this._cycleKey = 0;
    this._cycleActive = false;
    this._cyclePaused = false;
    this._pausedUntil = 0;
    this._hovering = false;
    this._onEditorSelect = () => this._applyEditorSelection();
  }

  /* ------------------------------------------------------------------ */
  /* Home Assistant API                                                  */
  /* ------------------------------------------------------------------ */

  setConfig(config) {
    if (!config || typeof config !== "object") {
      throw new Error("Invalid configuration");
    }
    if (config.tabs !== undefined && !Array.isArray(config.tabs)) {
      throw new Error("'tabs' must be a list");
    }
    const tabs = (config.tabs || []).map((tab) => (tab && typeof tab === "object" ? tab : {}));
    this._config = {
      ...DEFAULTS,
      ...config,
      auto_cycle: { ...AUTO_CYCLE_DEFAULTS, ...(config.auto_cycle || {}) },
      tabs,
    };
    this._tabsKey = JSON.stringify(config.tabs || []);
    this._resetSections();

    if (this._active === undefined || this._active >= tabs.length) {
      this._active = this._initialTab();
    }
    this._applyEditorSelection();

    if (this.isConnected) {
      this._setupWatchers();
      this._updateTemplateSubscriptions();
      this._scheduleCycle();
    }
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    for (const entry of this._sections.values()) {
      for (const card of entry.cards) card.hass = hass;
    }
    if (first) this._updateTemplateSubscriptions();
    this.requestUpdate();
  }

  get hass() {
    return this._hass;
  }

  set editMode(value) {
    this._setEditing("_editMode", value);
  }

  get editMode() {
    return this._editMode;
  }

  set preview(value) {
    this._setEditing("_preview", value);
  }

  get preview() {
    return this._preview;
  }

  async getCardSize() {
    if (!this._config) return 1;
    const index = this._active ?? 0;
    const entry = this._sections.get(index);
    const tab = this._config.tabs[index];
    const columns = Math.max(1, Number(tab?.columns) || 1);
    let size = 0;
    if (entry && entry.cards.length) {
      const sizes = await Promise.all(
        entry.cards.map((card) => (typeof card.getCardSize === "function" ? card.getCardSize() : 1)),
      );
      size = sizes.reduce((sum, value) => sum + (Number(value) || 1), 0);
    } else {
      size = (tab?.cards?.length || 0) * 2;
    }
    return 1 + Math.ceil(size / columns);
  }

  getGridOptions() {
    return { columns: 12, min_columns: 3 };
  }

  /* ------------------------------------------------------------------ */
  /* Lifecycle                                                           */
  /* ------------------------------------------------------------------ */

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(EDITOR_SELECT_EVENT, this._onEditorSelect);
    if (this._config) {
      this._setupWatchers();
      this._updateTemplateSubscriptions();
      this._applyEditorSelection();
      this._scheduleCycle();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(EDITOR_SELECT_EVENT, this._onEditorSelect);
    this._clearWatchers();
    this._unsubscribeTemplates();
    clearTimeout(this._cycleTimer);
    clearTimeout(this._returnTimer);
    this._cycleTimer = undefined;
    this._cycleActive = false;
  }

  willUpdate() {
    if (!this._config) return;
    const tabs = this._config.tabs;
    const ctx = { hass: this._hass, templates: this._templates };
    this._visibility = tabs.map((tab) => (this._hass ? tabVisible(tab, ctx) : true));
    this._shown = tabs.map((_, i) => i).filter((i) => this._isEditing || this._visibility[i]);

    if (!this._shown.includes(this._active)) {
      const fallback = this._initialTab();
      this._active = this._shown.includes(fallback) ? fallback : this._shown[0];
    }

    const hidden = !this._isEditing && tabs.length > 0 && this._shown.length === 0;
    if (hidden !== Boolean(this._hostHidden)) {
      this._hostHidden = hidden;
      this.toggleAttribute("hidden", hidden);
      fireEvent(this, "card-visibility-changed", { value: !hidden });
    }
    this.toggleAttribute("editing", this._isEditing);
  }

  updated() {
    this._syncContent();
    if (this._config && (this._active !== this._cycleForTab || this._canCycle() !== this._cycleForState)) {
      this._scheduleCycle();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Rendering                                                           */
  /* ------------------------------------------------------------------ */

  render() {
    const cfg = this._config;
    if (!cfg) return nothing;

    const position = ["top", "bottom", "left", "right"].includes(cfg.tab_position) ? cfg.tab_position : "top";
    const vertical = position === "left" || position === "right";
    const hideBar = cfg.hide_single_tab && !this._isEditing && this._shown.length <= 1;

    if (!cfg.tabs.length) {
      return html`<ha-card><div class="empty">${localize(this._hass, "card.no_tabs")}</div></ha-card>`;
    }

    return html`
      <ha-card
        class=${classMap({
          "no-bg": cfg.card_background === false,
          "flat-inner": cfg.inner_cards_background === false,
          [`bar-${position}`]: true,
        })}
        style=${styleMap({ "--hct-gap": `${Number(cfg.card_gap) >= 0 ? Number(cfg.card_gap) : 8}px` })}
        @pointerdown=${this._onPointerDown}
        @pointerenter=${this._onPointerEnter}
        @pointerleave=${this._onPointerLeave}
        @touchstart=${{ handleEvent: (ev) => this._onTouchStart(ev), passive: true }}
        @touchend=${{ handleEvent: (ev) => this._onTouchEnd(ev), passive: true }}
      >
        <div class="root pos-${position}">
          ${hideBar
            ? nothing
            : html`
                <div
                  class=${classMap({
                    tabbar: true,
                    vertical,
                    [`style-${cfg.tab_style || "underline"}`]: true,
                    [`align-${cfg.tab_alignment || "start"}`]: true,
                  })}
                  role="tablist"
                  aria-orientation=${vertical ? "vertical" : "horizontal"}
                  @keydown=${this._onKeyDown}
                >
                  ${this._shown.map((index) => this._renderTab(index))}
                </div>
              `}
          <div class="body">
            ${this._renderProgress()}
            <div class="content" role="tabpanel"></div>
          </div>
        </div>
      </ha-card>
    `;
  }

  _renderTab(index) {
    const cfg = this._config;
    const tab = cfg.tabs[index] || {};
    const active = index === this._active;
    const hiddenByConditions = !this._visibility[index];
    const name = tab.name || localize(this._hass, "editor.new_tab", { n: index + 1 });
    const showIcon = Boolean(tab.icon) && cfg.tab_content !== "name";
    const showName = cfg.tab_content !== "icon" || !tab.icon;
    const badge = this._badgeText(tab);
    const title = hiddenByConditions ? `${name} – ${localize(this._hass, "card.hidden_tab")}` : name;

    return html`
      <button
        class=${classMap({
          tab: true,
          active,
          "cond-hidden": hiddenByConditions,
          "icon-top": cfg.icon_position === "top" && showIcon && showName,
        })}
        role="tab"
        type="button"
        aria-selected=${active ? "true" : "false"}
        aria-label=${name}
        tabindex=${active ? "0" : "-1"}
        title=${title}
        data-index=${index}
        style=${styleMap(this._tabVars(tab))}
        @click=${() => this._onTabClick(index)}
      >
        ${showIcon ? html`<ha-icon .icon=${tab.icon}></ha-icon>` : nothing}
        ${showName ? html`<span class="label">${name}</span>` : nothing}
        ${badge !== undefined ? html`<span class="badge">${badge}</span>` : nothing}
        ${hiddenByConditions ? html`<ha-icon class="cond-icon" icon="mdi:eye-off"></ha-icon>` : nothing}
      </button>
    `;
  }

  _renderProgress() {
    const ac = this._config.auto_cycle;
    if (!this._cycleActive || !ac.show_progress) return nothing;
    const tab = this._config.tabs[this._active] || {};
    const color = cssColor(tab.color) ?? cssColor(this._config.color);
    return keyed(
      this._cycleKey,
      html`<div class="progress">
        <div
          class=${classMap({ bar: true, paused: this._cyclePaused })}
          style=${styleMap({
            animationDuration: `${this._cycleDuration}ms`,
            ...(color ? { "--hct-color": color } : {}),
          })}
        ></div>
      </div>`,
    );
  }

  _tabVars(tab) {
    const cfg = this._config;
    const pick = (key) => cssColor(tab[key]) ?? cssColor(cfg[key]);
    const vars = {};
    const map = {
      color: "--hct-color",
      text_color: "--hct-text",
      active_text_color: "--hct-active-text",
      background_color: "--hct-bg",
    };
    for (const [key, cssVar] of Object.entries(map)) {
      const value = pick(key);
      if (value) vars[cssVar] = value;
    }
    return vars;
  }

  _badgeText(tab) {
    if (!tab.badge_entity || !this._hass) return undefined;
    const stateObj = this._hass.states[tab.badge_entity];
    if (!stateObj || ["unavailable", "unknown"].includes(stateObj.state)) return undefined;
    if (typeof this._hass.formatEntityState === "function") {
      return this._hass.formatEntityState(stateObj);
    }
    const unit = stateObj.attributes?.unit_of_measurement;
    return unit ? `${stateObj.state} ${unit}` : stateObj.state;
  }

  /* ------------------------------------------------------------------ */
  /* Sections (tab content)                                              */
  /* ------------------------------------------------------------------ */

  get _isEditing() {
    return this._editMode || this._preview;
  }

  _setEditing(key, value) {
    const next = Boolean(value);
    if (this[key] === next) return;
    this[key] = next;
    for (const entry of this._sections.values()) {
      for (const card of entry.cards) this._applyCardMode(card);
    }
    this._applyEditorSelection();
    this.requestUpdate();
  }

  _applyCardMode(card) {
    const editing = this._isEditing;
    if (card.tagName === "HUI-CARD") {
      card.preview = editing;
    } else {
      card.editMode = editing;
      card.preview = editing;
    }
  }

  _resetSections() {
    this._buildToken += 1;
    this._sections.clear();
    this._displayedIndex = undefined;
    const content = this.renderRoot?.querySelector?.(".content");
    if (content) content.replaceChildren();
  }

  _getSection(index) {
    let entry = this._sections.get(index);
    if (entry) return entry;
    const tab = this._config.tabs[index] || {};
    const section = document.createElement("div");
    section.className = "section";
    section.dataset.empty = localize(this._hass, "editor.no_cards");
    section.style.setProperty("--hct-columns", String(Math.max(1, Number(tab.columns) || 1)));
    // Visibility changes of nested cards must not be mistaken for our own visibility.
    section.addEventListener("card-visibility-changed", (ev) => ev.stopPropagation());
    entry = { section, cards: [] };
    this._sections.set(index, entry);
    this._buildSection(tab, entry, this._buildToken);
    return entry;
  }

  async _buildSection(tab, entry, token) {
    const cards = Array.isArray(tab.cards) ? tab.cards : [];
    if (!cards.length) return;
    const useHuiCard = Boolean(customElements.get("hui-card"));
    const helpers = useHuiCard ? undefined : await getCardHelpers();
    if (token !== this._buildToken) return;
    for (const cardConfig of cards) {
      const card = this._createCard(cardConfig, helpers, entry);
      entry.cards.push(card);
      entry.section.append(card);
    }
  }

  _createCard(cardConfig, helpers, entry) {
    let card;
    if (customElements.get("hui-card")) {
      card = document.createElement("hui-card");
      card.hass = this._hass;
      card.preview = this._isEditing;
      card.config = cardConfig;
      if (typeof card.load === "function") card.load();
    } else if (helpers) {
      card = helpers.createCardElement(cardConfig);
      card.hass = this._hass;
      if (this._isEditing) this._applyCardMode(card);
    } else {
      card = document.createElement("div");
      card.textContent = "Home Assistant card helpers are not available.";
      return card;
    }
    card.addEventListener(
      "ll-rebuild",
      (ev) => {
        ev.stopPropagation();
        const fresh = this._createCard(cardConfig, helpers, entry);
        const position = entry.cards.indexOf(card);
        if (position >= 0) entry.cards[position] = fresh;
        card.replaceWith(fresh);
      },
      { once: true },
    );
    return card;
  }

  _syncContent() {
    const content = this.renderRoot.querySelector(".content");
    if (!content || !this._config) return;
    const index = this._shown.includes(this._active) ? this._active : undefined;
    const section = index === undefined ? undefined : this._getSection(index).section;
    if (section && content.firstElementChild === section && content.childElementCount === 1) return;
    if (!section && content.childElementCount === 0) return;

    const previous = this._displayedIndex;
    if (section) content.replaceChildren(section);
    else content.replaceChildren();
    this._displayedIndex = index;

    if (section && previous !== undefined && previous !== index) {
      this._animate(section, previous, index);
    }
  }

  _animate(section, from, to) {
    const animation = this._config.animation;
    section.classList.remove("anim-fade", "anim-slide-next", "anim-slide-prev");
    if (!animation || animation === "none") return;
    // Force reflow so the animation restarts
    void section.offsetWidth;
    if (animation === "slide") {
      const forward = this._shown.indexOf(to) >= this._shown.indexOf(from);
      section.classList.add(forward ? "anim-slide-next" : "anim-slide-prev");
    } else {
      section.classList.add("anim-fade");
    }
  }

  /* ------------------------------------------------------------------ */
  /* Tab selection                                                       */
  /* ------------------------------------------------------------------ */

  get _storageKey() {
    const base =
      this._config.storage_key ||
      hashString(`${window.location.pathname}|${this._config.tabs.map((t) => t.name || "").join("|")}`);
    return `hacard-tabs:${base}`;
  }

  _defaultIndex() {
    const count = this._config.tabs.length;
    const index = Number(this._config.default_tab) || 0;
    return Math.min(Math.max(0, index), Math.max(0, count - 1));
  }

  _initialTab() {
    if (this._config.remember_tab) {
      try {
        const stored = Number(window.localStorage.getItem(this._storageKey));
        if (Number.isInteger(stored) && stored >= 0 && stored < this._config.tabs.length) return stored;
      } catch (_err) {
        // storage not available
      }
    }
    return this._defaultIndex();
  }

  _setActive(index, source) {
    if (index === undefined || index === this._active) return;
    this._active = index;
    if (this._config.remember_tab && source !== "cycle") {
      try {
        window.localStorage.setItem(this._storageKey, String(index));
      } catch (_err) {
        // storage not available
      }
    }
  }

  _onTabClick(index) {
    this._setActive(index, "user");
    this._onInteraction(true);
  }

  _step(direction, { wrap = true, onlyVisible = false } = {}) {
    const order = onlyVisible ? this._shown.filter((i) => this._visibility[i]) : this._shown;
    if (order.length < 2) return undefined;
    const position = order.indexOf(this._active);
    let next = position + direction;
    if (next < 0 || next >= order.length) {
      if (!wrap) return undefined;
      next = (next + order.length) % order.length;
    }
    return order[next];
  }

  _onKeyDown(ev) {
    const keys = {
      ArrowRight: 1,
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1,
    };
    let target;
    if (ev.key in keys) target = this._step(keys[ev.key]);
    else if (ev.key === "Home") target = this._shown[0];
    else if (ev.key === "End") target = this._shown[this._shown.length - 1];
    else return;
    ev.preventDefault();
    if (target === undefined) return;
    this._setActive(target, "user");
    this._onInteraction(true);
    this.updateComplete.then(() => {
      this.renderRoot.querySelector(`.tab[data-index="${target}"]`)?.focus();
    });
  }

  _applyEditorSelection() {
    const selection = window.__hacardTabsEditorSelection;
    if (!selection || !this._config || selection.key !== this._tabsKey) return;
    const index = Number(selection.index);
    if (Number.isInteger(index) && index >= 0 && index < this._config.tabs.length) {
      this._active = index;
    }
  }

  /* ------------------------------------------------------------------ */
  /* Interaction: swipe, hover, inactivity                              */
  /* ------------------------------------------------------------------ */

  _onPointerDown() {
    this._onInteraction(false);
  }

  _onInteraction(tabChanged) {
    if (!this._config) return;
    const ac = this._config.auto_cycle;
    const pause = Number(ac.pause_on_interaction) || 0;
    if (ac.enabled && pause > 0) {
      this._pausedUntil = Date.now() + pause * 1000;
      this._scheduleCycle();
    } else if (tabChanged) {
      this._scheduleCycle();
    }
    this._armReturnTimer();
  }

  _armReturnTimer() {
    clearTimeout(this._returnTimer);
    const seconds = Number(this._config.return_to_default) || 0;
    if (seconds <= 0 || this._isEditing) return;
    this._returnTimer = setTimeout(() => {
      const index = this._defaultIndex();
      if (this._visibility[index]) this._setActive(index, "return");
    }, seconds * 1000);
  }

  _onTouchStart(ev) {
    this._touch = undefined;
    if (this._config?.swipe === false || ev.touches.length !== 1) return;
    const blocked = ev
      .composedPath()
      .some((el) => el instanceof Element && typeof el.matches === "function" && el.matches(SWIPE_BLOCKERS));
    if (blocked) return;
    const touch = ev.touches[0];
    this._touch = { x: touch.clientX, y: touch.clientY, time: Date.now() };
  }

  _onTouchEnd(ev) {
    const start = this._touch;
    this._touch = undefined;
    if (!start || !ev.changedTouches.length) return;
    const touch = ev.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5 || Date.now() - start.time > 800) return;
    const target = this._step(dx < 0 ? 1 : -1, { wrap: false });
    if (target === undefined) return;
    this._setActive(target, "user");
    this._onInteraction(true);
  }

  _onPointerEnter(ev) {
    if (ev.pointerType !== "mouse") return;
    this._hovering = true;
    if (!this._cycleActive || this._cyclePaused || !this._config.auto_cycle.pause_on_hover) return;
    clearTimeout(this._cycleTimer);
    this._cycleTimer = undefined;
    this._cycleRemaining = Math.max(0, this._cycleRemaining - (Date.now() - this._cycleStartedAt));
    this._cyclePaused = true;
    this.requestUpdate();
  }

  _onPointerLeave(ev) {
    if (ev.pointerType !== "mouse") return;
    this._hovering = false;
    if (!this._cycleActive || !this._cyclePaused) return;
    this._cyclePaused = false;
    this._startCycleTimer();
    this.requestUpdate();
  }

  /* ------------------------------------------------------------------ */
  /* Automatic rotation                                                  */
  /* ------------------------------------------------------------------ */

  _cycleOrder() {
    return this._shown.filter((i) => this._visibility[i]);
  }

  _canCycle() {
    const ac = this._config?.auto_cycle;
    if (!ac?.enabled || !this.isConnected || this._isEditing) return false;
    const order = this._cycleOrder();
    return order.length >= 2 && order.some((i) => !this._config.tabs[i]?.skip_cycle);
  }

  _nextCycleTab() {
    const order = this._cycleOrder();
    const start = Math.max(0, order.indexOf(this._active));
    for (let step = 1; step <= order.length; step += 1) {
      const candidate = order[(start + step) % order.length];
      if (!this._config.tabs[candidate]?.skip_cycle) return candidate;
    }
    return undefined;
  }

  _scheduleCycle() {
    clearTimeout(this._cycleTimer);
    this._cycleTimer = undefined;
    const can = this._canCycle();
    this._cycleForTab = this._active;
    this._cycleForState = can;

    if (!can) {
      if (this._cycleActive) {
        this._cycleActive = false;
        this.requestUpdate();
      }
      return;
    }

    const now = Date.now();
    if (this._pausedUntil > now) {
      this._cycleActive = false;
      this._cycleTimer = setTimeout(() => this._scheduleCycle(), this._pausedUntil - now);
      this.requestUpdate();
      return;
    }

    const tab = this._config.tabs[this._active] || {};
    const seconds =
      Number(tab.cycle_duration) > 0 ? Number(tab.cycle_duration) : Number(this._config.auto_cycle.interval) || 10;
    this._cycleDuration = Math.max(1, seconds) * 1000;
    this._cycleRemaining = this._cycleDuration;
    this._cycleKey += 1;
    this._cycleActive = true;
    this._cyclePaused = this._hovering && this._config.auto_cycle.pause_on_hover;
    if (!this._cyclePaused) this._startCycleTimer();
    this.requestUpdate();
  }

  _startCycleTimer() {
    clearTimeout(this._cycleTimer);
    this._cycleStartedAt = Date.now();
    this._cycleTimer = setTimeout(() => {
      this._cycleTimer = undefined;
      const next = this._nextCycleTab();
      if (next !== undefined && next !== this._active) this._setActive(next, "cycle");
      this._scheduleCycle();
    }, this._cycleRemaining);
  }

  /* ------------------------------------------------------------------ */
  /* Condition watchers                                                  */
  /* ------------------------------------------------------------------ */

  _setupWatchers() {
    this._clearWatchers();
    const conditions = collectConditions(this._config.tabs);
    const queries = new Set(
      conditions.filter((c) => conditionType(c) === "screen" && c.media_query).map((c) => c.media_query),
    );
    for (const query of queries) {
      try {
        const mql = window.matchMedia(query);
        const listener = () => this.requestUpdate();
        mql.addEventListener("change", listener);
        this._watchers.push(() => mql.removeEventListener("change", listener));
      } catch (_err) {
        // invalid media query
      }
    }
    if (conditions.some((c) => conditionType(c) === "time")) {
      const interval = setInterval(() => this.requestUpdate(), 15000);
      this._watchers.push(() => clearInterval(interval));
    }
  }

  _clearWatchers() {
    for (const dispose of this._watchers) dispose();
    this._watchers = [];
  }

  _updateTemplateSubscriptions() {
    if (!this._hass?.connection || !this.isConnected || !this._config) return;
    const wanted = new Set(
      collectConditions(this._config.tabs)
        .filter((c) => conditionType(c) === "template" && c.value_template)
        .map((c) => String(c.value_template)),
    );
    for (const [template, unsub] of this._templateSubs) {
      if (wanted.has(template)) continue;
      this._templateSubs.delete(template);
      this._templates.delete(template);
      unsub.then((fn) => fn?.()).catch(() => {});
    }
    for (const template of wanted) {
      if (this._templateSubs.has(template)) continue;
      const unsub = this._hass.connection
        .subscribeMessage(
          (msg) => {
            this._templates.set(template, msg && "result" in msg ? msg.result : false);
            this.requestUpdate();
          },
          {
            type: "render_template",
            template,
            variables: { user: this._hass.user?.name },
          },
        )
        .catch((err) => {
          console.warn("hacard-tabs: template error", err);
          this._templates.set(template, false);
          this.requestUpdate();
          return undefined;
        });
      this._templateSubs.set(template, unsub);
    }
  }

  _unsubscribeTemplates() {
    for (const unsub of this._templateSubs.values()) {
      unsub.then((fn) => fn?.()).catch(() => {});
    }
    this._templateSubs.clear();
  }
}

if (!customElements.get(CARD_TYPE)) {
  customElements.define(CARD_TYPE, HACardTabs);
}

window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === CARD_TYPE)) {
  window.customCards.push({
    type: CARD_TYPE,
    name: "Card Tabs",
    description: localize(undefined, "card.description"),
    preview: true,
    documentationURL: "https://github.com/Ga-Re/HACardTabs",
  });
}

console.info(
  `%c CARD-TABS %c v${VERSION} `,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; background: white; font-weight: 700;",
);
