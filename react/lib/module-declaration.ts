import type { JBSearchbarWebComponent, JBExtraFilterWebComponent, ExtractDisplayValueCallback } from "jb-searchbar";

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'jb-searchbar': JBSearchbarElement;
      'jb-extra-filter': JBExtraFilterElement;
    }
    interface JBSearchbarElement extends React.DetailedHTMLProps<React.HTMLAttributes<JBSearchbarWebComponent>, JBSearchbarWebComponent> {
    }
    interface JBExtraFilterElement extends React.DetailedHTMLProps<React.HTMLAttributes<JBExtraFilterWebComponent>, JBExtraFilterWebComponent> {
      placeholder?:string,
      extractDisplayValue:ExtractDisplayValueCallback
    }
  }
}
