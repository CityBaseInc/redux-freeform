import { test, fc } from '@fast-check/jest';
import { expect } from '@jest/globals';

import { fieldNameGen, initializeReducer } from '../test/util';

import {
  createInitialState,
  createFormReducer,
  createMapDispatchToProps,
  createFormState,
  set,
  clear,
  SET,
  CLEAR,
  addValidator,
  ADD_VALIDATOR,
  REMOVE_VALIDATOR,
  CLEAR_FIELD_VALIDATORS,
} from '../src/main';
import {
  REQUIRED,
  REQUIRED_ERROR,
  MATCHES_FIELD,
  MATCHES_FIELD_ERROR,
  ONLY_INTEGERS,
  ONLY_INTEGERS_ERROR,
  HAS_LENGTH,
  HAS_LENGTH_ERROR,
} from '../src/validation';

const exampleRequiredField = {
  validators: [
    {
      type: REQUIRED,
      args: [],
      error: REQUIRED_ERROR,
    },
  ],
};

const formConfig = {
  foo: exampleRequiredField,
};

const validatorFixture = {
  type: HAS_LENGTH,
  args: [3, 4],
  error: HAS_LENGTH_ERROR,
};

test('createFormState produces an object with valid state keys', () => {
  expect(Object.keys(createFormState(formConfig)).sort()).toEqual(
    ['reducer', 'mapDispatchToProps', 'mapStateToProps'].sort()
  );
});

test.prop(
  'set creates returns an action creator that returns a valid action',
  [fieldNameGen(), fc.string()],
  (t, fieldName, fieldValue) => {
    const action = set(fieldName)(fieldValue);
    expect(
      action.type === SET &&
        action.payload.value === fieldValue &&
        action.payload.fieldName === fieldName
    ).toBe(true);
  }
);

test('createInitialState takes a formConfig and returns a valid formState', () => {
  const expectedFormState = {
    foo: {
      rawValue: '',
      validators: [
        {
          type: REQUIRED,
          args: [],
          error: REQUIRED_ERROR,
        },
      ],
      constraints: [],
      errors: [REQUIRED_ERROR],
      hasErrors: true,
      dirty: false,
    },
  };
  expect(createInitialState(formConfig)).toEqual(expectedFormState);
});

test('createFormReducer returns a valid form reducer', () => {
  const formReducer = createFormReducer(formConfig);
  const expectedInitialState = {
    foo: {
      rawValue: '',
      validators: [
        {
          type: REQUIRED,
          args: [],
          error: REQUIRED_ERROR,
        },
      ],
      constraints: [],
      errors: [REQUIRED_ERROR],
      hasErrors: true,
      dirty: false,
    },
  };
  expect(initializeReducer(formReducer)).toEqual(expectedInitialState);
});

test('reducer set action updates correct field', () => {
  const formReducer = createFormReducer(formConfig);
  const initialState = initializeReducer(formReducer);
  const expectedState = {
    foo: {
      rawValue: 'bar',
      validators: [
        {
          type: REQUIRED,
          args: [],
          error: REQUIRED_ERROR,
        },
      ],
      constraints: [],
      errors: [],
      hasErrors: false,
      dirty: true,
    },
  };
  expect(
    formReducer(initialState, {
      type: SET,
      payload: { fieldName: 'foo', value: 'bar' },
    })
  ).toEqual(expectedState);
});

test('reducer set action re-validates dependent field', () => {
  const extendedFormConfig = {
    ...formConfig,
    matchesFoo: {
      validators: [
        {
          type: MATCHES_FIELD,
          args: ['foo'],
          error: MATCHES_FIELD_ERROR,
        },
      ],
    },
  };
  const formReducer = createFormReducer(extendedFormConfig);
  const initialState = initializeReducer(formReducer);
  const expectedInitialState = {
    foo: {
      rawValue: '',
      validators: [
        {
          type: REQUIRED,
          args: [],
          error: REQUIRED_ERROR,
        },
      ],
      constraints: [],
      errors: [REQUIRED_ERROR],
      hasErrors: true,
      dirty: false,
    },
    matchesFoo: {
      rawValue: '',
      validators: [
        {
          type: MATCHES_FIELD,
          args: ['foo'],
          error: MATCHES_FIELD_ERROR,
        },
      ],
      constraints: [],
      errors: [],
      hasErrors: false,
      dirty: false,
    },
  };
  expect(expectedInitialState).toEqual(initialState);
  initialState.matchesFoo.rawValue = 'baz';
  const expectedState = {
    foo: {
      rawValue: 'bar',
      validators: [
        {
          type: REQUIRED,
          args: [],
          error: REQUIRED_ERROR,
        },
      ],
      constraints: [],
      errors: [],
      hasErrors: false,
      dirty: true,
    },
    matchesFoo: {
      rawValue: 'baz',
      validators: [
        {
          type: MATCHES_FIELD,
          args: ['foo'],
          error: MATCHES_FIELD_ERROR,
        },
      ],
      constraints: [],
      errors: [MATCHES_FIELD_ERROR],
      hasErrors: true,
      dirty: false,
    },
  };
  expect(expectedState).toEqual(
    formReducer(initialState, {
      type: SET,
      payload: { fieldName: 'foo', value: 'bar' },
    })
  );
});

