import test from "ava";

import { validatorFns, NUMBER_GREATER_THAN } from "../src/validation";
import { validatorToPredicate } from "../src/util";

test("validatorToPredicate will override empty string case of validator", t => {
  const ngtPredicate = validatorToPredicate(
    validatorFns[NUMBER_GREATER_THAN],
    false
  );
  t.is(ngtPredicate("", ["0"], {}), false);
});

test("validatorToPredicate will run validator normally for non-empty string", t => {
  const ngtPredicate = validatorToPredicate(
    validatorFns[NUMBER_GREATER_THAN],
    false
  );
  t.is(ngtPredicate("1", ["0"], {}), true);
});
