export const validatorToPredicate =
  (validatorFn, emptyCase) =>
  (value, ...rest) =>
    value === "" ? emptyCase : validatorFn(value, ...rest);
