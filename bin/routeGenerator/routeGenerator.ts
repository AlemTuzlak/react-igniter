import path from "path";
import fs from 'fs';
import { ArgumentsCamelCase } from "yargs";
import { RouterV5 } from "./GeneratorFiles/RouterV5";
import chalk from 'chalk'
import { RouterV6 } from "./GeneratorFiles/Routerv6";

interface ApiGeneratorArguments extends ArgumentsCamelCase {
  routes?: string[],
  n?: string,
  name?: string,
  t?: boolean,
  withTabs?: boolean,
  m?: boolean,
  main?: boolean,
  ver?: string,
  ts?: boolean,
  typescript?: boolean,
  o?: string,
  output?: string
}

const routeGenerator = async (argv: ApiGeneratorArguments) => {
  if(argv.ver && (argv.ver !== 'v5' && argv.ver !== 'v6')) {
    console.log(chalk.bold.red(`Invalid version. Must be v5 or v6`))
    return;
  }
  const outputPath = path.join(process.cwd(), argv.o??'', (argv.name??'Router') + `.router.${argv.ts ? 'tsx' : 'jsx'}`);
  fs.writeFileSync(outputPath, argv.ver === 'v6' ? RouterV6(argv.routes!, argv.name, argv.withTabs, argv.main) : RouterV5(argv.routes!,argv.name, argv.withTabs, argv.main, argv.ts))
  console.log(chalk.bold.green('Router generated successfully!'))
}

export { routeGenerator }