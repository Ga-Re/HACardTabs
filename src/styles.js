import { css } from "lit";

export const cardStyles = css`
  :host {
    display: block;
  }
  :host([hidden]) {
    display: none !important;
  }
  ha-card {
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }
  ha-card.no-bg {
    background: none;
    border: none;
    box-shadow: none;
    border-radius: 0;
  }
  .root {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-width: 0;
  }
  .root.pos-bottom {
    flex-direction: column-reverse;
  }
  .root.pos-left {
    flex-direction: row;
  }
  .root.pos-right {
    flex-direction: row-reverse;
  }

  /* ---------- tab bar ---------- */
  .tabbar {
    display: flex;
    gap: 4px;
    padding: 6px 8px 0;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    flex: 0 0 auto;
    box-sizing: border-box;
    min-width: 0;
  }
  .tabbar::-webkit-scrollbar {
    display: none;
  }
  .no-bg .tabbar {
    padding-left: 0;
    padding-right: 0;
  }
  .pos-bottom .tabbar {
    padding: 0 8px 6px;
  }
  .tabbar.vertical {
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 8px 0 8px 8px;
    max-width: 40%;
  }
  .pos-right .tabbar.vertical {
    padding: 8px 8px 8px 0;
  }
  .tabbar.align-center {
    justify-content: center;
  }
  .tabbar.align-end {
    justify-content: flex-end;
  }
  .tabbar.align-stretch .tab {
    flex: 1 1 0;
    justify-content: center;
  }
  .tabbar.style-underline:not(.vertical) {
    border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  }
  .pos-bottom .tabbar.style-underline {
    border-bottom: none;
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  }
  .pos-left .tabbar.style-underline {
    border-right: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  }
  .pos-right .tabbar.style-underline {
    border-left: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  }
  .tabbar.style-segmented {
    margin: 8px 8px 0;
    padding: 4px;
    gap: 2px;
    border-radius: 12px;
    background: rgba(var(--rgb-primary-text-color, 33, 33, 33), 0.06);
  }
  .no-bg .tabbar.style-segmented {
    margin-left: 0;
    margin-right: 0;
  }
  .pos-bottom .tabbar.style-segmented {
    margin: 0 8px 8px;
  }
  .tabbar.vertical.style-segmented {
    margin: 8px 0 8px 8px;
  }
  .pos-right .tabbar.vertical.style-segmented {
    margin: 8px 8px 8px 0;
  }

  /* ---------- tab ---------- */
  .tab {
    --_color: var(--hct-color, var(--primary-color));
    all: unset;
    box-sizing: border-box;
    position: relative;
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    gap: 6px;
    min-height: 40px;
    padding: 8px 14px;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    white-space: nowrap;
    font-family: var(--ha-font-family-body, var(--paper-font-body1_-_font-family, inherit));
    font-size: var(--hacard-tabs-font-size, 14px);
    font-weight: 500;
    line-height: 1.2;
    color: var(--hct-text, var(--secondary-text-color));
    background: var(--hct-bg, transparent);
    border-radius: 8px 8px 0 0;
    transition:
      color 0.2s ease,
      background-color 0.2s ease,
      opacity 0.2s ease;
  }
  .tab:hover {
    background-color: var(--hct-bg, rgba(var(--rgb-primary-text-color, 33, 33, 33), 0.05));
  }
  .tab:focus-visible {
    outline: 2px solid var(--_color);
    outline-offset: -2px;
  }
  .tab ha-icon {
    --mdc-icon-size: var(--hacard-tabs-icon-size, 20px);
    flex: 0 0 auto;
  }
  .tab.icon-top {
    flex-direction: column;
    gap: 2px;
    padding: 6px 12px;
    font-size: var(--hacard-tabs-font-size, 12px);
  }
  .tab .label {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tab .badge {
    min-width: 18px;
    padding: 1px 6px;
    border-radius: 10px;
    box-sizing: border-box;
    font-size: 11px;
    font-weight: 600;
    text-align: center;
    color: var(--text-primary-color, #fff);
    background: var(--_color);
  }
  .tab.icon-top .badge {
    position: absolute;
    top: 2px;
    right: 2px;
  }
  .tab .cond-icon {
    --mdc-icon-size: 14px;
    opacity: 0.8;
  }
  .tab.cond-hidden {
    opacity: 0.45;
    outline: 1px dashed var(--secondary-text-color);
    outline-offset: -3px;
  }
  .vertical .tab {
    border-radius: 8px 0 0 8px;
  }
  .pos-right .vertical .tab {
    border-radius: 0 8px 8px 0;
  }
  .pos-bottom .tab {
    border-radius: 0 0 8px 8px;
  }

  /* underline */
  .style-underline .tab.active {
    color: var(--hct-active-text, var(--_color));
  }
  .style-underline .tab::after {
    content: "";
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 0;
    height: 3px;
    border-radius: 3px 3px 0 0;
    background: var(--_color);
    transform: scaleX(0);
    transition: transform 0.2s ease;
  }
  .style-underline .tab.active::after {
    transform: scaleX(1);
  }
  .pos-bottom .style-underline .tab::after {
    bottom: auto;
    top: 0;
    border-radius: 0 0 3px 3px;
  }
  .vertical.style-underline .tab::after {
    left: auto;
    right: 0;
    top: 8px;
    bottom: 8px;
    width: 3px;
    height: auto;
    border-radius: 3px 0 0 3px;
    transform: scaleY(0);
  }
  .vertical.style-underline .tab.active::after {
    transform: scaleY(1);
  }
  .pos-right .vertical.style-underline .tab::after {
    right: auto;
    left: 0;
    border-radius: 0 3px 3px 0;
  }

  /* pills / buttons / segmented */
  .style-pills .tab {
    border-radius: 999px;
  }
  .style-pills,
  .style-buttons {
    padding-bottom: 6px;
  }
  .pos-bottom .style-pills,
  .pos-bottom .style-buttons {
    padding-top: 6px;
  }
  .style-buttons .tab {
    border-radius: 12px;
    background: var(--hct-bg, rgba(var(--rgb-primary-text-color, 33, 33, 33), 0.06));
  }
  .style-segmented .tab {
    border-radius: 9px;
    min-height: 34px;
  }
  .style-pills .tab.active,
  .style-buttons .tab.active,
  .style-segmented .tab.active {
    background: var(--_color);
    color: var(--hct-active-text, var(--text-primary-color, #fff));
  }
  .style-pills .tab.active .badge,
  .style-buttons .tab.active .badge,
  .style-segmented .tab.active .badge {
    background: var(--card-background-color, #fff);
    color: var(--_color);
  }

  /* ---------- body ---------- */
  .body {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
  }
  .pos-bottom .body {
    flex-direction: column-reverse;
  }
  .progress {
    height: 3px;
    flex: 0 0 auto;
    overflow: hidden;
    background: rgba(var(--rgb-primary-text-color, 33, 33, 33), 0.06);
  }
  .progress .bar {
    height: 100%;
    background: var(--hct-color, var(--primary-color));
    transform-origin: left center;
    animation-name: hct-progress;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }
  .progress .bar.paused {
    animation-play-state: paused;
  }
  @keyframes hct-progress {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }
  .content {
    padding: var(--hacard-tabs-padding, 8px);
    min-width: 0;
    flex: 1 1 auto;
  }
  .no-bg .content {
    padding: var(--hacard-tabs-padding, 8px 0 0 0);
  }
  .no-bg.bar-bottom .content {
    padding: var(--hacard-tabs-padding, 0 0 8px 0);
  }
  .no-bg.bar-left .content {
    padding: var(--hacard-tabs-padding, 0 0 0 8px);
  }
  .no-bg.bar-right .content {
    padding: var(--hacard-tabs-padding, 0 8px 0 0);
  }
  .section {
    display: grid;
    grid-template-columns: repeat(var(--hct-columns, 1), minmax(0, 1fr));
    gap: var(--hct-gap, 8px);
    align-items: start;
  }
  .section > * {
    min-width: 0;
  }
  .flat-inner .section {
    --ha-card-background: transparent;
    --ha-card-box-shadow: none;
    --ha-card-border-width: 0;
    --ha-card-border-color: transparent;
  }
  :host([editing]) .section:empty::before {
    content: attr(data-empty);
    display: block;
    padding: 24px 8px;
    text-align: center;
    color: var(--secondary-text-color);
    border: 1px dashed var(--divider-color, rgba(0, 0, 0, 0.2));
    border-radius: 8px;
  }
  .section.anim-fade {
    animation: hct-fade 0.25s ease;
  }
  .section.anim-slide-next {
    animation: hct-slide-next 0.25s ease;
  }
  .section.anim-slide-prev {
    animation: hct-slide-prev 0.25s ease;
  }
  @keyframes hct-fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes hct-slide-next {
    from {
      opacity: 0;
      transform: translateX(24px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
  @keyframes hct-slide-prev {
    from {
      opacity: 0;
      transform: translateX(-24px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .section,
    .tab,
    .tab::after {
      animation: none !important;
      transition: none !important;
    }
  }
  .empty {
    padding: 16px;
    color: var(--secondary-text-color);
  }
`;
