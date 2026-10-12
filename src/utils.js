import { HA_COLORS } from "./const.js";

/** Converts a configured color into a CSS value. Supports Home Assistant color names. */
export function cssColor(value) {
  if (value === undefined || value === null || value === "") return undefined;
  if (Array.isArray(value) && value.length >= 3) return `rgb(${value.slice(0, 3).join(", ")})`;
  const color = String(value).trim();
  if (HA_COLORS.includes(color)) return `var(--${color}-color)`;
  return color;
}

/** Best effort conversion of any CSS color into #rrggbb (used for the native color picker). */
export function toHex(value) {
  const css = cssColor(value);
  if (!css) return "#03a9f4";
  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(css);
  if (short) return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`.toLowerCase();
  if (/^#[0-9a-f]{6}$/i.test(css)) return css.toLowerCase();
  try {
    const probe = document.createElement("span");
    probe.style.color = css;
    probe.style.display = "none";
    document.body.appendChild(probe);
    const computed = getComputedStyle(probe).color;
    probe.remove();
    const match = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(computed);
    if (match) {
      return `#${match
        .slice(1, 4)
        .map((n) => Number(n).toString(16).padStart(2, "0"))
        .join("")}`;
    }
  } catch (_err) {
    // ignore – fall through to default
  }
  return "#03a9f4";
}

export function fireEvent(node, type, detail, options = {}) {
  const event = new CustomEvent(type, {
    bubbles: options.bubbles ?? true,
    composed: options.composed ?? true,
    cancelable: Boolean(options.cancelable),
    detail,
  });
  node.dispatchEvent(event);
  return event;
}

let helpersPromise;
export function getCardHelpers() {
  if (!helpersPromise) {
    helpersPromise = window.loadCardHelpers ? window.loadCardHelpers() : Promise.resolve(undefined);
  }
  return helpersPromise;
}

const withTimeout = (promise, ms) => Promise.race([promise, new Promise((resolve) => setTimeout(resolve, ms))]);

async function loadEditorOf(helpers, cardType, config) {
  const tag = `hui-${cardType}-card`;
  let cls = customElements.get(tag);
  if (!cls && helpers) {
    helpers.createCardElement({ type: cardType, ...config });
    await withTimeout(customElements.whenDefined(tag), 5000);
    cls = customElements.get(tag);
  }
  if (cls?.getConfigElement) await cls.getConfigElement();
}

let haComponentsPromise;
/**
 * Makes sure the Home Assistant editor components we rely on (ha-form, hui-card-element-editor,
 * hui-card-picker …) are loaded. They are lazy loaded by the frontend, so we load the editors
 * of built-in cards that use them.
 */
export function loadHaComponents() {
  if (!haComponentsPromise) {
    haComponentsPromise = (async () => {
      const needed = ["ha-form", "hui-card-element-editor", "hui-card-picker"];
      if (needed.every((tag) => customElements.get(tag))) return;
      const helpers = await getCardHelpers();
      try {
        await loadEditorOf(helpers, "vertical-stack", { cards: [] });
      } catch (_err) {
        // ignore
      }
      try {
        await loadEditorOf(helpers, "entities", { entities: [] });
      } catch (_err) {
        // ignore
      }
      await withTimeout(Promise.all(needed.map((tag) => customElements.whenDefined(tag))), 10000);
    })();
  }
  return haComponentsPromise;
}
