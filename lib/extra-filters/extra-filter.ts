import type { Elements, ExtractDisplayValueCallback, FilterList, FilterOption, InputState, IntentColumn, SubmitEventDetail } from "./types";
import type { FilterElementDom } from "../types"
import { extractLabel } from "./utils";
import { JBOptionListWebComponent } from "jb-select";
import { renderHTML } from "./render";
import CSS from './extra-filter.css';
import VariablesCSS from './variables.css';
import type { JBSearchbarWebComponent } from "lib/jb-searchbar";
import { dictionary } from "./i18n";
import { i18n } from "jb-core/i18n";

export class JBExtraFilterWebComponent extends HTMLElement {
  #elements: Elements;
  #parentSearchbar: JBSearchbarWebComponent = null;
  #inputState: InputState = "SELECT_COLUMN";
  intentColumn: IntentColumn = {
    name: null,
    filterItem: null,
    value: null,
    valueString: null,
    label: null,
    active: false,
  };
  #extractDisplayValue: ExtractDisplayValueCallback | null;
  /**
   * @public
   * will convert filter element value to representable string value
   */
  get extractDisplayValue(): ExtractDisplayValueCallback {
    if (this.#extractDisplayValue) {
      return this.#extractDisplayValue;
    } else {
      return ({ name: _name, value }) => {
        return String(value)
      }
    }
  }
  set extractDisplayValue(value: ExtractDisplayValueCallback) {
    if (typeof value == "function") {
      this.#extractDisplayValue = value;
    }
  }
  get inputState() {
    return this.#inputState;
  }
  set inputState(value: InputState) {
    if (value == "SELECT_COLUMN") {
      this.#elements.filterSelect.value = null;
      this.#elements.intent.wrapper.classList.add("--hide");
      if (this.#elements.columnSelectOptionList.optionList.length) {
        this.#showColumnSelect();
        this.#elements.filterSelect.focus();
      }
    } else if (value == "FILL_VALUE") {
      this.#elements.intent.wrapper.classList.remove("--hide");
      this.#elements.intent.inputWrapper.innerHTML = "";
      this.#elements.filterSelect.parentElement?.classList.add("--hide");
    }
    this.#inputState = value;
  }
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open', delegatesFocus: true, slotAssignment: "named", serializable: true });

