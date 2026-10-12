export const VERSION = "1.0.0";

export const CARD_TYPE = "hacard-tabs";
export const EDITOR_TYPE = "hacard-tabs-editor";

/** Window event used by the editor to tell preview cards which tab is being edited. */
export const EDITOR_SELECT_EVENT = "hacard-tabs-editor-select";

export const DEFAULTS = {
  default_tab: 0,
  remember_tab: false,
  tab_position: "top",
  tab_style: "underline",
  tab_alignment: "start",
  tab_content: "icon_name",
  icon_position: "start",
  card_background: true,
  inner_cards_background: true,
  hide_single_tab: false,
  animation: "fade",
  swipe: true,
  card_gap: 8,
  return_to_default: 0,
};

export const AUTO_CYCLE_DEFAULTS = {
  enabled: false,
  interval: 10,
  pause_on_interaction: 30,
  pause_on_hover: true,
  show_progress: true,
};

/** Home Assistant named colors that map to `var(--<name>-color)`. */
export const HA_COLORS = [
  "primary",
  "accent",
  "red",
  "pink",
  "purple",
  "deep-purple",
  "indigo",
  "blue",
  "light-blue",
  "cyan",
  "teal",
  "green",
  "light-green",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deep-orange",
  "brown",
  "grey",
  "blue-grey",
  "black",
  "white",
  "disabled",
];

export const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export const CONDITION_TYPES = ["state", "numeric_state", "user", "screen", "time", "template"];

export const CONDITION_ICONS = {
  state: "mdi:state-machine",
  numeric_state: "mdi:numeric",
  user: "mdi:account",
  screen: "mdi:responsive",
  time: "mdi:clock-outline",
  template: "mdi:code-braces",
  and: "mdi:ampersand",
  or: "mdi:gate-or",
  not: "mdi:not-equal-variant",
};

export const SCREEN_PRESETS = {
  mobile: "(max-width: 767px)",
  tablet: "(min-width: 768px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)",
  wide: "(min-width: 1280px)",
};
