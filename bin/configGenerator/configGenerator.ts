import path from "path";
import fs from "fs";
import { inquirer } from "../helpers/inquirerInstance";
import { Config } from "./Config";
import { DefaultConfig, DefaultConfigType } from "./DefaultConfig";
import chalk from "chalk";

export const configGenerator = async (config?: DefaultConfigType) => {
  if (config) {
    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        default: "yes",
        name: "confirm",
        message:
          "Config file already exists! Do you want to update the config file?",
      },
    ]);

    if (confirm) {
      fs.writeFileSync(
        path.join(process.cwd(), "react-igniter.js"),
        Config({
          version: DefaultConfig.version,
          api: { ...DefaultConfig.api, ...config.api },
          component: { ...DefaultConfig.component, ...config.component },
          router: { ...DefaultConfig.router, ...config.router },
          form: { ...DefaultConfig.form, ...config.form },
        })
      );
      console.log(
        chalk.bold.green(`Updated react-igniter configuration successfully!`)
      );
    }
  } else {
    fs.writeFileSync(
      path.join(process.cwd(), "react-igniter.js"),
      Config(DefaultConfig)
    );
    console.log(
      chalk.bold.green(`Generated react-igniter configuration successfully!`)
    );
  }
};
