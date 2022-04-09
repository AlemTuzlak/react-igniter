const useValidator = () => {
    return (
`
import { FormValidators } from "./validators";
 
export const useFormValidator = (
  formData: Record<string | number | symbol, any>,
  formValidators: Record<string, FormValidators>,
) => {
  const formErrors: Record<string, string> = {}
  let formValid = true
  let submitDisabled = false;
  for (const [key, value] of Object.entries(formData)) {
    if (!key.includes("Touched")) {
      formErrors[key] = ""
      formValidators[key]?.forEach(({validator, params}) => {
        const validated = validator(value, params)
        if (!validated.valid) {
          formErrors[key] = validated.message
        }
      })
    }
  }
  for (const value of Object.values(formErrors)) {
    if (value !== "") formValid = false
  }
  for (const [key, value] of Object.entries(formErrors)) {
    if (value !== "" && formData[key + 'Touched']) submitDisabled = true
  }
  return { formErrors, formValid, submitDisabled }
}
`
    )
}
export { useValidator }