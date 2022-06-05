import chalk from "chalk";
import path from "path";
import { DefaultConfigType } from "../configGenerator/DefaultConfig";
import { inquirer } from "../helpers/inquirerInstance";
import { installDependency } from "../helpers/installDependency";
import { removeWhitespace } from "../helpers/removeWhitespace";
import { sanitizeOutputDirectory } from "../helpers/sanitizeOutputDirectory";
import { formGenerator } from "./formGenerator";
import { defaultValidationQuestions } from "./validationQuestions/default";
import { yupValidationQuestions } from "./validationQuestions/yup";

export type ValidationMode =
  | "onBlur"
  | "onChange"
  | "onSubmit"
  | "onTouched"
  | "all";

export type RevalidationMode = "onSubmit" | "onBlur" | "onChange";

export type InputType =
  | "text"
  | "date"
  | "datetime-local"
  | "url"
  | "email"
  | "password";

export type FormComponentType =
  | "input"
  | "select"
  | "radio"
  | "checkbox"
  | "textarea";

export type ValidationOption =
  | "required"
  | "min"
  | "max"
  | "minLength"
  | "maxLength"
  | "pattern"
  | "validate";

export type ValidationType = "default" | "yup";
export interface FormFieldAnswers {
  type: FormComponentType;
  inputType?: InputType;
  validation?: ValidationOption[];
  yupType?: string;
  yupValidation?: string[];
  minNumber?: number;
  maxNumber?: number;
  minLengthNumber?: number;
  maxLengthNumber?: number;
}
export interface Field extends FormFieldAnswers {
  name: string;
}
export interface FormInquirerAnswers {
  name: string;
  withContext: boolean;
  withValidation: boolean;
  validationMode: ValidationMode;
  revalidationMode: RevalidationMode;
  fields: string;
  output: string;
  typescript: boolean;
  exportType: string;
  includeIndex: boolean;
  validationType: ValidationType;
}

