import yargs, { ArgumentsCamelCase } from "yargs";
import { directoryFinder } from "../helpers/directoryFinder";
import fs from 'fs'
import path from 'path';
import { BaseApiTS, BaseApiJS } from "./BaseApi";
import { ExtendedApiTS, ExtendedApiJS } from "./ExtendedApi";
import chalk from "chalk";
import { uppercaseFirstLetter } from "../helpers/uppercaseFirstLetter";

interface ApiGeneratorArguments extends ArgumentsCamelCase {
    i?: boolean,
    init?: boolean,
    o?: string,
    output?: string,
    p?: string,
    prefix?: string,
    submodules?: string[],
    crud?: boolean,
    wc?: boolean,
    t?: boolean,
    typescript?: boolean,
}

const apiGenerator = async (argv: ApiGeneratorArguments) => {
    const outputPath = argv.o ? path.join(process.cwd(), argv.o) : await directoryFinder('\\api')
    if(outputPath.includes('api')){
        if(argv.i){
            const finalPath = path.join(outputPath, `BaseApi.${argv.t ? 'ts' : 'js'}`);
            fs.writeFileSync(finalPath, argv.t ? BaseApiTS(argv.p) : BaseApiJS(argv.p))
            console.log(chalk.bold.green('Initialized BaseApi successfully!'))
        }
        argv.submodules?.forEach(submodule => {
            const moduleNameLowercase = submodule.toLowerCase()
            const moduleName = uppercaseFirstLetter(moduleNameLowercase);
            const finalPath = path.join(outputPath, moduleName + 'Api')
            fs.mkdirSync(finalPath, { recursive: true })
            fs.writeFileSync(path.join(finalPath, `${moduleName}Api.${argv.t ? 'ts' : 'js'}`),argv.t ? ExtendedApiTS(moduleName, argv.wc??false, argv.prefix??'') : ExtendedApiJS(moduleName, argv.wc??false, argv.prefix??''))
            console.log(chalk.bold.green(`Generated ${moduleName}Api successfully!`))
        })

    } else {
        if(argv.i){
            const finalPath = path.join(outputPath, 'api');
            fs.mkdirSync(finalPath, { recursive: true });
            fs.writeFileSync(path.join(finalPath, `BaseApi.${argv.t ? 'ts' : 'js'}`), argv.t ? BaseApiTS(argv.p) : BaseApiJS(argv.p))
            console.log(chalk.bold.green('Initialized BaseApi successfully!'))
        }
        argv.submodules?.forEach(submodule => {
            const moduleNameLowercase = submodule.toLowerCase()
            const moduleName = uppercaseFirstLetter(moduleNameLowercase);
            const finalPath = path.join(outputPath, 'api', moduleName + 'Api')
            fs.mkdirSync(finalPath, { recursive: true })
            fs.writeFileSync(path.join(finalPath, `${moduleName}Api.${argv.t ? 'ts' : 'js'}`),argv.t ? ExtendedApiTS(moduleName, argv.wc??false, argv.prefix??'') : ExtendedApiJS(moduleName, argv.wc??false, argv.prefix??''))
            console.log(chalk.bold.green(`Generated ${moduleName}Api successfully!`))
        })
    }
}

export { apiGenerator }