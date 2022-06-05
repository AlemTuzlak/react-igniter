import { padFront } from "../../helpers/padFront";
import { uppercaseFirstLetter } from "../../helpers/uppercaseFirstLetter";
import {
  Field,
  RevalidationMode,
  ValidationMode,
  ValidationType,
} from "../formInquirer";

export const Form = (
  name: string,
  fields: Field[],
  typescript: boolean = false,
  withContext: boolean = false,
  withValidation: boolean = false,
  validationMode: ValidationMode = "onSubmit",
  revalidationMode: RevalidationMode = "onChange",
  exportType: string = "named",
  validationType: ValidationType = "default"
) => {
  const formFieldsPadding = withContext ? 2 : 0;
  return [
    `import React from 'react';`,
    `import { useForm${
      withContext ? ", FormProvider" : ""
    } } from 'react-hook-form'`,
    ...(validationType === "yup"
      ? [
          `import { yupResolver } from '@hookform/resolvers/yup';`,
          `import * as yup from "yup";`,
        ]
      : []),
    ``,
    ...(typescript
      ? [
          `interface ${name}Values {`,
          ...interfaceValueGenerator(fields, validationType),
          `}`,
          ``,
        ]
      : []),
    `const ${name} = () => {`,
    ...(validationType === "yup"
      ? [
          padFront(`const schema = yup.object().shape({`, 2),
          ...createYupSchema(fields, 4),
          padFront(`});`, 2),
        ]
      : []),
    padFront(
      `const ${
        withContext
          ? "methods"
          : "{ formState: { errors }, handleSubmit, register }"
      } = useForm${typescript ? `<${name}Values>` : ""}({`,
      2
    ),
    ...(withValidation
      ? [
          padFront(`mode: "${validationMode}",`, 4),
          padFront(`reValidateMode: "${revalidationMode}",`, 4),
        ]
      : []),
    ...(validationType === "yup"
      ? [padFront(`resolver: yupResolver(schema),`, 4)]
      : []),
    padFront(`defaultValues: {`, 4),
    ...defaultValueGenerator(fields, validationType),
    padFront(`}`, 4),
    padFront(`})`, 2),
    ...(withContext
      ? [
          padFront(
            "const { formState: { errors }, handleSubmit, register } = methods;",
            2
          ),
        ]
      : []),
    ``,
    padFront(
      `const onSubmit = (data${
        typescript ? `: ${name}Values` : ""
      }) => console.log(data)`,
      2
    ),
    ``,
    padFront(`return (`, 2),
    ...(withContext ? [padFront("<FormProvider {...methods} >", 4)] : []),
    padFront(`<form onSubmit={handleSubmit(onSubmit)}>`, formFieldsPadding + 4),
    ...fields.map((field) =>
      formComponentGenerator(
        field,
        formFieldsPadding + 6,
        withValidation,
        validationType
      )
    ),
    padFront(`</form>`, formFieldsPadding + 4),
    ...(withContext ? [padFront("</FormProvider>", 4)] : []),
    padFront(`)`, 2),
    `}`,
    ``,
    `export ${exportType === "named" ? `{ ${name} }` : `default ${name}`};`,
    ,
  ].join("\n");
};
const createYupSchema = (fields: Field[], padding: number) => {
  return fields.map((field) => {
    const type = field.yupType!;
    const validationFields = field.yupValidation!;
    return padFront(
      `${field.name}: yup.${createYupType(type)}${createYupValidation(
        validationFields
      )},`,
      padding
    );
  });
};
const createYupType = (type: string) => {
  switch (type) {
    case "object":
      return "object().shape({ /** your shape here */ })";
    case "array":
      return "array().of(yup.object().shape({ /** your shape here */ }))";
    default:
      return `${type}()`;
  }
};
const createYupValidation = (validationFields: string[]) => {
  return validationFields
    .map((field) => {
      switch (field) {
        case "min":
          return ".min(1)";
        case "max":
          return ".max(255)";
        case "lessThan":
          return ".lessThan(255)";
        case "moreThan":
          return ".moreThan(1)";
        case "length":
          return ".length(1)";
        case "matches":
          return ".matches(/ /)";
        default:
          return `.${field}()`;
      }
    })
    .join("");
};

const convertYupTypeToTS = (type: string) => {
  switch (type) {
    case "date":
      return "Date";
    case "object":
      return "Record<string, any>; // Please type me";
    case "array":
      return "any[]; // Please type me";
    case "mixed":
      return "any // Please type me";
    default:
      return `${type};`;
  }
};

const interfaceValueGenerator = (
  fields: Field[],
  validationType: ValidationType
) => {
  if (validationType === "yup") {
    return fields.map((field) =>
      padFront(`${field.name}: ${convertYupTypeToTS(field.yupType!)}`, 2)
    );
  }
  return fields.map((field) =>
    padFront(
      `${field.name}: ${field.type === "checkbox" ? "string[];" : "string;"}`,
      2
    )
  );
};
const createYupDefaultValue = (type: string) => {
  switch (type) {
    case "object":
      return "{},";
    case "array":
      return "[],";
    case "string":
      return "'',";
    case "number":
      return "null,";
    default:
      return "null,";
  }
};
const defaultValueGenerator = (
  fields: Field[],
  validationType: ValidationType
) => {
  if (validationType === "yup") {
    return fields.map((field) =>
      padFront(`${field.name}: ${createYupDefaultValue(field.yupType!)}`, 4)
    );
  }
  return fields.map((field) =>
    padFront(`${field.name}: ${field.type === "checkbox" ? "[]," : '"",'}`, 6)
  );
};