test('createMapDispatchToProps returns valid action creators', () => {
  const extendedFormConfig = {
    ...formConfig,
    bax: exampleRequiredField,
    baz: exampleRequiredField,
  };
  const dispatchObj = createMapDispatchToProps(extendedFormConfig)((x) => x);
  expect(dispatchObj.actions.fields.foo.set('bar1')).toEqual(set('foo')('bar1'));
  expect(dispatchObj.actions.fields.bax.set('bar2')).toEqual(set('bax')('bar2'));
  expect(dispatchObj.actions.fields.baz.set('bar3')).toEqual(set('baz')('bar3'));
  expect(dispatchObj.actions.form.clear()).toEqual(clear());
  expect(dispatchObj.actions.fields.foo.addValidator(validatorFixture)).toEqual(
    addValidator('foo')(validatorFixture)
  );
  expect(dispatchObj.actions.fields.bax.addValidator(validatorFixture)).toEqual(
    addValidator('bax')(validatorFixture)
  );
  expect(dispatchObj.actions.fields.baz.addValidator(validatorFixture)).toEqual(
    addValidator('baz')(validatorFixture)
  );
});

test('createMapDispatchToProps returns a memoized fn', () => {
  const fnA = (x) => x;
  const fnB = (x) => x;
  const mapDispatchToProps = createMapDispatchToProps(formConfig);
  // These are reference comparisons, not deep equals
  expect(mapDispatchToProps(fnA)).toBe(mapDispatchToProps(fnA));
  expect(mapDispatchToProps(fnA)).not.toBe(mapDispatchToProps(fnB));
});

test('unable to make change that violates constraints', () => {
  const _formConfig = {
    foo: {
      constraints: [
        {
          type: ONLY_INTEGERS,
          args: [],
          error: ONLY_INTEGERS_ERROR,
        },
      ],
    },
  };
  const formReducer = createFormReducer(_formConfig);
  const initialState = initializeReducer(formReducer);
  expect(initialState).toEqual(formReducer(initialState, set('foo')('a')));
});

test('able to make change that does not violate constraints', () => {
  const _formConfig = {
    foo: {
      constraints: [
        {
          type: ONLY_INTEGERS,
          args: [],
          error: ONLY_INTEGERS_ERROR,
        },
      ],
    },
  };
  const formReducer = createFormReducer(_formConfig);
  const initialState = initializeReducer(formReducer);
  const expectedState = {
    foo: {
      errors: [],
      rawValue: '1',
      constraints: [
        {
          type: ONLY_INTEGERS,
          args: [],
          error: ONLY_INTEGERS_ERROR,
        },
      ],
      validators: [],
      hasErrors: false,
      dirty: true,
    },
  };
  expect(expectedState).toEqual(formReducer(initialState, set('foo')('1')));
});

test('reducer clear action updates form to have a cleared state', () => {
  const formState = {
    foo: {
      rawValue: 'bar',
      validators: [
        {
          type: REQUIRED,
          args: [],
          error: REQUIRED_ERROR,
        },
      ],
      constraints: [],
      errors: [],
      hasErrors: false,
      dirty: true,
    },
  };
  const formReducer = createFormReducer(formState);
  const initialState = initializeReducer(formReducer);
  const clearedFormState = {
    foo: {
      rawValue: '',
      validators: [
        {
          type: REQUIRED,
          args: [],
          error: REQUIRED_ERROR,
        },
      ],
      constraints: [],
      errors: [REQUIRED_ERROR],
      hasErrors: true,
      dirty: false,
    },
  };
  expect(formReducer(initialState, { type: CLEAR })).toEqual(clearedFormState);
});

