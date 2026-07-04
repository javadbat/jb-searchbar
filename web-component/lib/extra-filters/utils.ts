import type { FilterElementDom } from "../types.js";

export function extractLabel(element: FilterElementDom): string {
  return element.getAttribute("label") || element.dataset.label || element.name;
}