export const formInquirer = async (
  config?: DefaultConfigType,
  name?: string
) => {
  try {
    await installDependency("react-hook-form");
  } catch (err) {
    return;
  }

  const rootDir = path.join(process.cwd(), config?.form?.rootDir ?? "");
  const answers = await inquirer.prompt<FormInquirerAnswers>([
    {
      type: "input",
      name: "name",
      message: "Enter form name:",
      when: !name,
      validate: (value) => {
        return value?.trim() !== ""
          ? true
          : "You must provide a name of at least 1 character";
      },
    },
    {
      type: "list",
      name: "typescript",
      default: false,
      message: "Do you want to generate typescript or javascript modules?",
      when: config?.form?.type === undefined ?? true,
      choices: [
        { name: "typescript", value: true },
        { name: "javascript", value: false },
      ],
    },
    {
      type: "list",
      name: "includeIndex",
      default: true,
      message: "Do you want to create an index file?",
      when: config?.form?.includeIndex === undefined ?? true,
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
      when: config?.form?.exportType === undefined ?? true,
      choices: [
        { name: "named", value: "named" },
        { name: "default", value: "default" },
      ],
    },
    {
      type: "list",
      name: "withContext",
      message: "Do you want to wrap the form with FormContextProvider?",
      default: false,
      when: config?.form?.withContext === undefined ?? true,
      choices: [
        { name: "Yes", value: true },
        { name: "No", value: false },
      ],
    },
    {
      type: "list",
      name: "withValidation",
      message: "Do you want to validate the form?",
      default: true,
      when: config?.form?.withValidation === undefined ?? true,
      choices: [
        { name: "Yes", value: true },
        { name: "No", value: false },
      ],
    },
    {
      type: "list",
      name: "validationType",
      message: "What validation mode do you want to use?",
      default: "default",
      when: (ans) =>
        (config?.form?.validationType === undefined &&
          (config?.form?.withValidation ?? ans.withValidation)) ??
        false,
      choices: [
        { name: "default", value: "default" },
        { name: "yup", value: "yup" },
      ],
    },
    {
      type: "list",
      name: "validationMode",
      message: "When will the validation be triggered?",
      default: "onSubmit",
      when: (ans) =>
        ans.withValidation && config?.form?.validationMode === undefined,
      choices: [
        {
          value: "onSubmit",
          name: `${chalk.bold.green(
            "[onSubmit]"
          )} - Validation will trigger on the submit event`,
        },
        {
          value: "onBlur",
          name: `${chalk.bold.green(
            "[onBlur]"
          )} - Validation will trigger on the blur event.`,
        },
        {
          value: "onChange",
          name: `${chalk.bold.green(
            "[onChange]"
          )} - Validation will trigger on the change event with each input`,
        },
        {
          value: "onTouched",
          name: `${chalk.bold.green(
            "[onTouched]"
          )} - Validation will trigger on the first blur event. After that, it will trigger on every change event.`,
        },
        {
          value: "all",
          name: `${chalk.bold.green(
            "[all]"
          )} - Validation will trigger on the blur and change events.`,
        },
      ],
    },
    {
      type: "list",
      name: "revalidationMode",
      message:
        "When will the validation be triggered after the form is submitted?",
      default: "onChange",
      when: (ans) =>
        ans.withValidation && config?.form?.revalidationMode === undefined,
      choices: [
        {
          value: "onSubmit",
          name: `${chalk.bold.green(
            "[onSubmit]"
          )} - Validation will trigger on the submit event`,
        },
        {
          value: "onBlur",
          name: `${chalk.bold.green(
            "[onBlur]"
          )} - Validation will trigger on the blur event.`,
        },
        {
          value: "onChange",
          name: `${chalk.bold.green(
            "[onChange]"
          )} - Validation will trigger on the change event with each input`,
        },
      ],
    },
    {
      type: "file-tree-selection",
      name: "output",
      message: "Select output directory.",
      root: rootDir,
      onlyShowDir: true,
    },
    {
      type: "input",
      name: "fields",
      message: "What fields will the form have? [Separate with space]",
      validate: (value) => {
        return value?.trim() !== ""
          ? true
          : "You must provide a name of at least 1 field";
      },
    },
  ]);

  const validationType = config?.form?.validationType ?? answers.validationType;
  if (validationType !== "default") {
    try {
      await installDependency("@hookform/resolvers");
      await installDependency(validationType);
    } catch (err) {
      return;
    }
  }
  const fields = answers.fields.trim().split(" ");
  const finalFields: Field[] = [];
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const fieldAnswers = await inquirer.prompt<FormFieldAnswers>([
      {
        type: "list",
        name: "type",
        default: "input",
        message: `What kind of component do you want "${chalk.greenBright(
          field
        )}" to be?`,
        choices: [
          { value: "input", name: "Input" },
          { value: "select", name: "Select" },
          { value: "radio", name: "Radio" },
          { value: "checkbox", name: "Checkbox" },
          { value: "textarea", name: "Textarea" },
        ],
      },
      {
        type: "list",
        name: "inputType",
        default: "text",
        message: `What kind of input do you want "${chalk.greenBright(
          field
        )}" to be?`,
        when: (ans) => ans.type === "input",
        choices: [
          { value: "text", name: "Text" },
          { value: "date", name: "Date" },
          { value: "datetime-local", name: "DateTime" },
          { value: "url", name: "URL" },
          { value: "email", name: "Email" },
          { value: "password", name: "Password" },
        ],
      },
      ...(validationType === "default"
        ? (defaultValidationQuestions(answers, config) as [])
        : []),
      ...(validationType === "yup" ? (yupValidationQuestions() as []) : []),
    ]);

    finalFields.push({
      ...fieldAnswers,
      name: removeWhitespace(field),
    });
  }

  const outputDir = sanitizeOutputDirectory(answers.output, rootDir);

  const finalOutput = {
    name: removeWhitespace(name ? name : answers.name),
    fields: finalFields,
    typescript:
      config?.form?.type !== undefined
        ? config?.form?.type === "typescript"
        : answers.typescript,
    withValidation: config?.form?.withValidation ?? answers.withValidation,
    validationMode: (config?.form?.validationMode ??
      answers.validationMode) as ValidationMode,
    revalidationMode: (config?.form?.revalidationMode ??
      answers.revalidationMode) as RevalidationMode,
    includeIndex: config?.form?.includeIndex ?? answers.includeIndex,
    output: outputDir.replace(process.cwd(), ""),
    withContext: config?.form?.withContext ?? answers.withContext,
    exportType: config?.form?.exportType ?? answers.exportType,
    validationType:
      (config?.form?.validationType as ValidationType) ??
      answers.validationType,
  };

  await formGenerator(finalOutput);
};
