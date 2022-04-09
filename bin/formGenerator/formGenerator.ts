import { ArgumentsCamelCase } from "yargs"
import { fieldFormatter } from "./fieldFormatter";
import fs from 'fs'
import path from 'path';
import { useValidator } from "./GeneratorFiles/useValidator";
import { validatorGenerator } from "./GeneratorFiles/validators";
import { FormGenerator } from "./GeneratorFiles/Form";
import chalk from "chalk";

interface ApiGeneratorArguments extends ArgumentsCamelCase {
    fields?: string[],
    n?: string,
    name?: string
}

export const validators = {
    email: 'validateEmail',
    length: 'validateLength',
    required: 'validateIfEmpty'
}
export type ValidValidators = keyof typeof validators;
export interface Field {
    name: string,
    type: string,
    validators: ValidValidators[]
}
const formGenerator = (argv: ApiGeneratorArguments) => {
    const fields: Field[] = fieldFormatter(argv.fields!)
    const validatorImports: string[] = [];
    fields.forEach(field => {
        field.validators.map(validator => {
            if(!validatorImports.includes(validators[validator])){
                validatorImports.push(validators[validator])
            }
        })
    })
    if (!fs.existsSync(path.join(process.cwd(), 'validation'))) {
        fs.mkdirSync(path.join(process.cwd(), 'validation'), { recursive: true });
        console.log(chalk.bold.green('Validation folder created successfully!'))
    }
    fs.writeFileSync(path.join(process.cwd(),'validation', 'useFormValidator.ts'), useValidator());
    console.log(chalk.bold.green('Generated useFormValidator hook successfully!'))
    fs.writeFileSync(path.join(process.cwd(),'validation', 'validators.ts'), validatorGenerator())
    console.log(chalk.bold.green('Generated validators successfully!'))
    fs.writeFileSync(path.join(process.cwd(), (argv.name??'Form') + '.tsx'), FormGenerator(argv.name??'Form', fields, validatorImports))
    console.log(chalk.bold.green('Generated form successfully!'))
}
export { formGenerator }