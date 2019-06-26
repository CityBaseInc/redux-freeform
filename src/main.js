import { computeErrors } from "./validation";

const createInitialState = formConfig => {
  const unvalidatedForm = Object.entries(formConfig)
    .map(([key, value]) => {
      const rawValue = value.defaultValue || "";
      const validators = value.validators || [];
      return {
        [key]: {
          dirty: false,
          rawValue,
          validators,
          isInterdependent: validators.reduce(
            (acc, v) => acc || v.isInterdependent,
            false
          )
        }
      };
    })
    .reduce((acc, next) => ({ ...acc, ...next }));
  // Because validators require the entire form we have to do a
  // second pass to add errors once the initial form has been
  // constructed
  const fields = Object.entries(unvalidatedForm)
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
    .reduce((acc, next) => ({ ...acc, ...next }), {});
  return {
    ...fields,
    interdependentFields: [
      Object.entries(fields)
        .filter(([fieldName, fieldObj]) => fieldObj.isInterdependent)
        .map(([fieldName]) => fieldName)
    ]
  };
};

const SET = "field/SET";
const set = fieldName => value => ({
  type: SET,
  payload: { fieldName, value }
});

const createFormReducer = formConfig => (
  state = createInitialState(formConfig),
  action = {}
) => {
  switch (action.type) {
    case SET:
      const changedFieldName = action.payload.fieldName;
      const newRawValue = action.payload.value;
      const field = state[changedFieldName];
      const newFormState = {
        ...state,
        [changedFieldName]: {
          ...field,
          rawValue: newRawValue
        }
      };
      const fieldsToValidate = [
        ...new Set([...state.interdependentFields, changedFieldName])
      ];
      const updatedFields = fieldsToValidate
        .map(fieldName => {
          const errors = computeErrors(fieldName, newFormState);
          return {
            [fieldName]: {
              ...newFormState[fieldName],
              dirty: true,
              errors,
              hasErrors: errors.length > 0
            }
          };
        })
        .reduce((acc, curr) => ({ ...acc, ...curr }), {});
      return {
        ...newFormState,
        ...updatedFields
      };
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
