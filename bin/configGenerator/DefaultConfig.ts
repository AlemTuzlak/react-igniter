export const DefaultConfig = {
  version: "1.0.2",
  component: {
    type: "typescript",
    test: true,
    style: "none", // "css", "scss", "styled-components", "none"
    storybook: false,
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
