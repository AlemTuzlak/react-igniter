import { DefaultConfigType } from "../configGenerator/DefaultConfig";
import { inquirer } from "../helpers/inquirerInstance";
import { installDependency } from "../helpers/installDependency";
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
  exportType: string;
  includeIndex: boolean;
  translations: boolean;
}
export const componentInquirer = async (
  config?: DefaultConfigType,
  componentName?: string
) => {
  const {
    test,
    typescript,
    name,
    output,
    storybook,
    style,
    exportType,
    includeIndex,
    translations,
  } = await inquirer.prompt<ComponentInquirerAnswers>([
    {
      type: "input",
      message: "What is the name of the component?",
      name: "name",
      when: !componentName,
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
      name: "translations",
      default: false,
      message:
        "Do you want to include translations hook (uses i18n) in the component?",
      when: config?.component?.translations === undefined ?? true,
      choices: [
        { name: "Yes", value: true },
        { name: "No", value: false },
      ],
    },
    {
      type: "list",
      name: "includeIndex",
      default: true,
      message: "Do you want to create an index file?",
      when: config?.component?.includeIndex === undefined ?? true,
      choices: [
        { name: "Yes", value: true },
        { name: "No", value: false },
      ],
    },
    {
      type: "list",
      name: "exportType",
      default: "named",
      message: "Do you want a named or default component export?",
      when: config?.component?.exportType === undefined ?? true,
      choices: [
        { name: "named", value: "named" },
        { name: "default", value: "default" },
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

  if (config?.component?.translations || translations) {
    try {
      await installDependency(
        "react-i18next",
        "npm install react-i18next i18next"
      );
    } catch (e) {
      return;
    }
  }
  const generatorArgs: ComponentGeneratorArguments = {
    name: componentName ?? name,
    test: config?.component?.test ?? test,
    style: config?.component?.style ?? style,
    output: output.replace(process.cwd(), ""),
    exportType: config?.component?.exportType ?? exportType,
    translations: config?.component?.translations ?? translations,
    typescript:
      config?.component?.type !== undefined
        ? config?.component?.type === "typescript"
        : typescript,
    storybook: config?.component?.storybook ?? storybook,
    includeIndex: config?.component?.includeIndex ?? includeIndex,
  };

  await componentGenerator(generatorArgs);
};
