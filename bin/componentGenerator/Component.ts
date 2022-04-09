import { StylingOptions } from "./componentGenerator"

const ComponentFile = (name: string, typescript: boolean, styling: string) => {
  const generateStylingImport = (styling: string) => {
    switch (styling) {
      case StylingOptions.CSS: 
        return `import './${name}.css'`
      case StylingOptions.SCSS: 
        return `import './${name}.scss'`
      case StylingOptions.STYLED: 
        return `import styled from 'styled-components'`
      case StylingOptions.NONE:
        return ''
      default: return '';
    }
   }
   const generateStyledComponent = (styling: string) => { 
     switch (styling) {
      case StylingOptions.CSS || StylingOptions.SCSS: 
      return [
        `    <div className="${name}">`,
        `    </div>`,
      ]
      case StylingOptions.STYLED: 
        return [
          `    <Styled${name}>`,
          `    </Styled${name}>`,
        ]
      case StylingOptions.NONE:
        return [
          `    <>`,
          `    </>`,
        ]
      default: return [
        `    <>`,
        `    </>`,
      ]
     }
   }

  const Component = [
    `import React${typescript ? `, { FC }` : ''} from 'react';`,
    `${generateStylingImport(styling)}`,
    '',
    ...(typescript ? [`interface ${name}Props {`, `  `, `}`, ``] : []),
    `const ${name}${typescript ? `: FC<${name}Props>` : ``} = () => {`,
    `  return (`,
    ...generateStyledComponent(styling),
    `  );`,
    `}`,
    ``,
    ...(StylingOptions.STYLED === styling ? [`const Styled${name} = styled.div\``, `  /** Styling here */`, `\`;`, ``] : []),
    `export { ${name} };`,
    ``
  ]
  return Component.join('\n')
}
export { ComponentFile }