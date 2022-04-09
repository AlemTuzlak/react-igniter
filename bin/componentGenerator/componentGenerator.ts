import { ArgumentsCamelCase } from "yargs";
import fs from 'fs'
import path from 'path';
import chalk from "chalk";
import { ComponentFile } from "./Component";
import { ComponentTestFile } from "./ComponentTest";
import { ComponentStyling } from "./ComponentStyling";
import { uppercaseFirstLetter } from "../helpers/uppercaseFirstLetter";
export enum StylingOptions  {
  CSS = 'css',
  SCSS = 'scss',
  STYLED = 'styled-components',
  NONE = 'none'
}
interface ComponentGeneratorArguments extends ArgumentsCamelCase {
  name?: string
  ts?: boolean
  typescript?: boolean,
  s?: string,
  style?: string,
  o?: string,
  output?: string,
  t?: boolean,
  test?: boolean
}
const componentGenerator = async (argv: ComponentGeneratorArguments) => {
  if (argv.s && !Object.values<string>(StylingOptions).includes(argv.s)) {
    console.log(chalk.bold.red(`Invalid styling option!`))
    console.log(chalk.bold.red(`Available options are css | scss | styled-components | none`))
    return;
  }
  if(argv.name) {
    const name =  uppercaseFirstLetter(argv.name);
    const outputPath = path.join(process.cwd(), argv.o??'', name)
    
    fs.mkdirSync(outputPath, { recursive: true })
    fs.writeFileSync(path.join(outputPath, `${name}.${argv.ts ? 'tsx' : 'jsx'}`), ComponentFile(name, argv.ts??false, argv.style??StylingOptions.NONE))
    if(argv.t) {
      fs.writeFileSync(path.join(outputPath, `${name}.test.${argv.ts ? 'tsx' : 'jsx'}`), ComponentTestFile(name))
    }
    fs.writeFileSync(path.join(outputPath, `index.${argv.ts ? 'tsx' : 'jsx'}`), `export { ${name} } from './${name}';\n`)	
    if(argv.style && (argv.style === StylingOptions.CSS || argv.style === StylingOptions.SCSS)) {
      fs.writeFileSync(path.join(outputPath, `${name}.${argv.style}`), ComponentStyling(name))	
    }
    console.log(chalk.bold.green(`Generated ${name} component folder successfully!`))
  }
}

export { componentGenerator }