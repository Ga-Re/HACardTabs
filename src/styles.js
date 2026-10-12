import { css } from "lit";

export const cardStyles = css`
  :host {
    display: block;
  }
  :host([hidden]) {
    display: none !important;
  }
  ha-card {
    position: relative;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }
  ha-card.menu-open {
    overflow: visible;
    z-index: 2;
  }
  .title {
    padding: 12px 16px 4px;
    font-family: var(--ha-card-header-font-family, inherit);
    font-size: var(--ha-card-header-font-size, 20px);
    font-weight: 500;
    line-height: 1.3;
    color: var(--ha-card-header-color, var(--primary-text-color));
  }
  .no-bg .title {
    padding-left: 0;
    padding-right: 0;
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
  .bar-wrap {
    flex: 0 0 auto;
    display: grid;
    grid-template-rows: 1fr;
    min-width: 0;
    transition:
      grid-template-rows 0.3s ease,
      grid-template-columns 0.3s ease,
      opacity 0.3s ease;
  }
  .bar-wrap.vertical {
    grid-template-rows: none;
    grid-template-columns: 1fr;
    max-width: 40%;
  }
  .bar-wrap.collapsed {
    grid-template-rows: 0fr;
    opacity: 0;
    pointer-events: none;
  }
  .bar-wrap.vertical.collapsed {
    grid-template-columns: 0fr;
  }
  .bar-wrap.edit-only {
    opacity: 0.55;
  }
  .bar-inner {
    min-width: 0;
    min-height: 0;
    overflow: hidden;
  }
  .bar-row {
    display: flex;
    align-items: center;
    min-width: 0;
  }
  .bar-wrap.vertical .bar-row {
    flex-direction: column;
    align-items: stretch;
    height: 100%;
  }
  .bar-btn {
    all: unset;
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    color: var(--secondary-text-color);
  }
  .bar-btn:hover:not([disabled]) {
    background: rgba(var(--rgb-primary-text-color, 33, 33, 33), 0.06);
  }
  .bar-btn[disabled] {
    opacity: 0.3;
    cursor: default;
  }
  .bar-btn ha-icon {
    --mdc-icon-size: 22px;
  }
  .bar-handle {
    all: unset;
    flex: 0 0 auto;
    align-self: center;
    width: 44px;
    height: 5px;
    margin: 6px auto;
    border-radius: 3px;
    background: var(--divider-color, rgba(0, 0, 0, 0.2));
    cursor: pointer;
  }
  .pos-left .bar-handle,
  .pos-right .bar-handle {
    width: 5px;
    height: 44px;
    margin: auto 6px;
  }
  .tabbar {
    position: relative;
    display: flex;
    flex: 1 1 auto;
    gap: var(--hct-tab-gap, 4px);
    padding: 6px 8px 0;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    box-sizing: border-box;
    min-width: 0;
  }
  .tabbar.wrap {
    flex-wrap: wrap;
    overflow: visible;
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
    gap: var(--hct-tab-gap, 2px);
    border-radius: calc(var(--hct-radius, 9px) + 3px);
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
    z-index: 1;
    min-height: var(--hct-tab-height, 40px);
    padding: 8px 14px;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    white-space: nowrap;
    font-family: var(--ha-font-family-body, var(--paper-font-body1_-_font-family, inherit));
    font-size: var(--hct-font-size, var(--hacard-tabs-font-size, 14px));
    font-weight: 500;
    line-height: 1.2;
    color: var(--hct-text, var(--secondary-text-color));
    background: var(--hct-bg, transparent);
    border-radius: var(--hct-radius, 8px) var(--hct-radius, 8px) 0 0;
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
    --mdc-icon-size: var(--hct-icon-size, var(--hacard-tabs-icon-size, 20px));
    flex: 0 0 auto;
  }
  .tab.icon-top {
    flex-direction: column;
    gap: 2px;
    padding: 6px 12px;
    font-size: var(--hct-font-size, var(--hacard-tabs-font-size, 12px));
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
    background: var(--hct-badge, var(--_color));
  }
  .badge.dot {
    position: absolute;
    top: 6px;
    right: 6px;
    min-width: 0;
    width: 9px;
    height: 9px;
    padding: 0;
    border-radius: 50%;
    box-shadow: 0 0 0 2px var(--card-background-color, #fff);
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
    border-radius: var(--hct-radius, 8px) 0 0 var(--hct-radius, 8px);
  }
  .pos-right .vertical .tab {
    border-radius: 0 var(--hct-radius, 8px) var(--hct-radius, 8px) 0;
  }
  .pos-bottom .tab {
    border-radius: 0 0 var(--hct-radius, 8px) var(--hct-radius, 8px);
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
    border-radius: var(--hct-radius, 999px);
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
    border-radius: var(--hct-radius, 12px);
    background: var(--hct-bg, rgba(var(--rgb-primary-text-color, 33, 33, 33), 0.06));
  }
  .style-segmented .tab {
    border-radius: var(--hct-radius, 9px);
    min-height: var(--hct-tab-height, 34px);
  }
  .style-pills .tab.active,
  .style-buttons .tab.active,
  .style-segmented .tab.active {
    background: var(--_color);
    color: var(--hct-active-text, var(--text-primary-color, #fff));
  }
  .style-pills .tab.active .badge:not(.dot),
  .style-buttons .tab.active .badge:not(.dot),
  .style-segmented .tab.active .badge:not(.dot) {
    background: var(--card-background-color, #fff);
    color: var(--_color);
  }

  /* sliding indicator */
  .indicator {
    --_color: var(--hct-color, var(--primary-color));
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 0;
    z-index: 0;
    opacity: 0;
    pointer-events: none;
    transition:
      left var(--hct-anim-duration, 300ms) var(--hct-anim-easing, ease),
      top var(--hct-anim-duration, 300ms) var(--hct-anim-easing, ease),
      width var(--hct-anim-duration, 300ms) var(--hct-anim-easing, ease),
      height var(--hct-anim-duration, 300ms) var(--hct-anim-easing, ease),
      opacity 0.2s ease;
  }
  .indicator.instant {
    transition: none;
  }
  .indicator::after {
    content: "";
    position: absolute;
    background: var(--_color);
    border-radius: inherit;
    transition: background-color 0.3s ease;
  }
  .style-underline .indicator::after {
    left: 10px;
    right: 10px;
    bottom: 0;
    height: 3px;
    border-radius: 3px 3px 0 0;
  }
  .pos-bottom .style-underline .indicator::after {
    bottom: auto;
    top: 0;
    border-radius: 0 0 3px 3px;
  }
  .vertical.style-underline .indicator::after {
    left: auto;
    right: 0;
    top: 8px;
    bottom: 8px;
    width: 3px;
    height: auto;
    border-radius: 3px 0 0 3px;
  }
  .pos-right .vertical.style-underline .indicator::after {
    right: auto;
    left: 0;
    border-radius: 0 3px 3px 0;
  }
  .style-pills .indicator {
    border-radius: var(--hct-radius, 999px);
  }
  .style-buttons .indicator {
    border-radius: var(--hct-radius, 12px);
  }
  .style-segmented .indicator {
    border-radius: var(--hct-radius, 9px);
  }
  .style-pills .indicator::after,
  .style-buttons .indicator::after,
  .style-segmented .indicator::after {
    inset: 0;
  }
  .tabbar.sliding .tab::after {
    display: none;
  }
  .tabbar.sliding.style-pills .tab.active,
  .tabbar.sliding.style-buttons .tab.active,
  .tabbar.sliding.style-segmented .tab.active {
    background: transparent;
  }

  /* overflow menu */
  .menu {
    position: absolute;
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 180px;
    max-width: 280px;
    max-height: 320px;
    overflow-y: auto;
    padding: 6px;
    box-sizing: border-box;
    border-radius: 12px;
    background: var(--card-background-color, #fff);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.22);
  }
  .menu-item {
    --_color: var(--hct-color, var(--primary-color));
    all: unset;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    color: var(--primary-text-color);
  }
  .menu-item:hover {
    background: rgba(var(--rgb-primary-text-color, 33, 33, 33), 0.06);
  }
  .menu-item.active {
    color: var(--_color);
    font-weight: 500;
  }
  .menu-item ha-icon {
    --mdc-icon-size: 20px;
    color: var(--_color);
  }
  .menu-item .spacer {
    width: 20px;
  }
  .menu-item .label {
    flex: 1 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .menu-item .badge {
    padding: 1px 6px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-primary-color, #fff);
    background: var(--hct-badge, var(--_color));
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
    height: var(--hct-progress-height, 3px);
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
  /* progress inside the active tab: uses the tab's text color */
  .progress.progress-tab {
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: 5px;
    border-radius: 2px;
    background: none;
    pointer-events: none;
  }
  .progress.progress-tab::before {
    content: "";
    position: absolute;
    inset: 0;
    background: currentColor;
    opacity: 0.25;
  }
  .progress.progress-tab .bar {
    position: relative;
    background: currentColor;
  }
  .tab.icon-top .progress.progress-tab {
    bottom: 2px;
  }
  .pos-bottom .style-underline .progress.progress-tab {
    bottom: auto;
    top: 5px;
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
    padding: var(--hct-padding, var(--hacard-tabs-padding, 8px));
    min-width: 0;
    flex: 1 1 auto;
    box-sizing: border-box;
  }
  .content.fixed-height {
    overflow-y: auto;
  }
  .no-bg .content {
    padding: var(--hct-padding, var(--hacard-tabs-padding, 8px 0 0 0));
  }
  .no-bg.bar-bottom .content {
    padding: var(--hct-padding, var(--hacard-tabs-padding, 0 0 8px 0));
  }
  .no-bg.bar-left .content {
    padding: var(--hct-padding, var(--hacard-tabs-padding, 0 0 0 8px));
  }
  .no-bg.bar-right .content {
    padding: var(--hct-padding, var(--hacard-tabs-padding, 0 8px 0 0));
  }
  .viewport {
    position: relative;
  }
  .viewport.animating,
  .viewport.dragging {
    overflow: hidden;
  }
  .viewport > .leaving,
  .viewport > .drag-neighbor {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  .viewport > .leaving {
    pointer-events: none;
  }
  .viewport.animating > .section {
    backface-visibility: hidden;
  }
  .viewport.dragging > .section {
    will-change: transform;
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
  @media (prefers-reduced-motion: reduce) {
    .tab,
    .tab::after,
    .indicator,
    .bar-wrap {
      animation: none !important;
      transition: none !important;
    }
  }
  .empty {
    padding: 16px;
    color: var(--secondary-text-color);
  }
`;
