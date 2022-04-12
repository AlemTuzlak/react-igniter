import { DefaultConfigType } from "../configGenerator/DefaultConfig";
import { inquirer } from "../helpers/inquirerInstance";
import { installDependency } from "../helpers/installDependency";
import { apiGenerator, ApiGeneratorArguments } from "./apiGenerator";

interface ApiInquirerAnswers {
  init: boolean;
  output: string;
  crud: boolean;
  prefix: string;
  submodules: string;
  typescript: boolean;
}

export const apiInquirer = async (config?: DefaultConfigType) => {
  try {
    await installDependency("axios");
  } catch (err) {
    return;
  }

  const { init, output, crud, prefix, submodules, typescript } =
    await inquirer.prompt<ApiInquirerAnswers>([
      {
        type: "list",
        name: "init",
        message:
          "Do you want to initialize a base API instance [Required for the submodules]?",
        default: true,
        when: config?.api?.init === undefined ?? true,
        choices: [
          { name: "Yes", value: true },
          { name: "No", value: false },
        ],
      },
      {
        type: "list",
        name: "typescript",
        default: false,
        message: "Do you want to generate typescript or javascript modules?",
        when: config?.api?.type === undefined ?? true,
        choices: [
          { name: "typescript", value: true },
          { name: "javascript", value: false },
        ],
      },
      {
        type: "input",
        name: "prefix",
        message: "What is the base API prefix?",

        when: (answers) =>
          answers.init && (config?.api?.prefix === undefined ?? true),
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
        when: config?.api?.crud === undefined ?? true,
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
  const generatorArgs: ApiGeneratorArguments = {
    init: config?.api?.init ?? init,
    output: output.replace(process.cwd(), ""),
    crud: config?.api?.crud ?? crud,
    prefix: config?.api?.prefix ?? prefix,
    submodules: submodules.trim().split(" "),
    typescript:
      config?.api?.type !== undefined
        ? config.api.type === "typescript"
        : typescript,
  };

  await apiGenerator(generatorArgs);
};
