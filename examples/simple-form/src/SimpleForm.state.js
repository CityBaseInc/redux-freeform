import {
  createFormState,
  matchesField,
  numberLessThan,
  numberGreaterThan,
  onlyIntegers,
  hasLength,
  required,
  matchesRegex,
  validateWhen,
  validateSum,
  onlyNaturals
} from "redux-freeform";

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
  },
  numberOfDogs: {
    validators: [validateSum(numberLessThan(5), ["numberOfCats"])],
    constraints: [onlyNaturals()]
  },
  numberOfCats: {
    validators: [validateSum(numberLessThan(5), ["numberOfDogs"])],
    constraints: [onlyNaturals()]
  }
};

export const { reducer, mapStateToProps, mapDispatchToProps } = createFormState(
  formConfig
);
