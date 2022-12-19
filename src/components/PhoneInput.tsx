import { FieldValidator, useField } from 'formik';
import { Rifm } from 'rifm';
import { AsYouType, isValidNumberForRegion } from 'libphonenumber-js';
import { TextFieldProps } from '@material-ui/core';
import { InlineTextField } from '@care/react-component-lib';

const parseDigits = (input: string) => (input.match(/\d+/g) || []).join('');
const formatPhone = (input: string) => {
  const digits = parseDigits(input).substr(0, 10);
  return new AsYouType('US').input(digits);
};

export const validatePhoneNumber = (phone: string) =>
  isValidNumberForRegion(phone, 'US') ? undefined : 'Please enter a valid phone number.';

// Props are providing a subset of TextField's props. Extend it if needed
interface BaseProps {
  /* eslint-disable react/require-default-props */
  id?: TextFieldProps['id'];
  name?: TextFieldProps['name'];
  label?: TextFieldProps['label'];
  error?: TextFieldProps['error'];
  helperText?: TextFieldProps['helperText'];
  InputProps?: TextFieldProps['InputProps'];
  classes?: TextFieldProps['classes'];
}

type PhoneInputProps = BaseProps & {
  value: string;

  onChange: (input: string) => void;
  onBlur?: TextFieldProps['onBlur'];
};

const PhoneInput = ({ value, onChange, ...textFieldProps }: PhoneInputProps) => (
  <Rifm value={value} onChange={onChange} format={formatPhone}>
    {({ value: rifmValue, onChange: rifmOnChange }) => (
      <InlineTextField {...textFieldProps} type="tel" value={rifmValue} onChange={rifmOnChange} />
    )}
  </Rifm>
);

type PhoneFieldProps = BaseProps & {
  name: string;
  validate?: FieldValidator;
};

export function PhoneField(props: PhoneFieldProps) {
  const { name, helperText, validate, ...rest } = props;
  const [field, meta, helpers] = useField({ name, validate: validate ?? validatePhoneNumber });

  const showError = meta.touched && Boolean(meta.error);
  return (
    <PhoneInput
      {...rest}
      {...field}
      onChange={helpers.setValue}
      error={showError}
      helperText={showError ? meta.error : helperText}
    />
  );
}

export default PhoneInput;
