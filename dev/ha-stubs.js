/* Minimal stand-ins for Home Assistant frontend elements so the card can be developed and
 * tested outside of Home Assistant. They only mimic the APIs the card and editor use. */
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
        this.title = this._icon || "";
        const root = this.shadowRoot || this.attachShadow({ mode: "open" });
        root.innerHTML = path
          ? `<svg viewBox="0 0 24 24" width="100%" height="100%"><path fill="currentColor" d="${path}"/></svg>`
          : `<span style="width:100%;height:100%;border-radius:50%;background:currentColor;opacity:.5"></span>`;
      }
    },
  );

  class DevTestCard extends HTMLElement {
    setConfig(config) {
      this._config = config;
      this.render();
    }
    set hass(hass) {
      this._hass = hass;
      this.render();
    }
    getCardSize() {
      return 2;
    }
    render() {
      if (!this._config) return;
      const c = this._config;
      let text = c.content || c.type;
      if (c.entity && this._hass) text = `${c.entity}: ${this._hass.states[c.entity]?.state}`;
      this.innerHTML = "";
      const card = document.createElement("div");
      card.className = "dev-card";
      card.style.cssText =
        "background:#fafafa;border:1px solid #ddd;border-radius:10px;padding:12px;white-space:pre-wrap;";
      card.textContent = text;
      this.appendChild(card);
    }
  }
  define("dev-test-card", DevTestCard);

  window.loadCardHelpers = async () => ({
    createCardElement(config) {
      const el = document.createElement("dev-test-card");
      el.setConfig(config);
      return el;
    },
  });

  /* ---------- editor stubs ---------- */

  const flatten = (schema) =>
    schema.flatMap((item) => (item.type === "grid" || item.type === "expandable" ? flatten(item.schema) : [item]));

  define(
    "ha-form",
    class extends HTMLElement {
      set data(v) {
        this._data = v;
        this.scheduleRender();
      }
      get data() {
        return this._data;
      }
      set schema(v) {
        this._schema = v;
        this.scheduleRender();
      }
      scheduleRender() {
        if (this._queued) return;
        this._queued = true;
        queueMicrotask(() => {
          this._queued = false;
          this.render();
        });
      }
      get schema() {
        return this._schema;
      }
      emit(name, value) {
        const data = { ...(this._data || {}), [name]: value };
        this.dispatchEvent(
          new CustomEvent("value-changed", { detail: { value: data }, bubbles: true, composed: true }),
        );
      }
      render() {
        if (!this._schema) return;
        this.innerHTML = "";
        this.style.display = "block";
        for (const item of flatten(this._schema)) {
          const row = document.createElement("label");
          row.style.cssText = "display:flex;flex-direction:column;gap:2px;margin:6px 0;font-size:13px;";
          row.dataset.name = item.name;
          const label = this.computeLabel ? this.computeLabel(item) : item.name;
          row.append(document.createTextNode(label));
          const sel = item.selector || {};
          const value = this._data?.[item.name];
          let input;
          if ("boolean" in sel) {
            input = document.createElement("input");
            input.type = "checkbox";
            input.checked = Boolean(value);
            input.addEventListener("change", () => this.emit(item.name, input.checked));
          } else if ("number" in sel) {
            input = document.createElement("input");
            input.type = "number";
            input.value = value ?? "";
            input.addEventListener("change", () =>
              this.emit(item.name, input.value === "" ? undefined : Number(input.value)),
            );
          } else if ("select" in sel && sel.select.multiple) {
            input = document.createElement("div");
            const current = new Set(value || []);
            for (const option of sel.select.options) {
              const box = document.createElement("input");
              box.type = "checkbox";
              box.value = option.value;
              box.checked = current.has(option.value);
              box.addEventListener("change", () => {
                if (box.checked) current.add(option.value);
                else current.delete(option.value);
                this.emit(item.name, [...current]);
              });
              const l = document.createElement("label");
              l.append(box, document.createTextNode(option.label));
              input.append(l);
            }
          } else if ("select" in sel && !sel.select.custom_value) {
            input = document.createElement("select");
            for (const option of sel.select.options) {
              const o = document.createElement("option");
              o.value = option.value;
              o.textContent = option.label;
              input.append(o);
            }
            input.value = value ?? "";
            input.addEventListener("change", () => this.emit(item.name, input.value));
          } else if ("ui_action" in sel) {
            input = document.createElement("textarea");
            input.value = value ? JSON.stringify(value) : "";
            input.addEventListener("change", () =>
              this.emit(item.name, input.value ? JSON.parse(input.value) : undefined),
            );
          } else {
            input = document.createElement("input");
            input.type = "text";
            input.value = value ?? "";
            input.addEventListener("change", () => this.emit(item.name, input.value));
          }
          input.className = "field";
          row.append(input);
          this.append(row);
        }
      }
    },
  );

  define(
    "hui-card-element-editor",
    class extends HTMLElement {
      set value(v) {
        this._value = v;
        this.render();
      }
      get value() {
        return this._value;
      }
      toggleMode() {
        this._yaml = !this._yaml;
        this.dispatchEvent(
          new CustomEvent("GUImode-changed", {
            detail: { guiMode: !this._yaml, guiModeAvailable: true },
            bubbles: true,
            composed: true,
          }),
        );
      }
      render() {
        if (!this._area) {
          this._area = document.createElement("textarea");
          this._area.style.cssText = "width:100%;min-height:120px;font-family:monospace;box-sizing:border-box";
          this._area.addEventListener("change", () => {
            const config = JSON.parse(this._area.value);
            this.dispatchEvent(
              new CustomEvent("config-changed", {
                detail: { config, guiModeAvailable: true },
                bubbles: true,
                composed: true,
              }),
            );
          });
          this.append(this._area);
        }
        this._area.value = JSON.stringify(this._value, null, 2);
      }
    },
  );

  define(
    "hui-card-picker",
    class extends HTMLElement {
      connectedCallback() {
        this.innerHTML = "";
        for (const type of ["markdown", "entity", "entities"]) {
          const btn = document.createElement("button");
          btn.textContent = type;
          btn.dataset.type = type;
          btn.style.margin = "4px";
          btn.addEventListener("click", () =>
            this.dispatchEvent(
              new CustomEvent("config-changed", {
                detail: { config: { type, content: type === "markdown" ? "Neue Karte" : undefined } },
                bubbles: true,
                composed: true,
              }),
            ),
          );
          this.append(btn);
        }
      }
    },
  );

  /* ---------- hass mock ---------- */

  window.createMockHass = () => ({
    language: "de",
    locale: { language: "de" },
    user: { id: "u1", name: "Gabriel", is_admin: true },
    states: {
      "light.wohnzimmer": { entity_id: "light.wohnzimmer", state: "off", attributes: { brightness: 0 } },
      "input_select.tab": {
        entity_id: "input_select.tab",
        state: "Wohnzimmer",
        attributes: { options: ["Wohnzimmer", "Küche", "Nur wenn Licht an"] },
      },
      "binary_sensor.klingel": { entity_id: "binary_sensor.klingel", state: "off", attributes: {} },
      "sensor.temperatur": {
        entity_id: "sensor.temperatur",
        state: "21",
        attributes: { unit_of_measurement: "°C" },
      },
    },
    formatEntityState(stateObj) {
      const unit = stateObj.attributes?.unit_of_measurement;
      return unit ? `${stateObj.state} ${unit}` : stateObj.state;
    },
    callWS: async (msg) =>
      msg.type === "config/auth/list"
        ? [
            { id: "u1", name: "Gabriel", system_generated: false, is_active: true },
            { id: "u2", name: "Gast", system_generated: false, is_active: true },
            { id: "sys", name: "Supervisor", system_generated: true, is_active: true },
          ]
        : undefined,
    connection: {
      subscribeMessage(callback, msg) {
        const match = /\{\{\s*(.*?)\s*\}\}/s.exec(msg.template);
        let result = true;
        if (match) {
          const expr = match[1];
          if (/^false$/i.test(expr)) result = false;
          else if (/^-?\d+(\.\d+)?$/.test(expr)) result = Number(expr);
          else if (/^['"].*['"]$/.test(expr)) result = expr.slice(1, -1);
        }
        setTimeout(() => callback({ result }), 10);
        return Promise.resolve(() => {});
      },
    },
    callService(domain, service, data) {
      window.__serviceCalls = window.__serviceCalls || [];
      window.__serviceCalls.push({ domain, service, data });
      if (window.__update && service === "select_option") {
        window.__update((states) => {
          states[data.entity_id] = { ...states[data.entity_id], state: data.option };
        });
      }
      return Promise.resolve();
    },
  });

  window.updateMockHass = (hass, fn) => {
    const states = { ...hass.states };
    fn(states);
    return { ...hass, states };
  };
})();
