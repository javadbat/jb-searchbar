import React, { Fragment, useState } from 'react';
import { JBExtraFilter, JBSearchbar, Props } from 'jb-searchbar/react';
import type { Meta, StoryObj } from '@storybook/react';
import { JBInput } from 'jb-input/react';
import { JBButton } from 'jb-button/react';
import { JBNumberInput } from 'jb-number-input/react';
import { JBDateInput } from 'jb-date-input/react';
import { JBOption, JBSelect } from 'jb-select/react';
import { JBSwitch } from 'jb-switch/react';
import type { JBDateInputWebComponent } from 'jb-date-input';
const meta: Meta<Props> = {
  title: "Components/JBSearchbar",
  component: JBSearchbar,
};
export default meta;
type Story = StoryObj<typeof JBSearchbar>;

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
            return (arg.dom as JBDateInputWebComponent).inputValue
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
  }
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
}