import type { JBOptionListWebComponent, JBSelectWebComponent } from "jb-select"
import type { FilterElementDom } from '../types';

export type InputState = "SELECT_COLUMN" | "FILL_VALUE";

export type FilterOption = {
  key: string,
  label: string,
}

export type Elements = {
  filterSelect: JBSelectWebComponent<FilterOption>,
  columnSelectOptionList: JBOptionListWebComponent<FilterOption, FilterOption>,
  filtersSlot: HTMLSlotElement,
  intent: {
    wrapper: HTMLDivElement,
    inputWrapper: HTMLDivElement
    input?: FilterElementDom<unknown>,
    submit: HTMLDivElement
  }
}

export type IntentColumn<TValue = unknown> = {
  filterItem: FilterListItem<TValue> | null,
  name: string | null,
  label: string | null,
  valueString: string | null,
  value: TValue | null,
  active: boolean
}

export type SubmitEventDetail<TValue> = {
  name:string
  label: string | null,
  displayValue: string | null,
  value: TValue | null,
}

export type FilterListItem<TValue = unknown> = {
  dom: FilterElementDom<TValue>,
  parentDom: HTMLElement
}
export type FilterList<TValue = unknown> = Map<string, FilterListItem<TValue>>;

/**
 * used to define a custom function to extract display value from value and dom
 */
export type ExtractDisplayValueCallback<TValue=unknown,TDom extends FilterElementDom<TValue> = FilterElementDom<TValue>> = (args:{value:TValue, name:string, dom?:TDom})=>string
