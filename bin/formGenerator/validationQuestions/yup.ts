import { QuestionCollection } from "inquirer";

export const yupValidationQuestions = (): QuestionCollection => [
  {
    type: "list",
    name: "yupType",
    default: "string",
    message: "What type of of field is this?",
    choices: [
      { name: "string", value: "string" },
      { name: "number", value: "number" },
      { name: "boolean", value: "boolean" },
      { name: "date", value: "date" },
      { name: "array", value: "array" },
      { name: "object", value: "object" },
      { name: "mixed", value: "mixed" },
    ],
  },
  {
    type: "checkbox",
    name: "yupValidation",
    choices: (ans) => [
      { value: "required", name: "Required" },
      { value: "nullable", name: "Nullable" },
      ...(ans.yupType !== "mixed" &&
      ans.yupType !== "object" &&
      ans.yupType !== "boolean"
        ? [
            { value: "min", name: "Min" },
            { value: "max", name: "Max" },
          ]
        : []),
      ...(ans.yupType === "string"
        ? [
            { value: "length", name: "Length" },
            { value: "matches", name: "Regex" },
            { value: "email", name: "Email" },
            { value: "url", name: "URL" },
          ]
        : []),
      //number
      ...(ans.yupType === "number"
        ? [
            { value: "lessThan", name: "Less than" },
            { value: "moreThan", name: "More than" },
            { value: "positive", name: "Positive" },
            { value: "negative", name: "Negative" },
            { value: "integer", name: "Integer" },
          ]
        : []),
      // array
      ...(ans.yupType === "array"
        ? [{ value: "length", name: "Min Length" }]
        : []),
    ],
  },
];
