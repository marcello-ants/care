import { VERTICALS_SELECT_LABELS } from '@/constants';
import { Select } from '@care/react-component-lib';
import { FormControl, FormHelperText, makeStyles, MenuItem, SelectProps } from '@material-ui/core';
import { useField } from 'formik';

export type VerticalsType = typeof VERTICALS_SELECT_LABELS;

interface CareVerticalProps extends SelectProps {
  id?: string;
  name?: string;
  value?: string;
  errorText?: string;
  errorDisplayed?: string | boolean;
}

const useStyles = makeStyles((theme) => ({
  // a workaround needed until the DNA-1169 is done
  selectContainer: {
    width: '100%',
    paddingTop: theme.spacing(2.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    marginBottom: theme.spacing(0),

    '& .MuiInput-input': {
      paddingTop: theme.spacing(2.25),
      paddingBottom: theme.spacing(0),
      paddingLeft: theme.spacing(2),
      color: theme.palette.care?.navy[900],
      fontSize: '18px',
      fontWeight: 700,
    },
    // styles for placeholder value
    '& .no-value .MuiInput-input': {
      color: theme.palette.care?.grey[700],
      fontWeight: 'normal',
    },
    '& .MuiFormHelperText-root': {
      marginTop: theme.spacing(0.5),
      paddingLeft: theme.spacing(0.25),
    },
  },
}));

const CareVertical = ({
  id,
  name,
  value,
  errorText,
  errorDisplayed,
  onChange,
  onBlur,
}: CareVerticalProps) => {
  const classes = useStyles();
  return (
    <FormControl error={Boolean(errorDisplayed)} className={classes.selectContainer}>
      <Select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        displayEmpty
        className={!value ? 'no-value' : ''}
        inputProps={{
          tabIndex: -1,
        }}>
        <MenuItem value="" disabled>
          What type of care do you need?
        </MenuItem>
        {Object.keys(VERTICALS_SELECT_LABELS).map((key) => (
          <MenuItem key={key} value={key}>
            {VERTICALS_SELECT_LABELS[key as keyof VerticalsType]}
          </MenuItem>
        ))}
      </Select>
      {errorText && <FormHelperText>{errorText}</FormHelperText>}
    </FormControl>
  );
};

CareVertical.defaultProps = {
  id: '',
  name: '',
  value: '',
  errorText: '',
  errorDisplayed: '',
};

interface CareVerticalSelectFieldProps extends SelectProps {
  name: string;
}

const validate = (value: string) => {
  return Object.keys(VERTICALS_SELECT_LABELS).some((option) => option === value)
    ? undefined
    : 'Please select an option';
};

const CareVerticalSelect = ({ name, ...props }: CareVerticalSelectFieldProps) => {
  const [field, meta] = useField({ name, validate });

  return (
    <CareVertical
      {...field}
      {...props}
      errorText={meta.error}
      errorDisplayed={meta.touched && meta.error}
    />
  );
};

export default CareVerticalSelect;
