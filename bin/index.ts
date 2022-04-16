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
import { versionUpdater } from "./helpers/versionUpdater";
yargs
  .scriptName("rig")
  .command(
    "component [name]",
    "Generate a new component",
    () => {},
    async (argv) => {
      let config: DefaultConfigType | undefined;
      try {
        config = await getConfigFile();
      } catch (err) {}
      console.log(argv);
      await componentInquirer(config, argv.name as string | undefined);
    }
  )
  .command(
    "router",
    "Generate a router",
    () => {},
    async () => {
      let config: DefaultConfigType | undefined;
      try {
        config = await getConfigFile();
      } catch (err) {}
      await routeInquirer(config);
    }
  )
  .command(
    "api",
    "Generate an api",
    () => {},
    async () => {
      let config: DefaultConfigType | undefined;
      try {
        config = await getConfigFile();
      } catch (err) {}
      await apiInquirer(config);
    }
  )
  .command(
    "config",
    "Generate react-igniter configuration",
    () => {},
    async () => {
      let config: DefaultConfigType | undefined;
      try {
        config = await getConfigFile();
      } catch (err) {}
      if (config?.version !== DefaultConfig.version || !config) {
        await configGenerator(config);
      } else {
        console.log(
          chalk.greenBright(
            "\nYou have the latest version of react-igniter configuration file.\n "
          )
        );
      }
    }
  )
  .command(
    "$0",
    "Gets the list of all the commands",
    (argv) => {
      argv.option("u", {
        alias: "update",
        desc: "Update the version of react-igniter",
        default: false,
        type: "boolean",
      });
    },
    async (argv) => {
      console.clear();
      console.log(
        chalk.underline.whiteBright.bold(`|  Welcome to React-igniter  |\n`)
      );
      let config: DefaultConfigType | undefined;
      try {
        config = await getConfigFile();
      } catch (err) {}

      if (argv.u) {
        const forceExit = await versionUpdater();
        if (forceExit) {
          process.exit(0);
        }
      }
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
