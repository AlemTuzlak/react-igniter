import fs from "fs";
import path from "path";
import chalk from "chalk";
import { ComponentFile } from "./OutputFiles/Component";
import { ComponentTestFile } from "./OutputFiles/ComponentTest";
import { ComponentStyling } from "./OutputFiles/ComponentStyling";
import { uppercaseFirstLetter } from "../helpers/uppercaseFirstLetter";
import { ComponentStorybook } from "./OutputFiles/ComponentStorybook";
import { indexFile } from "./OutputFiles/indexFile";

export enum StylingOptions {
  CSS = "css",
  SCSS = "scss",
  STYLED = "styled-components",
  NONE = "none",
}
export interface ComponentGeneratorArguments {
  name: string;
  typescript: boolean;
  style: string;
  output: string;
  storybook: boolean;
  test: boolean;
  exportType: string;
  includeIndex: boolean;
  translations: boolean;
}

const componentGenerator = async (argv: ComponentGeneratorArguments) => {
  const name = uppercaseFirstLetter(argv.name);
  const outputPath = path.join(process.cwd(), argv.output ?? "", name);

  fs.mkdirSync(outputPath, { recursive: true });
  fs.writeFileSync(
    path.join(outputPath, `${name}.${argv.typescript ? "tsx" : "jsx"}`),
    ComponentFile(
      name,
      argv.typescript ?? false,
      argv.style ?? StylingOptions.NONE,
      argv.exportType,
      argv.translations
    )
  );
  if (argv.test) {
    fs.writeFileSync(
      path.join(outputPath, `${name}.test.${argv.typescript ? "tsx" : "jsx"}`),
      ComponentTestFile(name, argv.exportType)
    );
  }

  if (argv.includeIndex) {
    fs.writeFileSync(
      path.join(outputPath, `index.${argv.typescript ? "tsx" : "jsx"}`),
      indexFile(name, argv.exportType)
    );
  }
  if (
    argv.style &&
    (argv.style === StylingOptions.CSS || argv.style === StylingOptions.SCSS)
  ) {
    fs.writeFileSync(
      path.join(outputPath, `${name}.${argv.style}`),
      ComponentStyling(name)
    );
  }
  if (argv.storybook) {
    fs.writeFileSync(
      path.join(
        outputPath,
        `${name}.stories.${argv.typescript ? "tsx" : "jsx"}`
      ),
      ComponentStorybook(name, argv.typescript, argv.exportType)
    );
  }
  console.log(
    chalk.bold.green(`Generated ${name} component folder successfully!`)
  );
};

export { componentGenerator };
