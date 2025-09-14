import type { ReactComponentBuildConfig, WebComponentBuildConfig } from "../../tasks/build/builder/src/types.ts";

export const webComponentList: WebComponentBuildConfig[] = [
  {
    name: "jb-searchbar",
    path: "./lib/jb-searchbar.ts",
    outputPath: "./dist/jb-searchbar.js",
    external: ["jb-input", "jb-select", "jb-date-input", "jb-core", "jb-core/theme"],
    umdName: "JBSearchbar",
    globals: {
      "jb-input": "JBInput",
      "jb-select": "JBSelect",
      "jb-date-input": "JBDateInput",
      "jb-core":"JBCore",
      "jb-core/theme":"JBCoreTheme",

    },
  },
];
export const reactComponentList: ReactComponentBuildConfig[] = [
  {
    name: "jb-searchbar-react",
    path: "./react/lib/JBSearchbar.tsx",
    outputPath: "./react/dist/JBSearchbar.js",
    external: ["prop-types", "react", "jb-searchbar", "jb-core", "jb-core/react"],
    globals: {
      react: "React",
      "prop-types": "PropTypes",
      "jb-searchbar": "JBSearchbar",
      "jb-core":"JBCore",
      "jb-core/react":"JBCoreReact"
    },
    umdName: "JBSearchbarReact",
    dir: "./react"
  },
];