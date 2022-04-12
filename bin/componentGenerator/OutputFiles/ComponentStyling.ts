export const ComponentStyling = (name: string) => {
  return [
    `.${name} {`,
    `  /** your styling here */`,
    `}`,
  ].join('\n')
}