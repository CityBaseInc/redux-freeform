const createValidator = (type, error) => {
  let validator = (...args) => ({ type, args, error });
  validator.error = error;
  return validator;
};

export let validatorFns = {};

export const REQUIRED = "validator/REQUIRED";
export const REQUIRED_ERROR = "error/REQUIRED";
export const required = createValidator(REQUIRED, REQUIRED_ERROR);
validatorFns[REQUIRED] = (value, args, form) => value !== "";

export const ONLY_INTEGERS = "validator/ONLY_INTEGERS";
export const ONLY_INTEGERS_ERROR = "error/ONLY_INTEGERS";
export const onlyIntegers = createValidator(ONLY_INTEGERS, ONLY_INTEGERS_ERROR);
validatorFns[ONLY_INTEGERS] = (value, args, form) => /^(-?\d+)?$/.test(value);

export const NUMBER_LESS_THAN = "validator/NUMBER_LESS_THAN";
export const NUMBER_LESS_THAN_ERROR = "error/NUMBER_LESS_THAN";
export const numberLessThan = createValidator(
  NUMBER_LESS_THAN,
  NUMBER_LESS_THAN_ERROR
);
validatorFns[NUMBER_LESS_THAN] = (value, args, form) => {
  if (value === "") {
    return true;
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
  return value === form[args[0]].rawValue;
};

export const HAS_LENGTH = "validator/HAS_LENGTH";
export const HAS_LENGTH_ERROR = "error/HAS_LENGTH";
export const hasLength = createValidator(HAS_LENGTH, HAS_LENGTH_ERROR);
validatorFns[HAS_LENGTH] = (value, args, form) => {
  const min = args[0];
  const max = args[1];
  if (max == undefined || min == undefined) {
    throw new Error(
      "Max and min need to be defined for hasLength, both or one of them is undefined"
    );
  }
  if (max < min) {
    throw new Error(
      "hasLength validator was passed a min greater than the max"
    );
  }
  const valueLength = value.length;
  return max >= valueLength && valueLength >= min;
};

export const EXCLUDES_CHARS = "validator/EXCLUDES_CHARS";
export const EXCLUDES_CHARS_ERROR = "error/EXCLUDES_CHARS";
export const excludesChars = createValidator(
  EXCLUDES_CHARS,
  EXCLUDES_CHARS_ERROR
);
validatorFns[EXCLUDES_CHARS] = (value, args, form) => {
  const excludedChars = args[0];
  if (excludedChars == undefined) {
    throw new Error(
      "excludesChars requires an array of excluded characters, but was passed undefined"
    );
  }
  return !value.split("").filter(char => excludedChars.includes(char)).length;
};

export const runValidatorErrorMessage = type =>
  `${type} was passed to runValidator, but that validator type does not exist.
  Please check that you are only calling validator functions exported from
  redux-freeform/validators in your form config.`;

export const runValidator = (validator, value, form) => {
  const validatorFn = validatorFns[validator.type];
  if (validatorFn === undefined) {
    throw new Error(runValidatorErrorMessage(validator.type));
  }
  return validatorFn(value, validator.args, form) ? null : validator.error;
};

const _computeErrors = (fieldName, form, validators) => {
  return validators
    .map(v => runValidator(v, form[fieldName].rawValue, form))
    .filter(x => x !== null);
};

export const computeConstraints = (fieldName, form) => {
  const constraints = form[fieldName].constraints;
  return _computeErrors(fieldName, form, constraints);
};

export const computeErrors = (fieldName, form) => {
  const validators = form[fieldName].validators;
  return _computeErrors(fieldName, form, validators);
};
