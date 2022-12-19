import { FieldConfig, useField } from 'formik';
import { InlineTextField } from '@care/react-component-lib';
import { TextFieldProps } from '@material-ui/core';

type ErrorValidationProps = {
  fireValidationErrorEvent?: () => void;
};

type FormikInlineTextFieldProps = TextFieldProps & FieldConfig<string> & ErrorValidationProps;

function FormikInlineTextField(props: FormikInlineTextFieldProps) {
  const { name, validate, fireValidationErrorEvent, ...rest } = props;
  const [field, meta] = useField({ name, validate });
  const { helperText } = props;
  const showError = meta.touched && Boolean(meta.error);

  if (fireValidationErrorEvent && showError && meta.error) {
    fireValidationErrorEvent();
  }

  return (
    <InlineTextField
      {...field}
      {...rest}
      error={showError}
      helperText={showError ? meta.error : helperText}
    />
  );
}

FormikInlineTextField.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  helperText: undefined,
  fireValidationErrorEvent: undefined,
};

export default FormikInlineTextField;
