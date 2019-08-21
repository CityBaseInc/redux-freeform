---
id: create-form-state
title: createFormState
sidebar_label: createFormState
---

`createFormState` is a function that takes a form config object and returns three functions:

- `reducer` a function that takes a current state and an action and returns an updated state
- `mapStateToProps` a function that given the state returns the view information about the state
- `mapDispatchToProps` a function that takes a dispatch function to communicate with the redux store and returns an object of functions to manipulate the state

This should be familiar if you have used redux and react-redux.

## Form Config

The form config object has as top level keys the names of your fields, for example:

```javascript
{
  name: {},
  age: {},
  city: {}
}
```

each field has its own configuration with these options:

- `defaultValue` the value to initialize the field to, by default an empty string
- `validators` a list of validator object to apply to the field, these generate errors [Read More](validators.md)
- `constraints` a list of constraint objects to apply to the field, these block changes [Read More](constraints.md)

## Form State

The form config object will be used to generate form state that can be consumed by your view that
looks like this:

```javascript
{
  name: {
    dirty: false,
    rawValue: '',
    validators: [],
    constraints: [],
    errors: [],
    hasErrors: false
  },
  age: {
    dirty: false,
    rawValue: '',
    validators: [],
    constraints: [],
    errors: [],
    hasErrors: false
  },
  city: {
    dirty: false,
    rawValue: '',
    validators: [],
    constraints: [],
    errors: [],
    hasErrors: false
  }
}
```

The top level keys are the same as the keys given to the form config and represent the fields.
Each sub-object has the following keys:

- `dirty` a boolean, this is false initially and becomes true once any change has occurred to the field
- `rawValue` a string, this is the value of the field as a string
- `validators` an array of objects, the validators to be applied to the field [Read More](validators.md)
- `constraints` an array of object, the constraints to be applied to the field [Read More](constraints.md)
- `errors` an array of strings, representing which validators are not satisfied by the current value
- `hasErrors` a boolean, representing if there are any errors (equivalent to checking if the errors array is empty)
