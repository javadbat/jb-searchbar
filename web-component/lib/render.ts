import { i18n } from "jb-core/i18n";
import { dictionary } from "./i18n";

export function renderHTML(): string {
    return /* html */ `
  <div class="jb-searchbar-web-component">
    <slot name="filters"></slot>
    <div class="search-dynamic-wrapper" part="dynamic-wrapper">
        <slot name="filter"></slot>
        <section class="filter-list-section" part="filter-list"></section>
        <slot name="divider"></slot>
        <slot name="extra" ></slot>
    </div>
    <button class="search-button-wrapper" part="search-button" type="button" aria-label="${dictionary.get(i18n, "search")}" aria-busy="false">
        <jb-icon-search aria-hidden="true"></jb-icon-search>
    </button>
  </div>
  `;
}
