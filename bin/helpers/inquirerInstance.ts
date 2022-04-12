import inquirer from "inquirer";
import inquirerFileTreeSelection from "inquirer-file-tree-selection-prompt";
inquirer.registerPrompt("file-tree-selection", inquirerFileTreeSelection);
export { inquirer };
