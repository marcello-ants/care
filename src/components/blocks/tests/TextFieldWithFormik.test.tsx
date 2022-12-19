import React from 'react';
import { render } from '@testing-library/react';
import { FormikProvider, useFormik } from 'formik';
import TextFieldWithFormik, { FormikTextFieldProps } from '../TextFieldWithFormik';

let formik;
let onSubmit: jest.Mock<any, any>;
let validate: jest.Mock<any, any>;

function Wrapper(props: FormikTextFieldProps) {
  onSubmit = jest.fn();
  validate = jest.fn();
  formik = useFormik<{ test: string }>({
    initialValues: {
      test: '',
    },
    validateOnMount: true,
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: (values) => onSubmit(values),
  });
  return (
    <FormikProvider value={formik}>
      <TextFieldWithFormik {...props} />
    </FormikProvider>
  );
}

function renderWrapper(props: FormikTextFieldProps) {
  return render(<Wrapper {...props} />);
}

describe('RateForAChild', () => {
  it('matches snapshot for the first item', () => {
    const view = renderWrapper({ id: 'min', name: 'min', placeholder: 'Min', validate });
    expect(view.asFragment()).toMatchSnapshot();
  });
});
