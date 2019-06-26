import { required, matchesField, onlyIntegers } from "./redux-formal";
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
  [onlyIntegers.error]: "age must be a whole number"
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
