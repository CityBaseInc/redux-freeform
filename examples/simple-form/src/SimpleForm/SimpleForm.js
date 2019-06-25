import {
  required
} from "redux-formal/validators";
import React from "react";

const FieldError =  ({ field }) => {
  if (field.hasError) {
    if (field.errors.includes(required.error)) {
      return "Field is required";
    } else {
      return "Please enter a valid value";
    }
  } else {
    return null;
  }
}

const SimpleForm = ({ actions, fields }) => (
  <form>
    <label>Age</label>
    <FieldError field={fields.age} />
    <input
      name="age"
      value={fields.age.rawValue}
      onChange={e => actions.age.set(e.target.value)} />
  </form>
);
