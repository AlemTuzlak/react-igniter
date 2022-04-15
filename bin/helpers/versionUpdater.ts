import chalk from "chalk";
import { exec } from "child_process";
import util from "util";
import { getPackageJson } from "./getPackageJson";
import { inquirer } from "./inquirerInstance";
import { spinnerInstance } from "./spinner";
const execAsync = util.promisify(exec);

export const versionUpdater = async () => {
  const spinner = spinnerInstance(" Checking for updates...").start();
  try {
    const { stdout: version } = await execAsync(
      "npm view react-igniter version"
    );
    const packageJson = getPackageJson(true);
    if (version.trim() === packageJson.version) {
      spinner.succeed(` React-igniter is up to date.\n`);
    } else {
      spinner.warn(" React-igniter is not up to date.\n");
      const { update } = await inquirer.prompt([
        { type: "confirm", name: "update", message: "Update React-igniter?" },
      ]);

      if (update) {
        spinner.text = " Updating React-igniter...";
        spinner.start();
        await execAsync("npm install react-igniter@latest -g");
        spinner.succeed(
          ` React-igniter updated successfully. Rerun ${chalk.bold.whiteBright(
            "rig"
          )} to run the latest version! \n`
        );

        return true;
      }
    }
    return false;
  } catch (e) {
    spinner.fail(" Can't fetch updates at this moment!\n");
    return false;
  }
};
