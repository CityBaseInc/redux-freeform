import test from "ava";
import {
  formattingFns,
  unformattingFns,
  phone,
  PHONE,
  getUniqueFormatDelimeters
} from "../src/formatting";

const allPhoneLengths = [
  { input: "", output: "" },
  { input: "1", output: "+1" },
  { input: "12", output: "+1 2" },
  { input: "123", output: "+1 23" },
  { input: "1234", output: "+1 (234) " },
  { input: "12345", output: "+1 (234) 5" },
  { input: "123456", output: "+1 (234) 56" },
  { input: "1234567", output: "+1 (234) 567 - " },
  { input: "12345678", output: "+1 (234) 567 - 8" },
  { input: "123456789", output: "+1 (234) 567 - 89" },
  { input: "1234567891", output: "+1 (234) 567 - 891" },
  { input: "12345678910", output: "+1 (234) 567 - 8910" },
  { input: "123456789101", output: "+12 (345) 678 - 9101" },
  { input: "1234567891012", output: "+123 (456) 789 - 1012" },
  { input: "12345678910123", output: "12345678910123" }
];

test("phone numbers are formatted properly", t => {
  for (let l of allPhoneLengths) {
    t.is(formattingFns[PHONE](l.input), l.output);
  }
});

test("phone numbers unformat properly", t => {
  for (let l of allPhoneLengths) {
    t.is(unformattingFns[PHONE](l.output), l.input);
  }
});

test("getUniqueFormatDelimeters does what it says", t => {
  const formats = ["", "~_", "@_^_", "af_ __"];
  t.deepEqual(
    getUniqueFormatDelimeters(formats).sort(),
    ["~", " ", "@", "^", "a", "f"].sort()
  );
});
