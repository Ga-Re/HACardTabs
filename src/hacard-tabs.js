import { LitElement, html, nothing } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { keyed } from "lit/directives/keyed.js";

import { AUTO_CYCLE_DEFAULTS, CARD_TYPE, DEFAULTS, EDITOR_SELECT_EVENT, EDITOR_TYPE, VERSION } from "./const.js";
import {
  collectConditions,
  conditionTemplates,
  conditionType,
  conditionsMet,
  isTruthy,
  tabVisible,
} from "./conditions.js";
import { EASINGS, getTransition } from "./animations.js";
import { localize } from "./localize.js";
import { cardStyles } from "./styles.js";
import { cssColor, fireEvent, getCardHelpers } from "./utils.js";
import "./editor.js";

const SWIPE_BLOCKERS =
  "input, textarea, select, [role='slider'], ha-slider, ha-control-slider, ha-control-circular-slider, " +
  "ha-control-select, ha-map, ha-chart-base, ha-more-info-control-select-container, .tabbar, .bar-row";

const HOLD_TIME = 500;
const DOUBLE_TAP_TIME = 250;

const isTemplate = (value) => typeof value === "string" && /\{\{|\{%/.test(value);
const hasAction = (action) => Boolean(action && action.action && action.action !== "none");
const px = (value) =>
  value === undefined || value === null || value === "" || Number.isNaN(Number(value))
    ? undefined
    : `${Number(value)}px`;

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
    this._narrow = false;
    this._barRevealed = true;
    this._menuOpen = false;
    this._overflow = { over: false, start: false, end: false };
    this._onEditorSelect = () => this._applyEditorSelection();
    this._onWindowPointer = (ev) => this._handleWindowPointer(ev);
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
    this._syncSeen = undefined;
    this._jumpStates = undefined;

    if (this._active === undefined || this._active >= tabs.length) {
      this._active = this._initialTab();
    }
    this._applyEditorSelection();

    if (this.isConnected) {
      this._setupWatchers();
      this._updateTemplateSubscriptions();
      this._scheduleCycle();
      this._revealBar();
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
    const fixedHeight = Number(this._config.content_height);
    if (fixedHeight > 0) return 1 + Math.ceil(fixedHeight / 50);
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
    if (typeof ResizeObserver !== "undefined") {
      this._resizeObserver = new ResizeObserver((entries) => this._onResize(entries));
      this._resizeObserver.observe(this);
      this._observedBar = undefined;
    }
    if (this._config) {
      this._setupWatchers();
      this._updateTemplateSubscriptions();
      this._applyEditorSelection();
      this._scheduleCycle();
      this._revealBar();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(EDITOR_SELECT_EVENT, this._onEditorSelect);
    window.removeEventListener("pointerdown", this._onWindowPointer, true);
    this._resizeObserver?.disconnect();
    this._resizeObserver = undefined;
    this._clearWatchers();
    this._unsubscribeTemplates();
    for (const timer of ["_cycleTimer", "_returnTimer", "_jumpTimer", "_barTimer", "_holdTimer", "_tapTimer"]) {
      clearTimeout(this[timer]);
      this[timer] = undefined;
    }
    this._cycleActive = false;
    this._menuOpen = false;
  }

  willUpdate() {
    if (!this._config) return;
    const tabs = this._config.tabs;
    const ctx = { hass: this._hass, templates: this._templates };
    this._visibility = tabs.map((tab) => (this._hass ? tabVisible(tab, ctx) : !tab.disabled));
    this._shown = tabs.map((_, i) => i).filter((i) => this._isEditing || this._visibility[i]);

    this._syncFromEntity();
    this._checkJumps(ctx);

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
    const bar = this.renderRoot.querySelector(".tabbar");
    if (this._resizeObserver && bar !== this._observedBar) {
      if (this._observedBar) this._resizeObserver.unobserve(this._observedBar);
      if (bar) this._resizeObserver.observe(bar);
      this._observedBar = bar;
    }
    this._positionIndicator();
    this._measureOverflow();
    if (this._active !== this._scrolledFor) {
      this._scrolledFor = this._active;
      this._scrollTabIntoView();
    }
    if (this._config && (this._active !== this._cycleForTab || this._canCycle() !== this._cycleForState)) {
      this._scheduleCycle();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Effective options (responsive)                                      */
  /* ------------------------------------------------------------------ */

  _eff(key) {
    const mobile = this._config.mobile;
    if (this._narrow && mobile && mobile[key] !== undefined && mobile[key] !== "" && mobile[key] !== "default") {
      return mobile[key];
    }
    return this._config[key];
  }

  _onResize(entries) {
    for (const entry of entries) {
      if (entry.target !== this || !this._config) continue;
      const mobile = this._config.mobile;
      const breakpoint = Number(this._config.mobile_breakpoint) || DEFAULTS.mobile_breakpoint;
      const width = entry.contentRect.width;
      const narrow = Boolean(mobile && Object.keys(mobile).length && width > 0 && width < breakpoint);
      if (narrow !== this._narrow) {
        this._narrow = narrow;
        this.requestUpdate();
      }
    }
    this._positionIndicator();
    this._measureOverflow();
  }

  /* ------------------------------------------------------------------ */
  /* Rendering                                                           */
  /* ------------------------------------------------------------------ */

  render() {
    const cfg = this._config;
    if (!cfg) return nothing;

    if (!cfg.tabs.length) {
      return html`<ha-card><div class="empty">${localize(this._hass, "card.no_tabs")}</div></ha-card>`;
    }

    const position = ["top", "bottom", "left", "right"].includes(this._eff("tab_position"))
      ? this._eff("tab_position")
      : "top";
    const vertical = position === "left" || position === "right";
    const contentHeight = px(cfg.content_height);
    const vars = {
      "--hct-gap": `${Number(cfg.card_gap) >= 0 ? Number(cfg.card_gap) : 8}px`,
      "--hct-font-size": px(cfg.tab_font_size),
      "--hct-icon-size": px(cfg.tab_icon_size),
      "--hct-tab-height": px(cfg.tab_height),
      "--hct-tab-gap": px(cfg.tab_spacing),
      "--hct-radius": px(cfg.tab_radius),
      "--hct-padding": px(cfg.content_padding),
      "--hct-anim-duration": `${this._animationDuration()}ms`,
      "--hct-anim-easing": EASINGS[cfg.animation_easing] || "ease",
    };

    return html`
      <ha-card
        class=${classMap({
          "no-bg": cfg.card_background === false,
          "flat-inner": cfg.inner_cards_background === false,
          "menu-open": this._menuOpen,
          [`bar-${position}`]: true,
        })}
        style=${styleMap(vars)}
        @pointerdown=${this._onPointerDown}
        @pointermove=${this._onPointerMove}
        @pointerenter=${this._onPointerEnter}
        @pointerleave=${this._onPointerLeave}
        @touchstart=${{ handleEvent: (ev) => this._onTouchStart(ev), passive: true }}
        @touchmove=${{ handleEvent: (ev) => this._onTouchMove(ev), passive: true }}
        @touchend=${{ handleEvent: (ev) => this._onTouchEnd(ev), passive: true }}
        @touchcancel=${{ handleEvent: () => this._onTouchCancel(), passive: true }}
      >
        ${cfg.title ? html`<div class="title">${cfg.title}</div>` : nothing}
        <div class="root pos-${position}">
          ${this._renderBar(position, vertical)}
          <div class="body">
            ${this._renderProgress()}
            <div
              class=${classMap({ content: true, "fixed-height": Boolean(contentHeight) })}
              style=${styleMap({ height: contentHeight })}
              role="tabpanel"
            >
              <div class="viewport"></div>
            </div>
          </div>
        </div>
        ${this._renderMenu()}
      </ha-card>
    `;
  }

  _renderBar(position, vertical) {
    const cfg = this._config;
    const mode = this._eff("tab_bar") || "show";
    if (cfg.hide_single_tab && !this._isEditing && this._shown.length <= 1) return nothing;
    if (mode === "hidden" && !this._isEditing) return nothing;

    const collapsed = mode === "auto" && !this._barRevealed && !this._isEditing;
    const overflow = vertical ? "scroll" : cfg.tab_overflow || "scroll";
    const style = this._eff("tab_style") || "underline";
    const sliding = cfg.sliding_indicator !== false;
    const showArrows = overflow === "arrows" && this._overflow.over;
    const showMore = overflow === "menu" && this._overflow.over;
    const activeTab = this._config.tabs[this._active] || {};

    return html`
      <div
        class=${classMap({
          "bar-wrap": true,
          vertical,
          collapsed,
          "edit-only": mode === "hidden",
        })}
      >
        <div class="bar-inner">
          <div class="bar-row">
            ${showArrows
              ? html`<button
                  type="button"
                  class="bar-btn"
                  ?disabled=${!this._overflow.start}
                  aria-label="‹"
                  @click=${() => this._scrollBar(-1)}
                >
                  <ha-icon icon="mdi:chevron-left"></ha-icon>
                </button>`
              : nothing}
            <div
              class=${classMap({
                tabbar: true,
                vertical,
                sliding,
                wrap: overflow === "wrap" && !vertical,
                [`style-${style}`]: true,
                [`align-${this._eff("tab_alignment") || "start"}`]: true,
              })}
              role="tablist"
              aria-orientation=${vertical ? "vertical" : "horizontal"}
              @keydown=${this._onKeyDown}
              @scroll=${this._measureOverflow}
            >
              ${sliding
                ? html`<div
                    class="indicator"
                    style=${styleMap(this._tabVars(activeTab, this._tabDisplay(this._active).color))}
                  ></div>`
                : nothing}
              ${this._shown.map((index) => this._renderTab(index))}
            </div>
            ${showArrows
              ? html`<button
                  type="button"
                  class="bar-btn"
                  ?disabled=${!this._overflow.end}
                  aria-label="›"
                  @click=${() => this._scrollBar(1)}
                >
                  <ha-icon icon="mdi:chevron-right"></ha-icon>
                </button>`
              : nothing}
            ${showMore
              ? html`<button
                  type="button"
                  class="bar-btn more-btn"
                  aria-haspopup="menu"
                  aria-expanded=${this._menuOpen ? "true" : "false"}
                  aria-label=${localize(this._hass, "card.more_tabs")}
                  title=${localize(this._hass, "card.more_tabs")}
                  @click=${this._toggleMenu}
                >
                  <ha-icon icon="mdi:dots-horizontal"></ha-icon>
                </button>`
              : nothing}
          </div>
        </div>
      </div>
      ${collapsed
        ? html`<button
            type="button"
            class="bar-handle"
            aria-label=${localize(this._hass, "card.show_tabs")}
            @click=${() => this._revealBar(true)}
          ></button>`
        : nothing}
    `;
  }

  _renderTab(index) {
    const cfg = this._config;
    const tab = cfg.tabs[index] || {};
    const display = this._tabDisplay(index);
    const active = index === this._active;
    const disabled = Boolean(tab.disabled);
    const hiddenByConditions = !disabled && !this._visibility[index];
    const content = this._eff("tab_content");
    const showIcon = Boolean(display.icon) && content !== "name";
    const showName = content !== "icon" || !display.icon;
    let title = display.name;
    if (disabled) title = `${display.name} – ${localize(this._hass, "card.disabled_tab")}`;
    else if (hiddenByConditions) title = `${display.name} – ${localize(this._hass, "card.hidden_tab")}`;

    return html`
      <button
        class=${classMap({
          tab: true,
          active,
          "cond-hidden": hiddenByConditions || disabled,
          "icon-top": this._eff("icon_position") === "top" && showIcon && showName,
        })}
        role="tab"
        type="button"
        aria-selected=${active ? "true" : "false"}
        aria-label=${display.name}
        tabindex=${active ? "0" : "-1"}
        title=${title}
        data-index=${index}
        style=${styleMap(this._tabVars(tab, display.color))}
        @click=${() => this._onTabClick(index)}
        @pointerdown=${() => this._onTabPointerDown(index)}
        @pointerup=${this._cancelHold}
        @pointerleave=${this._cancelHold}
        @pointercancel=${this._cancelHold}
        @contextmenu=${(ev) => hasAction(tab.hold_action) && ev.preventDefault()}
      >
        ${showIcon ? html`<ha-icon .icon=${display.icon}></ha-icon>` : nothing}
        ${showName ? html`<span class="label">${display.name}</span>` : nothing}
        ${display.badge !== undefined
          ? html`<span
              class=${classMap({ badge: true, dot: Boolean(tab.badge_dot) })}
              style=${styleMap({ "--hct-badge": cssColor(tab.badge_color) })}
              >${tab.badge_dot ? nothing : display.badge}</span
            >`
          : nothing}
        ${disabled
          ? html`<ha-icon class="cond-icon" icon="mdi:cancel"></ha-icon>`
          : hiddenByConditions
            ? html`<ha-icon class="cond-icon" icon="mdi:eye-off"></ha-icon>`
            : nothing}
      </button>
    `;
  }

  _renderProgress() {
    const ac = this._config.auto_cycle;
    if (!this._cycleActive || !ac.show_progress) return nothing;
    const color = cssColor(this._tabDisplay(this._active).color) ?? cssColor(this._config.color);
    return keyed(
      this._cycleKey,
      html`<div class="progress">
        <div
          class=${classMap({ bar: true, paused: this._cyclePaused })}
          style=${styleMap({
            animationDuration: `${this._cycleDuration}ms`,
            "--hct-color": color,
          })}
        ></div>
      </div>`,
    );
  }

  _renderMenu() {
    if (!this._menuOpen) return nothing;
    const pos = this._menuPos || {};
    return html`
      <div
        class="menu"
        role="menu"
        style=${styleMap({
          top: pos.top !== undefined ? `${pos.top}px` : undefined,
          bottom: pos.bottom !== undefined ? `${pos.bottom}px` : undefined,
          right: `${pos.right ?? 8}px`,
        })}
      >
        ${this._shown.map((index) => {
          const display = this._tabDisplay(index);
          const tab = this._config.tabs[index] || {};
          return html`
            <button
              type="button"
              role="menuitem"
              class=${classMap({ "menu-item": true, active: index === this._active })}
              style=${styleMap(this._tabVars(tab, display.color))}
              @click=${() => {
                this._closeMenu();
                this._selectByUser(index);
              }}
            >
              ${display.icon ? html`<ha-icon .icon=${display.icon}></ha-icon>` : html`<span class="spacer"></span>`}
              <span class="label">${display.name}</span>
              ${display.badge !== undefined && !tab.badge_dot
                ? html`<span class="badge" style=${styleMap({ "--hct-badge": cssColor(tab.badge_color) })}
                    >${display.badge}</span
                  >`
                : nothing}
            </button>
          `;
        })}
      </div>
    `;
  }

  /** Name, icon, color and badge of a tab including template overrides. */
  _tabDisplay(index) {
    const tab = this._config.tabs[index] || {};
    const fromTemplate = (key) => {
      if (!tab[key]) return undefined;
      const value = this._templates.get(String(tab[key]));
      if (value === undefined || value === null || value === "") return undefined;
      return String(value).trim() || undefined;
    };
    let badge;
    if (tab.badge !== undefined && tab.badge !== null && tab.badge !== "") {
      const raw = isTemplate(tab.badge) ? this._templates.get(String(tab.badge)) : tab.badge;
      badge = raw !== undefined && isTruthy(raw) ? String(raw).trim() : undefined;
    } else {
      badge = this._entityBadge(tab.badge_entity);
    }
    return {
      name: fromTemplate("name_template") || tab.name || localize(this._hass, "editor.new_tab", { n: index + 1 }),
      icon: fromTemplate("icon_template") || tab.icon,
      color: fromTemplate("color_template") || tab.color,
      badge,
    };
  }

  _tabVars(tab, color) {
    const cfg = this._config;
    const values = {
      "--hct-color": cssColor(color) ?? cssColor(cfg.color),
      "--hct-text": cssColor(tab.text_color) ?? cssColor(cfg.text_color),
      "--hct-active-text": cssColor(tab.active_text_color) ?? cssColor(cfg.active_text_color),
      "--hct-bg": cssColor(tab.background_color) ?? cssColor(cfg.background_color),
    };
    return Object.fromEntries(Object.entries(values).filter(([, value]) => value));
  }

  _entityBadge(entityId) {
    if (!entityId || !this._hass) return undefined;
    const stateObj = this._hass.states[entityId];
    if (!stateObj || ["unavailable", "unknown"].includes(stateObj.state)) return undefined;
    if (typeof this._hass.formatEntityState === "function") {
      return this._hass.formatEntityState(stateObj);
    }
    const unit = stateObj.attributes?.unit_of_measurement;
    return unit ? `${stateObj.state} ${unit}` : stateObj.state;
  }

  /* ------------------------------------------------------------------ */
  /* Tab bar helpers: indicator, overflow, menu, auto hide               */
  /* ------------------------------------------------------------------ */

  _positionIndicator() {
    const bar = this.renderRoot?.querySelector(".tabbar");
    const indicator = bar?.querySelector(".indicator");
    if (!indicator) return;
    const tab = bar.querySelector(`.tab[data-index="${this._active}"]`);
    if (!tab || !tab.offsetWidth) {
      indicator.style.opacity = "0";
      return;
    }
    const first = !indicator.dataset.placed;
    if (first) indicator.classList.add("instant");
    indicator.style.opacity = "1";
    indicator.style.left = `${tab.offsetLeft}px`;
    indicator.style.top = `${tab.offsetTop}px`;
    indicator.style.width = `${tab.offsetWidth}px`;
    indicator.style.height = `${tab.offsetHeight}px`;
    indicator.dataset.placed = "1";
    if (first) {
      void indicator.offsetWidth;
      indicator.classList.remove("instant");
    }
  }

  _scrollTabIntoView() {
    const bar = this.renderRoot?.querySelector(".tabbar");
    const tab = bar?.querySelector(`.tab[data-index="${this._active}"]`);
    if (!tab) return;
    const vertical = bar.classList.contains("vertical");
    const start = vertical ? tab.offsetTop : tab.offsetLeft;
    const size = vertical ? tab.offsetHeight : tab.offsetWidth;
    const scroll = vertical ? bar.scrollTop : bar.scrollLeft;
    const visible = vertical ? bar.clientHeight : bar.clientWidth;
    let target;
    if (start < scroll) target = start - 16;
    else if (start + size > scroll + visible) target = start + size - visible + 16;
    if (target === undefined) return;
    bar.scrollTo({ [vertical ? "top" : "left"]: Math.max(0, target), behavior: "smooth" });
  }

  _measureOverflow() {
    const bar = this.renderRoot?.querySelector(".tabbar");
    if (!bar) return;
    const vertical = bar.classList.contains("vertical");
    const size = vertical ? bar.scrollHeight : bar.scrollWidth;
    const visible = vertical ? bar.clientHeight : bar.clientWidth;
    const scroll = vertical ? bar.scrollTop : bar.scrollLeft;
    const next = {
      over: size > visible + 1,
      start: scroll > 1,
      end: scroll + visible < size - 1,
    };
    const key = `${next.over}|${next.start}|${next.end}`;
    if (key === this._overflowKey) return;
    this._overflowKey = key;
    this._overflow = next;
    this.requestUpdate();
  }

  _scrollBar(direction) {
    const bar = this.renderRoot.querySelector(".tabbar");
    bar?.scrollBy({ left: direction * bar.clientWidth * 0.7, behavior: "smooth" });
  }

  _toggleMenu(ev) {
    ev.stopPropagation();
    if (this._menuOpen) {
      this._closeMenu();
      return;
    }
    const card = this.renderRoot.querySelector("ha-card");
    const cardRect = card.getBoundingClientRect();
    const buttonRect = ev.currentTarget.getBoundingClientRect();
    const bottom = this._eff("tab_position") === "bottom";
    this._menuPos = bottom
      ? { bottom: cardRect.bottom - buttonRect.top + 4, right: cardRect.right - buttonRect.right }
      : { top: buttonRect.bottom - cardRect.top + 4, right: cardRect.right - buttonRect.right };
    this._menuOpen = true;
    window.addEventListener("pointerdown", this._onWindowPointer, true);
    this.requestUpdate();
  }

  _handleWindowPointer(ev) {
    const path = ev.composedPath();
    const menu = this.renderRoot.querySelector(".menu");
    const button = this.renderRoot.querySelector(".more-btn");
    if ((menu && path.includes(menu)) || (button && path.includes(button))) return;
    this._closeMenu();
  }

  _closeMenu() {
    if (!this._menuOpen) return;
    this._menuOpen = false;
    window.removeEventListener("pointerdown", this._onWindowPointer, true);
    this.requestUpdate();
  }

  _revealBar(force = false) {
    if (!this._config || (this._eff("tab_bar") || "show") !== "auto") return;
    const now = Date.now();
    // Throttle frequent pointer moves.
    if (!force && this._barRevealed && now - (this._barRevealedAt || 0) < 500) return;
    this._barRevealedAt = now;
    clearTimeout(this._barTimer);
    if (!this._barRevealed) {
      this._barRevealed = true;
      this.requestUpdate();
    }
    const delay = Math.max(1, Number(this._config.tab_bar_auto_hide) || DEFAULTS.tab_bar_auto_hide) * 1000;
    this._barTimer = setTimeout(() => {
      if (this._menuOpen || (this._hovering && this._hoverInBar)) {
        this._revealBar(true);
        return;
      }
      this._barRevealed = false;
      this.requestUpdate();
    }, delay);
  }

  /* ------------------------------------------------------------------ */
  /* Sections (tab content) and transitions                              */
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
    this._finishTransition();
    this._sections.clear();
    this._displayedIndex = undefined;
    this._currentSection = undefined;
    const viewport = this.renderRoot?.querySelector?.(".viewport");
    if (viewport) viewport.replaceChildren();
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

  _animationDuration() {
    const value = Number(this._config.animation_duration);
    return Math.min(3000, Math.max(50, Number.isFinite(value) && value > 0 ? value : DEFAULTS.animation_duration));
  }

  _animationName() {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return "none";
    return this._eff("animation") || "none";
  }

  _syncContent() {
    if (this._drag || this._dragSettling) return;
    const viewport = this.renderRoot.querySelector(".viewport");
    if (!viewport || !this._config) return;
    const index = this._shown.includes(this._active) ? this._active : undefined;
    const section = index === undefined ? undefined : this._getSection(index).section;
    if (section === this._currentSection && (!section || section.parentNode === viewport)) return;

    const previous =
      this._currentSection && this._currentSection.parentNode === viewport ? this._currentSection : undefined;
    const previousIndex = this._displayedIndex;
    this._finishTransition();
    this._currentSection = section;
    this._displayedIndex = index;

    if (section) {
      section.classList.remove("leaving");
      viewport.append(section);
    }
    for (const child of [...viewport.children]) {
      if (child !== section && child !== previous) child.remove();
    }
    if (!previous || previous === section) return;

    let transition;
    if (section && previousIndex !== undefined && typeof section.animate === "function") {
      const forward = this._shown.indexOf(index) >= this._shown.indexOf(previousIndex);
      transition = getTransition(this._animationName(), forward ? 1 : -1);
    }
    if (!transition) {
      previous.remove();
      return;
    }
    this._runTransition(viewport, previous, section, transition);
  }

  _runTransition(viewport, previous, section, transition) {
    const duration = this._animationDuration();
    const easing = transition.easing || EASINGS[this._config.animation_easing] || "ease";
    const part = transition.sequential ? duration / 2 : duration;
    viewport.classList.add("animating");
    previous.classList.add("leaving");
    const animations = [];
    if (transition.out) {
      animations.push(previous.animate(transition.out, { duration: part, easing, fill: "forwards" }));
    }
    animations.push(
      section.animate(transition.in, {
        duration: part,
        delay: transition.sequential ? part : 0,
        easing,
        fill: "backwards",
      }),
    );
    const state = { done: false };
    state.cleanup = () => {
      if (state.done) return;
      state.done = true;
      for (const animation of animations) animation.cancel();
      previous.classList.remove("leaving");
      if (previous !== this._currentSection) previous.remove();
      viewport.classList.remove("animating");
      if (this._transition === state) this._transition = undefined;
    };
    this._transition = state;
    Promise.all(animations.map((animation) => animation.finished)).then(state.cleanup, () => {});
  }

  _finishTransition() {
    this._transition?.cleanup();
    this._transition = undefined;
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
    if (this._config.remember_tab && (source === "user" || source === "return")) {
      try {
        window.localStorage.setItem(this._storageKey, String(index));
      } catch (_err) {
        // storage not available
      }
    }
  }

  /** Tab change requested by the user (click, keyboard, swipe, menu). */
  _selectByUser(index) {
    clearTimeout(this._jumpTimer);
    this._jumpTimer = undefined;
    const changed = index !== this._active;
    this._setActive(index, "user");
    this._onInteraction(true);
    if (changed) this._writeSync(index);
  }

  _onTabPointerDown(index) {
    this._holdFired = false;
    clearTimeout(this._holdTimer);
    const tab = this._config.tabs[index] || {};
    if (!hasAction(tab.hold_action)) return;
    this._holdTimer = setTimeout(() => {
      this._holdFired = true;
      this._fireAction(index, "hold");
    }, HOLD_TIME);
  }

  _cancelHold = () => {
    clearTimeout(this._holdTimer);
    this._holdTimer = undefined;
  };

  _onTabClick(index) {
    if (this._holdFired) {
      this._holdFired = false;
      return;
    }
    const tab = this._config.tabs[index] || {};
    if (!hasAction(tab.double_tap_action)) {
      this._selectByUser(index);
      return;
    }
    if (this._tapTimer && this._tapIndex === index) {
      clearTimeout(this._tapTimer);
      this._tapTimer = undefined;
      this._fireAction(index, "double_tap");
      return;
    }
    clearTimeout(this._tapTimer);
    this._tapIndex = index;
    this._tapTimer = setTimeout(() => {
      this._tapTimer = undefined;
      this._selectByUser(index);
    }, DOUBLE_TAP_TIME);
  }

  _fireAction(index, action) {
    const tab = this._config.tabs[index] || {};
    fireEvent(this, "hass-action", {
      config: {
        entity: tab.badge_entity,
        tap_action: { action: "none" },
        hold_action: tab.hold_action,
        double_tap_action: tab.double_tap_action,
      },
      action,
    });
  }

  _step(direction, { wrap = true } = {}) {
    const order = this._shown;
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
    this._selectByUser(target);
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
  /* Entity sync and automatic jumps                                     */
  /* ------------------------------------------------------------------ */

  _indexFromValue(value) {
    const text = String(value ?? "")
      .trim()
      .toLowerCase();
    if (!text || text === "unknown" || text === "unavailable") return undefined;
    const tabs = this._config.tabs;
    let index = tabs.findIndex((tab) => tab.id !== undefined && String(tab.id).toLowerCase() === text);
    if (index >= 0) return index;
    index = tabs.findIndex((tab) => tab.name && String(tab.name).toLowerCase() === text);
    if (index >= 0) return index;
    const number = Number(text);
    if (Number.isFinite(number) && Math.round(number) >= 1 && Math.round(number) <= tabs.length) {
      return Math.round(number) - 1;
    }
    return undefined;
  }

  _syncFromEntity() {
    const entityId = this._config.sync_entity;
    if (!entityId || this._config.sync_mode === "write" || !this._hass || this._isEditing) return;
    const state = this._hass.states[entityId]?.state;
    if (state === undefined || state === this._syncSeen) return;
    this._syncSeen = state;
    const index = this._indexFromValue(state);
    if (index !== undefined && this._visibility[index]) this._setActive(index, "entity");
  }

  _writeSync(index) {
    const entityId = this._config.sync_entity;
    if (!entityId || this._config.sync_mode === "read" || !this._hass) return;
    const stateObj = this._hass.states[entityId];
    if (!stateObj) return;
    const domain = entityId.split(".")[0];
    const tab = this._config.tabs[index] || {};
    const label = String(tab.id ?? tab.name ?? index + 1);
    if (domain === "input_select" || domain === "select") {
      const options = (stateObj.attributes?.options || []).map(String);
      const option =
        options.find((o) => o.toLowerCase() === label.toLowerCase()) ?? options.find((o) => o === String(index + 1));
      if (option === undefined || option === stateObj.state) return;
      this._hass.callService(domain, "select_option", { entity_id: entityId, option });
    } else if (domain === "input_text") {
      if (stateObj.state !== label) this._hass.callService(domain, "set_value", { entity_id: entityId, value: label });
    } else if (domain === "input_number" || domain === "number") {
      if (Number(stateObj.state) !== index + 1) {
        this._hass.callService(domain, "set_value", { entity_id: entityId, value: index + 1 });
      }
    }
  }

  _checkJumps(ctx) {
    const tabs = this._config.tabs;
    const states = tabs.map((tab) => {
      if (!this._hass || !Array.isArray(tab.jump_conditions) || !tab.jump_conditions.length) return undefined;
      // Wait until all templates delivered a first result, otherwise loading would look like a change.
      if (conditionTemplates(tab.jump_conditions).some((template) => !this._templates.has(template))) {
        return undefined;
      }
      return conditionsMet(tab.jump_conditions, tab.jump_condition_mode, ctx);
    });
    const previous = this._jumpStates;
    this._jumpStates = states;
    if (!previous || this._isEditing) return;
    const index = states.findIndex((state, i) => state === true && previous[i] === false && this._visibility[i]);
    if (index < 0) return;

    const from = this._active;
    this._setActive(index, "jump");
    clearTimeout(this._jumpTimer);
    this._jumpTimer = undefined;
    const back = Number(tabs[index].jump_return) || 0;
    const ac = this._config.auto_cycle;
    const pause = back > 0 ? back : Number(ac.pause_on_interaction) || 0;
    if (ac.enabled && pause > 0) this._pausedUntil = Date.now() + pause * 1000;
    if (back > 0 && from !== undefined && from !== index) {
      this._jumpTimer = setTimeout(() => {
        this._jumpTimer = undefined;
        if (this._active === index && this._visibility[from]) this._setActive(from, "jump");
      }, back * 1000);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Interaction: swipe, hover, inactivity                              */
  /* ------------------------------------------------------------------ */

  _onPointerDown() {
    this._revealBar(true);
    this._onInteraction(false);
  }

  _onPointerMove(ev) {
    if (ev.pointerType !== "mouse") return;
    this._hoverInBar = Boolean(ev.composedPath().some((el) => el?.classList?.contains?.("bar-wrap")));
    this._revealBar();
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
    this._revealBar(true);
    if (this._config?.swipe === false || ev.touches.length !== 1 || this._drag) return;
    const blocked = ev
      .composedPath()
      .some((el) => el instanceof Element && typeof el.matches === "function" && el.matches(SWIPE_BLOCKERS));
    if (blocked) return;
    const touch = ev.touches[0];
    this._touch = { x: touch.clientX, y: touch.clientY, time: Date.now(), axis: undefined };
  }

  _onTouchMove(ev) {
    const start = this._touch;
    if (!start || ev.touches.length !== 1) return;
    const touch = ev.touches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (!start.axis) {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      start.axis = Math.abs(dx) > Math.abs(dy) * 1.2 ? "x" : "y";
      if (start.axis === "x" && this._config.swipe_follow !== false) this._dragStart();
    }
    if (start.axis === "x" && this._drag) this._dragMove(dx);
  }

  _onTouchEnd(ev) {
    const start = this._touch;
    this._touch = undefined;
    if (!start) return;
    const touch = ev.changedTouches[0];
    const dx = touch ? touch.clientX - start.x : 0;
    const dy = touch ? touch.clientY - start.y : 0;
    const elapsed = Date.now() - start.time;
    if (this._drag) {
      this._dragEnd(dx, elapsed);
      return;
    }
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5 || elapsed > 800) return;
    const target = this._step(dx < 0 ? 1 : -1, { wrap: false });
    if (target !== undefined) this._selectByUser(target);
  }

  _onTouchCancel() {
    this._touch = undefined;
    if (this._drag) this._dragEnd(0, Infinity);
  }

  _dragStart() {
    const viewport = this.renderRoot.querySelector(".viewport");
    const current = this._currentSection;
    if (!viewport || !current || current.parentNode !== viewport) return;
    this._finishTransition();
    this._drag = { viewport, current, width: viewport.clientWidth || 1, sign: 0, offset: 0 };
    viewport.classList.add("dragging");
  }

  _dragMove(dx) {
    const drag = this._drag;
    const sign = dx < 0 ? 1 : -1;
    if (sign !== drag.sign) {
      if (drag.neighbor) {
        drag.neighbor.classList.remove("drag-neighbor");
        drag.neighbor.style.transform = "";
        drag.neighbor.remove();
      }
      drag.sign = sign;
      drag.target = this._step(sign, { wrap: false });
      drag.neighbor = drag.target !== undefined ? this._getSection(drag.target).section : undefined;
      if (drag.neighbor) {
        drag.neighbor.classList.add("drag-neighbor");
        drag.viewport.append(drag.neighbor);
      }
    }
    drag.offset = drag.neighbor ? dx : dx * 0.3;
    drag.current.style.transform = `translateX(${drag.offset}px)`;
    if (drag.neighbor) drag.neighbor.style.transform = `translateX(${drag.offset + sign * drag.width}px)`;
  }

  _dragEnd(dx, elapsed) {
    const drag = this._drag;
    this._drag = undefined;
    const velocity = Math.abs(dx) / Math.max(1, elapsed);
    const commit = Boolean(
      drag.neighbor &&
      Math.sign(-dx) === drag.sign &&
      (Math.abs(dx) > drag.width * 0.25 || (velocity > 0.4 && Math.abs(dx) > 30)),
    );
    const endCurrent = commit ? -drag.sign * drag.width : 0;
    const options = { duration: 220, easing: "ease-out", fill: "forwards" };
    const animations = [];
    if (typeof drag.current.animate === "function") {
      animations.push(
        drag.current.animate(
          [{ transform: `translateX(${drag.offset}px)` }, { transform: `translateX(${endCurrent}px)` }],
          options,
        ),
      );
      if (drag.neighbor) {
        animations.push(
          drag.neighbor.animate(
            [
              { transform: `translateX(${drag.offset + drag.sign * drag.width}px)` },
              { transform: `translateX(${commit ? 0 : drag.sign * drag.width}px)` },
            ],
            options,
          ),
        );
      }
    }
    this._dragSettling = true;
    const finish = () => {
      for (const animation of animations) animation.cancel();
      drag.current.style.transform = "";
      drag.viewport.classList.remove("dragging");
      if (drag.neighbor) {
        drag.neighbor.style.transform = "";
        drag.neighbor.classList.remove("drag-neighbor");
      }
      this._dragSettling = false;
      if (commit) {
        drag.current.remove();
        this._currentSection = drag.neighbor;
        this._displayedIndex = drag.target;
        this._selectByUser(drag.target);
      } else {
        drag.neighbor?.remove();
      }
      this.requestUpdate();
    };
    Promise.all(animations.map((animation) => animation.finished)).then(finish, finish);
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
    this._hoverInBar = false;
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
      if (this._drag) {
        this._scheduleCycle();
        return;
      }
      const next = this._nextCycleTab();
      if (next !== undefined && next !== this._active) this._setActive(next, "cycle");
      this._scheduleCycle();
    }, this._cycleRemaining);
  }

  /* ------------------------------------------------------------------ */
  /* Condition watchers and templates                                    */
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

  _wantedTemplates() {
    const wanted = new Set();
    for (const tab of this._config.tabs) {
      for (const template of conditionTemplates(tab.conditions)) wanted.add(template);
      for (const template of conditionTemplates(tab.jump_conditions)) wanted.add(template);
      for (const key of ["name_template", "icon_template", "color_template"]) {
        if (tab[key]) wanted.add(String(tab[key]));
      }
      if (isTemplate(tab.badge)) wanted.add(tab.badge);
    }
    return wanted;
  }

  _updateTemplateSubscriptions() {
    if (!this._hass?.connection || !this.isConnected || !this._config) return;
    const wanted = this._wantedTemplates();
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
