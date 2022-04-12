import { directoryFinder } from "../helpers/directoryFinder";
import fs from "fs";
import path from "path";
import { BaseApiTS, BaseApiJS } from "./OutputFiles/BaseApi";
import { ExtendedApiTS, ExtendedApiJS } from "./OutputFiles/ExtendedApi";
import chalk from "chalk";
import { uppercaseFirstLetter } from "../helpers/uppercaseFirstLetter";

export interface ApiGeneratorArguments {
  init: boolean;
  output: string;
  prefix: string;
  submodules: string[];
  crud: boolean;
  typescript: boolean;
}

const apiGenerator = async (argv: ApiGeneratorArguments) => {
  const outputPath = argv.output
    ? path.join(process.cwd(), argv.output)
    : await directoryFinder("\\api");
  if (outputPath.includes("api")) {
    if (argv.init) {
      const finalPath = path.join(
        outputPath,
        `BaseApi.${argv.typescript ? "ts" : "js"}`
      );
      fs.writeFileSync(
        finalPath,
        argv.typescript ? BaseApiTS(argv.prefix) : BaseApiJS(argv.prefix)
      );
      console.log(chalk.bold.green("Initialized BaseApi successfully!"));
    }
    argv.submodules?.forEach((submodule) => {
      const moduleNameLowercase = submodule.toLowerCase();
      const moduleName = uppercaseFirstLetter(moduleNameLowercase);
      const finalPath = path.join(outputPath, moduleName + "Api");
      fs.mkdirSync(finalPath, { recursive: true });
      fs.writeFileSync(
        path.join(
          finalPath,
          `${moduleName}Api.${argv.typescript ? "ts" : "js"}`
        ),
        argv.typescript
          ? ExtendedApiTS(moduleName, argv.crud ?? false, argv.prefix ?? "")
          : ExtendedApiJS(moduleName, argv.crud ?? false, argv.prefix ?? "")
      );
      console.log(chalk.bold.green(`Generated ${moduleName}Api successfully!`));
    });
  } else {
    if (argv.init) {
      const finalPath = path.join(outputPath, "api");
      fs.mkdirSync(finalPath, { recursive: true });
      fs.writeFileSync(
        path.join(finalPath, `BaseApi.${argv.typescript ? "ts" : "js"}`),
        argv.typescript ? BaseApiTS(argv.prefix) : BaseApiJS(argv.prefix)
      );
      console.log(chalk.bold.green("Initialized BaseApi successfully!"));
    }
    argv.submodules?.forEach((submodule) => {
      const moduleNameLowercase = submodule.toLowerCase();
      const moduleName = uppercaseFirstLetter(moduleNameLowercase);
      const finalPath = path.join(outputPath, "api", moduleName + "Api");
      fs.mkdirSync(finalPath, { recursive: true });
      fs.writeFileSync(
        path.join(
          finalPath,
          `${moduleName}Api.${argv.typescript ? "ts" : "js"}`
        ),
        argv.typescript
          ? ExtendedApiTS(moduleName, argv.crud ?? false, argv.prefix ?? "")
          : ExtendedApiJS(moduleName, argv.crud ?? false, argv.prefix ?? "")
      );
      console.log(chalk.bold.green(`Generated ${moduleName}Api successfully!`));
    });
  }
};

export { apiGenerator };
