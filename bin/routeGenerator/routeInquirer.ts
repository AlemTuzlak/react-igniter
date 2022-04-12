import { DefaultConfigType } from "../configGenerator/DefaultConfig";
import { routeGenerator, RouterGeneratorArguments } from "./routeGenerator";
import { getPackageJson } from "../helpers/getPackageJson";
import { installDependency } from "../helpers/installDependency";
import { inquirer } from "../helpers/inquirerInstance";
interface RouterInquirerAnswers {
  name: string;
  main: boolean;
  withTabs: boolean;
  typescript: boolean;
  output: string;
  routes: string;
}
export const routeInquirer = async (config?: DefaultConfigType) => {
  let version = "";
  try {
    const packageJson = await getPackageJson();
    const reactRouterDomVersion = packageJson.dependencies["react-router-dom"];
    if (reactRouterDomVersion === "latest") {
      version = "v6";
    } else {
      const [major] = reactRouterDomVersion.split(".");
      version = `v${major.replace("^", "")}`;
    }
  } catch (err) {}
  if (!version) {
    try {
      await installDependency(
        "react-router-dom",
        "npm i react-router react-router-dom"
      );
      version = "v6";
    } catch (err) {
      return;
    }
  }

  const { name, main, typescript, routes, withTabs, output } =
    await inquirer.prompt<RouterInquirerAnswers>([
      {
        type: "input",
        name: "name",
        message: "Name of the router file",
        default: "index",
        validate: (value) => {
          return value !== "" ? true : "You must at least 1 character name";
        },
      },
      {
        type: "list",
        name: "main",
        message: "Are you creating a main project router or a sub-router?",
        default: false,
        when: config?.router?.main === undefined ?? true,
        choices: [
          { name: "Main", value: true },
          { name: "Sub-router", value: false },
        ],
      },
      {
        type: "list",
        name: "typescript",
        default: false,
        message: "Do you want to generate a typescript or javascript router?",
        when: config?.router?.type === undefined ?? true,
        choices: [
          { name: "typescript", value: true },
          { name: "javascript", value: false },
        ],
      },

      {
        type: "input",
        name: "routes",
        message:
          "What are the paths of the routes you want to create? [Separate with space]",
        validate: (value) => {
          return value !== ""
            ? true
            : "You must provide a name of at least 1 route";
        },
      },
      {
        type: "list",
        name: "withTabs",
        message: "Do you want to create Tabs in the router?",
        when: config?.router?.withTabs === undefined ?? true,
        default: false,
        choices: [
          { name: "Yes", value: true },
          { name: "No", value: false },
        ],
      },

      {
        type: "file-tree-selection",
        name: "output",
        message: "Select output directory.",
        root: process.cwd(),
        onlyShowDir: true,
      },
    ]);

  const generatorArgs: RouterGeneratorArguments = {
    name: name,
    routes: routes.trim().split(" "),
    main: config?.router?.main ?? main,
    typescript:
      config?.router?.type !== undefined
        ? config?.router?.type === "typescript"
        : typescript,
    withTabs: config?.router?.withTabs ?? withTabs,
    ver: version,
    output: output.replace(process.cwd(), ""),
  };

  await routeGenerator(generatorArgs);
};
