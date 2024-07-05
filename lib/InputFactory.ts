/* eslint-disable no-duplicate-imports */
import 'jb-select';
import 'jb-input';
import 'jb-date-input';
import { JBInputWebComponent } from 'jb-input';
import { JBSelectWebComponent } from 'jb-select';
import { JBDateInputWebComponent } from 'jb-date-input';
import {CreateInputDomArgs, SelectFieldTypeConfig} from './types';
class InputFactory {
  createTextInput(args:CreateInputDomArgs) {
    const {column,onIntentSubmitted,setIntentActive,setIntentColumnValue} = args;
    const input = document.createElement('jb-input') as JBInputWebComponent;
    input.addEventListener('keydown', (e) => {
      const target = e.target as JBInputWebComponent;
      if (e.keyCode == 13 && target.value.trim() != "") {
        onIntentSubmitted();
      }
    });
    input.addEventListener('keyup', (e) => {
      const target = e.target as JBInputWebComponent;
      setIntentColumnValue(target.value,target.value,column.label);
      if (target.validation?.resultSummary.isValid) {
        setIntentActive(true);
      } else {
        setIntentActive(false, target.validation.resultSummary.message || undefined);
      }
    });
    input.addEventListener('init', () => {
      input.focus();
      input.validation.list = [
        {
          validator: /.{1}/g,
          message: 'پر کردن فیلد اجباری است'
        },
      ];
    });
    input.addEventListener('init', () => {
      input.focus();
    });
    return input;
  }
  createNumberInput(args:CreateInputDomArgs) {
    const {column,onIntentSubmitted,setIntentActive,setIntentColumnValue} = args;
    const input = document.createElement('jb-input') as JBInputWebComponent;

    input.addEventListener('keydown', (e) => {
      const target = e.target as JBInputWebComponent;
      if (e.keyCode == 13 && target.value.trim() != "") {
        onIntentSubmitted();
      }
    });
    input.addEventListener('keyup', (e) => {
      const target = e.target as JBInputWebComponent;
      const value = parseInt(target.value);
      setIntentColumnValue(value,target.value, column.label);
      if (target.validation && target.validation.resultSummary.isValid) {
        setIntentActive(true);
      } else {
        setIntentActive(false, target.validation?.resultSummary.message || undefined);
      }
    });
    input.addEventListener('init', () => {
      input.focus();
      input.validation.list = [
        {
          validator: /.{1}/g,
          message: 'پر کردن فیلد اجباری است'
        },
        {
          validator: /^[0-9]*$/g,
          message: 'تنها میتوانید عدد وارد نمایید'
        },
      ];
    });
    return input;
  }
  createSelectInput(args:CreateInputDomArgs) {
    const {column,onIntentSubmitted,setIntentActive,setIntentColumnValue} = args;
    const select = document.createElement('jb-select') as JBSelectWebComponent;
    const columnConfig = column.config as SelectFieldTypeConfig;
    select.callbacks.getOptionTitle = columnConfig.getOptionTitle;
    select.callbacks.getOptionValue = columnConfig.getOptionValue;
    select.optionList = columnConfig.optionList;
    select.addEventListener('change', (e) => {
      const target = e.target as JBSelectWebComponent;
      let title = "";
      title = target.selectedOptionTitle;
      setIntentColumnValue(target.value,title, column.label);
      setIntentActive(true);
      onIntentSubmitted();
    });
    select.addEventListener('init', () => {
      select.focus();
    });
    return select;
  }
  createDateInput(args:CreateInputDomArgs) {
    const {column,onIntentSubmitted,setIntentActive,setIntentColumnValue} = args;
    const dateInput = document.createElement('jb-date-input') as JBDateInputWebComponent;
    dateInput.required = true;
    dateInput.valueType = "JALALI";
    dateInput.setAttribute("format","YYYY/MM/DD");
    dateInput.addEventListener('init', () => {
      dateInput.focus();
    });
    dateInput.addEventListener('keyup', (e) => {
      const target = e.target as JBDateInputWebComponent;
      if (target.validation.resultSummary.isValid) {
        setIntentActive(true);
        const value = target.valueInDate;
        const valueString = target.value;
        setIntentColumnValue(value,valueString, column.label);
      } else {
        setIntentActive(false, target.validation.resultSummary.message || undefined);
      }
    });
    dateInput.addEventListener('select', (e) => {
      const target = e.target as JBDateInputWebComponent;
      setIntentActive(true);
      const value = target.valueInDate;
      const valueString = target.value;
      setIntentColumnValue(value,valueString, column.label);
      onIntentSubmitted();
    });
    return dateInput;
  }
}
export { InputFactory };