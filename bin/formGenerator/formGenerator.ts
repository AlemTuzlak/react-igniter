import fs from "fs";
import path from "path";
import chalk from "chalk";
import { uppercaseFirstLetter } from "../helpers/uppercaseFirstLetter";
import { Field, RevalidationMode, ValidationMode } from "./formInquirer";
import { Form } from "./Form";

export interface FormGeneratorArguments {
  name: string;
  typescript: boolean;
  output: string;
  withContext: boolean;
  withValidation: boolean;
  validationMode: ValidationMode;
  revalidationMode: RevalidationMode;
  fields: Field[];
}

const formGenerator = async ({
  output,
  name,
  typescript,
  withContext,
  withValidation,
  validationMode,
  revalidationMode,
  fields,
}: FormGeneratorArguments) => {
  const finalName = uppercaseFirstLetter(name);
  const outputPath = path.join(output ?? process.cwd(), finalName);

  fs.mkdirSync(outputPath, { recursive: true });
  fs.writeFileSync(
    path.join(outputPath, `${finalName}.${typescript ? "tsx" : "jsx"}`),
    Form(
      finalName,
      fields,
      typescript,
      withContext,
      withValidation,
      validationMode,
      revalidationMode
    )
  );

  console.log(chalk.bold.green(`Generated ${name} form successfully!`));
};

export { formGenerator };
