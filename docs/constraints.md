---
id: constraints
title: Constraints
sidebar_label: Constraints
---

Constraints function the same as validators, and in fact use the same
functions but instead of reporting an error, they disallow a change that would
not validate.

They are specified on the constraints key of a field in a form config object.

```javascript
{
  name: {
    constraints: [hasLength(0, 10)];
  }
}
```

A couple things to note here:

Constraints are in general _used more permissively_ than validators. For example a validator like
`hasLength(10, 10)` could be paired with a constraint `hasLength(0, 10)` in order to prevent
the user from typing after the tenth character, but displaying an error if they have less than 10
characters. `hasLength(10, 10)` as a constraint would be unlikely to be that useful as it would disallow
any changes that make the string _not_ length 10. This would make the only valid action pasting in a
10 character string.

Constraints are applied _per set event_. So if the _set_ action contains a value that fails the constraint
validation the state treats it as though it was never sent at all.

Constraints make some validators redundant. If you use `onlyIntegers` as a constraint then `onlyIntegers`
is useless as a validator as it would never be able to display that error.

**Remember that constraints are a UX consideration and should never be considered a security measure. Always
validate on the backend where the user does not control the runtime.**
