import chalk from "chalk";
import { execSync } from "child_process";
import inquirer from "inquirer";
import { checkPackageDependency } from "./checkPackageDependency";
import { getPackageJson } from "./getPackageJson";

export const installDependency = async (dependency: string) => {
  let hasDependencyInstalled = false;
  try {
    const packageJson = getPackageJson();
    hasDependencyInstalled = checkPackageDependency(packageJson, dependency);
  } catch (e){
    throw e
  }
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: dependency,
      message: `Do you want to install ${dependency}?`,
      when: !hasDependencyInstalled,
      choices: [
        { name: "Yes", value: true },
        { name: "No", value: false },
      ],
    },
  ]);
  
  if (answer[dependency] && !hasDependencyInstalled) {
    const result = execSync(`npm i ${dependency}`, { stdio: "inherit" });
    if(result !== null){
      console.log(chalk.red(`Error installing ${dependency}`));
      throw new Error(chalk.red(`Error installing ${dependency}`));
    }
  }
  if(!hasDependencyInstalled && !answer[dependency]){
    console.log(chalk.red(`The React Igniter generator requires ${dependency} to be installed!`));
    throw new Error(`The React Igniter generator requires ${dependency} to be installed!`);
  }
}