export const DefaultConfig = {
  version: "1.0.8",
  component: {
    type: "typescript",
    test: true,
    style: "none", // "css", "scss", "styled-components", "none"
    storybook: false,
    exportType: "named", // "named" , "default"
    includeIndex: true,
    translations: false,
  },
  api: {
    type: "typescript",
    init: true,
    crud: true,
    prefix: "",
  },
  router: {
    main: true,
    type: "typescript",
    withTabs: false,
  },
};

export type DefaultConfigType = typeof DefaultConfig;
