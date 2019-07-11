const FORMAT_CHAR = "_";

export const getUniqueFormatDelimeters = formats => [
  ...new Set(
    formats
      .join("")
      .split(FORMAT_CHAR)
      .join("")
      .split("")
  )
];

const format = formats => value => {
  const usedFormat = formats[value.length];
  if (!usedFormat) {
    return value;
  }
  const formatPieces = usedFormat.split(FORMAT_CHAR);
  const valuePieces = value.split("");
  const zipped = formatPieces.map((v, i) => v + (valuePieces[i] || ""));
  return zipped.join("");
};

const unformat = uniqueDelimeters => formattedValue =>
  formattedValue
    .split("")
    .filter(s => !uniqueDelimeters.includes(s))
    .join("");

export let unformattingFns = {};
export let formattingFns = {};

const PHONE_FORMATS = [
  "",
  "+_",
  "+_ _",
  "+_ __",
  "+_ (___) ",
  "+_ (___) _",
  "+_ (___) __",
  "+_ (___) ___ - ",
  "+_ (___) ___ - _",
  "+_ (___) ___ - __",
  "+_ (___) ___ - ___",
  "+_ (___) ___ - ____",
  "+__ (___) ___ - ____",
  "+___ (___) ___ - ____"
];
const phoneUniqueDelimeters = getUniqueFormatDelimeters(PHONE_FORMATS);
export const phone = "formatter/PHONE";
formattingFns[phone] = format(PHONE_FORMATS);
unformattingFns[phone] = unformat(phoneUniqueDelimeters);
