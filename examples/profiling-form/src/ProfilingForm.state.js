import { createFormState, matchesField, required } from "redux-freeform";

let formConfig = {};
formConfig["field-0"] = {
  validators: [required()]
};
for (let i = 1; i < 1000; i++) {
  formConfig[`field-${i}`] = {
    validators: [required(), matchesField(`field-${i - 1}`)]
  };
}

export const { reducer, mapStateToProps, mapDispatchToProps } = createFormState(
  formConfig
);
