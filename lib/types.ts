import { JBDateInputWebComponent } from "jb-date-input";
import { JBInputWebComponent } from "jb-input";
import { JBSelectWebComponent } from "jb-select";

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
    config?:any
}
export type IntentColumn = {
    column:FilterColumn | null,
    label:string | null,
    value:string | null,
    active:boolean
}
export type FilterItem = {
    column:FilterColumn,
    value:string,
    label:string,
    dom?:HTMLDivElement
}
export type SpliceArgs = [start:number,deleteCount: number, ...items: FilterItem[]]
export type JBSearchbarValueItem = {
    column:FilterColumn,
    value:string
}
export type JBSearchbarValue = JBSearchbarValueItem[];