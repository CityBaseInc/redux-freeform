import { required, matchesField, hasLength } from "redux-freeform";
import React, { useEffect } from "react";

const InputField = ({
  labelTextWhenNoError,
  field,
  fieldActions,
  errorMessages,
}) => (
  <div>
    <div>
      <label>
        {field.hasErrors ? errorMessages[field.errors[0]] : labelTextWhenNoError}
      </label>
    </div>
    <input
      value={field.rawValue}
      onChange={(e) => fieldActions.set(e.target.value)}
    />
    {!field.dirty && " ✴️"}
    {field.dirty && field.hasErrors && " ❌"}
    {field.dirty && !field.hasErrors && " ✅"}
    <p />
  </div>
);

const ProfilingForm = ({ actions, fields, addValidationProp }) => {
  useEffect(() => {
    if (addValidationProp) {
      Object.keys(actions.fields).map((fieldName) =>
        actions.fields[fieldName].addValidator(hasLength(3, 4))
      );
    }
  }, [actions.fields]);

  const fieldErrorMessages = {
    [required.error]: "required",
    [matchesField.error]: "must match",
    [hasLength.error]: "must have correct length",
  };

  const fieldComponents = Object.keys(fields).map((fieldName) => (
    <InputField
      key={fieldName}
      labelTextWhenNoError={fieldName}
      field={fields[fieldName]}
      fieldActions={actions.fields[fieldName]}
      errorMessages={fieldErrorMessages}
    />
  ));
  return (
    <div>
      <button onClick={() => actions.form.clear()}>Clear the form</button>
      {fieldComponents}
    </div>
  );
};

export default ProfilingForm;
