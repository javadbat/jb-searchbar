import type { ReactComponentBuildConfig, WebComponentBuildConfig } from "../../tasks/build/builder/src/types.ts";

export const webComponentList: WebComponentBuildConfig[] = [
  {
    name: "jb-searchbar",
    path: "./lib/jb-searchbar.ts",
    outputPath: "./dist/jb-searchbar.js",
    external: ["jb-input", "jb-select", "jb-date-input"],
    umdName: "JBSearchbar",
    globals: {
      "jb-input": "JBInput",
      "jb-select": "JBSelect",
      "jb-date-input": "JBDateInput",
    },
  },
];
export const reactComponentList: ReactComponentBuildConfig[] = [
  {
    name: "jb-searchbar-react",
    path: "./react/lib/JBSearchbar.tsx",
    outputPath: "./react/dist/JBSearchbar.js",
    external: ["prop-types", "react", "jb-searchbar"],
    globals: {
      react: "React",
      "prop-types": "PropTypes",
      "jb-searchbar": "JBSearchbar",
    },
    umdName: "JBSearchbarReact",
    dir: "./react"
  },
];