    const html = `<style> ${VariablesCSS} \n ${CSS}</style>\n${renderHTML()}`;
    const element = document.createElement("template");
    element.innerHTML = html;
    shadowRoot.appendChild(element.content.cloneNode(true));
    this.#elements = {
      filtersSlot: shadowRoot.querySelector('.filters-slot'),
      intent: {
        wrapper: shadowRoot.querySelector('.intent-wrapper'),
        inputWrapper: shadowRoot.querySelector('.intent-input-wrapper'),
        submit: shadowRoot.querySelector('.intent-submit-button'),
      },
      filterSelect: shadowRoot.querySelector('.filter-select'),
      columnSelectOptionList: shadowRoot.querySelector("#ColumnSelectOptionList")
    }
    this.#registerEventListener();
    this.#initColumnList();
  }
  connectedCallback() {
    this.#setSearchbar();
  }
  #registerEventListener() {
    this.#elements.filterSelect.addEventListener("change", this.#onFilterSelected.bind(this));
    this.#elements.intent.submit.addEventListener("click", this.#onIntentSubmitted.bind(this));
    this.#elements.filterSelect.addEventListener("init", () => {
      if (this.getAttribute("autofocus") === "") {
        this.#elements.filterSelect.focus();
      }
    });
  }
  static get observedAttributes() {
    return ["placeholder", "size"];
  }
  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    switch (name) {
      case "placeholder":
        this.#elements.filterSelect.setAttribute("placeholder", newValue);
        break;
      case "size":
        this.#elements.filterSelect.setAttribute("size", newValue);
    }
  }
  #onIntentSubmitted() {
    if (
      this.intentColumn.filterItem &&
      this.intentColumn.value &&
      this.intentColumn.valueString &&
      this.intentColumn.label &&
      this.intentColumn.active
    ) {
      this.#submitIntent();
      this.intentColumn.filterItem.parentDom.appendChild(this.intentColumn.filterItem.dom);
      this.inputState = "SELECT_COLUMN";
      this.intentColumn = {
        name: null,
        filterItem: null,
        value: null,
        valueString: null,
        label: null,
        active: false,
      };
      this.#elements.intent.submit.classList.remove("--active");
    }
  }
  #submitIntent() {
    const name = this.intentColumn.name;
    const value = this.intentColumn.value;
    const displayValue = this.intentColumn.valueString;
    const label = this.intentColumn.label;
    this.#dispatchSubmitEvent({
      value, label, displayValue, name
    })
  }
  #dispatchSubmitEvent(value: SubmitEventDetail<unknown>) {
    const event = new CustomEvent<SubmitEventDetail<unknown>>('intent-submit', { detail: value });
    this.dispatchEvent(event);
  }
  #onFilterSelected() {
    const filter = this.#elements.filterSelect.value
    this.intentColumn.name = filter.key;
    this.intentColumn.filterItem = this.#filterList.get(filter.key);
    this.inputState = "FILL_VALUE";
    const inputDom = this.#filterList.get(filter.key).dom
    this.#elements.intent.input = inputDom;
    this.#elements.intent.inputWrapper.appendChild(inputDom);
    const updateIntentValidity = async (showError: boolean) => {
      const result = await this.#elements.intent.input.validation.checkValidity({ showError: showError });
      if (result.isAllValid) {
        this.intentColumn.active = true;
        this.#elements.intent.submit.classList.add("--active");
        this.#elements.intent.submit.setAttribute("title", dictionary.get(i18n, "submitTitle"));
      } else {
        this.intentColumn.active = false;
        this.#elements.intent.submit.classList.remove("--active");
        this.#elements.intent.submit.setAttribute("title", this.#elements.intent.input.validation.resultSummary.message);
      }
    }
    const updateIntentValue = () => { this.#setIntentValue(this.#elements.intent.input.value, this.extractDisplayValue({ value: inputDom.value, name: filter.key, dom: inputDom }), extractLabel(inputDom)) }
    updateIntentValidity(false);
    // add event listeners
    inputDom.addEventListener("change", async () => {
      await updateIntentValidity(true);
      updateIntentValue();
    });
    inputDom.addEventListener("input", async (e: InputEvent) => {
      updateIntentValidity(false);
      updateIntentValue();
    });
    inputDom.addEventListener("enter", () => {
      updateIntentValue();
      this.#onIntentSubmitted();
    })
  }
  #setIntentValue(value: unknown, valueString: string, label: string) {
    this.intentColumn.value = value;
    this.intentColumn.label = label;
    this.intentColumn.valueString = valueString;
  }
  #handleNotDefinedWebComponents(elements: Element[]) {
    elements.forEach((element) => {
      if (element.tagName.includes("-")) {
        const webComponentClass = customElements.get(element.tagName.toLowerCase());
        if (webComponentClass == undefined) {
          customElements.whenDefined(element.tagName.toLowerCase()).then((definedConstructor) => {
            if ((definedConstructor as any).formAssociated) {
              this.updateSlotElements();
            }

          })
        }
      }
    })
  }
  //it's not observable so call update after change
  #filterList: FilterList = new Map();
  #filterElementAttributeObserver = new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.type == "attributes" && record.attributeName == "name") {
        if(record.oldValue == null && (record.target as FilterElementDom).name){
          // if element get proper name attribute (due to react delay or user late update)
          this.#addToList([record.target as FilterElementDom]);
        }
        //if element name change we update list base on new name
        const value = this.#filterList.get(record.oldValue);
        if (value) {
          this.#filterList.delete(record.oldValue)
          const newName = (record.target as FilterElementDom).name;
          // when new name is empty it just mean we need to remove the element (we only accept named elements) 
          if(newName){
            this.#filterList.set(newName, value);
          }
        }
      }
      if (record.type == "attributes" && (record.attributeName == "label" || "data-label")) {
        this.setFilterListSelectOptionList();
      }
    })
  })
  #initColumnList() {
    const filtersSlot = this.#elements.filtersSlot;
    filtersSlot.addEventListener('slotchange', this.updateSlotElements.bind(this));
    this.#filterElementAttributeObserver.observe(this, { attributeFilter: ["name", "label", "data-label"], attributeOldValue: true, childList: true, attributes: true, subtree: true, characterData: false })
    this.updateSlotElements();
  }
  #removeFromList(nodeList: Element[]) {
    const removeList = Array.from(this.#filterList).filter(x => nodeList.includes(x[1].dom));
    removeList.forEach((item) => {
      this.#filterList.delete(item[0]);
    })

  }
  #addToList(nodeList: Element[]) {
    const formElements = nodeList.filter((x => ((x.constructor as any)?.formAssociated || 'form' in x))) as FilterElementDom<unknown>[];
    const namedElements = formElements.filter(x=>(x as FilterElementDom).name);
    const noNamedElements = formElements.filter(x=>(x as FilterElementDom).name == '');
    this.#handleNotDefinedWebComponents(nodeList);
    namedElements.forEach((fe) => {
      this.#filterList.set(fe.name, { dom: fe, parentDom: fe.parentElement });
    });
    //most of the time elements that exist in searchbar but have no name will be named later. here we watch for them.
    noNamedElements.forEach(nne=>{this.#filterElementAttributeObserver.observe(nne,{attributeFilter:["name"],childList:false,subtree:false,attributes:true,attributeOldValue:true})})
  }
  #slotObserver = new MutationObserver((records) => {
    records.forEach((record) => {
      record.removedNodes.forEach((removedNode) => {
        if (removedNode.nodeType == 1) {
          this.#removeFromList([removedNode as Element])
        }
      })
      record.addedNodes.forEach((addedNode) => {
        if (addedNode.nodeType == 1) {
          this.#addToList([addedNode as Element])
        }
      })
      this.setFilterListSelectOptionList();
    })
  })
  /**
 * @public need to be accessed from outside for some scenario that list does not update
 */
  updateSlotElements() {
    const filtersElements = this.#elements.filtersSlot.assignedElements();
    this.#filterList.clear();
    this.#addToList(filtersElements);
    this.setFilterListSelectOptionList();
    this.#slotObserver.disconnect();
    this.#slotObserver.observe(this.#elements.filtersSlot, { subtree: false, childList: true })
  }
  setFilterListSelectOptionList() {

    const optionList: FilterOption[] = [];

    for (const f of this.#filterList) {
      const key = f[0];
      const filter = f[1];
      // check for max usage count
      const maxCount = filter.dom.dataset.maxCount ? Number(filter.dom.dataset.maxCount) : null;
      if (this.#parentSearchbar && maxCount) {
        const usedCount = this.#parentSearchbar.value.reduce((acc, x) => {
          return x.name === key ? acc + 1 : acc;
        }, 0);
        if (maxCount <= usedCount) continue;
      }

      optionList.push({
        label: extractLabel(filter.dom),
        key
      });
    }
    const setupSelect = () => {
      this.#elements.columnSelectOptionList.callbacks.getTitle = (column) => {
        return column.label;
      };
      this.#elements.columnSelectOptionList.optionList = optionList;
    }
    if (this.#elements.columnSelectOptionList instanceof JBOptionListWebComponent) {
      setupSelect();
    } else {
      (this.#elements.columnSelectOptionList as HTMLElement).addEventListener('init', () => setupSelect())
    }
  }
  #showColumnSelect() {
    this.#elements.filterSelect.parentElement?.classList.remove("--hide");
  }

  disconnectedCallback() {
    this.#slotObserver.disconnect();
    this.#filterElementAttributeObserver.disconnect();
  }
  #setSearchbar() {
    if (this.parentElement.tagName.toLowerCase() == "jb-searchbar") {
      this.#parentSearchbar = this.parentElement as JBSearchbarWebComponent
    }
  }
}

const myElementNotExists = !customElements.get("jb-extra-filter");
if (myElementNotExists) {
  window.customElements.define("jb-extra-filter", JBExtraFilterWebComponent);
}