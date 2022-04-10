#! /usr/bin/env node
import yargs from "yargs";
import { apiGenerator } from "./apiGenerator/apiGenerator";
import { componentGenerator } from "./componentGenerator/componentGenerator";
//import { formGenerator } from "./formGenerator/formGenerator";
import { routeGenerator } from "./routeGenerator/routeGenerator";
import inquirer from "inquirer";
import inquirerFileTreeSelection from "inquirer-file-tree-selection-prompt";
import chalkAnimation from "chalk-animation";
import { sleep } from "./helpers/sleep";
import { getPackageJson } from "./helpers/getPackageJson";
import { installDependency } from "./helpers/installDependency";
yargs
  .scriptName("react-igniter")
  /*   .command(
    "api <submodules..>",
    "Creates an API in the current project.",
    (yargs) => {
      yargs
        .option("i", {
          alias: "init",
          type: "boolean",
          describe: "Creates BaseApi instance to be extended by submodules.",
        })
        .option("o", {
          alias: "output",
          type: "string",
          describe: "Output path for the API.",
        })
        .option("wc", {
          alias: "crud",
          type: "boolean",
          describe: "Creates CRUD actions inside of submodules.",
        });
      option("t", {
        alias: "typescript",
        type: "boolean",
        describe: "Creates typescript files.",
      }).option("p", {
        alias: "prefix",
        type: "string",
        describe: "Base API prefix for the backend endpoints",
        default: "/",
      });
    },
    (argv) => {
      apiGenerator(argv);
    }
  )
  .command(
    "form <fields..>",
    "Creates a Form component in the current directory",
    (yargs) => {
      yargs.option("n", {
        alias: "name",
        type: "string",
        describe: "Name of the Form component",
        demandOption: true,
      });
    },
    (argv) => {
      formGenerator(argv);
    }
  )
  .command(
    "router <routes..>",
    "Create a router in the current directory",
    (yargs) => {
      yargs
        .option("n", {
          alias: "name",
          type: "string",
          describe: "Sets the router name",
        })
        .option("t", {
          alias: "withTabs",
          type: "boolean",
          describe: "Creates tabs alongside the router",
        })
        .option("m", {
          alias: "main",
          type: "boolean",
          describe: "Creates main application router",
        })
        .option("ver", {
          choices: ["v5", "v6"],
          type: "string",
          describe:
            "Outputs compatible router version for the react-router-dom package",
          default: "v6",
        })
        .option("ts", {
          alias: "typescript",
          type: "boolean",
          describe: "Creates a typescript router",
        });
    },
    (argv) => {
      routeGenerator(argv);
    }
  )
  .command(
    "component <name>",
    "Creates a react component in the current directory",
    (yargs) => {
      yargs
        .option("ts", {
          alias: "typescript",
          type: "boolean",
          describe: "Creates a typescript component",
        })
        .option("s", {
          alias: "style",
          type: "string",
          options: ["css", "scss", "styled-components", "none"],
          default: "none",
          describe: "Creates a styling module for the component",
        })
        .option("o", {
          alias: "output",
          type: "string",
          describe: "Output file for the generated files",
        });
    },
    (argv) => componentGenerator(argv)
  ) */
  .command(
    "$0",
    "Run react-igniter to get started",
    (yargs) => {},
    async (argv) => {
      console.clear();
      const title = chalkAnimation.karaoke(
        "Welcome to the React Igniter!\n",
        3.6
      );
      await sleep(1000);
      title.stop();

      inquirer.registerPrompt("file-tree-selection", inquirerFileTreeSelection);
      const { action } = await inquirer.prompt([
        {
          type: "list",
          name: "action",
          message: "What do you want to do?",
          default: "component",
          choices: [
            { name: "1. Create a component", value: "component" },
            { name: "2. Create a router", value: "router" },
            { name: "3. Create an api", value: "api" },
          ],
        },
      ]);
      if (action === "component") {
        const answers = await inquirer.prompt([
          {
            type: "input",
            message: "What is the name of the component?",
            name: "name",
            validate: (value) => {
              return value !== "" ? true : "You must provide a name";
            },
          },
          {
            type: "list",
            name: "test",
            message: "Do you want to create a test file?",
            choices: [
              { name: "Yes", value: true },
              { name: "No", value: false },
            ],
          },
          {
            type: "list",
            name: "typescript",
            default: false,
            message:
              "Do you want to create a typescript or javascript component?",
            choices: [
              { name: "typescript", value: true },
              { name: "javascript", value: false },
            ],
          },
          {
            type: "list",
            name: "style",
            message: "Choose a styling module for the component:",
            choices: ["css", "scss", "styled-components", "none"],
            default: "none",
          },
          {
            type: "file-tree-selection",
            name: "output",
            message: "Select output directory.",
            root: process.cwd(),
            onlyShowDir: true,
          },
        ]);
        argv.test = answers.test;
        argv.t = answers.test;
        argv.name = answers.name;
        argv.s = answers.style;
        argv.style = answers.style;
        argv.ts = answers.typescript;
        argv.typescript = answers.typescript;
        argv.output = answers.output.replace(process.cwd(), "");
        argv.o = answers.output.replace(process.cwd(), "");
        componentGenerator(argv);
      }
      if (action === "api") {
        try {
          await installDependency("axios");
        } catch (err) {
          return;
        }

        const answers = await inquirer.prompt([
          {
            type: "list",
            name: "init",
            message:
              "Do you want to initialize a base API instance [Required for the submodules]?",
            default: true,
            choices: [
              { name: "Yes", value: true },
              { name: "No", value: false },
            ],
          },
          {
            type: "list",
            name: "typescript",
            default: false,
            message:
              "Do you want to generate typescript or javascript modules?",
            choices: [
              { name: "typescript", value: true },
              { name: "javascript", value: false },
            ],
          },
          {
            type: "input",
            name: "prefix",
            message: "What is the base API prefix?",
            when: (answers) => answers.init,
            default: "/",
          },
          {
            type: "input",
            name: "submodules",
            message:
              "What are the names of API submodules you want to create? [Separate with space]",
            validate: (value) => {
              return value !== ""
                ? true
                : "You must provide a name of at least 1 submodule";
            },
          },
          {
            type: "list",
            name: "crud",
            message: "Do you want to create CRUD actions for the submodules?",
            default: false,
            choices: [
              { name: "Yes", value: true },
              { name: "No", value: false },
            ],
          },
          {
            type: "file-tree-selection",
            name: "output",
            message: "Select output directory.",
            root: process.cwd(),
            onlyShowDir: true,
          },
        ]);
        argv.i = answers.init;
        argv.init = answers.init;
        argv.o = answers.output.replace(process.cwd(), "");
        argv.output = answers.output.replace(process.cwd(), "");
        argv.wc = answers.crud;
        argv.crud = answers.crud;
        argv.p = answers.prefix;
        argv.prefix = answers.prefix;
        argv.submodules = answers.submodules.trim().split(" ");
        argv.t = answers.typescript;
        argv.typescript = answers.typescript;
        apiGenerator(argv);
      }
      if (action === "router") {
        let version = "";
        try {
          const packageJson = await getPackageJson();
          const reactRouterDomVersion =
            packageJson.dependencies["react-router-dom"];
          if (reactRouterDomVersion === "latest") {
            version = "v6";
          } else {
            const [major] = reactRouterDomVersion.split(".");
            version = `v${major.replace("^", "")}`;
          }
        } catch (err) {}
        if (!version) {
          try {
            await installDependency(
              "react-router-dom",
              "npm i react-router react-router-dom"
            );
            version = "v6";
          } catch (err) {
            return;
          }
        }

        const answers = await inquirer.prompt([
          {
            type: "input",
            name: "name",
            message: "Name of the router file",
            default: "index",
            validate: (value) => {
              return value !== "" ? true : "You must at least 1 character name";
            },
          },
          {
            type: "list",
            name: "main",
            message: "Are you creating a main project router or a sub-router?",
            default: false,
            choices: [
              { name: "Main", value: true },
              { name: "Sub-router", value: false },
            ],
          },
          {
            type: "list",
            name: "typescript",
            default: false,
            message:
              "Do you want to generate a typescript or javascript router?",
            choices: [
              { name: "typescript", value: true },
              { name: "javascript", value: false },
            ],
          },

          {
            type: "input",
            name: "routes",
            message:
              "What are the paths of the routes you want to create? [Separate with space]",
            validate: (value) => {
              return value !== ""
                ? true
                : "You must provide a name of at least 1 route";
            },
          },
          {
            type: "list",
            name: "withTabs",
            message: "Do you want to create Tabs in the router?",
            default: false,
            choices: [
              { name: "Yes", value: true },
              { name: "No", value: false },
            ],
          },

          {
            type: "file-tree-selection",
            name: "output",
            message: "Select output directory.",
            root: process.cwd(),
            onlyShowDir: true,
          },
        ]);
        argv.routes = answers.routes.trim().split(" ");
        argv.ts = answers.typescript;
        argv.typescript = answers.typescript;
        argv.name = answers.name;
        argv.n = answers.name;
        argv.withTabs = answers.withTabs;
        argv.t = answers.withTabs;
        argv.main = answers.main;
        argv.m = answers.main;
        argv.ver = version;
        argv.o = answers.output.replace(process.cwd(), "");
        argv.output = answers.output.replace(process.cwd(), "");
        routeGenerator(argv);
      }
    }
  )
  .help().argv;
