import produce from "immer";
import { computeErrors } from "./validation";

export const createInitialState = formConfig => {
  const unvalidatedForm = Object.entries(formConfig)
    .map(([key, value]) => {
      const rawValue = value.defaultValue || "";
      const validators = value.validators || [];
      return {
        [key]: {
          dirty: false,
          rawValue,
          validators
        }
      };
    })
    .reduce((acc, next) => ({ ...acc, ...next }));
  // Because validators require the entire form we have to do a
  // second pass to add errors once the initial form has been
  // constructed
  return Object.entries(unvalidatedForm)
    .map(([key, value]) => {
      const errors = computeErrors(key, unvalidatedForm);
      return {
        [key]: {
          ...value,
          errors,
          hasErrors: errors.length > 0
        }
      };
    })
    .reduce((acc, next) => ({ ...acc, ...next }));
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
        draftState[changedFieldName].rawValue = newRawValue;

        const fields = Object.entries(draftState);
        let entry, fieldName, field, errors, dirty;
        for (entry of fields) {
          fieldName = entry[0];
          field = entry[1];
          errors = computeErrors(fieldName, draftState);
          dirty = fieldName === changedFieldName ? true : field.dirty;
          draftState[fieldName].errors = errors;
          draftState[fieldName].dirty = dirty;
          draftState[fieldName].hasErrors = errors.length > 0;
        }
      });
    default:
      return state;
  }
};

export const createMapDispatchToProps = formConfig => dispatch => ({
  actions: Object.keys(formConfig)
    .map(fieldName => ({
      [fieldName]: {
        set: value => dispatch(set(fieldName)(value))
      }
    }))
    .reduce((acc, curr) => ({ ...acc, ...curr }))
});

export const createFormState = formConfig => ({
  reducer: createFormReducer(formConfig),
  mapDispatchToProps: createMapDispatchToProps(formConfig),
  mapStateToProps: state => ({ fields: state })
});
