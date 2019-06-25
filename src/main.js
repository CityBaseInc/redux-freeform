import { computeErrors } from "validation";

const createInitialState = formConfig => {
  const unvalidatedForm = Object.entries(formConfig).map(([key, value]) => {
    const rawValue = value.defaultValue || "";
    const validators = value.validators || [];
    return {
      [key]: {
        dirty: false,
        rawValue,
        validators
      }
    };
  }).reduce((acc, next) => ({...acc, ...next}));
  // Because validators require the entire form we have to do a
  // second pass to add errors once the initial form has been
  // constructed
  return Object.entries(unvalidatedForm).map(([key, value]) => {
    const errors = computeErrors(key, unvalidatedForm);
    return {
      [key]: {
        ...value,
        errors,
        hasErrors: errors.length > 0
      }
    }
  }).reduce((acc, next) => ({ ...acc, ...next}));
};

const SET = "field/SET";
const set = fieldName => value => ({
  type: SET,
  payload: { fieldName, value }
});

const createFormReducer = formConfig => (
  state = createInitialState(formConfig),
  action
) => {
  switch (action.type) {
    const field = state[action.payload.fieldName];
    case SET:
      return {
        ...state,
        [action.payload.fieldName]: {
          ...field,
          rawValue: action.payload.value,
          dirty: true,
          errors: computeErrors(field.validators, action.payload.value)
        }
      }
  }
};

export const createFormState = formConfig => ({
  reducer: createFormReducer(formConfig)
});
