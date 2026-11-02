import { css } from "lit";

export const cardStyles = css`
  :host {
    --rm-heat: var(--state-climate-heat-color, #ff8100);
    --rm-cool: var(--state-climate-cool-color, #2b9af9);
    --rm-idle: var(--state-climate-idle-color, #8a8a8a);
    --rm-off: var(--state-climate-off-color, var(--disabled-color, #9e9e9e));
    --rm-comfort: var(--orange-color, #ff9800);
    --rm-eco: var(--green-color, #4caf50);
    --rm-manual: var(--blue-color, #2196f3);
    --rm-warn: var(--warning-color, #ffa600);
    --rm-error: var(--error-color, #db4437);
    --rm-radius: var(--ha-card-border-radius, 12px);
    --rm-chip-bg: rgba(var(--rgb-primary-text-color, 33, 33, 33), 0.06);
    --rm-gap: 16px;
    display: block;
  }

  ha-card {
    padding: var(--rm-gap);
    display: flex;
    flex-direction: column;
    gap: 14px;
    overflow: hidden;
    position: relative;
    container-type: inline-size;
    --rm-accent: var(--rm-idle);
  }
  ha-card.action-heating {
    --rm-accent: var(--rm-heat);
  }
  ha-card.action-cooling {
    --rm-accent: var(--rm-cool);
  }
  ha-card.action-off {
    --rm-accent: var(--rm-off);
  }
  ha-card.compact {
    --rm-gap: 12px;
    gap: 10px;
  }

  button {
    font: inherit;
    color: inherit;
  }

  /* Header -------------------------------------------------------------- */
  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    min-width: 0;
  }
  .icon-bubble {
    flex: none;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    color: var(--rm-accent);
    background: color-mix(in srgb, var(--rm-accent) 18%, transparent);
    transition: color 0.3s, background 0.3s;
  }
  .compact .icon-bubble {
    width: 36px;
    height: 36px;
  }
  .heading {
    flex: 1;
    min-width: 0;
  }
  .name {
    font-size: 1.1em;
    font-weight: 500;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .status {
    font-size: 0.875em;
    color: var(--secondary-text-color);
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .status .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--rm-accent);
    flex: none;
  }
  ha-card.action-heating .status .dot,
  ha-card.action-cooling .status .dot {
    animation: pulse 1.6s ease-in-out infinite;
  }
  @keyframes pulse {
    50% {
      opacity: 0.35;
    }
  }
  .current {
    text-align: right;
    flex: none;
  }
  .current .temp {
    font-size: 1.9em;
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.02em;
  }
  .compact .current .temp {
    font-size: 1.5em;
  }
  .current .temp .unit {
    font-size: 0.5em;
    vertical-align: top;
    margin-left: 2px;
    color: var(--secondary-text-color);
  }
  .current .humidity {
    font-size: 0.8em;
    color: var(--secondary-text-color);
    display: inline-flex;
    align-items: center;
    gap: 2px;
    margin-top: 4px;
    --mdc-icon-size: 14px;
  }

  /* Chips --------------------------------------------------------------- */
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px 4px 8px;
    border-radius: 16px;
    font-size: 0.8em;
    font-weight: 500;
    background: var(--rm-chip-bg);
    color: var(--primary-text-color);
    border: none;
    --mdc-icon-size: 16px;
    --chip-color: var(--secondary-text-color);
  }
  .chip ha-icon {
    color: var(--chip-color);
  }
  .chip.warn {
    --chip-color: var(--rm-warn);
    background: color-mix(in srgb, var(--rm-warn) 16%, transparent);
  }
  .chip.error {
    --chip-color: var(--rm-error);
    background: color-mix(in srgb, var(--rm-error) 14%, transparent);
  }
  .chip.info {
    --chip-color: var(--rm-cool);
    background: color-mix(in srgb, var(--rm-cool) 14%, transparent);
  }
  .chip.ok {
    --chip-color: var(--rm-eco);
  }
  .chip.clickable {
    cursor: pointer;
  }

  /* Target -------------------------------------------------------------- */
  .targets {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .target {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
    border-radius: var(--rm-radius);
    background: var(--rm-chip-bg);
  }
  .target .value {
    flex: 1;
    text-align: center;
    min-width: 0;
  }
  .target .value .label {
    font-size: 0.8em;
    color: var(--secondary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .target .value .number {
    font-size: 2.2em;
    font-weight: 400;
    line-height: 1.15;
    font-variant-numeric: tabular-nums;
    transition: opacity 0.2s;
  }
  .compact .target .value .number {
    font-size: 1.7em;
  }
  .targets.dual .target .value .number {
    font-size: 1.6em;
  }
  .target .value .number .unit {
    font-size: 0.45em;
    vertical-align: top;
    margin-left: 2px;
    color: var(--secondary-text-color);
  }
  .target.pending .number {
    color: var(--rm-accent);
  }
  .target.disabled {
    opacity: 0.5;
  }
  .step {
    flex: none;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: grid;
    place-items: center;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
    transition: transform 0.1s, background 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  .compact .step {
    width: 40px;
    height: 40px;
  }
  .step:hover {
    background: color-mix(in srgb, var(--rm-accent) 12%, var(--card-background-color, #fff));
  }
  .step:active {
    transform: scale(0.92);
  }
  .step:disabled {
    cursor: default;
    opacity: 0.4;
    transform: none;
  }
  .step.heat {
    color: var(--rm-heat);
  }
  .step.cool {
    color: var(--rm-cool);
  }

  /* Override bar -------------------------------------------------------- */
  .override {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 8px 8px 12px;
    border-radius: var(--rm-radius);
    --ov-color: var(--secondary-text-color);
    background: var(--rm-chip-bg);
    --mdc-icon-size: 20px;
  }
  .override.active {
    background: color-mix(in srgb, var(--ov-color) 14%, transparent);
  }
  .override.comfort {
    --ov-color: var(--rm-comfort);
  }
  .override.eco {
    --ov-color: var(--rm-eco);
  }
  .override.manual {
    --ov-color: var(--rm-manual);
  }
  .override > ha-icon {
    color: var(--ov-color);
    flex: none;
  }
  .override .text {
    flex: 1;
    min-width: 0;
    font-size: 0.875em;
    line-height: 1.35;
  }
  .override .text .title {
    font-weight: 500;
  }
  .override .text .sub {
    color: var(--secondary-text-color);
    font-size: 0.92em;
  }
  .override .progress {
    height: 3px;
    border-radius: 2px;
    margin-top: 5px;
    background: color-mix(in srgb, var(--ov-color) 20%, transparent);
    overflow: hidden;
  }
  .override .progress > div {
    height: 100%;
    background: var(--ov-color);
    transition: width 1s linear;
  }
  .override .actions {
    display: flex;
    gap: 6px;
    flex: none;
  }
  .small-btn {
    border: none;
    cursor: pointer;
    border-radius: 16px;
    padding: 6px 12px;
    font-size: 0.8em;
    font-weight: 500;
    background: var(--card-background-color, #fff);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
    white-space: nowrap;
  }
  .small-btn:hover {
    background: color-mix(in srgb, var(--ov-color, var(--primary-color)) 12%, var(--card-background-color, #fff));
  }
  .small-btn.primary {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }

  /* Sections ------------------------------------------------------------ */
  .section-title {
    font-size: 0.8em;
    font-weight: 500;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .section-title .hint {
    text-transform: none;
    letter-spacing: 0;
    font-weight: 400;
    opacity: 0.85;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Duration chips ------------------------------------------------------ */
  .durations {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .dur {
    flex: none;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    background: transparent;
    border-radius: 16px;
    padding: 6px 12px;
    font-size: 0.85em;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
    white-space: nowrap;
  }
  .dur:hover {
    border-color: var(--primary-color);
  }
  .dur.selected {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }

  /* Segmented buttons (presets, modes) --------------------------------- */
  .segments {
    display: grid;
    grid-auto-columns: minmax(0, 1fr);
    grid-auto-flow: column;
    gap: 6px;
  }
  .seg {
    border: none;
    cursor: pointer;
    border-radius: 10px;
    padding: 8px 4px;
    background: var(--rm-chip-bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    min-width: 0;
    --mdc-icon-size: 20px;
    --seg-color: var(--primary-color);
    transition: background 0.15s, color 0.15s;
    -webkit-tap-highlight-color: transparent;
  }
  .seg .seg-label {
    font-size: 0.78em;
    font-weight: 500;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .seg .seg-sub {
    font-size: 0.7em;
    color: var(--secondary-text-color);
  }
  .seg ha-icon {
    color: var(--seg-color);
  }
  .seg:hover {
    background: color-mix(in srgb, var(--seg-color) 14%, transparent);
  }
  .seg.active {
    background: var(--seg-color);
    color: #fff;
  }
  .seg.active ha-icon,
  .seg.active .seg-sub {
    color: #fff;
  }
  .seg.none {
    --seg-color: var(--primary-color);
  }
  .seg.comfort {
    --seg-color: var(--rm-comfort);
  }
  .seg.eco {
    --seg-color: var(--rm-eco);
  }
  .seg.manual {
    --seg-color: var(--rm-manual);
  }
  .seg.off {
    --seg-color: var(--rm-off);
  }
  .seg.heat {
    --seg-color: var(--rm-heat);
  }
  .seg.cool {
    --seg-color: var(--rm-cool);
  }
  .seg.heat_cool,
  .seg.auto {
    --seg-color: var(--green-color, #4caf50);
  }
  .compact .seg {
    flex-direction: row;
    justify-content: center;
    gap: 6px;
    padding: 7px 4px;
  }
  .compact .seg .seg-sub {
    display: none;
  }
  @container (max-width: 380px) {
    .compact .seg {
      flex-direction: column;
      gap: 2px;
    }
  }

  /* Rows (windows, switches) ------------------------------------------- */
  .rows {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 40px;
    padding: 0 4px;
    border-radius: 8px;
    cursor: pointer;
    --mdc-icon-size: 22px;
  }
  .row:hover {
    background: var(--rm-chip-bg);
  }
  .row > ha-icon {
    color: var(--secondary-text-color);
    flex: none;
  }
  .row.on > ha-icon {
    color: var(--rm-warn);
  }
  .row.on.toggle > ha-icon {
    color: var(--primary-color);
  }
  .row .row-name {
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .row .row-name .sub {
    display: block;
    font-size: 0.8em;
    color: var(--secondary-text-color);
  }
  .row .row-state {
    color: var(--secondary-text-color);
    font-size: 0.9em;
  }
  .row.on .row-state {
    color: var(--rm-warn);
    font-weight: 500;
  }
  .note {
    font-size: 0.8em;
    color: var(--secondary-text-color);
    padding: 2px 4px;
  }

  /* Toggle switch ------------------------------------------------------- */
  .switch {
    position: relative;
    width: 36px;
    height: 20px;
    flex: none;
    border-radius: 10px;
    background: var(--switch-unchecked-track-color, rgba(0, 0, 0, 0.26));
    transition: background 0.2s;
  }
  .switch::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--switch-unchecked-button-color, #fafafa);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s;
  }
  .switch.on {
    background: var(--switch-checked-track-color, var(--primary-color));
  }
  .switch.on::after {
    transform: translateX(16px);
    background: var(--switch-checked-button-color, #fff);
  }

  /* Info ---------------------------------------------------------------- */
  .info {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 16px;
    font-size: 0.82em;
    color: var(--secondary-text-color);
  }
  .info span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    --mdc-icon-size: 16px;
  }
  .info b {
    font-weight: 500;
    color: var(--primary-text-color);
  }

  /* Settings ------------------------------------------------------------ */
  details {
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    padding-top: 10px;
  }
  summary {
    cursor: pointer;
    list-style: none;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9em;
    font-weight: 500;
    color: var(--secondary-text-color);
    --mdc-icon-size: 20px;
  }
  summary::-webkit-details-marker {
    display: none;
  }
  summary .chev {
    margin-left: auto;
    transition: transform 0.2s;
  }
  details[open] summary .chev {
    transform: rotate(180deg);
  }
  .settings {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
    margin-top: 10px;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 0.8em;
    color: var(--secondary-text-color);
  }
  .field .input {
    display: flex;
    align-items: center;
    border-radius: 8px;
    background: var(--rm-chip-bg);
    overflow: hidden;
  }
  .field .input button {
    border: none;
    background: transparent;
    width: 32px;
    height: 34px;
    cursor: pointer;
    font-size: 1.2em;
    flex: none;
  }
  .field .input button:hover {
    background: rgba(var(--rgb-primary-text-color, 33, 33, 33), 0.08);
  }
  .field input {
    flex: 1;
    min-width: 0;
    width: 100%;
    border: none;
    background: transparent;
    text-align: center;
    font: inherit;
    font-size: 1.15em;
    color: var(--primary-text-color);
    -moz-appearance: textfield;
  }
  .field input::-webkit-outer-spin-button,
  .field input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .field .suffix {
    padding-right: 8px;
    color: var(--secondary-text-color);
  }
  .settings-actions {
    grid-column: 1 / -1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    font-size: 0.85em;
    color: var(--secondary-text-color);
  }

  /* Messages ------------------------------------------------------------ */
  .message {
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.85em;
  }
  .message.error {
    background: color-mix(in srgb, var(--rm-error) 14%, transparent);
    color: var(--rm-error);
  }
  .message.warning {
    background: color-mix(in srgb, var(--rm-warn) 16%, transparent);
  }
  .busy {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 2px;
    overflow: hidden;
  }
  .busy::after {
    content: "";
    position: absolute;
    left: -40%;
    width: 40%;
    height: 100%;
    background: var(--primary-color);
    animation: busy 1s ease-in-out infinite;
  }
  @keyframes busy {
    to {
      left: 100%;
    }
  }
`;
