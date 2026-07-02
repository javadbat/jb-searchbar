import type { JBInputWebComponent } from 'jb-input';
import type { JBSearchbarWebComponent, JBExtraFilterWebComponent } from 'jb-searchbar';
import type { JBSelectWebComponent } from 'jb-select';
import { expect, userEvent, waitFor } from 'storybook/test';

type ExtraFilterOption = {
  key: string;
  label: string;
};

export function getSearchbar(canvasElement: HTMLElement) {
  const searchbar = canvasElement.querySelector<JBSearchbarWebComponent>('jb-searchbar');
  expect(searchbar).toBeTruthy();
  expect(searchbar!.shadowRoot).toBeTruthy();
  return searchbar!;
}

export function getExtraFilter(canvasElement: HTMLElement) {
  const extraFilter = canvasElement.querySelector<JBExtraFilterWebComponent>('jb-extra-filter');
  expect(extraFilter).toBeTruthy();
  expect(extraFilter!.shadowRoot).toBeTruthy();
  return extraFilter!;
}

export function getExtraFilterSelect(extraFilter: JBExtraFilterWebComponent) {
  const select = extraFilter.shadowRoot?.querySelector<JBSelectWebComponent<ExtraFilterOption>>('.filter-select');
  expect(select).toBeTruthy();
  return select!;
}

export function getExtraFilterOptionList(extraFilter: JBExtraFilterWebComponent) {
  const optionList = extraFilter.shadowRoot?.querySelector<HTMLElement & { optionList: ExtraFilterOption[] }>(
    '#ColumnSelectOptionList',
  );
  expect(optionList).toBeTruthy();
  return optionList!;
}

export function getIntentSubmitButton(extraFilter: JBExtraFilterWebComponent) {
  const button = extraFilter.shadowRoot?.querySelector<HTMLElement>('.intent-submit-button');
  expect(button).toBeTruthy();
  return button!;
}

export function getIntentInput(extraFilter: JBExtraFilterWebComponent, selector: string) {
  const input = extraFilter.shadowRoot?.querySelector<JBInputWebComponent>(`.intent-input-wrapper ${selector}`);
  expect(input).toBeTruthy();
  return input!;
}

export function getNativeInput(input: JBInputWebComponent) {
  const nativeInput = input.shadowRoot?.querySelector<HTMLInputElement>('input');
  expect(nativeInput).toBeTruthy();
  return nativeInput!;
}

export function getFilterChip(searchbar: JBSearchbarWebComponent, index = 0) {
  const chip = searchbar.shadowRoot?.querySelectorAll<HTMLElement>('.filter-item')[index];
  expect(chip).toBeTruthy();
  return chip!;
}

export async function waitForExtraFilterOptions(extraFilter: JBExtraFilterWebComponent, keys: string[]) {
  const optionList = getExtraFilterOptionList(extraFilter);

  await waitFor(() => {
    expect(optionList.optionList.map((option) => option.key)).toEqual(keys);
  });

  return optionList.optionList;
}

export function chooseExtraFilter(extraFilter: JBExtraFilterWebComponent, key: string) {
  const select = getExtraFilterSelect(extraFilter);
  const option = getExtraFilterOptionList(extraFilter).optionList.find((item) => item.key === key);

  expect(option).toBeTruthy();
  select.value = option!;
  select.dispatchEvent(new Event('change', { bubbles: true }));
}

export async function fillIntentInput(
  extraFilter: JBExtraFilterWebComponent,
  selector: string,
  value: string,
  expectedValue = value,
) {
  const input = getIntentInput(extraFilter, selector);
  const nativeInput = getNativeInput(input);

  await userEvent.type(nativeInput, value);

  await waitFor(() => {
    expect(input.value).toBe(expectedValue);
  });

  return input;
}
