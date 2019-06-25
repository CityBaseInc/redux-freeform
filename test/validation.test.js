import test from "ava";
import { check, gen } from "ava-check";
import {
  required,
  REQUIRED,
  REQUIRED_ERROR,
  onlyNumbers,
  ONLY_NUMBERS,
  ONLY_NUMBERS_ERROR,
  numberLessThan,
  NUMBER_LESS_THAN,
  NUMBER_LESS_THAN_ERROR,
  matchesField,
  MATCHES_FIELD,
  MATCHES_FIELD_ERROR,
  validatorFns
} from "../src/validation";

test("required validator produces correct validator object", t => {
  t.is(required.error, REQUIRED_ERROR);
  t.deepEqual(required(), { type: REQUIRED, args: [] });
});

test("onlyNumbers validator produces correct validator object", t => {
  t.is(onlyNumbers.error, ONLY_NUMBERS_ERROR);
  t.deepEqual(onlyNumbers(), { type: ONLY_NUMBERS, args: [] });
});

test("numberLessThan validator produces correct validator object", t => {
  t.is(numberLessThan.error, NUMBER_LESS_THAN_ERROR);
  t.deepEqual(numberLessThan(3), { type: NUMBER_LESS_THAN, args: [3] });
});

test("matchesField validator produces correct validator object", t => {
  t.is(matchesField.error, MATCHES_FIELD_ERROR);
  t.deepEqual(matchesField("foo"), { type: MATCHES_FIELD, args: ["foo"] });
});

// test(
//   "required validator accepts any string",
//   check(gen.string, (t, stringA) => {
//     t.true(validatorFns[REQUIRED](stringA, [], {}));
//   })
// );

test("required validator rejects empty string", t => {
  t.false(validatorFns[REQUIRED]("", [], {}));
});
