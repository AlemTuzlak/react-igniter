export const DefaultConfig = {
  version: "1.1.2",
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
  form: {
    withContext: false,
    withValidation: true,
    type: "typescript",
    validationMode: "onSubmit", // "onSubmit", "onChange", "onBlur", "all", "onTouched"
    revalidationMode: "onChange", // "onChange", "onBlur", "onSubmit"
    exportType: "named", // "named" , "default"
    includeIndex: true,
  },
};

export type DefaultConfigType = typeof DefaultConfig;
