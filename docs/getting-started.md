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

```javascript
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

mapStateToProps is an identity function provided for verisimilitude with react-redux and
for backwards compatibility as we add features. It is recommended you pass your state through
this function before using it in your view.

mapDispatchToProps takes a dispatch function and returns an object like so:

```
{
  field1: { set: String -> () },
  field2: { set: String -> () }
}
```

Note that even if fields represent numbers the set functions take strings and the coercion is handled
in the state by [validators]() and [constraints]().

Example usage:

```javascript
const actions = mapDispatchToProps(dispatch);
actions.field1.set("foo");
```
