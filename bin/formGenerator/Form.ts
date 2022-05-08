import { padFront } from "../helpers/padFront";
import { uppercaseFirstLetter } from "../helpers/uppercaseFirstLetter";
import { Field, RevalidationMode, ValidationMode } from "./formInquirer";

export const Form = (
  name: string,
  fields: Field[],
  typescript: boolean = false,
  withContext: boolean = false,
  withValidation: boolean = false,
  validationMode: ValidationMode = "onSubmit",
  revalidationMode: RevalidationMode = "onChange"
) => {
  const formFieldsPadding = withContext ? 2 : 0;
  return [
    `import React${typescript ? ", { FC }" : ""} from 'react';`,
    `import { useForm${
      withContext ? ", FormProvider" : ""
    } } from 'react-hook-form'`,
    ``,
    ...(typescript
      ? [
          `interface ${name}Values {`,
          ...interfaceValueGenerator(fields),
          `}`,
          ``,
        ]
      : []),
    `const ${name}${typescript ? ": FC" : ""} = () => {`,
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
    padFront(`defaultValues: {`, 4),
    ...defaultValueGenerator(fields),
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
      formComponentGenerator(field, formFieldsPadding + 6, withValidation)
    ),
    padFront(`</form>`, formFieldsPadding + 4),
    ...(withContext ? [padFront("</FormProvider>", 4)] : []),
    padFront(`)`, 2),
    `}`,
    ``,
    `export { ${name} };`,
  ].join("\n");
};

const interfaceValueGenerator = (fields: Field[]) => {
  return fields.map((field) =>
    padFront(
      `${field.name}: ${field.type === "checkbox" ? "string[];" : "string;"}`,
      2
    )
  );
};
const defaultValueGenerator = (fields: Field[]) => {
  return fields.map((field) =>
    padFront(`${field.name}: ${field.type === "checkbox" ? "[]," : '"",'}`, 6)
  );
};

const formComponentGenerator = (
  field: Field,
  padding: number,
  withValidation: boolean = false
) => {
  const singleComponent = singleFieldGenerator(
    field,
    padding + 2,
    withValidation
  );
  return [
    padFront(`<div>`, padding),
    singleComponent,
    padFront(`<p>{errors?.${field.name}?.message}</p>`, padding + 2),
    padFront(`</div>`, padding),
  ].join("\n");
};

const splitCamelCase = (string: string) => {
  return string.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
};
const singleFieldGenerator = (
  field: Field,
  padding: number,
  withValidation: boolean
) => {
  switch (field.type) {
    case "input": {
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
    case "checkbox": {
      return [
        padFront(`<label htmlFor="${field.name}">`, padding),
        padFront(
          `<input type="checkbox" id="${field.name}" {...register("${
            field.name
          }"${
            withValidation && field.validation?.length
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
            withValidation && field.validation?.length
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
          withValidation && field.validation?.length
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
            withValidation && field.validation?.length
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
