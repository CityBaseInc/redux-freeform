import {
  required,
  matchesField,
  onlyIntegers,
  numberLessThan,
  hasLength
} from "redux-freeform";
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
const fourDigitCodeErrorMessages = {
  [required.error]: "four digit code is required",
  [hasLength.error]: "four digit code must be 4 numbers"
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
      value={field.formattedValue}
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
    <InputField
      field={fields.fourDigitCode}
      fieldActions={actions.fourDigitCode}
      labelTextWhenNoError="four digit code"
      errorMessages={fourDigitCodeErrorMessages}
    />
    <InputField
      field={fields.phoneNumber}
      fieldActions={actions.phoneNumber}
      labelTextWhenNoError="phone number"
    />
  </form>
);

export default SimpleForm;
