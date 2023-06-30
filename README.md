![header](/images/freeform-banner-small.png)

![Build Status](https://github.com/CityBaseInc/redux-freeform/actions/workflows/test.yml/badge.svg)

[Read the Docs!](https://citybaseinc.github.io/redux-freeform)

## What?

Freeform is a library that generates form management reducers for you. It handles validation and provides state information for you to render as you like. Freeform is _renderless_ which is to say
it makes no decisions for how you display the form state. As such it does not necessarily depend upon
React and could in theory be used with Angular or any other view library you're using with redux.

Freeform supports a functional all-in approach to Redux apps. There are many benefits to keeping _all_ your state in Redux
but it can be tedious to write out all the reducers and actions. By generating form reducers from simple configs we make
this much more manageable.

Freeform takes a form configuration object and generates a `mapStateToProps`, `mapDispatchToProps`,
and `reducer` for you to use at your leisure.

## Why?

There are a lot of redux form management libraries. Some of those may suit your needs better. This library
will be of use to you if you want your app to contain a single source of truth for app state and
you want full flexibility in your rendering.

## Example Usage

Check the `/examples` folder for runnable examples. But here's what the API looks like:

```javascript
import {
  createFormState,
  matchesField,
  numberLessThan,
  onlyIntegers,
  required
} from "redux-freeform";

const formConfig = {
  age: {
    validators: [required(), onlyIntegers(), numberLessThan(99)]
  },
  name: {
    validators: [required()]
  },
  confirmName: {
    validators: [required(), matchesField("name")]
  },
  country: {
    defaultValue: "U.S.",
    validators: [required()]
  }
};

const { reducer, mapStateToProps, mapDispatchToProps } = createFormState(
  formConfig
);
```

## Testing

Ava is the test runner for Redux Freeform. 

- To run tests locally: `yarn run test`
- To check test coverage locally: `yarn run coverage`