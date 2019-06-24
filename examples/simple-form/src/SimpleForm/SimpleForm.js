import {
  required
} from "redux-formal/validators";
import React from "react";

const FieldError =  ({ errors }) => {
  if (errors.length > 0) {
    if (errors.includes(required.error)) {
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
    <FieldError errors={fields.age.errors} />
    <input
      name="age"
      value={fields.age.value}
      onChange={e => actions.age.set(e.target.value)} />
  </form>
);
