import { QuestionCollection } from "inquirer";
import { DefaultConfigType } from "../../configGenerator/DefaultConfig";
import { FormFieldAnswers, FormInquirerAnswers } from "../formInquirer";

export const defaultValidationQuestions = (
  answers: FormInquirerAnswers,
  config?: DefaultConfigType
): QuestionCollection => [
  {
    type: "checkbox",
    name: "validation",
    when:
      config?.form?.withValidation === true || answers.withValidation === true,
    choices: [
      { value: "required", name: "Required" },
      { value: "min", name: "Min" },
      { value: "max", name: "Max" },
      { value: "minLength", name: "Min Length" },
      { value: "maxLength", name: "Max Length" },
      { value: "pattern", name: "Regex" },
      { value: "validate", name: "Custom validation" },
    ],
  },
  {
    type: "input",
    when: (ans: FormFieldAnswers) => ans.validation?.includes("min"),
    name: "minNumber",
    default: 1,
    message: "What is the minimum value for this input?",
    validate: (val: any) => (!isNaN(val) ? true : "Must be a number"),
  },
  {
    type: "input",
    when: (ans: FormFieldAnswers) => ans.validation?.includes("max"),
    name: "maxNumber",
    default: 255,
    message: "What is the maximum value for this input?",
    validate: (val: any) => (!isNaN(val) ? true : "Must be a number"),
  },
  {
    type: "input",
    when: (ans: FormFieldAnswers) => ans.validation?.includes("minLength"),
    name: "minLengthNumber",
    default: 1,
    message: "What is the minimum length of this input?",
    validate: (val: any) => (!isNaN(val) ? true : "Must be a number"),
  },
  {
    type: "input",
    when: (ans: FormFieldAnswers) => ans.validation?.includes("maxLength"),
    name: "maxLengthNumber",
    default: 255,
    message: "What is the maximum length of this input?",
    validate: (val: any) => (!isNaN(val) ? true : "Must be a number"),
  },
];
