![header](/images/freeform-banner-small.png)

[![CircleCI](https://circleci.com/gh/CityBaseInc/redux-freeform/tree/master.svg?style=svg&circle-token=c438da276819dc386059028121b088ca581341fc)](https://circleci.com/gh/CityBaseInc/redux-freeform/tree/master)

[Read the Docs!](https://citbaseinc.github.io/redux-freeform)

## What?

Freeform is a library that generates form management reducers for you. It handles validation and formatting
and provides state information for you to render as you like. Freeform is _renderless_ which is to say
it makes no decisions for how you display the form state. As such it does not necessarily depend upon
React and could in theory be used with Angular or any other view library you're using with redux.

Freeform supports the Component Reducer Pattern where your apps contain no component state
and are composed of smaller redux "apps" that can be managed in the parent state as is convenient.

Freeform will takes a form configuration object and generates a `mapStateToProps`, `mapDispatchToProps`,
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
