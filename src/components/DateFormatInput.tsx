import { FieldConfig, useField } from 'formik';
import { Rifm } from 'rifm';
import { TextFieldProps } from '@material-ui/core';
import { InlineTextField } from '@care/react-component-lib';

const parseDigits = (value: string) => (value.match(/\d+/g) || []).join('');

const formatDate = (string: string) => {
  const digits = parseDigits(string);
  const chars = digits.split('');
  return chars
    .reduce((r, v, index) => (index === 2 || index === 4 ? `${r}/${v}` : `${r}${v}`), '')
    .substr(0, 10);
};

const formatDateWithAppend = (value: string) => {
  const res = formatDate(value);

  if (value.endsWith('/')) {
    if (res.length === 2) {
      return `${res}/`;
    }

    if (res.length === 5) {
      return `${res}/`;
    }
  }
  return res;
};

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

type DateInputProps = BaseProps & {
  value: string;

  onChange: (input: string) => void;
  onBlur?: TextFieldProps['onBlur'];
};

export const DateInput = ({ value, onChange, ...textFieldProps }: DateInputProps) => (
  <Rifm value={value} onChange={onChange} format={formatDateWithAppend}>
    {({ value: rifmValue, onChange: rifmOnChange }) => (
      <InlineTextField {...textFieldProps} value={rifmValue} onChange={rifmOnChange} />
    )}
  </Rifm>
);

export type DateFieldProps = BaseProps & FieldConfig<string>;

export const DateField = (props: DateFieldProps) => {
  const { name, helperText, validate, ...rest } = props;
  const [field, meta, helpers] = useField({ name, validate });

  const showError = meta.touched && Boolean(meta.error);
  return (
    <DateInput
      {...rest}
      {...field}
      onChange={helpers.setValue}
      error={showError}
      helperText={showError ? meta.error : helperText}
    />
  );
};
