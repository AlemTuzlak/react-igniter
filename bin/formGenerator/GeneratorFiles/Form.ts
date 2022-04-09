import { uppercaseFirstLetter } from "../../helpers/uppercaseFirstLetter";
import { Field, validators } from "../formGenerator"

const FormGenerator = (name: string, fields: Field[], validatorImports: string[]) => {
  const generateFormDataInterface = () => {
    return fields.map(field => {
      return (
  `${field.name}: ${field.type}
  ${field.name}Touched: boolean`
      );
    }).join('\n  ')
  }
  const generateDefaultValue = (type: string) => {
    switch(type){
      case 'string':
        return '""';
      case 'number':
        return '0';
      case 'boolean':
        return 'false'
    }
  }
  const generateFormData= () => {
    return fields.map(field => {
      return (
  `
    ${field.name}: ${generateDefaultValue(field.type)},
    ${field.name}Touched: false,`
      );
    }).join('')
  }
  const generateFormValidators = () => {
    return fields.map(field => {
      return (
  `${field.name}: [${field.validators?.map(currentValidator => `{ validator: ${validators[currentValidator]} }`).join(', ')}]`
      );
    }).join(',\n    ')
  }
  const generateFieldErrors = () => {
    return fields.map(field => {
      return (
  `
  const shouldShow${uppercaseFirstLetter(field.name)}Error = (formData.${field.name}Touched && formErrors.${field.name}) || (isSubmitted && formErrors.${field.name});`
      );
    }).join('')
  }
  const generateFormHtmlFields = () => {
    return fields.map(field => {
      return (
        field.type === 'boolean' ?
        `<div>
        <p>
          ${uppercaseFirstLetter(field.name)}
        </p>
        <input style={{borderColor: shouldShow${uppercaseFirstLetter(field.name)}Error ? 'red' : ''}} className="${name}-input" id="${field.name}" onChange={handleChange} onBlur={handleBlur} checked={formData.${field.name}} type="checkbox" />
        <p style={{color: shouldShow${uppercaseFirstLetter(field.name)}Error ? 'red' : ''}} className="${name}-error">
          {shouldShow${uppercaseFirstLetter(field.name)}Error ? formErrors.${field.name} : ''}
        </p>
      </div>
      ` : `<label htmlFor="${field.name}">
        <p>
          ${uppercaseFirstLetter(field.name)}
        </p>
        <input style={{borderColor: shouldShow${uppercaseFirstLetter(field.name)}Error ? 'red' : ''}} className="${name}-input" id="${field.name}" onChange={handleChange} onBlur={handleBlur} value={formData.${field.name}} type="${field.type === 'string' ? 'text' : 'number'}" />
        <p style={{color: shouldShow${uppercaseFirstLetter(field.name)}Error ? 'red' : ''}} className="${name}-error">
          {shouldShow${uppercaseFirstLetter(field.name)}Error ? formErrors.${field.name} : ''}
        </p>
      </label>
      `
      );
    }).join('')
  }
    return (
`import React, { useState, FocusEvent, ChangeEvent, FC } from 'react';
import { useFormValidator } from './validation/useFormValidator';
${validatorImports?.length ? `import { ${validatorImports.join(', ')} } from './validation/validators';` : ''}

interface FormData {
  ${generateFormDataInterface()}
}

const ${name}: FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({${generateFormData()}
  });
  
  const { formErrors, formValid, submitDisabled } = useFormValidator(formData, {
    ${generateFormValidators()}
    }
  );

  const formatValue = (e: ChangeEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>) => {
    ${fields.some(field => field.type === 'boolean') ? 'const key = e.target.id as keyof FormData' : ''}
    switch (e.target.type) {${fields.some(field => field.type === 'boolean') ? 
      `
      case 'checkbox': {
        return !formData[key];
      }` : ''}
      case 'text': {
        return e.target.value;
      }${fields.some(field => field.type === 'number') ? 
      `
      case 'number': {
        return parseInt(e.target.value);
      }` : ''}
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: formatValue(e),
    })
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: formatValue(e),
      [\`\${e.target.id}Touched\`]: true,
    })
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
    if (formValid) {
      // Make Request logic
      alert('Submitted')
    }
  }

  const submitButtonDisabled = submitDisabled || (isSubmitted && !formValid);${generateFieldErrors()}

  return (
    <div className="${name}">
      ${generateFormHtmlFields()}
      <button disabled={submitButtonDisabled} onClick={handleSubmit} className="${name}-button" type="submit">
        Submit form
      </button>
    </div>
  );
}

export { ${name} };`
    )
}

export { FormGenerator }