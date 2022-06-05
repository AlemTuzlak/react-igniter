import fs from "fs";
import path from "path";
import chalk from "chalk";
import { uppercaseFirstLetter } from "../helpers/uppercaseFirstLetter";
import {
  Field,
  RevalidationMode,
  ValidationMode,
  ValidationType,
} from "./formInquirer";
import { Form } from "./outputFiles/Form";
import { indexFile } from "./outputFiles/indexFile";

export interface FormGeneratorArguments {
  name: string;
  typescript: boolean;
  output: string;
  withContext: boolean;
  withValidation: boolean;
  validationMode: ValidationMode;
  revalidationMode: RevalidationMode;
  fields: Field[];
  exportType: string;
  includeIndex: boolean;
  validationType: ValidationType;
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
  includeIndex,
  exportType,
  validationType,
}: FormGeneratorArguments) => {
  const finalName = uppercaseFirstLetter(name);
  const outputPath = path.join(process.cwd(), output ?? "", finalName);

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
      revalidationMode,
      exportType,
      validationType
    )
  );
  if (includeIndex) {
    fs.writeFileSync(
      path.join(outputPath, `index.${typescript ? "tsx" : "jsx"}`),
      indexFile(finalName, exportType)
    );
  }
  console.log(chalk.bold.green(`Generated ${finalName} form successfully!`));
};

export { formGenerator };
