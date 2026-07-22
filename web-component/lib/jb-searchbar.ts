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
import "jb-icons/search";
import { extractLabel } from "./extra-filters/utils";
import { i18n } from "jb-core/i18n";
import { dictionary } from "./i18n";
export * from './types.js';
export { JBExtraFilterWebComponent } from './extra-filters/extra-filter'
export * from './extra-filters/types.js'
export class JBSearchbarWebComponent extends HTMLElement {
  #internals?: ElementInternals;
  #isLoading = false;
  elements!: JBSearchbarElements;
  filterList: FilterItem[] = [];
  get isLoading() {
    return this.#isLoading;
  }
  set isLoading(value) {
    this.#isLoading = value;
    this.elements.searchButton.icon.isLoading = value;
    this.elements.searchButton.wrapper.setAttribute("aria-busy", value ? "true" : "false");
  }

  get value(): JBSearchbarValue {
    const value = this.filterList.map((x) => ({ name: x.name, label: x.label, value: x.value, displayValue: x.displayValue }));
    return [...this.#gatherFiltersValue(), ...value];
  }
  #searchOnChange = false;
  get searchOnChange() {
    return this.#searchOnChange;
  }
  set searchOnChange(value) {
    if (typeof value === "boolean") {
      this.#searchOnChange = value;
    }
  }
  constructor() {
    super();
    if (typeof this.attachInternals === "function") {
      this.#internals = this.attachInternals();
      this.#internals.role = "search";
      this.#internals.ariaLabel = dictionary.get(i18n, "search");
    }
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
        if (property === "splice") {
          //when we remove filter
          const origMethod = target[property];
          const customSplice = (...args: SpliceArgs) => {
            const domIndex = args[0];
            this.elements.filterListWrapper.children[domIndex].remove();
            setTimeout(() => {
              this.elements.extraFilters.forEach(x => { x.setFilterListSelectOptionList() });
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
        if (!(property === "length") && typeof property === "string") {
          if (Number(property) === target.length) {
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
    this.elements.extraFilters.forEach(x => { x.setFilterListSelectOptionList() });
  }
  connectedCallback() {
    // standard web component event that called when all of dom is bound
    this.callOnLoadEvent();
    this.initProp();
    this.callOnInitEvent();
  }
  callOnLoadEvent() {
    const event = new CustomEvent("load", { bubbles: true, composed: true });
    this.dispatchEvent(event);
  }
  callOnInitEvent() {
    const event = new CustomEvent("init", { bubbles: true, composed: true });
    this.dispatchEvent(event);
  }
  #initWebComponent() {
    const shadowRoot = this.attachShadow({ mode: "open", delegatesFocus: true, serializable: true });
    registerDefaultVariables();
    const html = `<style>${CSS} ${VariablesCSS}</style>\n${renderHTML()}`;
    const element = document.createElement("template");
    element.innerHTML = html;
    shadowRoot.appendChild(element.content.cloneNode(true));
    this.elements = {
      filterListWrapper: shadowRoot.querySelector(".filter-list-section") as HTMLDivElement,
      searchButton: {
        wrapper: shadowRoot.querySelector(".search-button-wrapper") as HTMLButtonElement,
        icon: shadowRoot.querySelector("jb-icon-search")!,
      },
      extraFilterSlot: shadowRoot.querySelector(`slot[name="extra"]`)!,
      filterSlot: shadowRoot.querySelector(`slot[name="filter"]`)!,
      extraFilters: []
    };
    this.#registerEventListener();
    this.#initExtraFilters();
  }

  #extraFiltersAbort = new AbortController();
  #initExtraFilters() {
    this.elements.extraFilterSlot.addEventListener("slotchange", () => {
      const assignedElements = this.elements.extraFilterSlot.assignedElements().filter(x => x.tagName.toUpperCase() === "JB-EXTRA-FILTER") as JBExtraFilterWebComponent[];
      this.elements.extraFilters = assignedElements;
      this.#extraFiltersAbort.abort("Remove prev listeners and setup new one");
      this.#extraFiltersAbort = new AbortController();
      this.elements.extraFilters.forEach((ef) => {
        ef.addEventListener("intent-submit", this.#onIntentSubmit.bind(this) as EventListener, { signal: this.#extraFiltersAbort.signal });
      })
    })
  }
  static get observedAttributes() {
    return ["search-on-change"];
  }
  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    switch (name) {
      case "search-on-change":
        this.searchOnChange = newValue === "" || newValue === "true";
        break;
    }
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
      displayValue: displayValue || "",
      value,
      label: label || name,
    });
    this.elements.extraFilters.forEach(x => { x.setFilterListSelectOptionList() });
    this.#dispatchOnChange();
  }
  #gatherFiltersValue() {
    const slots = this.elements.filterSlot.assignedElements();
    const value: JBSearchbarValue = [];
    slots.forEach((slot) => {
      const namedElements = Array.from(slot.querySelectorAll("[name]")) as FilterElementDom[];
      const formElements: FilterElementDom[] = namedElements.filter((ne) => ne.value !== undefined && ((ne.constructor as any)?.formAssociated || 'form' in ne)) as FilterElementDom[];

      formElements.forEach((fe) => {
        value.push({
          name: fe.getAttribute("name") || fe.name,
          value: fe.value,
          label: extractLabel(fe),
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
