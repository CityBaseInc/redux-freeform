---
id: validators-api
title: Validators
sidebar_label: Validators
---

All validators are functions that may or may not take arguments and return a validator object that will be consumed by [createFormState](create-form-state.md).

## required

required validates on anything other than an empty string

```jsx
import { required } from "redux-freeform";

const formConfig = {
  email: {
    validators: [required()]
  }
};
```

| Value | Validates |
| ----- | --------- |
| ""    | False     |
| "foo" | True      |

## onlyIntegers

onlyIntegers will validate only on fields containing integers

```jsx
import { onlyIntegers } from "redux-freeform";

const formConfig = {
  age: {
    validators: [onlyIntegers()]
  }
};
```

| Value   | Validates |
| ------- | --------- |
| ""      | True      |
| "123"   | True      |
| "asdf"  | False     |
| "as123" | False     |

## numberLessThan

numberLessThan will validate any number less than the one provided

```jsx
import { onlyIntegers } from "redux-freeform";

const formConfig = {
  age: {
    validators: [numberLessThan(11)]
  }
};
```

Arguments:
`hasLength(n)`

- `n` value must be numerically `<` this value

| Value | n   | Validates |
| ----- | --- | --------- |
| ""    | any | True      |
| "10"  | 11  | True      |
| "15"  | 11  | False     |

## hasLength

hasLength will validate for any string of the given length

```jsx
import { onlyIntegers } from "redux-freeform";

const formConfig = {
  code: {
    validators: [hasLength(4, 6)]
  }
};
```

Arguments:
`hasLength(min, max)`

- `min` value must be >= this value
- `max` value must be <= this value

you can specify exactly one length like so:

`hasLength(4, 4)`

| Value    | min | max | Validates |
| -------- | --- | --- | --------- |
| ""       | 0   | 4   | True      |
| ""       | 1   | 4   | False     |
| "abc"    | 4   | 4   | False     |
| "abc"    | 2   | 4   | True      |
| "abcdef" | 1   | 3   | False     |

## matchesField

matchesField validates if this fields value is equivalent to another given fields value

```jsx
import { onlyIntegers } from "redux-freeform";

const formConfig = {
  password: {
    validators: [hasLength(4, 6)]
  },
  confirmPassword: {
    validators: [matchesField("password")]
  }
};
```

Arguments:
`matchesField(fieldName)`

- `fieldName` the string name of another key in the form object

Note: this causes the field to essentially "inherit" the validators of the matching field, so you do not need to specify them on each one unless you want the errors to populate in both field states

| Value | Other Field Value | Validates |
| ----- | ----------------- | --------- |
| "foo" | "foo"             | True      |
| ""    | ""                | True      |
| "foo" | "bar"             | True      |
