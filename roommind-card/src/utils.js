import { language, localize } from "./localize.js";

export const CARD_TYPE = "roommind-card";
export const EDITOR_TYPE = "roommind-card-editor";
export const VERSION = "1.0.0";

/** Durations (hours) offered by default. "schedule" and "permanent" are special values. */
export const DEFAULT_DURATIONS = ["schedule", 1, 2, 4, "permanent"];
export const ALL_DURATIONS = ["schedule", 0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 24, 48, "permanent"];

export const DEFAULTS = {
  durations: DEFAULT_DURATIONS,
  default_duration: "schedule",
  show_status: true,
  show_target: true,
  show_duration: true,
  show_presets: true,
  show_modes: true,
  show_windows: true,
  show_toggles: true,
  show_climate_control: false,
  show_info: true,
  show_settings: true,
  settings_open: false,
  compact: false,
  apply_delay: 1200,
};

export function fireEvent(node, type, detail = {}) {
  const event = new CustomEvent(type, { bubbles: true, composed: true, detail });
  node.dispatchEvent(event);
  return event;
}

/** Normalises a duration value from the config ("1", 1, "schedule" …). */
export function normalizeDuration(value) {
  if (value === "schedule" || value === "permanent") return value;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export function durationLabel(hass, value) {
  if (value === "schedule") return localize(hass, "duration.schedule");
  if (value === "permanent") return localize(hass, "duration.permanent");
  if (value < 1) return localize(hass, "duration.minutes", { n: Math.round(value * 60) });
  return localize(hass, "duration.hours", { n: formatNumber(hass, value, 1) });
}

// --- Temperatures -----------------------------------------------------------------------------

/** RoomMind stores temperatures in °C; Home Assistant shows them in the user's unit system. */
export function isFahrenheit(hass) {
  return hass?.config?.unit_system?.temperature === "°F";
}

export function tempUnit(hass) {
  return hass?.config?.unit_system?.temperature || "°C";
}

export function toCelsius(hass, value) {
  if (value === null || value === undefined) return value;
  return isFahrenheit(hass) ? ((value - 32) * 5) / 9 : value;
}

export function fromCelsius(hass, value) {
  if (value === null || value === undefined) return value;
  return isFahrenheit(hass) ? (value * 9) / 5 + 32 : value;
}

export function roundToStep(value, step) {
  const s = step || 0.5;
  return Math.round(Math.round(value / s) * s * 100) / 100;
}

export function formatNumber(hass, value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "–";
  const num = Number(value);
  try {
    return new Intl.NumberFormat(hass?.locale?.language || language(hass), {
      maximumFractionDigits: digits,
      minimumFractionDigits: 0,
    }).format(num);
  } catch (_err) {
    return String(Math.round(num * 10 ** digits) / 10 ** digits);
  }
}

export function formatTemp(hass, value, digits = 1) {
  return `${formatNumber(hass, value, digits)} ${tempUnit(hass)}`;
}

// --- Time -------------------------------------------------------------------------------------

function clock(hass, date) {
  try {
    return new Intl.DateTimeFormat(hass?.locale?.language || language(hass), {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (_err) {
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  }
}

/** "15:30", "morgen 06:00" or "Mo., 03.11. 06:00". */
export function formatUntil(hass, epochSeconds) {
  const date = new Date(epochSeconds * 1000);
  const now = new Date();
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const dayDiff = Math.round((startOfDay(date) - startOfDay(now)) / 86400000);
  const time = clock(hass, date);
  if (dayDiff === 0) return localize(hass, "time.today", { time });
  if (dayDiff === 1) return localize(hass, "time.tomorrow", { time });
  try {
    const day = new Intl.DateTimeFormat(hass?.locale?.language || language(hass), {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    }).format(date);
    return `${day} ${time}`;
  } catch (_err) {
    return `${date.toLocaleDateString()} ${time}`;
  }
}

/** Remaining time "1 h 25 min", "12 min", "2 T 3 h". */
export function formatRemaining(hass, seconds) {
  const total = Math.max(0, Math.round(seconds / 60));
  const d = Math.floor(total / 1440);
  const h = Math.floor((total % 1440) / 60);
  const m = total % 60;
  if (d > 0) return localize(hass, "time.day_hour", { d, h });
  if (h > 0) return localize(hass, "time.hour_min", { h, m });
  return localize(hass, "time.min", { m: Math.max(m, 1) });
}

/** The override end as epoch seconds, from the RoomMind API or the climate attribute (ISO). */
export function overrideUntil(stateObj, live) {
  if (live && live.override_active) {
    return typeof live.override_until === "number" ? live.override_until : null;
  }
  const iso = stateObj?.attributes?.override_until;
  if (!iso) return null;
  const ms = Date.parse(iso);
  return Number.isNaN(ms) ? null : ms / 1000;
}

// --- RoomMind ---------------------------------------------------------------------------------

export const OVERRIDE_FOR_PRESET = { comfort: "boost", eco: "eco", manual: "custom" };
export const PRESET_FOR_OVERRIDE = { boost: "comfort", eco: "eco", custom: "manual" };

/**
 * Finds the RoomMind room (area id) behind a climate entity:
 * explicit config → entity id `climate.roommind_<area>` → registry unique id → entity area.
 */
export async function resolveAreaId(hass, entityId, rooms, configured) {
  if (configured) return configured;
  const ids = Object.keys(rooms || {});
  const match = /^climate\.roommind_(.+)$/.exec(entityId || "");
  if (match && ids.includes(match[1])) return match[1];
  try {
    const entry = await hass.callWS({ type: "config/entity_registry/get", entity_id: entityId });
    const unique = /^roommind_(.+)_climate$/.exec(entry?.unique_id || "");
    if (unique && ids.includes(unique[1])) return unique[1];
    if (entry?.area_id && ids.includes(entry.area_id)) return entry.area_id;
  } catch (_err) {
    // registry not accessible – keep trying
  }
  const area = hass.entities?.[entityId]?.area_id;
  if (area && ids.includes(area)) return area;
  return match ? match[1] : undefined;
}

export function isOpenState(state) {
  return ["on", "open", "opening", "true"].includes(String(state).toLowerCase());
}

export function windowIcon(stateObj, open) {
  const cls = stateObj?.attributes?.device_class;
  if (cls === "door" || cls === "garage_door") return open ? "mdi:door-open" : "mdi:door-closed";
  return open ? "mdi:window-open-variant" : "mdi:window-closed-variant";
}
