import chalk from "chalk";

export const getPackageJson = (failSilently = false) => {
  try {
    const packageJson = require(`${process.cwd()}/package.json`);
    return packageJson;
  } catch (e) {
    if (!failSilently) {
      console.log(
        chalk.bold.redBright(
          "No package json found! Please run this command in a project directory."
        )
      );
    }
    throw e;
  }
};
