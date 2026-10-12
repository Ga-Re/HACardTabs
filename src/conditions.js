import { WEEKDAYS } from "./const.js";

const asArray = (value) => (value === undefined || value === null ? [] : Array.isArray(value) ? value : [value]);

/** Returns the condition type, also for the legacy `{entity, state}` shorthand. */
export function conditionType(condition) {
  if (!condition) return undefined;
  if (condition.condition) return condition.condition;
  if (condition.entity) return "state";
  return undefined;
}

function entityValue(hass, entityId, attribute) {
  const stateObj = hass?.states?.[entityId];
  if (!stateObj) return undefined;
  return attribute ? stateObj.attributes?.[attribute] : stateObj.state;
}

function numericThreshold(hass, value) {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "string" && hass?.states?.[value]) {
    return Number(hass.states[value].state);
  }
  return Number(value);
}

function parseTime(value) {
  if (!value || typeof value !== "string") return undefined;
  const [h, m = "0", s = "0"] = value.split(":");
  const seconds = Number(h) * 3600 + Number(m) * 60 + Number(s);
  return Number.isNaN(seconds) ? undefined : seconds;
}

export function isTruthy(value) {
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    return !["", "false", "off", "no", "0", "none", "unknown", "unavailable"].includes(v);
  }
  return Boolean(value);
}

/**
 * Evaluates a single condition.
 * @param {object} condition
 * @param {{hass: object, templates: Map<string, any>, now?: Date}} ctx
 */
export function checkCondition(condition, ctx) {
  const { hass } = ctx;
  switch (conditionType(condition)) {
    case "state": {
      const value = entityValue(hass, condition.entity, condition.attribute);
      const current = value === undefined ? undefined : String(value);
      if (condition.state !== undefined) {
        return asArray(condition.state).map(String).includes(current);
      }
      if (condition.state_not !== undefined) {
        return !asArray(condition.state_not).map(String).includes(current);
      }
      return current !== undefined;
    }
    case "numeric_state": {
      const value = Number(entityValue(hass, condition.entity, condition.attribute));
      if (Number.isNaN(value)) return false;
      const above = numericThreshold(hass, condition.above);
      const below = numericThreshold(hass, condition.below);
      if (above !== undefined && !(value > above)) return false;
      if (below !== undefined && !(value < below)) return false;
      return true;
    }
    case "user":
      return asArray(condition.users).includes(hass?.user?.id);
    case "screen":
      return condition.media_query ? window.matchMedia(condition.media_query).matches : true;
    case "time": {
      const now = ctx.now || new Date();
      const days = asArray(condition.weekdays);
      if (days.length && !days.includes(WEEKDAYS[(now.getDay() + 6) % 7])) return false;
      const current = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      const after = parseTime(condition.after);
      const before = parseTime(condition.before);
      if (after !== undefined && before !== undefined && after > before) {
        // Range over midnight, e.g. 22:00 – 06:00
        return current >= after || current < before;
      }
      if (after !== undefined && current < after) return false;
      if (before !== undefined && current >= before) return false;
      return true;
    }
    case "template":
      return isTruthy(ctx.templates?.get(condition.value_template));
    case "and":
      return asArray(condition.conditions).every((c) => checkCondition(c, ctx));
    case "or":
      return asArray(condition.conditions).some((c) => checkCondition(c, ctx));
    case "not":
      return !asArray(condition.conditions).some((c) => checkCondition(c, ctx));
    default:
      return true;
  }
}

/** Evaluates a list of conditions combined with "all" (AND, default) or "any" (OR). */
export function conditionsMet(list, mode, ctx) {
  const conditions = asArray(list);
  if (!conditions.length) return true;
  return mode === "any"
    ? conditions.some((c) => checkCondition(c, ctx))
    : conditions.every((c) => checkCondition(c, ctx));
}

/** Evaluates the visibility of a tab (disabled tabs are never visible). */
export function tabVisible(tab, ctx) {
  if (tab?.disabled) return false;
  return conditionsMet(tab?.conditions, tab?.condition_mode, ctx);
}

/** Walks a list of conditions including nested groups. */
export function flattenConditions(list) {
  const result = [];
  const walk = (items) => {
    for (const condition of asArray(items)) {
      if (!condition || typeof condition !== "object") continue;
      result.push(condition);
      if (condition.conditions) walk(condition.conditions);
    }
  };
  walk(list);
  return result;
}

/** All conditions (visibility and jump conditions, including nested groups) of all tabs. */
export function collectConditions(tabs) {
  return asArray(tabs).flatMap((tab) => [
    ...flattenConditions(tab?.conditions),
    ...flattenConditions(tab?.jump_conditions),
  ]);
}

/** Templates used by template conditions in a condition list. */
export function conditionTemplates(list) {
  return flattenConditions(list)
    .filter((c) => conditionType(c) === "template" && c.value_template)
    .map((c) => String(c.value_template));
}
