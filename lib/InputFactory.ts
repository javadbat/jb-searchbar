/* eslint-disable no-duplicate-imports */
import 'jb-select';
import 'jb-input';
import 'jb-date-input';
import { JBInputWebComponent } from 'jb-input';
import { JBSelectWebComponent } from 'jb-select';
import { JBDateInputWebComponent } from 'jb-date-input';
import {FilterColumn} from './types';
class InputFactory {
    createTextInput({ onIntentSubmited, setIntentColumnValue, setIntentActive }) {
        const input = document.createElement('jb-input') as JBInputWebComponent;
        input.addEventListener('keydown', (e) => {
            const target = e.target as JBInputWebComponent;
            if (e.keyCode == 13 && target.value.trim() != "") {
                onIntentSubmited();
            }
        });
        input.addEventListener('keyup', (e) => {
            const target = e.target as JBInputWebComponent;
            setIntentColumnValue(target.value, target.value);
            if (target.validation?.isValid) {
                setIntentActive(true);
            } else {
                setIntentActive(false, target.validation?.message);
            }
        });
        input.addEventListener('init', () => {
            input.focus();
            input.validationList = [
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
    createNumberInput({ onIntentSubmited, setIntentColumnValue, setIntentActive }) {
        const input = document.createElement('jb-input') as JBInputWebComponent;

        input.addEventListener('keydown', (e) => {
            const target = e.target as JBInputWebComponent;
            if (e.keyCode == 13 && target.value.trim() != "") {
                onIntentSubmited();
            }
        });
        input.addEventListener('keyup', (e) => {
            const target = e.target as JBInputWebComponent;
            const value = parseInt(target.value);
            setIntentColumnValue(value, target.value);
            if (target.validation && target.validation.isValid) {
                setIntentActive(true);
            } else {
                setIntentActive(false, target.validation?.message);
            }
        });
        input.addEventListener('init', () => {
            input.focus();
            input.validationList = [
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
    createSelectInput({ column, onIntentSubmited, setIntentColumnValue, setIntentActive }) {
        const select = document.createElement('jb-select') as JBSelectWebComponent;
        select.callbacks.getOptionTitle = column.config.getOptionTitle;
        select.callbacks.getOptionValue = column.config.getOptionValue;
        select.optionList = column.config.optionList;
        select.addEventListener('change', (e) => {
            const target = e.target as JBSelectWebComponent;
            let label = "";
            label = target.selectedOptionTitle;
            setIntentColumnValue(target.value, label);
            setIntentActive(true);
            onIntentSubmited();
        });
        select.addEventListener('init', () => {
            select.focus();
        });
        return select;
    }
    createDateInput({ column, onIntentSubmited, setIntentColumnValue, setIntentActive }) {
        const dateInput = document.createElement('jb-date-input') as JBDateInputWebComponent;
        dateInput.required = true;
        dateInput.addEventListener('init', () => {
            dateInput.focus();
        });
        dateInput.addEventListener('keyup', (e) => {
            const target = e.target as JBDateInputWebComponent;
            if (target.validation.isValid) {
                setIntentActive(true);
                const value = target.value;
                const label = target.inputValue;
                setIntentColumnValue(value, label);
            } else {
                setIntentActive(false, target.validation.message);
            }
        });
        dateInput.addEventListener('select', (e) => {
            const target = e.target as JBDateInputWebComponent;
            setIntentActive(true);
            const value = target.value;
            const label = target.inputValue;
            setIntentColumnValue(value, label);
            onIntentSubmited();
        });
        return dateInput;
    }
}
export { InputFactory };