const formComponentGenerator = (
  field: Field,
  padding: number,
  withValidation: boolean = false,
  validationType: string = "default"
) => {
  const singleComponent = singleFieldGenerator(
    field,
    padding + 2,
    withValidation,
    validationType
  );
  return [
    padFront(`<div>`, padding),
    singleComponent,
    padFront(`<p>{${generateFieldError(field)}}</p>`, padding + 2),
    padFront(`</div>`, padding),
  ].join("\n");
};

const generateFieldError = (field: Field) => {
  switch (field.yupType) {
    case "array":
      return `errors?.${field.name}?.length && errors?.${field.name}[0].message`;
    case "object":
      return `/** errors?.${field.name}?.YOUR_OBJECT_KEY_HERE.message */`;
    default:
      return `errors?.${field.name}?.message`;
  }
};
const splitCamelCase = (string: string) => {
  return string.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
};
const singleFieldGenerator = (
  field: Field,
  padding: number,
  withValidation: boolean,
  validationType: string = "default"
) => {
  switch (field.type) {
    case "input": {
      return padFront(
        `<input${
          field.inputType !== "text"
            ? padFront(`type="${field.inputType}"`, 1)
            : ""
        } {...register("${field.name}"${
          withValidation &&
          validationType === "default" &&
          field.validation?.length
            ? `, ${generateValidationObject(field)}`
            : ""
        })} placeholder="${splitCamelCase(field.name)}" />`,
        padding
      );
    }
    case "checkbox": {
      return [
        padFront(`<label htmlFor="${field.name}">`, padding),
        padFront(
          `<input type="checkbox" id="${field.name}" {...register("${
            field.name
          }"${
            withValidation &&
            validationType === "default" &&
            field.validation?.length
              ? `, ${generateValidationObject(field)}`
              : ""
          })} placeholder="${splitCamelCase(field.name)}" />`,
          padding + 2
        ),
        padFront(`${splitCamelCase(field.name)}`, padding + 2),
        padFront(`</label>`, padding),
      ].join("\n");
    }
    case "radio": {
      return [
        padFront(`<label htmlFor="${field.name}">`, padding),
        padFront(
          `<input type="radio" id="${field.name}" {...register("${field.name}"${
            withValidation &&
            validationType === "default" &&
            field.validation?.length
              ? `, ${generateValidationObject(field)}`
              : ""
          })} placeholder="${splitCamelCase(field.name)}" />`,
          padding + 2
        ),
        padFront(`${splitCamelCase(field.name)}`, padding + 2),
        padFront(`</label>`, padding),
      ].join("\n");
    }
    case "textarea": {
      return padFront(
        `<textarea placeholder="${splitCamelCase(field.name)}" {...register("${
          field.name
        }"${
          withValidation &&
          validationType === "default" &&
          field.validation?.length
            ? `, ${generateValidationObject(field)}`
            : ""
        })} />`,
        padding
      );
    }
    case "select": {
      return [
        padFront(
          `<select {...register("${field.name}"${
            withValidation &&
            validationType === "default" &&
            field.validation?.length
              ? `, ${generateValidationObject(field)}`
              : ""
          })}>`,
          padding
        ),
        padFront(
          `<option value="" disabled>Select an option</option>`,
          padding + 2
        ),
        padFront(`<option value="1">Option 1</option>`, padding + 2),
        padFront(`</select>`, padding),
      ].join("\n");
    }
    default: {
      return padFront(
        `<input${
          field.inputType !== "text"
            ? padFront(`type="${field.inputType}"`, 1)
            : ""
        } {...register("${field.name}"${
          withValidation && field.validation?.length
            ? `, ${generateValidationObject(field)}`
            : ""
        })} placeholder="${splitCamelCase(field.name)}" />`,
        padding
      );
    }
  }
};

const generateValidationObject = (field: Field) => {
  return [
    `{`,
    ...(field.validation?.includes("required")
      ? [`required: "${splitCamelCase(field.name)} is required.",`]
      : []),
    ...(field.validation?.includes("min")
      ? [
          `min: { value: ${field.minNumber}, message: "${splitCamelCase(
            uppercaseFirstLetter(field.name)
          )} minimum value is ${field.minNumber}."},`,
        ]
      : []),
    ...(field.validation?.includes("max")
      ? [
          `max: { value: ${field.maxNumber}, message: "${splitCamelCase(
            uppercaseFirstLetter(field.name)
          )} maximum value is ${field.maxNumber}."},`,
        ]
      : []),
    ...(field.validation?.includes("minLength")
      ? [
          `minLength: { value: ${
            field.minLengthNumber
          }, message: "${splitCamelCase(
            uppercaseFirstLetter(field.name)
          )} minimum length is ${field.minLengthNumber}."},`,
        ]
      : []),
    ...(field.validation?.includes("maxLength")
      ? [
          `maxLength: { value: ${
            field.maxLengthNumber
          }, message: "${splitCamelCase(
            uppercaseFirstLetter(field.name)
          )} maximum length is ${field.maxLengthNumber}."},`,
        ]
      : []),
    ...(field.validation?.includes("pattern")
      ? [
          `pattern: { value: /a-z/, message: "${splitCamelCase(
            uppercaseFirstLetter(field.name)
          )} must match pattern."},`,
        ]
      : []),
    ...(field.validation?.includes("validate")
      ? [
          `validate: { customValidator: value => value || "${splitCamelCase(
            uppercaseFirstLetter(field.name)
          )} has to pass custom validator." },`,
        ]
      : []),
    `}`,
  ].join(" ");
};
