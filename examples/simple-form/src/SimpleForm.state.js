import {
  createFormState,
  matchesField,
  numberLessThan,
  numberGreaterThan,
  onlyIntegers,
  hasLength,
  required,
  matchesRegex,
  validateWhen
} from "redux-freeform";

console.log(validateWhen(required(), numberGreaterThan(18), "age"));

const formConfig = {
  age: {
    validators: [required(), onlyIntegers(), numberLessThan(99)]
  },
  maritalStatus: {
    validators: [validateWhen(required(), numberGreaterThan(18), "age")]
  },
  name: {
    validators: [required()]
  },
  confirmName: {
    validators: [required(), matchesField("name")]
  },
  country: {
    defaultValue: "U.S.",
    validators: [required()]
  },
  fourDigitCode: {
    validators: [required(), hasLength(4, 4)],
    constraints: [onlyIntegers(), hasLength(0, 4)]
  },
  regexMatch: {
    validators: [required(), matchesRegex("^[^s@]+@[^s@]+.[^s@]+$")] //simple regex to validate email address
  },
  animal: {
    validators: [required()]
  },
  animalNoise: {
    validators: [
      validateWhen(required(), matchesRegex("^.+$"), "animal"),
      validateWhen(matchesRegex("^woof$"), matchesRegex("^dog$"), "animal"),
      validateWhen(matchesRegex("^meow$"), matchesRegex("^cat$"), "animal"),
      validateWhen(matchesRegex("^moo$"), matchesRegex("^cow$"), "animal")
    ]
  }
};

export const { reducer, mapStateToProps, mapDispatchToProps } = createFormState(
  formConfig
);
