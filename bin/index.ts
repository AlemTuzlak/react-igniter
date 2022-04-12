#! /usr/bin/env node
import yargs from "yargs";
import { getConfigFile } from "./helpers/getConfigFile";
import chalk from "chalk";
import {
  DefaultConfig,
  DefaultConfigType,
} from "./configGenerator/DefaultConfig";
import { componentInquirer } from "./componentGenerator/componentInquirer";
import { apiInquirer } from "./apiGenerator/apiInquirer";
import { routeInquirer } from "./routeGenerator/routeInquirer";
import { configGenerator } from "./configGenerator/configGenerator";
import { inquirer } from "./helpers/inquirerInstance";

yargs
  .scriptName("rig")
  .command(
    "$0",
    "Run rig to get started",
    (_) => {},
    async () => {
      console.clear();
      console.log(
        chalk.underline.whiteBright.bold(`|  Welcome to React-igniter  |\n`)
      );
      let config: DefaultConfigType | undefined;
      try {
        config = await getConfigFile();
      } catch (err) {}

      const { action } = await inquirer.prompt([
        {
          type: "list",
          name: "action",
          message: "What do you want to do?",
          default: "component",
          choices: [
            { name: "1. Create Component", value: "component" },
            { name: "2. Create Router", value: "router" },
            { name: "3. Create Api(s)", value: "api" },
            ...(config?.version !== DefaultConfig.version || !config
              ? [
                  {
                    name: config
                      ? "4. Update configuration"
                      : "4. Initialize configuration",
                    value: "config",
                  },
                ]
              : []),
          ],
        },
      ]);
      if (action === "component") {
        await componentInquirer(config);
      }
      if (action === "api") {
        await apiInquirer(config);
      }
      if (action === "router") {
        await routeInquirer(config);
      }
      if (action === "config") {
        await configGenerator(config);
      }
    }
  )
  .help().argv;
