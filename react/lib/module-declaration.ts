import type { JBSearchbarWebComponent } from "jb-searchbar";

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'jb-searchbar': JBSearchbarType;
    }
    interface JBSearchbarType extends React.DetailedHTMLProps<React.HTMLAttributes<JBSearchbarWebComponent>, JBSearchbarWebComponent> {
      "class"?: string,
      "type"?: string,
      "placeholder"?:string,
    }
  }
}
