import { StylingOptions } from "../componentGenerator";

const ComponentFile = (
  name: string,
  typescript: boolean,
  styling: string,
  exportType: string = "named",
  translations: boolean = false
) => {
  const generateStylingImport = (styling: string) => {
    switch (styling) {
      case StylingOptions.CSS:
        return `import './${name}.css'`;
      case StylingOptions.SCSS:
        return `import './${name}.scss'`;
      case StylingOptions.STYLED:
        return `import styled from 'styled-components'`;
      case StylingOptions.NONE:
        return "";
      default:
        return "";
    }
  };
  const generateStyledComponent = (styling: string) => {
    switch (styling) {
      case StylingOptions.CSS || StylingOptions.SCSS:
        return [`    <div className="${name}">`, `    </div>`];
      case StylingOptions.STYLED:
        return [`    <Styled${name}>`, `    </Styled${name}>`];
      case StylingOptions.NONE:
        return [`    <>`, `    </>`];
      default:
        return [`    <>`, `    </>`];
    }
  };

  const Component = [
    `import React from 'react';`,
    ...(translations
      ? ["import { useTranslation } from 'react-i18next';"]
      : []),
    `${generateStylingImport(styling)}`,
    "",
    ...(typescript ? [`interface ${name}Props {`, `  `, `}`, ``] : []),
    `const ${name} = ({}${typescript ? `: ${name}Props` : ""}) => {`,
    ...(translations ? ["  const { t } = useTranslation();"] : []),
    `  return (`,
    ...generateStyledComponent(styling),
    `  );`,
    `}`,
    ``,
    ...(StylingOptions.STYLED === styling
      ? [
          `const Styled${name} = styled.div\``,
          `  /** Styling here */`,
          `\`;`,
          ``,
        ]
      : []),
    `export ${exportType === "named" ? `{ ${name} }` : `default ${name}`};`,
    ``,
  ];
  return Component.join("\n");
};
export { ComponentFile };
