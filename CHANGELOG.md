# Changelog

## Unreleased

### Changed

- Made custom-element module evaluation SSR-safe by extending `JBBaseComponent` where needed and registering elements through the shared `defineWebComponent()` helper; raised the minimum `jb-core` version to `0.35.0`.

## [3.3.0] - 2026-08-14

### Added

- Added the public `renderFilterList()` method to rerender selected filter chips after programmatic changes to existing `filterList` items.

### Fixed

- Preserve the original order of extra-filter templates after submitting or canceling a filter intent.

## [3.2.0] - 2026-08-13

### Changed

- Updated component color defaults to use the shared semantic content and surface tokens.
- Update jb-select version.

## [3.1.1] - 2026-08-3

### Fixed

- fix justify-content of searchbar.

## [3.1.0] - 2026-07-19

### Changed

- Search, filter deletion, and extra-filter submission now use labeled native buttons with visible keyboard focus and native disabled behavior.
- Moved the divider color default into `variables.css` and exposed `--jb-searchbar-divider-bg-color`.
- Added public searchbar sizing and extra-filter submit button size variables.
- add `Esc` key support to cancel current intent
- add autofocus on intent selected.
