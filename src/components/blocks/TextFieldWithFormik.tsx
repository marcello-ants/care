import { FieldConfig, useField } from 'formik';
import { TextField } from '@care/react-component-lib';
import { TextFieldProps } from '@material-ui/core';

export type FormikTextFieldProps = TextFieldProps &
  FieldConfig<string> & { hideErrorMessage?: boolean };

function TextFieldWithFormik(props: FormikTextFieldProps) {
  const { name, validate, hideErrorMessage, ...rest } = props;
  const [field, meta] = useField({ name, validate });
  const { helperText } = props;
  const showError = meta.touched && Boolean(meta.error);

  return (
    <TextField
      {...field}
      {...rest}
      error={showError}
      helperText={showError ? !hideErrorMessage && meta.error : helperText}
    />
  );
}

TextFieldWithFormik.defaultProps = {
  helperText: undefined,
};

export default TextFieldWithFormik;
