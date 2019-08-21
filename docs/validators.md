---
id: validators
title: Validators
sidebar_label: Validators
---

Validators are object that you can attach to your form fields in your form
config object in order to generate errors. For example:

```javascript
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

```javascript
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

```javascript
import { required } from "redux-freeform";

formState.fieldName.errors.includes(required.error); // true if "fieldName" field has a "required" error
```
