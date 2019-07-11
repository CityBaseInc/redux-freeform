import { fc } from "ava-fast-check";

export const fieldNameGen = () =>
  fc.string(1, 15).filter(str => /^[A-z]$/.test(str));

export const smallerBiggerTupleGen = fc
  .float()
  .chain(smallerNumber =>
    fc.tuple(
      fc.constant(smallerNumber),
      fc
        .float(smallerNumber, Number.MAX_SAFE_INTEGER)
        .filter(n => n !== smallerNumber)
    )
  );

export const stringWithoutCharTupleGen = fc
  .char()
  .chain(excludedChar =>
    fc.tuple(
      fc.constant(excludedChar),
      fc.string(1, 10).filter(str => !str.includes(excludedChar))
    )
  );

export const stringWithCharTupleGen = fc
  .char()
  .chain(excludedChar =>
    fc.tuple(
      fc.constant(excludedChar),
      fc.string(1, 10).filter(str => str.includes(excludedChar))
    )
  );

export const initializeReducer = reducer =>
  reducer(undefined, { type: "@@INIT" });
