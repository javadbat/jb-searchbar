import CSS from "./jb-searchbar.css";
import VariablesCSS from "./variables.css";
import type {
  JBSearchbarElements,
  FilterItem,
  SpliceArgs,
  JBSearchbarValue,
  FilterElementDom
} from "./types.js";

import { registerDefaultVariables } from 'jb-core/theme';
import { renderHTML } from "./render";
import { createFilterDOM } from "./utils";
import './extra-filters/extra-filter.js';
import type { SubmitEventDetail } from "./extra-filters/types";
import type { JBExtraFilterWebComponent } from "./extra-filters/extra-filter.js";
import { extractLabel } from "./extra-filters/utils";
export * from './types.js';
export {JBExtraFilterWebComponent} from './extra-filters/extra-filter'
export * from './extra-filters/types.js'
export class JBSearchbarWebComponent extends HTMLElement {
  #isLoading = false;
  elements!: JBSearchbarElements;
  filterList: FilterItem[] = [];
  get isLoading() {
    return this.#isLoading;
  }
  set isLoading(value) {
    if (!this.#isLoading && value) {
      this.#playSearchIconAnimation();
    }
    this.#isLoading = value;
  }

  get value(): JBSearchbarValue {
    const value = this.filterList.map((x) => ({ name: x.name, label: x.label, value: x.value, displayValue:x.displayValue }));
    return [...this.#gatherFiltersValue(),...value];
  }
  #searchOnChange = false;
  get searchOnChange() {
    return this.#searchOnChange;
  }
  set searchOnChange(value) {
    if (typeof value == "boolean") {
      this.#searchOnChange = value;
    }
  }
  constructor() {
    super();
    this.#initWebComponent();
  }
  #registerEventListener() {
    this.elements.searchButton.wrapper.addEventListener("click", this.search.bind(this));
  }
  initProp() {
    this.filterList = this.createFilterList();
  }
  createFilterList() {
    const flProxy = new Proxy<FilterItem[]>([], {
      get: (target, property, receiver) => {
        if (property == "splice") {
          //when we remove filter
          const origMethod = target[property];
          const customSplice = (...args: SpliceArgs) => {
            const domIndex = args[0];
            this.elements.filterListWrapper.children[domIndex].remove();
            setTimeout(() => {
              this.elements.extraFilters.forEach(x=>{x.setFilterListSelectOptionList()});
            }, 0);

            //because we apply function like this the get wont call again in proxy
            //we apply into proxy not original obj so setter hooks for splice in setter do their job
            return origMethod.apply(receiver, args);
          };
          return customSplice;
        }
        //@ts-ignore
        return target[property];
      },
      set: (target, property, value: FilterItem) => {
        if (!(property == "length") && typeof property == "string") {
          if (Number(property) == target.length) {
            //when push
            const dom = createFilterDOM(value.displayValue, value.label, this.filterList.length, this.deleteFilter.bind(this));
            value.dom = dom;
            this.elements.filterListWrapper.appendChild(dom);
          }
          if (
            !Number.isNaN(Number(property)) &&
            Number(property) < target.length
          ) {
            //when splice
            //we do dom delete in proxy getter
            value.dom!.dataset.filterIndex = property;
          }
        }
        //@ts-ignore
        target[property] = value;
        return true;
      },
    });
    return flProxy;
  }

