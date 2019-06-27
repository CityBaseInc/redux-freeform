const createValidator = (type, error) => {
  let validator = (...args) => ({ type, args, error });
  validator.error = error;
  return validator;
};

export let validatorFns = {};

const memoize = (resolver, fn) => {
  let cache = {};
  return (...args) => {
    const cacheKey = resolver(...args);
    const cachedVal = cache[cacheKey];
    if (cachedVal !== undefined) {
      return cachedVal;
    }
    const result = fn(...args);
    cache[cacheKey] = result;
    return result;
  };
};

export const REQUIRED = "validator/REQUIRED";
export const REQUIRED_ERROR = "error/REQUIRED";
export const required = createValidator(REQUIRED, REQUIRED_ERROR);
validatorFns[REQUIRED] = memoize(
  value => value,
  (value, args, form) => value !== ""
);

export const ONLY_INTEGERS = "validator/ONLY_INTEGERS";
export const ONLY_INTEGERS_ERROR = "error/ONLY_INTEGERS";
export const onlyIntegers = createValidator(ONLY_INTEGERS, ONLY_INTEGERS_ERROR);
validatorFns[ONLY_INTEGERS] = memoize(
  value => value,
  (value, args, form) => /^-?\d+$/.test(value)
);

export const NUMBER_LESS_THAN = "validator/NUMBER_LESS_THAN";
export const NUMBER_LESS_THAN_ERROR = "error/NUMBER_LESS_THAN";
export const numberLessThan = createValidator(
  NUMBER_LESS_THAN,
  NUMBER_LESS_THAN_ERROR
);
validatorFns[NUMBER_LESS_THAN] = memoize(
  (value, args) => String(args[0]) + value,
  (value, args, form) => {
    if (value === "") {
      return false;
    }
    return Number(value) < args[0];
  }
);

export const MATCHES_FIELD = "validator/MATCHES_FIELD";
export const MATCHES_FIELD_ERROR = "error/MATCHES_FIELD";
export const matchesField = createValidator(MATCHES_FIELD, MATCHES_FIELD_ERROR);
validatorFns[MATCHES_FIELD] = memoize(
  (value, args, form) => value + (form[args[0]] || {}).rawValue,
  (value, args, form) => {
    if (form[args[0]] === undefined) {
      throw new Error(
        `${
          args[0]
        } was passed to matchesField, but that field does not exist in the form`
      );
    }
    return value === form[args[0]].rawValue;
  }
);

export const runValidatorErrorMessage = type =>
  `${type} was passed to runValidator, but that validator type does not exist. 
  Please check that you are only calling validator functions exported from 
  redux-formal/validators in your form config.`;

export const runValidator = (validator, value, form) => {
  const validatorFn = validatorFns[validator.type];
  if (validatorFn === undefined) {
    throw new Error(runValidatorErrorMessage(validator.type));
  }
  return validatorFn(value, validator.args, form) ? null : validator.error;
};

export const computeErrors = (fieldName, form) => {
  const validators = form[fieldName].validators;
  let errors = [];
  let error = null;
  let v;
  for (v of validators) {
    error = runValidator(v, form[fieldName].rawValue, form);
    if (error !== null) {
      errors.push(error);
    }
  }
  return errors;
};
