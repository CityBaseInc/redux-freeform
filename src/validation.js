const createValidator = (type, error) => {
  let validator = (...args) => ({ type, args });
  validator.error = error;
  return validator;
};

export let validatorFns = {};

export const REQUIRED = "validator/REQUIRED";
export const REQUIRED_ERROR = "error/REQUIRED";
export const required = createValidator(REQUIRED, REQUIRED_ERROR);
validatorFns[REQUIRED] = (value, args, form) => value !== "";

export const ONLY_NUMBERS = "validator/ONLY_NUMBERS";
export const ONLY_NUMBERS_ERROR = "error/ONLY_NUMBERS";
export const onlyNumbers = createValidator(ONLY_NUMBERS, ONLY_NUMBERS_ERROR);
validatorFns[ONLY_NUMBERS] = (value, args, form) => /^\d*$/.test(value);

export const NUMBER_LESS_THAN = "validator/NUMBER_LESS_THAN";
export const NUMBER_LESS_THAN_ERROR = "error/NUMBER_LESS_THAN";
export const numberLessThan = createValidator(
  NUMBER_LESS_THAN,
  NUMBER_LESS_THAN_ERROR
);
validatorFns[NUMBER_LESS_THAN] = (value, args, form) => {
  if (value === "") {
    return false;
  }
  return Number(value) < args[0];
};

export const MATCHES_FIELD = "validator/MATCHES_FIELD";
export const MATCHES_FIELD_ERROR = "error/MATCHES_FIELD";
export const matchesField = createValidator(MATCHES_FIELD, MATCHES_FIELD_ERROR);
validatorFns[MATCHES_FIELD] = (value, args, form) => {
  if (form[args[0]] === undefined) {
    throw new Error(
      `${
        args[0]
      } was passed to matchesField, but that field does not exist in the form`
    );
  }
  value === form[args[0]].rawValue;
};

export const runValidator = (validator, value, form) => {
  return validatorFns[validator.type](value, validator.args, form)
    ? null
    : validator.error;
};

export const computeErrors = (fieldName, form) => {
  const validators = form[fieldName].validators;
  return validators
    .map(v => runValidator(v, form[fieldName].rawValue, form))
    .filter(x => x !== null);
};
