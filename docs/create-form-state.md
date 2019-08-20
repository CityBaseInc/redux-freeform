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
- `validators` a list of validator object to apply to the field, these generate errors [Read More]()
- `constraints` a list of constraint objects to apply to the field, these block changes [Read More]()
