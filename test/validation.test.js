import test from "ava";
import { testProp, fc } from "ava-fast-check";

import { fieldNameGen } from "./util";
import {
  required,
  REQUIRED,
  REQUIRED_ERROR,
  onlyIntegers,
  ONLY_INTEGERS,
  ONLY_INTEGERS_ERROR,
  numberLessThan,
  NUMBER_LESS_THAN,
  NUMBER_LESS_THAN_ERROR,
  matchesField,
  MATCHES_FIELD,
  MATCHES_FIELD_ERROR,
  validatorFns,
  runValidator,
  runValidatorErrorMessage,
  computeErrors
} from "../src/validation";

test("required validator produces correct validator object", t => {
  t.is(required.error, REQUIRED_ERROR);
  t.deepEqual(required(), {
    type: REQUIRED,
    args: [],
    error: REQUIRED_ERROR
  });
});

test("onlyIntegers validator produces correct validator object", t => {
  t.is(onlyIntegers.error, ONLY_INTEGERS_ERROR);
  t.deepEqual(onlyIntegers(), {
    type: ONLY_INTEGERS,
    args: [],
    error: ONLY_INTEGERS_ERROR
  });
});

test("numberLessThan validator produces correct validator object", t => {
  t.is(numberLessThan.error, NUMBER_LESS_THAN_ERROR);
  t.deepEqual(numberLessThan(3), {
    type: NUMBER_LESS_THAN,
    args: [3],
    error: NUMBER_LESS_THAN_ERROR
  });
});

test("matchesField validator produces correct validator object", t => {
  t.is(matchesField.error, MATCHES_FIELD_ERROR);
  t.deepEqual(matchesField("foo"), {
    type: MATCHES_FIELD,
    args: ["foo"],
    error: MATCHES_FIELD_ERROR
  });
});

testProp(
  "required validator accepts any string",
  [fc.string(1, 100)],
  stringA => !!validatorFns[REQUIRED](stringA, [], {})
);

test("required validator rejects empty string", t => {
  t.false(validatorFns[REQUIRED]("", [], {}));
});

testProp(
  "onlyIntegers validator accepts any integer string",
  [fc.integer()],
  intA => !!validatorFns[ONLY_INTEGERS](String(intA), [], {})
);

testProp(
  "onlyIntegers rejects alphabetic string",
  [fc.stringOf(fc.char().filter(c => /[A-z]/.test(c)))],
  stringA => !validatorFns[ONLY_INTEGERS](stringA, [], {})
);

testProp(
  "onlyIntegers rejects float string",
  [fc.float(), fc.integer(1, 10)],
  (floatA, fixedLength) =>
    !validatorFns[ONLY_INTEGERS](floatA.toFixed(fixedLength), [], {})
);

const smallerBiggerTuple = fc
  .float()
  .chain(smallerNumber =>
    fc.tuple(
      fc.constant(smallerNumber),
      fc
        .float(smallerNumber, Number.MAX_SAFE_INTEGER)
        .filter(n => n !== smallerNumber)
    )
  );

testProp(
  "numberLessThan accepts value less than argument",
  [smallerBiggerTuple],
  ([smallerNumber, biggerNumber]) =>
    !!validatorFns[NUMBER_LESS_THAN](String(smallerNumber), [biggerNumber], {})
);

testProp(
  "numberLessThan rejects value greater than argument",
  [smallerBiggerTuple],
  ([smallerNumber, biggerNumber]) =>
    !validatorFns[NUMBER_LESS_THAN](String(biggerNumber), [smallerNumber], {})
);

testProp(
  "numberLessThan rejects value equal to argument",
  [fc.float()],
  numberA => !validatorFns[NUMBER_LESS_THAN](String(numberA), [numberA], {})
);

testProp(
  "matchesField accepts value equal to argument field rawValue",
  [fieldNameGen(), fc.string()],
  (fieldName, fieldValue) =>
    !!validatorFns[MATCHES_FIELD](fieldValue, [fieldName], {
      [fieldName]: {
        rawValue: fieldValue
      }
    })
);

testProp(
  "matchesField rejects value not equal to argument field rawValue",
  [
    fc.string(1, 15).filter(str => /^[A-z]$/.test(str)),
    fc.string(),
    fc.string(1, 15)
  ],
  (fieldName, fieldValue, fieldValueModifier) =>
    !validatorFns[MATCHES_FIELD](fieldValue, [fieldName], {
      [fieldName]: {
        rawValue: `${fieldValue}${fieldValueModifier}`
      }
    })
);

test("runValidator returns null when validator accepts", t => {
  t.is(runValidator({ type: REQUIRED, args: [] }, "foo", {}), null);
});

test("runValidator returns validator error when validator rejects", t => {
  t.is(
    runValidator({ type: REQUIRED, args: [], error: REQUIRED_ERROR }, "", {}),
    REQUIRED_ERROR
  );
});

test("runValidator throws error when validatorFn does not exist", t => {
  const validatorError = t.throws(() =>
    runValidator({ type: "foo", args: [], error: "bar" }, "", {})
  );
  t.is(validatorError.message, runValidatorErrorMessage("foo"));
});

test("computeErrors returns an empty array when validators accept", t => {
  const acceptingForm = {
    foo: {
      rawValue: "12",
      validators: [
        { type: REQUIRED, args: [], error: REQUIRED_ERROR },
        { type: ONLY_INTEGERS, args: [], error: ONLY_INTEGERS_ERROR },
        { type: NUMBER_LESS_THAN, args: [13], error: NUMBER_LESS_THAN_ERROR }
      ]
    }
  };
  t.deepEqual(computeErrors("foo", acceptingForm), []);
});

test("computeErrors returns an array of errors for each rejecting validator ordered by validator for each ", t => {
  const rejectingForm = {
    foo: {
      rawValue: "11",
      validators: [
        { type: REQUIRED, args: [], error: REQUIRED_ERROR },
        { type: MATCHES_FIELD, args: ["bar"], error: MATCHES_FIELD_ERROR },
        { type: ONLY_INTEGERS, args: [], error: ONLY_INTEGERS_ERROR },
        { type: NUMBER_LESS_THAN, args: [10], error: NUMBER_LESS_THAN_ERROR }
      ]
    },
    bar: {
      rawValue: "12",
      validators: []
    }
  };
  t.deepEqual(computeErrors("foo", rejectingForm), [
    MATCHES_FIELD_ERROR,
    NUMBER_LESS_THAN_ERROR
  ]);
});
