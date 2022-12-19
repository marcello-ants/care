import { useFormik, FormikErrors, useField } from 'formik';
import { Select, FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { useAppDispatch, useSeekerPCState } from '@/components/AppState';
import useFlowNavigation from '@/components/features/flowNavigation/useFlowNavigation';
import { logCareEvent } from '@/utilities/amplitudeAnalyticsHelper';

export const GENERAL_ERROR_MESSAGE = 'Please select a valid number of pets';

type FormikSelectFieldProps = {
  name: string;
  label: string;
  errorDisplayed: boolean;
  options: number[] | string[];
};

type FormValues = {
  dogs: number;
  cats: number;
  other: number;
  generalFormError: string;
};

type FormErrors = {
  generalFormError: string;
};

export const FormikSelectField = (props: FormikSelectFieldProps) => {
  const { name, label, errorDisplayed, options, ...rest } = props;
  const [field] = useField({ name });
  return (
    <>
      <FormControl fullWidth margin="dense" error={errorDisplayed}>
        <InputLabel htmlFor={name}>{label}</InputLabel>
        <Select data-testid="select" autoWidth {...field} {...rest}>
          {options.map((option: number | string) => (
            <MenuItem key={option} data-testid="select-option" value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

function AboutPetsForm() {
  const { goNext } = useFlowNavigation();
  const dispatch = useAppDispatch();
  const { pets } = useSeekerPCState();

  function handleSubmission(values: FormValues) {
    const { dogs, cats, other } = values;
    dispatch({ type: 'setPetsNumber', pets: { dogs, cats, other } });
    logCareEvent('Member Enrolled', 'Details', { pets: { dogs, cats, other } });
    goNext();
  }

  function formikValidation(values: FormValues) {
    const errors: FormikErrors<FormErrors> = {};
    const atLeastOneFieldFullfiled = Object.values(values).some((value) => Boolean(value));

    if (!atLeastOneFieldFullfiled) {
      errors.generalFormError = GENERAL_ERROR_MESSAGE;
    }
    return errors;
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      ...pets,
      generalFormError: '',
    },
    validate: formikValidation,
    onSubmit: handleSubmission,
    validateOnBlur: false,
    validateOnChange: true,
  });

  return formik;
}

export default AboutPetsForm;