test('reducer add validator action updates correct field', () => {
  const formReducer = createFormReducer(formConfig);
  const initialState = initializeReducer(formReducer);
  const expectedState = {
    foo: {
      rawValue: '',
      validators: [
        {
          type: REQUIRED,
          args: [],
          error: REQUIRED_ERROR,
        },
        {
          type: HAS_LENGTH,
          args: [3, 4],
          error: HAS_LENGTH_ERROR,
        },
      ],
      constraints: [],
      errors: [REQUIRED_ERROR],
      hasErrors: true,
      dirty: false,
    },
  };
  expect(
    formReducer(initialState, {
      type: ADD_VALIDATOR,
      payload: {
        fieldName: 'foo',
        validator: {
          type: HAS_LENGTH,
          args: [3, 4],
          error: HAS_LENGTH_ERROR,
        },
      },
    })
  ).toEqual(expectedState);
});

test('reducer remove validator action updates correct field', () => {
  const formReducer = createFormReducer({
    foo: {
      validators: [
        {
          type: REQUIRED,
          args: [],
          error: REQUIRED_ERROR,
        },
        {
          type: HAS_LENGTH,
          args: [3, 4],
          error: HAS_LENGTH_ERROR,
        },
      ],
    },
  });
  const initialState = initializeReducer(formReducer);
  const expectedState = {
    foo: {
      rawValue: '',
      validators: [
        {
          type: REQUIRED,
          args: [],
          error: REQUIRED_ERROR,
        },
      ],
      constraints: [],
      errors: [REQUIRED_ERROR],
      hasErrors: true,
      dirty: false,
    },
  };
  expect(
    formReducer(initialState, {
      type: REMOVE_VALIDATOR,
      payload: {
        fieldName: 'foo',
        validator: {
          type: HAS_LENGTH,
          args: [3, 4],
          error: HAS_LENGTH_ERROR,
        },
      },
    })
  ).toEqual(expectedState);
});

test('reducer remove validator action performs no changes if no validator to remove is found', () => {
  const formReducer = createFormReducer({
    foo: {
      validators: [
        {
          type: REQUIRED,
          args: [],
          error: REQUIRED_ERROR,
        },
      ],
      errors: [REQUIRED_ERROR],
      hasErrors: true,
    },
  });
  const initialState = initializeReducer(formReducer);
  const expectedState = {
    foo: {
      rawValue: '',
      validators: [
        {
          type: REQUIRED,
          args: [],
          error: REQUIRED_ERROR,
        },
      ],
      constraints: [],
      errors: [REQUIRED_ERROR],
      hasErrors: true,
      dirty: false,
    },
  };
  expect(
    formReducer(initialState, {
      type: REMOVE_VALIDATOR,
      payload: {
        fieldName: 'foo',
        validator: {
          type: HAS_LENGTH,
          args: [3, 4],
          error: HAS_LENGTH_ERROR,
        },
      },
    })
  ).toEqual(expectedState);
});

test('reducer clear field validators action removes all validators from a field', () => {
  const formReducer = createFormReducer(formConfig);
  const initialState = initializeReducer(formReducer);
  const expectedState = {
    foo: {
      rawValue: '',
      validators: [],
      constraints: [],
      errors: [],
      hasErrors: false,
      dirty: false,
    },
  };
  expect(
    formReducer(initialState, {
      type: CLEAR_FIELD_VALIDATORS,
      payload: { fieldName: 'foo' },
    })
  ).toEqual(expectedState);
});

test('reducer clear field validators action performs no changes when there are no validators or errors to clear', () => {
  const formReducer = createFormReducer({
    foo: {
      validators: [],
      errors: [],
      hasErrors: false,
    },
  });
  const initialState = initializeReducer(formReducer);
  const expectedState = {
    foo: {
      rawValue: '',
      validators: [],
      constraints: [],
      errors: [],
      hasErrors: false,
      dirty: false,
    },
  };
  expect(
    formReducer(initialState, {
      type: CLEAR_FIELD_VALIDATORS,
      payload: { fieldName: 'foo' },
    })
  ).toEqual(expectedState);
});
