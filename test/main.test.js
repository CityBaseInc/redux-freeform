import test from "ava";
import { testProp, fc } from "ava-fast-check";

import { fieldNameGen } from "./util";

import {
  createInitialState,
  createFormReducer,
  createMapDispatchToProps,
  createFormState,
  set,
  SET
} from "../src/main";
import { REQUIRED, REQUIRED_ERROR } from "../src/validation";

const formConfig = {
  foo: {
    validators: [
      {
        type: REQUIRED,
        args: [],
        error: REQUIRED_ERROR
      }
    ]
  }
};

testProp(
  "set creates returns an action creator that returns a valid action",
  [fieldNameGen(), fc.string()],
  (fieldName, fieldValue) => {
    const action = set(fieldName)(fieldValue);
    return (
      action.type === SET &&
      action.payload.value === fieldValue &&
      action.payload.fieldName === fieldName
    );
  }
);

test("createInitialState takes a formConfig and returns a valid formState", t => {
  const expectedFormState = {
    foo: {
      rawValue: "",
      validators: [
        {
          type: REQUIRED,
          args: [],
          error: REQUIRED_ERROR
        }
      ],
      errors: [REQUIRED_ERROR],
      hasErrors: true,
      dirty: false
    }
  };
  t.deepEqual(createInitialState(formConfig), expectedFormState);
});

test("createFormReducer returns a valid form reducer", t => {
  const formReducer = createFormReducer(formConfig);
  const expectedInitialState = {
    foo: {
      rawValue: "",
      validators: [
        {
          type: REQUIRED,
          args: [],
          error: REQUIRED_ERROR
        }
      ],
      errors: [REQUIRED_ERROR],
      hasErrors: true,
      dirty: false
    }
  };
  t.deepEqual(formReducer(undefined, { type: "@@init" }), expectedInitialState);
});
