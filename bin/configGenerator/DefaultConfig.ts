export const DefaultConfig = {
  version: "1.1.5",
  component: {
    type: "typescript",
    test: true,
    style: "none", // "css", "scss", "styled-components", "none"
    storybook: false,
    exportType: "named", // "named" , "default"
    includeIndex: true,
    translations: false,
    rootDir: "",
    disabled: false,
  },
  api: {
    type: "typescript",
    init: true,
    crud: true,
    prefix: "",
    rootDir: "",
    disabled: false,
  },
  router: {
    main: true,
    type: "typescript",
    withTabs: false,
    rootDir: "",
    disabled: false,
  },
  form: {
    withContext: false,
    withValidation: true,
    type: "typescript",
    validationMode: "onSubmit", // "onSubmit", "onChange", "onBlur", "all", "onTouched"
    revalidationMode: "onChange", // "onChange", "onBlur", "onSubmit"
    exportType: "named", // "named" , "default"
    includeIndex: true,
    rootDir: "",
    disabled: false,
    validationType: "default", // "default", "yup"
  },
};

export type DefaultConfigType = typeof DefaultConfig;
