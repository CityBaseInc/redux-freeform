import produce from "immer";
import { computeErrors, computeConstraints } from "./validation";

export const createInitialState = formConfig => {
  let initialForm = {};
  const formConfigKeys = Object.keys(formConfig);
  let formKey;
  for (formKey of formConfigKeys) {
    initialForm[formKey] = {
      dirty: false,
      rawValue: formConfig[formKey].defaultValue || "",
      validators: formConfig[formKey].validators || [],
      constraints: formConfig[formKey].constraints || []
    };
  }
  // Because validators require the entire form we have to do a
  // second pass to add errors once the initial form has been
  // constructed
  let errors;
  for (formKey of formConfigKeys) {
    errors = computeErrors(formKey, initialForm);
    initialForm[formKey].errors = errors;
    initialForm[formKey].hasErrors = errors.length > 0;
  }
  return initialForm;
};

export const SET = "field/SET";
export const set = fieldName => value => ({
  type: SET,
  payload: { fieldName, value }
});

export const createFormReducer = formConfig => (
  state = createInitialState(formConfig),
  action = {}
) => {
  switch (action.type) {
    case SET:
      const changedFieldName = action.payload.fieldName;
      const newRawValue = action.payload.value;

      return produce(state, draftState => {
        let originalValue = draftState[changedFieldName].rawValue;
        draftState[changedFieldName].rawValue = newRawValue;
        if (computeConstraints(changedFieldName, draftState).length > 0) {
          // If the change violates constraints, revert the change
          draftState[changedFieldName].rawValue = originalValue;
          return draftState;
        }

        const fields = Object.entries(draftState);
        for (let entry of fields) {
          let fieldName = entry[0];
          let field = entry[1];
          let errors = computeErrors(fieldName, draftState);
          let dirty = fieldName === changedFieldName ? true : field.dirty;
          draftState[fieldName].errors = errors;
          draftState[fieldName].dirty = dirty;
          draftState[fieldName].hasErrors = errors.length > 0;
        }
      });
    default:
      return state;
  }
};

// FIXME: This is broken
export const createMapDispatchToProps = formConfig => {
  // Do memo-ization
  let cachedDispatch;
  let cacheValue;
  return dispatch => {
    if (dispatch == cachedDispatch) {
      return cacheValue;
    }
    let dispatchObj = {};
    const keys = Object.keys(formConfig);
    for (let fieldName of keys) {
      dispatchObj[fieldName] = {
        set: value => dispatch(set(fieldName)(value))
      };
    }
    cachedDispatch = dispatch;
    cacheValue = dispatchObj;
    return dispatchObj;
  };
};

export const createFormState = formConfig => ({
  reducer: createFormReducer(formConfig),
  mapDispatchToProps: createMapDispatchToProps(formConfig),
  mapStateToProps: state => state
});
