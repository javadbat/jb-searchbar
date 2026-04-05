import type {EventTypeWithTarget} from 'jb-core';
import type { JBSearchbarWebComponent } from "./jb-searchbar";
import type {ValidationHelper} from "jb-validation";
import type { JBExtraFilterWebComponent } from "./extra-filters/extra-filter";

export type JBSearchbarElements = {

    filterListWrapper:HTMLDivElement,
    filterSlot:HTMLSlotElement,
    extraFilterSlot:HTMLSlotElement,
    extraFilters:JBExtraFilterWebComponent[]
    searchButton:{
        wrapper:HTMLDivElement,
        svg:{
            spinnerLine:SVGClipPathElement,
            spinnerBox:SVGGElement,
        }
    },
}

export type FilterItem<TValue=unknown> = {
    name:string,
    value:TValue,
    displayValue:string,
    label:string,
    dom?:HTMLElement
}
export type SpliceArgs = [start:number,deleteCount: number, ...items: FilterItem[]]
export type JBSearchbarValueItem<TValue=unknown> = {
    name:string,
    label?:string
    value:TValue,
    displayValue?:string
}
export type JBSearchbarValue = JBSearchbarValueItem[];
export type SelectFieldTypeConfig<OptionType = any> = {
    optionList:OptionType[],
    getOptionTitle: (option:OptionType)=>string,
    getOptionValue:(option:OptionType)=>any
}

export type JBSearchbarEventType<TEvent> = EventTypeWithTarget<TEvent,JBSearchbarWebComponent>
export type JBExtraFilterEventType<TEvent> = EventTypeWithTarget<TEvent,JBExtraFilterWebComponent>

//new method types

export type FilterElementDom<TValue = unknown> = HTMLElement & {
    validation:ValidationHelper<unknown>,
    value: TValue,
    name:string,
}

/* Variants */
export type SizeVariants = 'xs' | 'sm' | 'md' | 'lg' | 'xl';