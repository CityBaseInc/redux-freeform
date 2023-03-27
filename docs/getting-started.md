---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

## Installation

Run the following with yarn:

`yarn add redux-freeform`

or with npm:

`npm install redux-freeform`

## Create A Form

Create a form config object:

```jsx
import { createFormState } from "redux-freeform";

const formConfig = {
  field1: {},
  field2: {}
};

const { reducer, mapStateToProps, mapDispatchToProps } = createFormState(
  formConfig
);
```

Now you can use `reducer, mapStateToProps, mapDispatchToProps` as you would in any
other Redux app.

mapStateToProps is an function for use with react-redux that takes the form state and returns an object

```jsx
{
  fields: state
}
```

mapDispatchToProps takes a dispatch function and returns an object like so:

```jsx
{
  actions: {
    fields: {
      field1: { 
        set: String -> (),
        addValidator: Object -> ()
       },
      field2: { 
        set: String -> (),
        addValidator: Object -> ()
      }
    },
    form: {
      clear: () -> ()
    }
  }
}
```

Note that even if fields represent numbers the set functions take strings and the coercion is handled
in the state by [validators](validators.md) and [constraints](constraints.md).

Example usage:

```jsx
const props = mapDispatchToProps(dispatch);
props.actions.fields.field1.set("foo");
props.actions.fields.fields.addValidator(hasLength(3, 4))
props.actions.form.clear();
```

## Updating a form
When using these actions for a form or field actions inside `useEffect`, you will need to include the form or field actions as a dependency to avoid useEffect causing an infinite render loop.

### Examples:
**For field actions, include `actions.fields.<fieldname>`**
```
  useEffect(() => {
    if(requiresEmail) {
      actions.fields.email.addValidator(required());
    }
  }, [actions.fields.email]);
```
```
  useEffect(() => {
    if(emailIsNotRequired) {
      actions.fields.email.removeValidator(required());
    }
  }, [actions.fields.email]);
```

**For form actions, include `actions.form`**
```
  useEffect(() => {
    if(clearOnDismount) {
      actions.form.clearValidators();
    }
  }, [actions.form]);
```

## Putting It Together With React

```jsx
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { createFormState, required, hasLength } from "redux-freeform";

const myFormConfig = {
  field1: {
    validators: [required()]
  }
};
const { reducer, mapStateToProps, mapDispatchToProps } = createFormState(
  myFormConfig
);

const MyForm = ({ actions, fields }) => (
  <div>
    {fields.field1.hasErrors && fields.field1.errors.includes(required.error)
      ? "Field 1 is required"
      : "Field 1"}
    <input
      value={fields.field1.rawValue}
      onChange={evt => actions.fields.field1.set(evt.target.value)}
      type="text"
    />
  </div>
);

const MySecondForm = ({ actions, fields, isTrue }) => {
  useEffect(() => {
    if(isTrue) {
      actions.fields.field1.addValidator(hasLength(3, 4))
    }
  }, [actions.fields.field1])

  return (
    <div>
      {fields.field1.hasErrors && fields.field1.errors.includes(required.error)
        ? "Field 1 is required"
        : fields.field1.hasErrors && fields.field1.errors.includes(hasLength.error) 
        ? "Field 1 is incorrect length" 
        : "Field 1"}
      <input
        value={fields.field1.rawValue}
        onChange={evt => actions.fields.field1.set(evt.target.value)}
        type="text"
      />
    </div>
  )
}

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
const rootEl = document.getElementById("root");
const render = () =>
  ReactDOM.render(
    <MyForm
      {...mapStateToProps(store.getState())}
      {...mapDispatchToProps(store.dispatch)}
    />,
    rootEl
  );

render();
store.subscribe(render);
```
