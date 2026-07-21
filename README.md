# jb-searchbar

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/jb-searchbar)
[![GitHub license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://raw.githubusercontent.com/javadbat/jb-searchbar/main/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/jb-searchbar)](https://www.npmjs.com/package/jb-searchbar)
![GitHub Created At](https://img.shields.io/github/created-at/javadbat/jb-searchbar)

`jb-searchbar` is a compact search and filter web component. It lets you render always-visible filters, optional user-selected filters, and a search button in one responsive bar.

- Supports any form-associated element as a filter.
- Supports always-visible filters through `slot="filter"`.
- Supports optional filters through `<jb-extra-filter slot="extra">`.
- Lets users add the same extra filter more than once unless `data-max-count` limits it.
- Collects normal and extra filter values through `.value`.
- Dispatches `search` when the search button is clicked or when `searchOnChange` is enabled.
- DOM-driven setup: define filters directly in markup instead of passing a large JavaScript configuration object.

## When to use

Use `jb-searchbar` when a page needs a compact query/filter surface for lists, tables, reports, or dashboards.

Use a normal form when filters need a full-page layout, complex grouping, or submit/reset controls outside the searchbar.

## Demo

- [CodePen](https://codepen.io/javadbat/pen/rNjrZpy)
- [Storybook](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar)

## Using With JS Frameworks

<a href="https://github.com/javadbat/jb-searchbar/tree/main/react" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/React.js-jb--searchbar%2Freact-000.svg?logo=react&logoColor=%2361DAFB" height="30" /></a>

Other integrations: <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#angular" target="_blank" rel="noopener noreferrer">Angular</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#vue" target="_blank" rel="noopener noreferrer">Vue</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#nuxt" target="_blank" rel="noopener noreferrer">Nuxt</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#svelte" target="_blank" rel="noopener noreferrer">Svelte</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#sveltekit" target="_blank" rel="noopener noreferrer">SvelteKit</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#solidjs" target="_blank" rel="noopener noreferrer">SolidJS</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#lit" target="_blank" rel="noopener noreferrer">Lit</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#nextjs" target="_blank" rel="noopener noreferrer">Next.js</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#astro" target="_blank" rel="noopener noreferrer">Astro</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#blazor" target="_blank" rel="noopener noreferrer">Blazor</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#server-rendered-templates" target="_blank" rel="noopener noreferrer">Server-rendered templates</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#wordpress" target="_blank" rel="noopener noreferrer">WordPress</a> · <a href="https://javadbat.github.io/design-system/?path=/docs/getting-started-framework-integration--docs#alpinejs-and-htmx" target="_blank" rel="noopener noreferrer">Alpine.js and HTMX</a>

## Installation

```sh
npm i jb-searchbar
```

```js
import 'jb-searchbar';
```

```html
<jb-searchbar></jb-searchbar>
```

## How it works

`jb-searchbar` supports two filter types:

- Normal filters: always visible elements placed in `slot="filter"`.
- Extra filters: hidden filter templates placed inside `<jb-extra-filter slot="extra">`. The user selects one, fills its value, and submits it into the searchbar as a removable filter chip.

## API reference

### jb-searchbar attributes

| name | type | default | description |
| --- | --- | --- | --- |
| `search-on-change` | `boolean` | `false` | Runs `search()` after selected extra filters change. Empty attribute and `"true"` mean true. |
| `size` | `'sm' \| 'md'` | `md` style defaults | Visual size variant. |

### jb-searchbar properties

| name | type | readonly | description |
| --- | --- | --- | --- |
| `value` | `JBSearchbarValue` | yes | Current normal filter values plus selected extra filters. |
| `filterList` | `FilterItem[]` | no | Selected extra-filter chips. This is runtime state, not the available filter template list. |
| `searchOnChange` | `boolean` | no | Runs `search()` after selected extra filters change. |
| `isLoading` | `boolean` | no | Plays or stops the search icon loading animation. |

### jb-searchbar methods

| name | returns | description |
| --- | --- | --- |
| `search()` | `void` | Dispatches the `search` event. |
| `deleteFilter(filterIndex)` | `void` | Removes a selected extra filter by index and dispatches `change`. |
| `createFilterList()` | `FilterItem[]` | Creates the proxied selected-filter list used internally. |

### jb-searchbar events

| event | description |
| --- | --- |
| `load` | Dispatched from `connectedCallback` before initialization. |
| `init` | Dispatched from `connectedCallback` after initialization. |
| `search` | Dispatched when the search button is clicked or `search()` is called. |
| `change` | Dispatched when a selected extra filter is added or removed. |

### jb-searchbar slots

| slot | description |
| --- | --- |
| `filter` | Always-visible filter elements. |
| `extra` | One or more `<jb-extra-filter>` elements. |
| `divider` | Optional divider content between normal filters and extra filters. |

## Normal filters

Put always-visible filter elements inside an element with `slot="filter"`. The searchbar gathers elements that have a `name` and a `value` property.

```html
<jb-searchbar>
  <div slot="filter">
    <jb-input name="firstName" placeholder="First name"></jb-input>
    <jb-input name="lastName" placeholder="Last name"></jb-input>
    <jb-number-input name="age" placeholder="Age"></jb-number-input>
  </div>
</jb-searchbar>
```

## Extra filters

Extra filters are filter templates that the user can choose from a dropdown. Place them inside `<jb-extra-filter slot="extra">`.

```html
<jb-searchbar>
  <jb-extra-filter slot="extra" placeholder="Choose filter">
    <jb-input name="firstName" data-label="First name"></jb-input>
    <jb-input name="lastName" data-label="Last name"></jb-input>
    <jb-number-input name="age" data-label="Age"></jb-number-input>
  </jb-extra-filter>
</jb-searchbar>
```

Use `label` or `data-label` on each filter template. Use `data-label` when the visible input label should not be used as the selected filter label.

> By Pressing `Esc` key intent field (selected field) will disappear and filter go to select column step again.

### data-max-count

Use `data-max-count` on a filter template to limit how many times it can be selected.

```html
<jb-extra-filter slot="extra">
  <jb-number-input name="age" data-label="Age" data-max-count="1"></jb-number-input>
</jb-extra-filter>
```

## jb-extra-filter API

### jb-extra-filter attributes

| name | type | default | description |
| --- | --- | --- | --- |
| `placeholder` | `string` | localized default | Placeholder for the filter select. |
| `size` | `'sm' \| 'md'` | `md` style defaults | Visual size forwarded to the internal select. |
| `autofocus` | `boolean` | `false` | Focuses the internal select after it initializes when set as an empty attribute. |

### jb-extra-filter properties

| name | type | readonly | description |
| --- | --- | --- | --- |
| `inputState` | `'SELECT_COLUMN' \| 'FILL_VALUE'` | no | Current UI state. |
| `intentColumn` | `IntentColumn` | no | Current selected filter draft before it is submitted. |
| `extractDisplayValue` | `ExtractDisplayValueCallback` | no | Converts a filter value to the display string shown in the selected filter chip. |

### jb-extra-filter methods

| name | returns | description |
| --- | --- | --- |
| `updateSlotElements()` | `void` | Re-reads slotted filter templates and updates the select options. |
| `setFilterListSelectOptionList()` | `void` | Updates the available option list after selected filters change. |

### jb-extra-filter events

| event | detail | description |
| --- | --- | --- |
| `load` | none | Dispatched from `connectedCallback` before parent lookup. |
| `init` | none | Dispatched from `connectedCallback` after parent lookup. |
| `intent-submit` | `{ name, label, displayValue, value }` | Dispatched when the user submits an extra filter value. |

## Value

Read `.value` from the searchbar to get normal filters and selected extra filters.

```js
const searchbar = document.querySelector('jb-searchbar');

searchbar.addEventListener('search', () => {
  console.log(searchbar.value);
});
```

Each item contains:

| field | description |
| --- | --- |
| `name` | Filter element name. |
| `label` | Filter label from `label`, `data-label`, or fallback extraction. |
| `value` | Raw filter value. |
| `displayValue` | Display string for selected extra-filter chips. |

## Search on change

```html
<jb-searchbar search-on-change></jb-searchbar>
```

```js
const searchbar = document.querySelector('jb-searchbar');

searchbar.searchOnChange = true;
```

## Loading state

Set `isLoading` while a search request is running.

```js
const searchbar = document.querySelector('jb-searchbar');

searchbar.isLoading = true;
searchbar.isLoading = false;
```

## Display value formatting

Use `extractDisplayValue` on `<jb-extra-filter>` when the raw value should be displayed differently.

```js
const extraFilter = document.querySelector('jb-extra-filter');

extraFilter.extractDisplayValue = ({ name, value, dom }) => {
  if (name === 'createdAt') {
    return dom.inputValue;
  }
  return String(value);
};
```

## CSS parts and variables

### jb-searchbar parts

| part | description |
| --- | --- |
| `dynamic-wrapper` | Wrapper around normal filters, selected extra filters, divider, and extra filter slot. |
| `filter-list` | Selected extra-filter chip list. |
| `search-button` | Search button wrapper. |

### jb-extra-filter parts

| part | description |
| --- | --- |
| `column-select-wrapper` | Wrapper around the filter selector. |
| `intent-wrapper` | Wrapper shown while the user fills a selected filter value. |
| `intent-input-wrapper` | Wrapper where the selected filter input is moved. |
| `intent-submit-button` | Button that submits the selected extra filter value. |

| CSS variable name | description |
| --- | --- |
| `--jb-searchbar-divider-bg-color` | Divider background color. |
| `--jb-searchbar-filter-item-bg-color` | Selected extra-filter chip background color. |
| `--jb-searchbar-filter-item-border-radius` | Selected extra-filter chip border radius. |
| `--jb-searchbar-filter-item-color` | Selected extra-filter chip text color. |
| `--jb-searchbar-min-height` | Base searchbar minimum height. |
| `--jb-searchbar-min-height-sm` | Searchbar minimum height for `size="sm"`. |
| `--jb-searchbar-search-button-size` | Base search button size. |
| `--jb-searchbar-search-button-size-sm` | Search button size for `size="sm"`. |
| `--jb-extra-filter-submit-height` | Extra filter submit button height. |
| `--jb-extra-filter-submit-height-sm` | Extra filter submit button height for `size="sm"`. |
| `--jb-extra-filter-submit-width` | Extra filter submit button width. |
| `--jb-extra-filter-submit-width-sm` | Extra filter submit button width for `size="sm"`. |

```css
jb-searchbar {
  --jb-searchbar-filter-item-bg-color: #2563eb;
  --jb-searchbar-filter-item-color: #fff;
}
```

## Accessibility notes

- The search button is a clickable wrapper with an SVG icon. Add surrounding text or an external button if your page needs a visible text action.
- Filter elements keep their own accessibility behavior while slotted or moved into the extra-filter intent area.
- Extra filter templates must have `name` attributes so values can be collected.

## Related Docs

- See [`jb-searchbar/react`](https://github.com/javadbat/jb-searchbar/tree/main/react) if you want to use this component in React.
- See [`jb-select`](https://github.com/javadbat/jb-select) for the internal select used by `jb-extra-filter`.
- See [All JB Design System Component List](https://javadbat.github.io/design-system/) for more components.
- Use [Contribution Guide](https://github.com/javadbat/design-system/blob/main/docs/contribution-guide.md) if you want to contribute to this component.

## AI agent notes

- Import `jb-searchbar` once before using `<jb-searchbar>` or `<jb-extra-filter>`.
- Put always-visible filters inside an element with `slot="filter"`.
- Put `<jb-extra-filter slot="extra">` inside `<jb-searchbar>` for optional filters.
- Put optional filter templates as children of `<jb-extra-filter>`.
- Use `data-label` on filter templates when the selected chip label should differ from the input label.
- Use `data-max-count="1"` when a filter can only be selected once.
- Read `searchbar.value` inside `search` or `change` events.
- Use `searchOnChange` as a JavaScript property or `search-on-change` as an HTML attribute.
- This package includes [`custom-elements.json`](./custom-elements.json) and points to it with the package.json `customElements` field. The field is documented by the Custom Elements Manifest project in [Referencing manifests from npm packages](https://github.com/webcomponents/custom-elements-manifest#referencing-manifests-from-npm-packages).
- In `custom-elements.json`, `exports.kind: "custom-element-definition"` maps `jb-searchbar` and `jb-extra-filter` tag names to their implementation classes.
