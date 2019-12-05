import {
  createFormState,
  matchesField,
  numberLessThan,
  onlyIntegers,
  hasLength,
  required,
  matchesRegex
} from "redux-freeform";

const formConfig = {
  age: {
    validators: [required(), onlyIntegers(), numberLessThan(99)]
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
    validators: [required(), matchesRegex("^[^\s@]+@[^\s@]+\.[^\s@]+$")] //simple regex to validate email address
  }
};

export const { reducer, mapStateToProps, mapDispatchToProps } = createFormState(
  formConfig
);
