import {
  required,
  matchesField,
  onlyIntegers,
  numberLessThan
} from "redux-formal";
import React from "react";

const nameFieldErrorMessages = {
  [required.error]: "name is required"
};
const confirmNameFieldErrorMessages = {
  [required.error]: "confirm name is required",
  [matchesField.error]: "confirm name must match name"
};
const ageFieldErrorMessages = {
  [required.error]: "age is required",
  [onlyIntegers.error]: "age must be a whole number",
  [numberLessThan.error]: "age must be less than 99"
};

const InputField = ({
  labelTextWhenNoError,
  field,
  fieldActions,
  errorMessages
}) => (
  <div>
    <div>
      <label>
        {field.hasErrors
          ? errorMessages[field.errors[0]]
          : labelTextWhenNoError}
      </label>
    </div>
    <input
      value={field.rawValue}
      onChange={e => fieldActions.set(e.target.value)}
    />
    {!field.dirty && " ✴️"}
    {field.dirty && field.hasErrors && " ❌"}
    {field.dirty && !field.hasErrors && " ✅"}
    <p />
  </div>
);

const SimpleForm = ({ actions, fields }) => (
  <form>
    <InputField
      field={fields.name}
      fieldActions={actions.name}
      labelTextWhenNoError="name"
      errorMessages={nameFieldErrorMessages}
    />
    <InputField
      field={fields.confirmName}
      fieldActions={actions.confirmName}
      labelTextWhenNoError="confirm name"
      errorMessages={confirmNameFieldErrorMessages}
    />
    <InputField
      field={fields.age}
      fieldActions={actions.age}
      labelTextWhenNoError="age"
      errorMessages={ageFieldErrorMessages}
    />
  </form>
);

export default SimpleForm;
