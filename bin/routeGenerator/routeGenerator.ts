import path from "path";
import fs from "fs";
import chalk from "chalk";

import { RouterV5 } from "./GeneratorFiles/RouterV5";
import { RouterV6 } from "./GeneratorFiles/Routerv6";

export interface RouterGeneratorArguments {
  routes: string[];
  name: string;
  withTabs: boolean;
  main: boolean;
  ver: string;
  typescript: boolean;
  output: string;
}

const routeGenerator = async (argv: RouterGeneratorArguments) => {
  if (argv.ver && argv.ver !== "v5" && argv.ver !== "v6") {
    console.log(chalk.bold.red(`Invalid version. Must be v5 or v6`));
    return;
  }
  const outputPath = path.join(
    process.cwd(),
    argv.output ?? "",
    (argv.name ?? "Router") + `.router.${argv.typescript ? "tsx" : "jsx"}`
  );
  fs.writeFileSync(
    outputPath,
    argv.ver === "v6"
      ? RouterV6(argv.routes!, argv.name, argv.withTabs, argv.main)
      : RouterV5(
          argv.routes!,
          argv.name,
          argv.withTabs,
          argv.main,
          argv.typescript
        )
  );
  console.log(chalk.bold.green("Router generated successfully!"));
};

export { routeGenerator };
