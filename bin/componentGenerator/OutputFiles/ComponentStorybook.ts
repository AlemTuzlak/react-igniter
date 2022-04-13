export const ComponentStorybook = (
  name: string,
  typescript: boolean,
  exportType: string = "named"
) => {
  return [
    `import React from 'react';`,
    ``,
    ...(typescript
      ? [`import { ComponentStory, ComponentMeta } from '@storybook/react';`]
      : []),
    `import ${
      exportType === "named" ? `{ ${name} }` : `${name}`
    } from './${name}';`,
    ``,
    `export default {`,
    `  title: '${name}',`,
    `  component: ${name},`,
    `} ${typescript ? `as ComponentMeta<typeof ${name}>;` : ""};`,
    ``,
    `export const ${name}Story${
      typescript ? `: ComponentStory<typeof ${name}>` : ""
    } = () => <${name} />;`,
    ``,
  ].join("\n");
};
