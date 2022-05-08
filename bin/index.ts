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
import { formInquirer } from "./formGenerator/formInquirer";

yargs
  .scriptName("rig")
  .command(
    "component [name]",
    "Generate a new component",
    (yargs) => {
      yargs.option("i", {
        alias: "ignore-config",
        describe: "Ignore config file",
        type: "boolean",
        default: false,
      });
    },
    async (argv) => {
      let config: DefaultConfigType | undefined;
      try {
        config = await getConfigFile();
      } catch (err) {}
      await componentInquirer(
        argv.i ? undefined : config,
        argv.name as string | undefined
      );
    }
  )
  .command(
    "router",
    "Generate a router",
    (yargs) => {
      yargs.option("i", {
        alias: "ignore-config",
        describe: "Ignore config file",
        type: "boolean",
        default: false,
      });
    },
    async (argv) => {
      let config: DefaultConfigType | undefined;
      try {
        config = await getConfigFile();
      } catch (err) {}
      await routeInquirer(argv.i ? undefined : config);
    }
  )
  .command(
    "api",
    "Generate an api",
    (yargs) => {
      yargs.option("i", {
        alias: "ignore-config",
        describe: "Ignore config file",
        type: "boolean",
        default: false,
      });
    },
    async (argv) => {
      let config: DefaultConfigType | undefined;
      try {
        config = await getConfigFile();
      } catch (err) {}
      await apiInquirer(argv.i ? undefined : config);
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
    (yargs) => {
      yargs.option("u", {
        alias: "update",
        desc: "Update the version of react-igniter",
        default: false,
        type: "boolean",
      });
      yargs.option("i", {
        alias: "ignore-config",
        describe: "Ignore config file",
        type: "boolean",
        default: false,
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
            { name: "4. Create Form", value: "form" },
            ...(config?.version !== DefaultConfig.version || !config
              ? [
                  {
                    name: config
                      ? "5. Update configuration"
                      : "5. Initialize configuration",
                    value: "config",
                  },
                ]
              : []),
          ],
        },
      ]);
      if (action === "component") {
        await componentInquirer(argv.i ? undefined : config);
      }
      if (action === "api") {
        await apiInquirer(argv.i ? undefined : config);
      }
      if (action === "router") {
        await routeInquirer(argv.i ? undefined : config);
      }
      if (action === "form") {
        await formInquirer(argv.i ? undefined : config);
      }
      if (action === "config") {
        await configGenerator(config);
      }
    }
  )
  .help().argv;
