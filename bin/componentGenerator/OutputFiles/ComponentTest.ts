export const ComponentTestFile = (
  name: string,
  exportType: string = "named"
) => {
  const ComponentTest = [
    `// If your tests fail make sure to include jest-dom in your tests setup: https://github.com/testing-library/jest-dom`,
    `import React from 'react';`,
    `import { render } from '@testing-library/react';`,
    `import ${
      exportType === "named" ? `{ ${name} }` : `${name}`
    } from './${name}';`,
    ``,
    `describe('${name}', () => {`,
    `  it('renders', () => {`,
    `    render(<${name} />);`,
    `  });`,
    `});`,
  ];
  return ComponentTest.join("\n");
};
