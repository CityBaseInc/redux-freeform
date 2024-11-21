import { validatorFns, NUMBER_GREATER_THAN } from '../src/validation';
import { validatorToPredicate } from '../src/util';
import { test, expect } from '@jest/globals';

test('validatorToPredicate will override empty string case of validator', () => {
  const ngtPredicate = validatorToPredicate(
    validatorFns[NUMBER_GREATER_THAN],
    false
  );
  expect(ngtPredicate('', ['0'], {})).toBe(false);
});

test('validatorToPredicate will run validator normally for non-empty string', () => {
  const ngtPredicate = validatorToPredicate(
    validatorFns[NUMBER_GREATER_THAN],
    false
  );
  expect(ngtPredicate('1', ['0'], {})).toBe(true);
});
