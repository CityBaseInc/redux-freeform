/* eslint-disable no-unused-vars */
import { validatorToPredicate } from "./util";

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

export const ONLY_NATURALS = "validator/ONLY_NATURALS";
export const ONLY_NATURALS_ERROR = "error/ONLY_NATURALS";
export const onlyNaturals = createValidator(ONLY_NATURALS, ONLY_NATURALS_ERROR);
validatorFns[ONLY_NATURALS] = (value, args, form) => /^(\d+)?$/.test(value);

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

export const NUMBER_GREATER_THAN = "validator/NUMBER_GREATER_THAN";
export const NUMBER_GREATER_THAN_ERROR = "error/NUMBER_GREATER_THAN";
export const numberGreaterThan = createValidator(
  NUMBER_GREATER_THAN,
  NUMBER_GREATER_THAN_ERROR
);
validatorFns[NUMBER_GREATER_THAN] = (value, args, form) => {
  if (value === "") {
    return true;
  }
  return Number(value) > args[0];
};

export const MATCHES_FIELD = "validator/MATCHES_FIELD";
export const MATCHES_FIELD_ERROR = "error/MATCHES_FIELD";
export const matchesField = createValidator(MATCHES_FIELD, MATCHES_FIELD_ERROR);
validatorFns[MATCHES_FIELD] = (value, args, form) => {
  if (form[args[0]] === undefined) {
    throw new Error(
      `${args[0]} was passed to matchesField, but that field does not exist in the form`
    );
  }
  return value === form[args[0]].rawValue;
};

export const validateWhenErrorMessage = type =>
  `${type} was passed to validateWhen, but that validator type does not exist. 
  Please check that you are only calling validator creator functions exported from 
  redux-freeform in your form config and that you didn't forget to 
  invoke the validator creator (you cannot pass the functions themselves to 
  createFormState). Also make sure you aren't passing validateWhen() to validateWhen
  as the primary validator.`;

export const VALIDATE_WHEN = "validator/VALIDATE_WHEN";
export const VALIDATE_WHEN_ERROR = "error/VALIDATE_WHEN";
export const validateWhen = (
  dependentValidator,
  primaryValidator,
  optionalFieldName
) => ({
  type: VALIDATE_WHEN,
  args: [dependentValidator, primaryValidator, optionalFieldName],
  error: dependentValidator.error
});
validatorFns[VALIDATE_WHEN] = (value, args, form) => {
  const [dependentValidator, primaryValidator, optionalFieldName] = args;
  const dependsOnOtherField = typeof optionalFieldName === "string";
  const primaryPredicate = validatorToPredicate(
    validatorFns[primaryValidator.type],
    false
  );

  if (primaryPredicate === undefined) {
    throw validateWhenErrorMessage(primaryValidator.type);
  }
  if (dependsOnOtherField && form[optionalFieldName] === undefined) {
    throw new Error(
      `${args[2]} was passed to matchesField, but that field does not exist in the form`
    );
  }

  const primaryValue = dependsOnOtherField
    ? form[optionalFieldName].rawValue
    : value;
  const primaryPredicatePassed = primaryPredicate(
    primaryValue,
    primaryValidator.args,
    form
  );

  return primaryPredicatePassed
    ? validatorFns[dependentValidator.type](
        value,
        dependentValidator.args,
        form
      )
    : true;
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

export const MATCHES_REGEX = "validator/MATCHES_REGEX";
export const MATCHES_REGEX_ERROR = "error/MATCHES_REGEX";
export const matchesRegex = createValidator(MATCHES_REGEX, MATCHES_REGEX_ERROR);
validatorFns[MATCHES_REGEX] = (value, args, form) =>
  new RegExp(args[0]).test(value); // new RexExp never throws an error, no matter the input

// based on http://www.brainjar.com/js/validation/
export const IS_ROUTING_NUMBER = "validator/IS_ROUTING_NUMBER";
export const IS_ROUTING_NUMBER_ERROR = "error/IS_ROUTING_NUMBER";
export const isRoutingNumber = createValidator(
  IS_ROUTING_NUMBER,
  IS_ROUTING_NUMBER_ERROR
);
validatorFns[IS_ROUTING_NUMBER] = (value, args, form) => {
  if (value === "") {
    return true;
  }
  if (value.length != 9) {
    return false;
  }
  const sum = value
    .split("")
    .map(ch => parseInt(ch))
    .reduce((acc, cur, idx) => {
      switch (idx % 3) {
        case 0:
          return acc + 3 * cur;
        case 1:
          return acc + 7 * cur;
        case 2:
          return acc + 1 * cur;
      }
    }, 0);
  return sum != 0 && sum % 10 == 0;
};

export const runValidatorErrorMessage = type =>
  `${type} was passed to runValidator, but that validator type does not exist. 
  Please check that you are only calling validator creator functions exported from 
  redux-freeform in your form config and that you didn't forget to 
  invoke the validator creator (you cannot pass the functions themselves to 
  createFormState)`;

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
