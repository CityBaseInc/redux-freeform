import test from "ava";
import { testProp, fc } from "ava-fast-check";

import { fieldNameGen, initializeReducer } from "./util";

import {
  createInitialState,
  createFormReducer,
  createMapDispatchToProps,
  createFormState,
  set,
  clear,
  SET
} from "../src/main";
import {
  REQUIRED,
  REQUIRED_ERROR,
  MATCHES_FIELD,
  MATCHES_FIELD_ERROR,
  ONLY_INTEGERS,
  ONLY_INTEGERS_ERROR
} from "../src/validation";

const exampleRequiredField = {
  validators: [
    {
      type: REQUIRED,
      args: [],
      error: REQUIRED_ERROR
    }
  ]
};

const formConfig = {
  foo: exampleRequiredField
};

test("createFormState produces an object with valid state keys", t => {
  t.deepEqual(
    Object.keys(createFormState(formConfig)).sort(),
    ["reducer", "mapDispatchToProps", "mapStateToProps"].sort()
  );
});

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
      constraints: [],
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
      constraints: [],
      errors: [REQUIRED_ERROR],
      hasErrors: true,
      dirty: false
    }
  };
  t.deepEqual(initializeReducer(formReducer), expectedInitialState);
});

test("reducer set action updates correct field", t => {
  const formReducer = createFormReducer(formConfig);
  const initialState = initializeReducer(formReducer);
  const expectedState = {
    foo: {
      rawValue: "bar",
      validators: [
        {
          type: REQUIRED,
          args: [],
          error: REQUIRED_ERROR
        }
      ],
      constraints: [],
      errors: [],
      hasErrors: false,
      dirty: true
    }
  };
  t.deepEqual(
    formReducer(initialState, {
      type: SET,
      payload: { fieldName: "foo", value: "bar" }
    }),
    expectedState
  );
});

test("reducer set action re-validates dependent field", t => {
  const extendedFormConfig = {
    ...formConfig,
    matchesFoo: {
      validators: [
        {
          type: MATCHES_FIELD,
          args: ["foo"],
          error: MATCHES_FIELD_ERROR
        }
      ]
    }
  };
  const formReducer = createFormReducer(extendedFormConfig);
  const initialState = initializeReducer(formReducer);
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
      constraints: [],
      errors: [REQUIRED_ERROR],
      hasErrors: true,
      dirty: false
    },
    matchesFoo: {
      rawValue: "",
      validators: [
        {
          type: MATCHES_FIELD,
          args: ["foo"],
          error: MATCHES_FIELD_ERROR
        }
      ],
      constraints: [],
      errors: [],
      hasErrors: false,
      dirty: false
    }
  };
  t.deepEqual(expectedInitialState, initialState);
  const expectedState = {
    foo: {
      rawValue: "bar",
      validators: [
        {
          type: REQUIRED,
          args: [],
          error: REQUIRED_ERROR
        }
      ],
      constraints: [],
      errors: [],
      hasErrors: false,
      dirty: true
    },
    matchesFoo: {
      rawValue: "",
      validators: [
        {
          type: MATCHES_FIELD,
          args: ["foo"],
          error: MATCHES_FIELD_ERROR
        }
      ],
      constraints: [],
      errors: [MATCHES_FIELD_ERROR],
      hasErrors: true,
      dirty: false
    }
  };
  t.deepEqual(
    expectedState,
    formReducer(initialState, {
      type: SET,
      payload: { fieldName: "foo", value: "bar" }
    })
  );
});

test("createMapDispatchToProps returns valid action creators", t => {
  const extendedFormConfig = {
    ...formConfig,
    bax: exampleRequiredField,
    baz: exampleRequiredField
  };
  const dispatchObj = createMapDispatchToProps(extendedFormConfig)(x => x);
  t.deepEqual(dispatchObj.actions.fields.foo.set("bar1"), set("foo")("bar1"));
  t.deepEqual(dispatchObj.actions.fields.bax.set("bar2"), set("bax")("bar2"));
  t.deepEqual(dispatchObj.actions.fields.baz.set("bar3"), set("baz")("bar3"));
  t.deepEqual(dispatchObj.actions.form.clear(), clear());
});

test("createMapDispatchToProps returns a memoized fn", t => {
  const fnA = x => x;
  const fnB = x => x;
  const mapDispatchToProps = createMapDispatchToProps(formConfig);
  // These are reference comparisons, not deep equals
  t.is(mapDispatchToProps(fnA), mapDispatchToProps(fnA));
  t.not(mapDispatchToProps(fnA), mapDispatchToProps(fnB));
});

test("unable to make change that violates constraints", t => {
  const _formConfig = {
    foo: {
      constraints: [
        {
          type: ONLY_INTEGERS,
          args: [],
          error: ONLY_INTEGERS_ERROR
        }
      ]
    }
  };
  const formReducer = createFormReducer(_formConfig);
  const initialState = initializeReducer(formReducer);
  t.deepEqual(initialState, formReducer(initialState, set("foo")("a")));
});

test("able to make change that does not violate constraints", t => {
  const _formConfig = {
    foo: {
      constraints: [
        {
          type: ONLY_INTEGERS,
          args: [],
          error: ONLY_INTEGERS_ERROR
        }
      ]
    }
  };
  const formReducer = createFormReducer(_formConfig);
  const initialState = initializeReducer(formReducer);
  const expectedState = {
    foo: {
      errors: [],
      rawValue: "1",
      constraints: [
        {
          type: ONLY_INTEGERS,
          args: [],
          error: ONLY_INTEGERS_ERROR
        }
      ],
      validators: [],
      hasErrors: false,
      dirty: true
    }
  };
  t.deepEqual(expectedState, formReducer(initialState, set("foo")("1")));
});
