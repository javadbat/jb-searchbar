import { JBDateInputWebComponent } from "jb-date-input";
import { JBInputWebComponent } from "jb-input";
import { JBSelectWebComponent } from "jb-select";
import { string } from "prop-types";

export type InputState = "SELECT_COLUMN" | "FILL_VALUE";
export type JBSearchbarElements = {
    columnSelect:JBSelectWebComponent,
    filterListWrapper:HTMLDivElement,
    searchButton:{
        wrapper:HTMLDivElement,
        svg:{
            spinnerLine:SVGClipPathElement,
            spinnerBox:SVGGElement,
        }
    },
    intent:{
        column:HTMLDivElement,
        wrapper:HTMLDivElement,
        input:{
            wrapper:HTMLDivElement,
            input: JBSelectWebComponent | JBInputWebComponent | JBDateInputWebComponent | null
        },
        submitButton:HTMLDivElement,

    }
}
export type FilterColumn = {
    key: string,
    label: string,
    type: 'TEXT' | 'DATE' | 'SELECT' | 'NUMBER',
    maxUsageCount?: number,
    config?:any|SelectFieldTypeConfig,
}
export type IntentColumn = {
    column:FilterColumn | null,
    label:string | null,
    valueString:string | null,
    value:any | null,
    active:boolean
}
export type FilterItem = {
    column:FilterColumn,
    value:any,
    valueString:string,
    label:string,
    dom?:HTMLDivElement
}
export type SpliceArgs = [start:number,deleteCount: number, ...items: FilterItem[]]
export type JBSearchbarValueItem = {
    column:FilterColumn,
    value:string
}
export type JBSearchbarValue = JBSearchbarValueItem[];
export type CreateInputDomArgs = {
    onIntentSubmitted:()=>void,
    setIntentColumnValue:(value:any,stringValue:string,label:string)=>void,
    setIntentActive:(value:boolean, err?:string)=>void,
    column:FilterColumn
}
export type SelectFieldTypeConfig<OptionType = any> = {
    optionList:OptionType[],
    getOptionTitle: (option:OptionType)=>string,
    getOptionValue:(option:OptionType)=>any
}