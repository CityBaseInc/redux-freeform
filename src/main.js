import produce from "immer";
import {
  computeConstraints,
  computeDirtyEntries,
  computeErrorEntries,
  computeErrors,
} from "./validation";

export const createInitialState = (formConfig) => {
  let initialForm = {};
  const formConfigKeys = Object.keys(formConfig);
  for (let formKey of formConfigKeys) {
    initialForm[formKey] = {
      dirty: false,
      rawValue: formConfig[formKey].defaultValue || "",
      validators: formConfig[formKey].validators || [],
      constraints: formConfig[formKey].constraints || [],
    };
  }
  // Because validators require the entire form we have to do a
  // second pass to add errors once the initial form has been
  // constructed
  for (let formKey of formConfigKeys) {
    let errors = computeErrors(formKey, initialForm);
    initialForm[formKey].errors = errors;
    initialForm[formKey].hasErrors = errors.length > 0;
  }

  return initialForm;
};

export const SET = "field/SET";
export const set = (fieldName) => (value) => ({
  type: SET,
  payload: { fieldName, value },
});

export const CLEAR = "form/CLEAR";
export const clear = () => ({ type: CLEAR });

export const ADD_VALIDATOR = "field/ADD_VALIDATOR";
export const addValidator = (fieldName) => (validator) => ({
  type: ADD_VALIDATOR,
  payload: { fieldName, validator },
});

export const REMOVE_VALIDATOR = "field/REMOVE_VALIDATOR";
export const removeValidator = (fieldName) => (validator) => ({
  type: REMOVE_VALIDATOR,
  payload: { fieldName, validator },
});

export const CLEAR_FIELD_VALIDATORS = "field/CLEAR_FIELD_VALIDATORS";
export const clearFieldValidators = (fieldName) => () => ({
  type: CLEAR_FIELD_VALIDATORS,
  payload: { fieldName },
});

export const createFormReducer =
  (formConfig) =>
  (state = createInitialState(formConfig), action) => {
    switch (action.type) {
      case SET: {
        const changedFieldName = action.payload.fieldName;
        const newRawValue = action.payload.value;

        return produce(state, (draftState) => {
          let originalValue = draftState[changedFieldName].rawValue;
          draftState[changedFieldName].rawValue = newRawValue;
          if (computeConstraints(changedFieldName, draftState).length > 0) {
            // If the change violates constraints, revert the change
            draftState[changedFieldName].rawValue = originalValue;
            return draftState;
          }

          computeDirtyEntries(draftState, changedFieldName);
          computeErrorEntries(draftState);
        });
      }
      case CLEAR:
        return createInitialState(formConfig);
      case ADD_VALIDATOR: {
        const fieldWithOverride = action.payload.fieldName;
        const newValidator = action.payload.validator;

        return produce(state, (draftState) => {
          draftState[fieldWithOverride].validators.push(newValidator);
          computeErrorEntries(draftState);
        });
      }
      case REMOVE_VALIDATOR: {
        const fieldToOverride = action.payload.fieldName;
        const targetValidator = action.payload.validator;

        return produce(state, (draftState) => {
          let fieldValidators = draftState[fieldToOverride].validators;
          draftState[fieldToOverride].validators = fieldValidators.filter(
            (validator) => validator.type !== targetValidator.type
          );
          computeErrorEntries(draftState);
        });
      }
      case CLEAR_FIELD_VALIDATORS: {
        const fieldToClear = action.payload.fieldName;

        return produce(state, (draftState) => {
          draftState[fieldToClear].validators = [];
          computeErrorEntries(draftState);
        });
      }
      default:
        return state;
    }
  };

export const createMapDispatchToProps = (formConfig) => {
  // Do memo-ization
  let cachedDispatch;
  let cacheValue;
  return (dispatch) => {
    if (dispatch == cachedDispatch) {
      return cacheValue;
    }
    let dispatchObj = {};
    dispatchObj.fields = {};
    const keys = Object.keys(formConfig);
    for (let fieldName of keys) {
      dispatchObj.fields[fieldName] = {
        set: (value) => dispatch(set(fieldName)(value)),
        addValidator: (validator) => dispatch(addValidator(fieldName)(validator)),
        removeValidator: (validator) =>
          dispatch(removeValidator(fieldName)(validator)),
        clear: () => dispatch(clearFieldValidators(fieldName)()),
      };
    }
    dispatchObj.form = { clear: () => dispatch(clear()) };
    cachedDispatch = dispatch;
    cacheValue = { actions: dispatchObj };
    return cacheValue;
  };
};

export const mapStateToProps = (state) => ({ fields: state });

export const createFormState = (formConfig) => ({
  reducer: createFormReducer(formConfig),
  mapDispatchToProps: createMapDispatchToProps(formConfig),
  mapStateToProps: mapStateToProps,
});
