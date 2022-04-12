import { DefaultConfigType } from "../configGenerator/DefaultConfig";
import { inquirer } from "../helpers/inquirerInstance";
import {
  componentGenerator,
  ComponentGeneratorArguments,
} from "./componentGenerator";

interface ComponentInquirerAnswers {
  name: string;
  test: boolean;
  storybook: boolean;
  style: string;
  typescript: boolean;
  output: string;
}
export const componentInquirer = async (config?: DefaultConfigType) => {
  const { test, typescript, name, output, storybook, style } =
    await inquirer.prompt<ComponentInquirerAnswers>([
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
        when: config?.component?.test === undefined ?? true,
        choices: [
          { name: "Yes", value: true },
          { name: "No", value: false },
        ],
      },
      {
        type: "list",
        name: "storybook",
        message: "Do you want to create a storybook file?",
        when: config?.component?.storybook === undefined ?? true,
        choices: [
          { name: "Yes", value: true },
          { name: "No", value: false },
        ],
      },
      {
        type: "list",
        name: "typescript",
        default: false,
        message: "Do you want to create a typescript or javascript component?",
        when: config?.component?.type === undefined ?? true,
        choices: [
          { name: "typescript", value: true },
          { name: "javascript", value: false },
        ],
      },
      {
        type: "list",
        name: "style",
        message: "Choose a styling module for the component:",
        when: config?.component?.style === undefined ?? true,
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
  const generatorArgs: ComponentGeneratorArguments = {
    name: name,
    test: config?.component?.test ?? test,
    style: config?.component?.style ?? style,
    output: output.replace(process.cwd(), ""),
    typescript:
      config?.component?.type !== undefined
        ? config?.component?.type === "typescript"
        : typescript,
    storybook: config?.component?.storybook ?? storybook,
  };

  await componentGenerator(generatorArgs);
};
