import { fc } from "ava-fast-check";

export const fieldNameGen = () =>
  fc.string(1, 15).filter((str) => /^[A-z]$/.test(str));

export const initializeReducer = (reducer) => reducer(undefined, { type: "@@INIT" });
