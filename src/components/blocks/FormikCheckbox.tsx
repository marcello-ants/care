import { FieldConfig, useField } from 'formik';
import { Checkbox } from '@care/react-component-lib';
import { CheckboxProps } from '@material-ui/core';

type FormikCheckboxProps = CheckboxProps & FieldConfig<string>;

function FormikCheckbox(props: FormikCheckboxProps) {
  const { name, validate, ...rest } = props;
  const [field] = useField({ name, validate });

  return <Checkbox {...field} {...rest} checked={field.value} />;
}

export default FormikCheckbox;
