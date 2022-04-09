const validatorGenerator = () => {
    return (
`
interface Range {
  min?: number
  max?: number
}

export type ValidatorFunction = (...args: any[]) => ValidatorResponse

export interface ValidatorResponse {
  valid: boolean
  message: string
}

export type FormValidators = {
  validator: ValidatorFunction,
  params?: Record<string, any>
}[]

export const validateEmail: ValidatorFunction = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return {
    valid: re.test(String(email).toLowerCase()),
    message: "Invalid email",
  }
}

export const validateLength: ValidatorFunction = (value: string | number, params: Range) => {
  let isValid = false
  if (typeof value === 'string' && (params?.max ?? 999) >= value.length && (params?.min ?? 0) <= value.length) isValid = true
  if (typeof value === 'number' && (params?.max ?? 999) >= value && (params?.min ?? 0) <= value) isValid = true
  return {
    valid: isValid,
    message: "Invalid length",
  }
}

export const validateIfEmpty: ValidatorFunction = (string: string | number) => {
  return {
    valid:
      (typeof string === "string" || typeof string === "number") &&
        ((typeof string === "string" && string.trim().length) || typeof string === "number")
        ? true
        : false,
    message: "Can\'t be empty",
  }
}
`
    )
}

export { validatorGenerator }