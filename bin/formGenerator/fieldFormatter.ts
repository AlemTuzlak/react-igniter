import { validators, ValidValidators } from "./formGenerator";

const fieldFormatter = (fields: string[]) => {
    return fields?.map(field => {
        const values = field.split(':');
        const name = values[0];
        let type: string = 'string';
        let fieldValidators: ValidValidators[] = [];
        if(values.length > 1 && values[1].toLowerCase() === 'string' || values[1].toLowerCase() === 'number' ||values[1] === 'boolean'){
            type = values[1].toLowerCase()
        }
        if(values[2]){
            const splitValidators = values[2].split(',');
            fieldValidators = splitValidators.map((currentValidator: any) => {
                if(validators[currentValidator as ValidValidators])
                    return currentValidator
                return '';
            })!.filter(currentValidator => currentValidator !== '')!
        }
        return {
            name,
            type,
            validators: fieldValidators
        }
    })!;
}

export { fieldFormatter }