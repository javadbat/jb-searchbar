# JBSearchbar React Component

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/jb-searchbar)
[![GitHub license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://raw.githubusercontent.com/javadbat/jb-searchbar/main/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/jb-searchbar-react)](https://www.npmjs.com/package/jb-searchbar-react)
![GitHub Created At](https://img.shields.io/github/created-at/javadbat/jb-searchbar)

React wrapper for [`jb-searchbar`](https://github.com/javadbat/jb-searchbar). It exports `JBSearchbar` and `JBExtraFilter`.

## Demo

Explore the [React searchbar examples](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--normal), including [small sizing and loading](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--size), [search-on-change](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--search-on-change), and [dynamic extra filters](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--change-extra-fields).

## Installation

```sh
npm i jb-searchbar
```

```jsx
import { JBSearchbar, JBExtraFilter } from 'jb-searchbar/react';
```

## When to use

Use `JBSearchbar` when a React view needs a compact filter area that can collect normal filters, optional extra filters, display selected filter chips, and dispatch one search value object. See the [normal filter demo](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--normal) for the complete interaction.

## Basic usage

```jsx
<JBSearchbar onSearch={(event) => console.log(event.target.value)}>
  <div slot="filter">
    <JBInput name="textFilter" placeholder="Text filter" />
  </div>
</JBSearchbar>
```

## How it works

Normal filters go in the `filter` slot. Optional filters go in `JBExtraFilter`, which renders in the `extra` slot. When search runs, the web component traverses named child inputs and exposes the collected object on `event.target.value`.

## Props

### JBSearchbar

| prop | type | description |
| --- | --- | --- |
| `searchOnChange` | `boolean` | Runs search after selected extra filters change; see [search-on-change](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--search-on-change). |
| `isLoading` | `boolean` | Plays or stops the search icon loading animation; see the [loading demo](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--size). |
| `size` | `'sm' \| 'md'` | Visual size variant; see the [size demo](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--size). |
| `onLoad` | `(event) => void` | Called from the web component `load` event; see the [events demo](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--events). |
| `onInit` | `(event) => void` | Called from the web component `init` event; see the [events demo](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--events). |
| `onSearch` | `(event) => void` | Called when search is triggered; see the [search interaction](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--search-interaction). |

### JBExtraFilter

| prop | type | description |
| --- | --- | --- |
| `placeholder` | `string` | Placeholder for the filter select; see the [extra filter demo](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--normal). |
| `size` | `'sm' \| 'md'` | Visual size variant; see the [size demo](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--size). |
| `onExtractDisplayValue` | `ExtractDisplayValueCallback` | Converts a raw filter value to the chip display string; see [display formatting](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--normal). |
| `onLoad` | `(event) => void` | Called from the web component `load` event; see the [events demo](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--events). |
| `onInit` | `(event) => void` | Called from the web component `init` event; see the [events demo](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--events). |
| `onIntentSubmit` | `(event) => void` | Called when the user submits an extra filter value; see the [events demo](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--events). |

## Normal filters

Place always-visible inputs in a wrapper with `slot="filter"`; see the [normal filter demo](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--normal).

```jsx
<JBSearchbar onSearch={(event) => console.log(event.target.value)}>
  <div slot="filter">
    <JBInput name="firstName" placeholder="First name" />
    <JBNumberInput name="age" placeholder="Age" />
  </div>
</JBSearchbar>
```

## Extra filters

`JBExtraFilter` sets `slot="extra"` and turns named templates into selectable, removable chips; see the [extra filter demo](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--normal).

`JBExtraFilter` automatically renders with `slot="extra"`.

```jsx
<JBSearchbar onSearch={(event) => console.log(event.target.value)}>
  <JBExtraFilter placeholder="Choose filter">
    <JBInput name="firstName" data-label="First name" />
    <JBNumberInput name="age" data-label="Age" data-max-count={1} />
  </JBExtraFilter>
</JBSearchbar>
```

## jb-extra-filter API

Use the `JBExtraFilter` props and callbacks shown in the [events demo](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--events).

`JBExtraFilter` wraps the underlying `jb-extra-filter` web component. Use `placeholder`, `size`, `onIntentSubmit`, and `onExtractDisplayValue` from React, and put named filter input templates inside it.

## Display value formatting

Use `onExtractDisplayValue` to control selected chip text; see the [normal filter demo](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--normal).

```tsx
<JBExtraFilter
  onExtractDisplayValue={({ name, value, dom }) => {
    if (name === 'createdAt') {
      return dom.inputValue;
    }
    return String(value);
  }}
>
  <JBDateInput name="createdAt" data-label="Created at" />
</JBExtraFilter>
```

## Search on change

Set `searchOnChange` when adding or removing an extra filter should trigger `onSearch`; see the [search-on-change demo](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--search-on-change).

```jsx
<JBSearchbar searchOnChange onSearch={(event) => console.log(event.target.value)}>
  <JBExtraFilter>
    <JBInput name="title" data-label="Title" />
  </JBExtraFilter>
</JBSearchbar>
```

## Size and RTL

Use `size="sm"` for compact layouts. The [size/loading demo](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--size) and [RTL demo](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--rtl-sample) show the responsive variants.

## Loading state

Set `isLoading` while a request is running; see the [size and loading demo](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--size).

```jsx
<JBSearchbar isLoading={isSearching}>
  <div slot="filter">
    <JBInput name="query" placeholder="Search" />
  </div>
</JBSearchbar>
```

## Dynamic filter templates

React updates `JBExtraFilter` options when its children change; see the [dynamic filter demo](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--change-extra-fields).

## Styling

The React components use the same CSS variables and parts as the web components. See the shared [web-component styling guidance](../README.md#css-parts-and-variables).

```css
.report-searchbar {
  --jb-searchbar-filter-item-bg-color: #2563eb;
  --jb-searchbar-filter-item-color: #fff;
}
```

```jsx
<JBSearchbar className="report-searchbar" />
```

## Value

Read `event.target.value` in `onSearch`. The value is an object keyed by each named filter. Extra filters are included after the user submits them through `JBExtraFilter`; see the [search interaction](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--search-interaction).

## CSS parts and variables

The React components expose the same CSS parts and variables as `jb-searchbar` and `jb-extra-filter`; see the [normal searchbar demo](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--normal) and [size demo](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--size).

## Accessibility notes

Give each child filter input a clear label, placeholder, or `data-label`. Extra filter chips should have display values that are meaningful without relying only on visual context; see the [normal filter example](https://javadbat.github.io/design-system/?path=/story/components-jbsearchbar--normal).

## Shared Documentation

For filter behavior, value shape, slots, web-component events, CSS parts, and CSS variables, see [`jb-searchbar`](https://github.com/javadbat/jb-searchbar).

## Related Docs

- See [`jb-searchbar`](https://github.com/javadbat/jb-searchbar) if you want to use this component as a pure JavaScript web component.
- See [All JB Design System Component List](https://javadbat.github.io/design-system/) for more components.
- Use [Contribution Guide](https://github.com/javadbat/design-system/blob/main/docs/contribution-guide.md) if you want to contribute to this component.

## AI agent notes

- Import `JBSearchbar` and `JBExtraFilter` from `jb-searchbar/react`.
- Put normal filters inside a wrapper with `slot="filter"`.
- Use `JBExtraFilter` for optional filters; it already sets `slot="extra"`.
- Add `name` and `data-label` to filter template elements.
- Use `event.target.value` in `onSearch` to read collected filter values.
- Use `searchOnChange`, not `search-on-change`, in React.
- Use `onExtractDisplayValue` to customize selected chip display text.
