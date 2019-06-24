import {
  required,
  onlyNumbers,
  numberLessThan,
  onlyAlphabetical,
  minimumLength,
  matchesOtherField
} from "redux-formal/validators";
import { createFormState } from "redux-formal";

const formConfig = {
    age: {
      validators: [required(), onlyNumbers(), numberLessThan(99)]
    },
    name: {
      validators: [required(), onlyAlphabetical(), minimumLength(3)]
    },
    confirmName: {
      validators: [required(), matchesOtherField("name")]
    },
    country: {
      defaultValue: "U.S.",
      validators: [required()]
    },
    customCode: {
      validators: [matchesRegex(/[0-9]+/)]
    }
};

export {
  reducer,
  mapStateToProps,
  mapDispatchToProps
} = createFormState(formConfig);
