import { required, matchesField } from "redux-formal";
import React from "react";

const fieldErrorMessages = {
  [required.error]: "required",
  [matchesField.error]: "must match"
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

const ProfilingForm = ({ actions, fields }) => {
  const fieldComponents = Object.keys(fields).map(fieldName => (
    <InputField
      key={fieldName}
      labelTextWhenNoError={fieldName}
      field={fields[fieldName]}
      fieldActions={actions[fieldName]}
      errorMessages={fieldErrorMessages}
    />
  ));
  return <form>{fieldComponents}</form>;
};

export default ProfilingForm;