  deleteFilter(filterIndex: number) {
    this.filterList.splice(filterIndex, 1);
    this.#dispatchOnChange();
    this.elements.extraFilters.forEach(x=>{x.setFilterListSelectOptionList()});
  }
  connectedCallback() {
    // standard web component event that called when all of dom is bound
    this.callOnLoadEvent();
    this.initProp();
  }
  callOnLoadEvent() {
    const event = new CustomEvent("load", { bubbles: true, composed: true });
    this.dispatchEvent(event);
  }
  #initWebComponent() {
    const shadowRoot = this.attachShadow({ mode: "open",delegatesFocus:true, serializable:true });
    registerDefaultVariables();
    const html = `<style>${CSS} ${VariablesCSS}</style>\n${renderHTML()}`;
    const element = document.createElement("template");
    element.innerHTML = html;
    shadowRoot.appendChild(element.content.cloneNode(true));
    this.elements = {
      filterListWrapper: shadowRoot.querySelector(".filter-list-section") as HTMLDivElement,
      searchButton: {
        wrapper: shadowRoot.querySelector(".search-button-wrapper") as HTMLDivElement,
        svg: {
          spinnerLine: shadowRoot.querySelector(".search-button-wrapper .convertable-line") as SVGClipPathElement,
          spinnerBox: shadowRoot.querySelector(".search-button-wrapper .spin-line-group") as SVGGElement,
        },
      },
      extraFilterSlot: shadowRoot.querySelector(`slot[name="extra"]`),
      filterSlot:shadowRoot.querySelector(`slot[name="filter"]`),
      extraFilters:[]
    };
    this.#registerEventListener();
    this.#initExtraFilters();
  }

  #extraFiltersAbort = new AbortController();
  #initExtraFilters(){
    this.elements.extraFilterSlot.addEventListener("slotchange",()=>{
      const assignedElements = this.elements.extraFilterSlot.assignedElements().filter(x=>x.tagName.toUpperCase() == "JB-EXTRA-FILTER") as JBExtraFilterWebComponent[];
      this.elements.extraFilters = assignedElements;
      this.#extraFiltersAbort.abort("Remove prev listeners and setup new one");
      this.#extraFiltersAbort = new AbortController();
      this.elements.extraFilters.forEach((ef)=>{
        ef.addEventListener("intent-submit", this.#onIntentSubmit.bind(this), {signal:this.#extraFiltersAbort.signal});
      })
    })
  }
  // static get observedAttributes() {
  //   return [];
  // }
  // attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
  // }


  #playSearchIconAnimation() {
    const spinnerLine = this.elements.searchButton.svg.spinnerLine;
    const spinnerBox = this.elements.searchButton.svg.spinnerBox;
    const self = this;
    const ShrinkLineAnimation = spinnerLine.animate(
      [
        { d: 'path("M400 400 L 450 450")' },
        { d: 'path("M410 410 L 415 415")' },
      ],
      { id: "ShrinkLine", duration: 400 }
    );
    ShrinkLineAnimation.cancel();
    const shrinkLineFunction = function () {
      spinnerLine.setAttribute(
        "d",
        "M 407.82484150097946 413.25475607450323 A 220 220 0 0 0 413.25475607450323 407.8248415009794"
      );
      curveLineAnimation.play();
    };
    ShrinkLineAnimation.onfinish = shrinkLineFunction;
    const curveLineAnimation = spinnerLine.animate(
      [
        {
          d: 'path("M 407.82484150097946 413.25475607450323 A 220 220 0 0 0 413.25475607450323 407.8248415009794")',
        },
        { d: 'path("M 255 475 A 220 220 0 0 0 475 255")' },
      ],
      { id: "CurveLine", duration: 400 }
    );
    curveLineAnimation.cancel();
    const curveLineFunction = function () {
      spinnerLine.setAttribute("d", "M 255 475 A 220 220 0 0 0 475 255");
      spinAnimation.play();
    };
    curveLineAnimation.onfinish = curveLineFunction;
    const spinAnimation = spinnerBox.animate(
      [
        { transform: "rotate(0deg)" },
        { transform: "rotate(180deg)" },
        { transform: "rotate(360deg)" },
      ],
      { id: "Spin", duration: 1000, iterations: 1 }
    );
    spinAnimation.cancel();
    const spinFunction = function () {
      if (self.isLoading == true) {
        spinAnimation.play();
      } else {
        ReverseCurveLineAnimation.play();
      }
    };
    spinAnimation.onfinish = spinFunction;
    const growLineAnimation = spinnerLine.animate(
      [
        { d: 'path("M410 410 L 415 415")' },
        { d: 'path("M400 400 L 450 450")' },
      ],
      { id: "GrowLine", duration: 400 }
    );
    growLineAnimation.cancel();
    const growLineFunction = function () {
      spinnerLine.setAttribute("d", "M400 400 L 450 450");
    };
    growLineAnimation.onfinish = growLineFunction;

    const ReverseCurveLineAnimation = spinnerLine.animate(
      [
        { d: 'path("M 255 475 A 220 220 0 0 0 475 255")' },
        {
          d: 'path("M 407.82484150097946 413.25475607450323 A 220 220 0 0 0 413.25475607450323 407.8248415009794")',
        },
      ],
      { id: "ReverseCurveLine", duration: 400 }
    );
    ReverseCurveLineAnimation.cancel();
    const ReverseCurveLineFunction = function () {
      spinnerLine.setAttribute("d", "M410 410 L 415 415");
      growLineAnimation.play();
    };
    ReverseCurveLineAnimation.onfinish = ReverseCurveLineFunction;
    ShrinkLineAnimation.play();
  }
  #dispatchOnChange() {
    const event = new CustomEvent("change");
    this.dispatchEvent(event);
    if (this.searchOnChange) {
      this.search();
    }
  }
  search() {
    const event = new CustomEvent("search");
    this.dispatchEvent(event);
  }
  #onIntentSubmit(e: CustomEvent<SubmitEventDetail<unknown>>) {
    const { displayValue, label, name, value } = e.detail;
    this.filterList.push({
      name,
      displayValue,
      value,
      label,
    });
    this.elements.extraFilters.forEach(x=>{x.setFilterListSelectOptionList()});
    this.#dispatchOnChange();
  }
  #gatherFiltersValue(){
    const slots = this.elements.filterSlot.assignedElements();
    const value: JBSearchbarValue = [];
    slots.forEach((slot)=>{
      const namedElements = slot.querySelectorAll("[name]");
      const formElements:FilterElementDom[] = Array.from(namedElements).filter((ne:FilterElementDom)=>ne.value !== undefined && (ne.constructor as any)?.formAssociated) as unknown as FilterElementDom[];
      formElements.forEach((fe)=>{
        value.push({
          name:fe.getAttribute("name"),
          value:fe.value,
          label:extractLabel(fe),
        })
      })
    })
    return value;
  }
}
const myElementNotExists = !customElements.get("jb-searchbar");
if (myElementNotExists) {
  window.customElements.define("jb-searchbar", JBSearchbarWebComponent);
}
