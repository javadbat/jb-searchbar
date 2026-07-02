import React, { Fragment, useState } from 'react';
import { JBExtraFilter, JBSearchbar } from 'jb-searchbar/react';
import type { Meta, StoryObj } from '@storybook/react';
import { JBInput } from 'jb-input/react';
import { JBButton } from 'jb-button/react';
import { JBNumberInput } from 'jb-number-input/react';
import { JBDateInput } from 'jb-date-input/react';
import { JBOption, JBSelect } from 'jb-select/react';
import type { JBDateInputWebComponent } from 'jb-date-input';
import { expect, userEvent, waitFor } from 'storybook/test';
import {
  chooseExtraFilter,
  fillIntentInput,
  getExtraFilter,
  getFilterChip,
  getIntentInput,
  getIntentSubmitButton,
  getSearchbar,
  waitForExtraFilterOptions,
} from './test-utils';
const meta = {
  title: "Components/JBSearchbar",
  component: JBSearchbar,
} satisfies Meta<typeof JBSearchbar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {

  args: {
    children:
      <Fragment>
        <div slot="filter">
          <JBInput placeholder='text filter' name="textFilter"/>
          <JBNumberInput placeholder='number filter' name="numberFilter" showControlButton/>
          <JBSelect placeholder='Option filter' name="optionFilter">
            <JBOption value="1">Option 1</JBOption>
            <JBOption value="2">Option 2</JBOption>
            <JBOption value="3">Option 3</JBOption>
          </JBSelect>
        </div>
        <JBExtraFilter onExtractDisplayValue={(arg)=> {
          switch(arg.name){
            case 'extraDateFilter':
            return (arg.dom as unknown as JBDateInputWebComponent).inputValue
          }
          return String(arg.value);
          }}>
          <JBInput name="extraTextFilter" data-label="text filter" placeholder='Simple Text Filter' />
          <JBNumberInput name="extraNumberFilter" data-label="number filter" placeholder='Simple Number Filter' />
          <JBInput name="extraMinimumFilter" data-label="minimum 3 " placeholder='type 3 char and more to approve' validationList={[{
            validator: /.{3}/g,
            message: "you must enter 3 value"
          }]} />
          <JBDateInput name="extraDateFilter" data-label="date filter" placeholder='Simple Date Filter' required/>
          <JBInput name="extraOneTime" data-label="one time" placeholder='you can only use this one time' data-max-count={1} />
        </JBExtraFilter>
      </Fragment>,

    onSearch: () => {
      console.log('search happened');
    }
  },
  play: async ({ canvasElement }) => {
    const searchbar = getSearchbar(canvasElement);
    const extraFilter = getExtraFilter(canvasElement);

    await waitForExtraFilterOptions(extraFilter, [
      'extraTextFilter',
      'extraNumberFilter',
      'extraMinimumFilter',
      'extraDateFilter',
      'extraOneTime',
    ]);

    chooseExtraFilter(extraFilter, 'extraMinimumFilter');

    await waitFor(() => {
      expect(extraFilter.inputState).toBe('FILL_VALUE');
      expect(getIntentInput(extraFilter, 'jb-input[name="extraMinimumFilter"]')).toBeTruthy();
      expect(getIntentSubmitButton(extraFilter).classList.contains('--active')).toBe(false);
    });

    await fillIntentInput(extraFilter, 'jb-input[name="extraMinimumFilter"]', 'ab');

    await waitFor(() => {
      expect(getIntentSubmitButton(extraFilter).classList.contains('--active')).toBe(false);
    });

    await fillIntentInput(extraFilter, 'jb-input[name="extraMinimumFilter"]', 'c', 'abc');

    await waitFor(() => {
      expect(getIntentSubmitButton(extraFilter).classList.contains('--active')).toBe(true);
    });

    await userEvent.click(getIntentSubmitButton(extraFilter));

    await waitFor(() => {
      expect(extraFilter.inputState).toBe('SELECT_COLUMN');
      expect(searchbar.value).toContainEqual({
        name: 'extraMinimumFilter',
        label: 'minimum 3 ',
        value: 'abc',
        displayValue: 'abc',
      });
      expect(getFilterChip(searchbar).textContent).toContain('minimum 3 : abc');
    });
  }
};
export const Size: Story = {
  args: {
    children:
      <Fragment>
        <div slot="filter">
          <JBInput placeholder='text filter' name="textFilter" size='sm'/>
          <JBSelect placeholder='Option filter' name="optionFilter" size='sm'>
            <JBOption value="1">Option 1</JBOption>
            <JBOption value="2">Option 2</JBOption>
            <JBOption value="3">Option 3</JBOption>
          </JBSelect>
        </div>
        <JBExtraFilter size='sm' onExtractDisplayValue={(arg)=> {
          switch(arg.name){
            case 'extraDateFilter':
            return (arg.dom as unknown as JBDateInputWebComponent).inputValue
          }
          return String(arg.value);
          }}>
          <JBInput data-label="text filter" placeholder='Simple Text Filter' size='sm' />
          <JBInput name="extraMinimumFilter" data-label="minimum 3 " placeholder='type 3 char and more to approve' size='sm' validationList={[{
            validator: /.{3}/g,
            message: "you must enter 3 value"
          }]} />
          <JBDateInput name="extraDateFilter" data-label="date filter" placeholder='Simple Date Filter' size='sm' required/>
        </JBExtraFilter>
        <div slot="divider"></div>
      </Fragment>,

    onSearch: () => {
      console.log('search happened');
    },
    size:'sm',
    isLoading:true
  },
};
export const RTLSample: Story = {
  args: {
    // placeholder: 'نوع فیلتر را انتخاب کنید',
  },
  parameters: {
    themes: {
      themeOverride: 'rtl'
    }
  },
};

export const SearchOnChange: Story = {
  args: {
    ...Normal.args,
    searchOnChange: true,
  }
};

export const ChangeExtraFields: Story = {
  render: () => {
    const [showExtraFilter, setShowExtraFilter] = useState<boolean>(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <JBSearchbar>
          <JBExtraFilter placeholder='choose on of the options'>
            <JBInput label="Name" name="name" required message="enter your name" />
            {
              showExtraFilter &&
              <JBNumberInput label="Age" name="age" message="enter your age" />
            }
          </JBExtraFilter>
        </JBSearchbar>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
          <JBButton onClick={() => setShowExtraFilter(true)}>Add Age Filter</JBButton>
          <JBButton onClick={() => setShowExtraFilter(false)}>Hide Age Filter</JBButton>
        </div>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const extraFilter = getExtraFilter(canvasElement);
    const buttons = Array.from(canvasElement.querySelectorAll('jb-button'));
    const addAgeButton = buttons.find((button) => button.textContent?.includes('Add Age Filter'));
    const hideAgeButton = buttons.find((button) => button.textContent?.includes('Hide Age Filter'));

    expect(addAgeButton).toBeTruthy();
    expect(hideAgeButton).toBeTruthy();

    await waitForExtraFilterOptions(extraFilter, ['name']);

    await userEvent.click(addAgeButton!);

    await waitForExtraFilterOptions(extraFilter, ['name', 'age']);

    await userEvent.click(hideAgeButton!);

    await waitForExtraFilterOptions(extraFilter, ['name']);
  }
}
