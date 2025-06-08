import CSS from "./jb-searchbar.scss";
import { InputFactory } from "./InputFactory";
import { JBOptionListWebComponent, JBSelectWebComponent } from "jb-select";
import {
  FilterColumn,
  InputState,
  IntentColumn,
  JBSearchbarElements,
  FilterItem,
  SpliceArgs,
  JBSearchbarValue,
} from "./types.js";
import {registerDefaultVariables} from 'jb-core/theme';
import { renderHTML } from "./render";

export * from './types.js';
export class JBSearchbarWebComponent extends HTMLElement {
  #isLoading = false;
  #inputState: InputState = "SELECT_COLUMN";
  #columnList: FilterColumn[] = [];
  #inputFactory: InputFactory = new InputFactory();
  intentColumn: IntentColumn = {
    column: null,
    value: null,
    valueString: null,
    label: null,
    active: false,
  };
  elements!: JBSearchbarElements;
  filterList: FilterItem[] = [];
  get isLoading() {
    return this.#isLoading;
  }
  set isLoading(value) {
    if (!this.#isLoading && value) {
      this.playSearchIconAnimation();
    }
    this.#isLoading = value;
  }
  get inputState() {
    return this.#inputState;
  }
  set inputState(value: InputState) {
    if (value == "SELECT_COLUMN") {
      this.elements.columnSelect.value = null;
      this.elements.intent.wrapper.classList.add("--hide");
      if (this.elements.columnSelectOptionList.optionList.length) {
        this.#showColumnSelect();
        this.elements.columnSelect.focus();
      }
    } else if (value == "FILL_VALUE") {
      this.elements.intent.wrapper.classList.remove("--hide");
      this.elements.intent.input.wrapper.innerHTML = "";
      this.elements.columnSelect.parentElement?.classList.add("--hide");
    }
    this.#inputState = value;
  }
  get value(): JBSearchbarValue {
    return this.filterList.map((x) => ({ column: x.column, value: x.value }));
  }
  get columnList() {
    return this.#columnList;
  }
  set columnList(value: FilterColumn[]) {
    //TODO: check validation of column to be array ind has necessary prop
    this.setColumnList(value);
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
    this.initWebComponent();
  }
  registerEventListener() {
    this.elements.columnSelect.addEventListener(
      "change",
      this.onColumnSelected.bind(this)
    );
    this.elements.intent.submitButton.addEventListener(
      "click",
      this.onIntentSubmitted.bind(this)
    );
    this.elements.columnSelect.addEventListener("init", () => {
      this.elements.columnSelect.focus();
    });
    this.elements.searchButton.wrapper.addEventListener(
      "click",
      this.search.bind(this)
    );
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
              if (
                this.elements.columnSelectOptionList.optionList.length &&
                this.inputState == "SELECT_COLUMN"
              ) {
                this.#showColumnSelect();
              }
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
          if (parseInt(property) == target.length) {
            //when push
            const dom = this.createFilterDOM(value.valueString, value.label);
            value.dom = dom;
            this.elements.filterListWrapper.appendChild(dom);
          }
          if (
            !Number.isNaN(Number(property)) &&
            parseInt(property) < target.length
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
  createFilterDOM(label: string, columnLabel: string) {
    const dom = document.createElement("div");
    dom.classList.add("filter-item");
    const deleteButtonDom = document.createElement("div");
    deleteButtonDom.classList.add("delete-btn");
    deleteButtonDom.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 298.667 298.667" style="enable-background:new 0 0 298.667 298.667;" xml:space="preserve"><g><polygon points="298.667,30.187 268.48,0 149.333,119.147 30.187,0 0,30.187 119.147,149.333 0,268.48 30.187,298.667     149.333,179.52 268.48,298.667 298.667,268.48 179.52,149.333   "/></g></svg>`;
    const labelDom = document.createElement("div");
    labelDom.classList.add("filter-label");
    labelDom.innerHTML = `${columnLabel}: ${label}`;
    const filterIndex = this.filterList.length;
    dom.dataset.filterIndex = filterIndex.toString();
    deleteButtonDom.addEventListener("click", (e) => {
      const currentTarget = e.currentTarget as HTMLDivElement;
      const filterIndex = parseInt(
        currentTarget!.parentElement!.dataset.filterIndex!
      );
      this.deleteFilter(filterIndex);
    });
    dom.appendChild(deleteButtonDom);
    dom.appendChild(labelDom);
    return dom;
  }
  deleteFilter(filterIndex: number) {
    this.filterList.splice(filterIndex, 1);
    this.triggerOnChange();
    this.setColumnListSelectOptionList();
  }
  connectedCallback() {
    // standard web component event that called when all of dom is binded
    this.callOnLoadEvent();
    this.initProp();
  }
  callOnLoadEvent() {
    const event = new CustomEvent("load", { bubbles: true, composed: true });
    this.dispatchEvent(event);
  }
  initWebComponent() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    registerDefaultVariables();
    const html = `<style>${CSS}</style>` + "\n" + renderHTML();
    const element = document.createElement("template");
    element.innerHTML = html;
    shadowRoot.appendChild(element.content.cloneNode(true));
    this.elements = {
      filterListWrapper: shadowRoot.querySelector(".filter-list-section") as HTMLDivElement,
      searchButton: {wrapper: shadowRoot.querySelector(".search-button-wrapper") as HTMLDivElement,
        svg: {
          spinnerLine: shadowRoot.querySelector(".search-button-wrapper .convertable-line") as SVGClipPathElement,
          spinnerBox: shadowRoot.querySelector(".search-button-wrapper .spin-line-group") as SVGGElement,
        },
      },
      columnSelect: shadowRoot.querySelector(".column-select") as JBSelectWebComponent,
      columnSelectOptionList: shadowRoot.querySelector("#ColumnSelectOptionList") as JBOptionListWebComponent<FilterColumn,FilterColumn>,
      intent: {column: shadowRoot.querySelector(".intent-wrapper .intent-column") as HTMLDivElement,
        input: {
          wrapper: shadowRoot.querySelector(
            ".intent-wrapper .intent-input-wrapper"
          ) as HTMLDivElement,
          input: null,
        },
        submitButton: shadowRoot.querySelector(
          ".intent-wrapper .intent-submit-button"
        ) as HTMLDivElement,
        wrapper: shadowRoot.querySelector(".intent-wrapper") as HTMLDivElement,
      },
    };
    this.registerEventListener();
  }
  static get observedAttributes() {
    return ["placeholder"];
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    // do something when an attribute has changed
    this.onAttributeChange(name, newValue);
  }
  onAttributeChange(name: string, value: string) {
    switch (name) {
      case "placeholder":
        this.elements.columnSelect.setAttribute("placeholder", value);
        break;
    }
  }
  setColumnList(columnList: FilterColumn[]) {
    this.#columnList = columnList;
    this.setColumnListSelectOptionList();
  }
  setColumnListSelectOptionList() {
    const currentFilterKeys = this.filterList.map((filter) => {
      return filter.column.key;
    });
    if (this.columnList) {
      const columnList = this.columnList.filter((column) => {
        const maxUsageCount = column.maxUsageCount || 1;
        const usedCount = currentFilterKeys.filter(
          (key) => key == column.key
        ).length;
        if (usedCount >= maxUsageCount) {
          return false;
        }
        return true;
      });
      this.elements.columnSelectOptionList.callbacks.getTitle = (column) => {
        return column.label;
      };
      this.elements.columnSelectOptionList.optionList = columnList;
    }
  }
  onColumnSelected(e: Event) {
    const target = e.target as JBSelectWebComponent;
    const column = target.value;
    this.intentColumn.column = column;
    this.inputState = "FILL_VALUE";
    this.elements.intent.column.innerHTML = column.label;
    const inputDom = this.createIntentInputDom(column);
    this.elements.intent.input.input = inputDom;
    this.elements.intent.input.wrapper.appendChild(inputDom);
  }
  createIntentInputDom(column: FilterColumn) {
    const setIntentActive = (value: boolean, err = "") => {
      this.intentColumn.active = value;
      if (value) {
        this.elements.intent.submitButton.classList.add("--active");
        this.elements.intent.submitButton.setAttribute("title", "ثبت فیلتر");
      } else {
        this.elements.intent.submitButton.classList.remove("--active");
        this.elements.intent.submitButton.setAttribute("title", err);
      }
    };
    const setIntentColumnValue = (
      value: any,
      valueString: string,
      label: string
    ) => {
      this.intentColumn.value = value;
      this.intentColumn.label = label;
      this.intentColumn.valueString = valueString;
    };
    switch (column.type) {
      case "TEXT":
        return this.#inputFactory.createTextInput({
          column: column,
          onIntentSubmitted: this.onIntentSubmitted.bind(this),
          setIntentActive: setIntentActive,
          setIntentColumnValue,
        });
      case "NUMBER":
        return this.#inputFactory.createNumberInput({
          column,
          onIntentSubmitted: this.onIntentSubmitted.bind(this),
          setIntentActive: setIntentActive,
          setIntentColumnValue,
        });
      case "SELECT":
        return this.#inputFactory.createSelectInput({
          column,
          onIntentSubmitted: this.onIntentSubmitted.bind(this),
          setIntentActive: setIntentActive,
          setIntentColumnValue,
        });
      case "DATE":
        return this.#inputFactory.createDateInput({
          column,
          onIntentSubmitted: this.onIntentSubmitted.bind(this),
          setIntentActive: setIntentActive,
          setIntentColumnValue,
        });
    }
  }
  onIntentSubmitted() {
    if (
      this.intentColumn.column &&
      this.intentColumn.value &&
      this.intentColumn.valueString &&
      this.intentColumn.label &&
      this.intentColumn.active
    ) {
      this.submitIntent(
        this.intentColumn.column,
        this.intentColumn.value,
        this.intentColumn.valueString,
        this.intentColumn.label
      );
      this.inputState = "SELECT_COLUMN";
      this.intentColumn = {
        column: null,
        value: null,
        valueString: null,
        label: null,
        active: false,
      };
      this.elements.intent.submitButton.classList.remove("--active");
    }
  }
  submitIntent(
    column: FilterColumn,
    value: any,
    valueString: string,
    label: string
  ) {
    this.filterList.push({
      column,
      valueString,
      value,
      label,
    });
    this.setColumnListSelectOptionList();
    this.triggerOnChange();
  }
  playSearchIconAnimation() {
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
  triggerOnChange() {
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
  #showColumnSelect() {
    this.elements.columnSelect.parentElement?.classList.remove("--hide");
  }
}
const myElementNotExists = !customElements.get("jb-searchbar");
if (myElementNotExists) {
  window.customElements.define("jb-searchbar", JBSearchbarWebComponent);
}
