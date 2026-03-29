export function renderHTML(): string {
    return /* html */ `
  <div class="jb-searchbar-web-component">
    <slot name="filters"></slot>
    <div class="search-dynamic-wrapper">
        <slot name="filter"></slot>
        <section class="filter-list-section"></section>
        <slot name="extra" ></slot>
    </div>
    <div class="search-button-wrapper">
        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <circle cx="255" cy="255" r="170"></circle>
            <g class="spin-line-group">
                <rect x="0" y="0" width="512" height="512" />
                <path class="convertable-line" d="M400 400 L 450 450"></path>
            </g>
        </svg>
    </div>
  </div>
  `;
}