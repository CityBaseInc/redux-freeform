---
id: validators
title: Validators
sidebar_label: Validators
---

Validators are small configuration objects that get consumed by [createFormState](create-form-state.md) and the internals of redux-freeform when performing validation. These objects would be combersome to write by hand, so redux-freeform exposes functions to generate these objects. Some validator creators take no arguments, some take arguments that will be used in the returned configuration objects `args` array and consumed during validation.

Example usage:

```jsx
import {
  createFormState,
  numberLessThan,
  onlyIntegers,
  required
} from "redux-freeform";

const formConfig = {
  age: {
    validators: [required(), onlyIntegers(), numberLessThan(99)]
  }
};
```

`required`, `onlyIntegers`, and `numberLessThan` are functions that generate serializable objects
representing validators and their parameters. They will return object that look like this:

```jsx
{
  type: "validator/REQUIRED",
  args: [],
  error: "error/REQUIRED"
}
```

- `type` a constant representing the validator type, used for validation function lookup
- `args` an optional array of arguments that parameterize the validator
- `error` the error constant that will be given to the state if the validator does not pass

## Errors

You can access errors from the state and compare them to a given validator like so:

```jsx
import { required } from "redux-freeform";

fields.fieldName.errors.includes(required.error); // true if "fieldName" field has a "required" error
```

## IMPORTANT NOTE:
To allow for fields to be optional by default, we have chosen to only return errors for NON-empty input values. The exception to this is the `required` validator which returns false for empty and true for anything else and thus should be used on all required form fields.

Internally, we break this rule for the when behavior. when takes another validator object as an argument to use as a predicate. Say field a has the following configuration:
```jsx
{
  a: {
    validators: [validateWhen(required(), onlyIntegers(), "b")]
  },
  b: {
    validators: []
  }
```

If `onlyIntegers` kept convention and validated `""`, a would be required by default as the precondition for when would be met causing `required` to validate against field a and reject. For this reason, any validator passed as the _second_ argument to validatedWhen (its precondition) will return false for an empty string to invert the default UX. In practice, this is more intuitive than it sounds.
