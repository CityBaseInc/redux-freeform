import {
  required,
  matchesField,
  onlyIntegers,
  numberLessThan,
  hasLength,
  matchesRegex,
} from 'redux-freeform';
import React from 'react';

const nameFieldErrorMessages = {
  [required.error]: 'name is required',
};
const confirmNameFieldErrorMessages = {
  [required.error]: 'confirm name is required',
  [matchesField.error]: 'confirm name must match name',
};
const ageFieldErrorMessages = {
  [required.error]: 'age is required',
  [onlyIntegers.error]: 'age must be a whole number',
  [numberLessThan.error]: 'age must be less than 99',
};
const maritalStatusErrorMessages = {
  [required.error]: 'marital status is required when over 18',
};
const fourDigitCodeErrorMessages = {
  [required.error]: 'four digit code is required',
  [hasLength.error]: 'four digit code must be 4 numbers',
};
const matchesRegexError = {
  [required.error]: 'email is required',
  [matchesRegex.error]: 'email is invalid',
};
const animalError = {
  [required.error]: 'animal type is required',
};
const animalNoiseError = (a) => ({
  [matchesRegex.error]: `that's not what a ${a} sounds like`,
  [required.error]: `animal noise is required`,
});
const numberOfDogsError = {
  [numberLessThan.error]: 'Number of cats and dogs cannot exceed 5.',
};
const numberOfCatsError = {
  [numberLessThan.error]: 'Number of cats and dogs cannot exceed 5.',
};

const InputField = ({
  labelTextWhenNoError,
  field,
  fieldActions,
  errorMessages,
}) => (
  <div>
    <div>
      <label>
        {field.hasErrors ? errorMessages[field.errors[0]] : labelTextWhenNoError}
      </label>
    </div>
    <input
      value={field.rawValue}
      onChange={(e) => fieldActions.set(e.target.value)}
    />
    {!field.dirty && ' ✴️'}
    {field.dirty && field.hasErrors && ' ❌'}
    {field.dirty && !field.hasErrors && ' ✅'}
    <p />
  </div>
);

const InputDropDown = ({
  labelTextWhenNoError,
  field,
  fieldActions,
  errorMessages,
  choices,
}) => (
  <div>
    <div>
      <label>
        {field.hasErrors ? errorMessages[field.errors[0]] : labelTextWhenNoError}
      </label>
    </div>
    <select
      value={field.rawValue}
      onChange={(e) => fieldActions.set(e.target.value)}
    >
      {choices.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
    {!field.dirty && ' ✴️'}
    {field.dirty && field.hasErrors && ' ❌'}
    {field.dirty && !field.hasErrors && ' ✅'}
    <p />
  </div>
);

const SimpleForm = ({ actions, fields }) => (
  <div>
    <InputField
      field={fields.name}
      fieldActions={actions.fields.name}
      labelTextWhenNoError="name"
      errorMessages={nameFieldErrorMessages}
    />
    <InputField
      field={fields.confirmName}
      fieldActions={actions.fields.confirmName}
      labelTextWhenNoError="confirm name"
      errorMessages={confirmNameFieldErrorMessages}
    />
    <InputField
      field={fields.age}
      fieldActions={actions.fields.age}
      labelTextWhenNoError="age"
      errorMessages={ageFieldErrorMessages}
    />
    <InputField
      field={fields.maritalStatus}
      fieldActions={actions.fields.maritalStatus}
      labelTextWhenNoError="marriage status"
      errorMessages={maritalStatusErrorMessages}
    />
    <InputField
      field={fields.fourDigitCode}
      fieldActions={actions.fields.fourDigitCode}
      labelTextWhenNoError="four digit code"
      errorMessages={fourDigitCodeErrorMessages}
    />
    <InputField
      field={fields.regexMatch}
      fieldActions={actions.fields.regexMatch}
      labelTextWhenNoError="email"
      errorMessages={matchesRegexError}
    />
    <InputDropDown
      field={fields.animal}
      fieldActions={actions.fields.animal}
      labelTextWhenNoError="animal"
      errorMessages={animalError}
      choices={['dog', 'cat', 'cow']}
    />
    <InputField
      field={fields.animalNoise}
      fieldActions={actions.fields.animalNoise}
      labelTextWhenNoError="animal noise"
      errorMessages={animalNoiseError(fields.animal.rawValue)}
    />
    <InputField
      field={fields.numberOfCats}
      fieldActions={actions.fields.numberOfCats}
      labelTextWhenNoError="number of cats"
      errorMessages={numberOfCatsError}
    />
    <InputField
      field={fields.numberOfDogs}
      fieldActions={actions.fields.numberOfDogs}
      labelTextWhenNoError="number of dogs"
      errorMessages={numberOfDogsError}
    />
    <button onClick={() => actions.form.clear()}>Clear the form</button>
  </div>
);

export default SimpleForm;
