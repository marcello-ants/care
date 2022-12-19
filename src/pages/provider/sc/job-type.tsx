import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { StatelessSelector, Pill, InlineTextField, Typography } from '@care/react-component-lib';
import useEnterKey from '@/components/hooks/useEnterKey';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { PROVIDER_ROUTES } from '@/constants';
import Header from '@/components/Header';
import { useProviderState, useAppDispatch } from '@/components/AppState';
import { isOnlyNumbers } from '@/utilities/globalValidations';
import { JobTypes, JobHours } from '@/types/common';

const MAX_HOURS = 168;

function getOnlyNumbers(value = '') {
  return value.replace(/[^\d]/g, '');
}

const useStyles = makeStyles((theme) => ({
  header: {
    marginBottom: theme.spacing(2),
  },
  pillList: {
    '& .MuiListItem-root': {
      marginBottom: theme.spacing(0),
    },
  },
  hoursPerWeek: {
    marginBottom: theme.spacing(2),
  },
  hoursLabel: {
    marginTop: theme.spacing(1),
  },
  inputContainer: {
    paddingLeft: theme.spacing(4),
    '& .MuiFormControl-root': {
      padding: 0,
      marginTop: theme.spacing(-2),
    },
  },
  inlineTextFieldOverride: {
    paddingLeft: 0,
    paddingRight: 0,
    // removes number arrows from Chrome, Safari, Edge, Opera
    '& input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
      appearance: 'none',
      margin: 0,
    },
    // removes number arrows from Firefox
    '& input[type=number]': {
      appearance: 'textfield',
    },
  },
  nextButtonContainer: {
    padding: theme.spacing(4, 3, 0),
  },
}));

type PillWithScheduleProps = {
  value: string;
  selected?: boolean;
  minValue?: string;
  maxValue?: string;
  hoursLabel: string;
  handleMinInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleMaxInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
};

function PillWithSchedule(props: PillWithScheduleProps) {
  const classes = useStyles();
  const {
    value,
    selected,
    minValue = '',
    maxValue = '',
    hoursLabel,
    handleMinInputChange,
    handleMaxInputChange,
    handleArrowPress,
  } = props;
  const [inputError, setInputError] = useState({ min: false, max: false });
  const hasRangeError = Boolean(maxValue && parseInt(minValue, 10) > parseInt(maxValue, 10));
  const errorText = hasRangeError
    ? 'Min hours should not exceed max hours'
    : 'Please type a number';

  const onKeyDown = ({ key, metaKey }: KeyboardEvent<HTMLInputElement>, type: string) => {
    const MISC_VALID_KEYS = [
      'Backspace',
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'Meta',
    ];
    const isPaste = key === 'v' && metaKey;
    const isCopy = key === 'c' && metaKey;
    const selectAll = key === 'a' && metaKey;
    const validInteraction = isPaste || isCopy || selectAll;
    setInputError((data) => ({
      ...data,
      min: false,
      max: false,
      [type]: !isOnlyNumbers(MISC_VALID_KEYS.includes(key) || validInteraction ? '0' : key),
    }));
  };

  const onBlurInput = () => {
    setInputError({ min: hasRangeError || false, max: false });
  };
  return (
    <>
      <Pill {...props} />
      {selected && (
        <Grid container className={classes.hoursPerWeek}>
          <Grid item xs={12} className={classes.inputContainer}>
            <Typography variant="h4" className={classes.hoursLabel}>
              {hoursLabel}
            </Typography>
          </Grid>
          <Grid item xs={6} className={classes.inputContainer}>
            <InlineTextField
              id={`min-${value}`}
              name={value}
              label="Min"
              value={minValue}
              onChange={handleMinInputChange}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                onKeyDown(e, 'min');
                handleArrowPress(e, 'min');
              }}
              onBlur={onBlurInput}
              inputProps={{
                maxLength: 3,
                'aria-label': `min-${value}`,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              error={inputError.min}
              helperText={inputError.min ? errorText : undefined}
              classes={{ root: classes.inlineTextFieldOverride }}
            />
          </Grid>
          <Grid item xs={6} className={classes.inputContainer}>
            <InlineTextField
              id={`max-${value}`}
              name={value}
              label="Max"
              value={maxValue}
              onChange={handleMaxInputChange}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                onKeyDown(e, 'max');
                handleArrowPress(e, 'max');
              }}
              onBlur={onBlurInput}
              inputProps={{
                maxLength: 3,
                'aria-label': `max-${value}`,
              }}
              error={inputError.max}
              helperText={inputError.max ? errorText : undefined}
              classes={{ root: classes.inlineTextFieldOverride }}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
}

PillWithSchedule.defaultProps = {
  selected: false,
  minValue: '',
  maxValue: '',
};

function JobType() {
  const classes = useStyles();
  const router = useRouter();
  const { jobTypes, jobTypesSchedules } = useProviderState();
  const dispatch = useAppDispatch();
  const hasRangeError = Object.keys(jobTypesSchedules).some((job: string) => {
    const hours = jobTypesSchedules[job as JobTypes];
    return hours && parseInt(hours.min, 10) > parseInt(hours.max, 10);
  });
  const canContinue = jobTypes.length > 0 && !hasRangeError;

  const handleHourInputChange = (
    { target }: ChangeEvent<HTMLInputElement>,
    keyName: keyof JobHours
  ) => {
    const { name, value } = target;
    let number = Number(getOnlyNumbers(value));

    // validate max hours per week
    if (number > 7 * 24) {
      number = MAX_HOURS;
    }

    dispatch({
      type: 'setJobTypesSchedule',
      name: name as JobTypes,
      value: number ? String(number) : '',
      key: keyName,
    });
  };

  const handleArrowPress = (e: KeyboardEvent<HTMLInputElement>, keyName: keyof JobHours) => {
    const { target, key } = e;
    const { name, value } = target as HTMLInputElement;
    if (key === 'ArrowUp' || key === 'ArrowDown') {
      let updatedVal = Number(value);
      if (key === 'ArrowUp' && updatedVal < MAX_HOURS) {
        updatedVal += 1;
      }
      if (key === 'ArrowDown' && updatedVal >= 2) {
        updatedVal -= 1;
      }

      dispatch({
        type: 'setJobTypesSchedule',
        name: name as JobTypes,
        value: updatedVal.toString(),
        key: keyName,
      });
    }
  };

  const handleJobTypeChange = (values: Array<JobTypes>) => {
    dispatch({ type: 'setJobTypes', jobTypes: values });
  };

  const sendAnalytics = () => {
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data: {
        enrollment_flow: 'MW VHP Provider Enrollment',
        enrollment_step: 'provider_schedule_type',
        cta_clicked: jobTypes.join(','),
      },
    });
  };
  const handleNext = () => {
    sendAnalytics();
    router.push(PROVIDER_ROUTES.AVAILABILITY);
  };

  useEnterKey(canContinue, handleNext);

  return (
    <section>
      <Grid container>
        <Grid item xs={12} className={classes.header}>
          <Header>My schedule works best with:</Header>
        </Grid>
        <Grid item xs={12}>
          <StatelessSelector
            name="careType"
            className={classes.pillList}
            value={jobTypes}
            onChange={handleJobTypeChange}>
            <PillWithSchedule
              label="Recurring jobs"
              hoursLabel="Hours per week:"
              value="recurring"
              size="md"
              minValue={jobTypesSchedules.recurring?.min}
              maxValue={jobTypesSchedules.recurring?.max}
              handleMinInputChange={(e) => handleHourInputChange(e, 'min')}
              handleMaxInputChange={(e) => handleHourInputChange(e, 'max')}
              handleArrowPress={handleArrowPress}
            />
            <PillWithSchedule
              label="One-time jobs"
              hoursLabel="Hours per job:"
              value="onetime"
              size="md"
              minValue={jobTypesSchedules.onetime?.min}
              maxValue={jobTypesSchedules.onetime?.max}
              handleMinInputChange={(e) => handleHourInputChange(e, 'min')}
              handleMaxInputChange={(e) => handleHourInputChange(e, 'max')}
              handleArrowPress={handleArrowPress}
            />
            <PillWithSchedule
              label="Live-in jobs"
              hoursLabel="Hours per week:"
              value="livein"
              size="md"
              minValue={jobTypesSchedules.livein?.min}
              maxValue={jobTypesSchedules.livein?.max}
              handleMinInputChange={(e) => handleHourInputChange(e, 'min')}
              handleMaxInputChange={(e) => handleHourInputChange(e, 'max')}
              handleArrowPress={handleArrowPress}
            />
          </StatelessSelector>
        </Grid>
      </Grid>
      <div className={classes.nextButtonContainer}>
        <Button
          color="primary"
          variant="contained"
          size="large"
          disabled={!canContinue}
          fullWidth
          onClick={handleNext}>
          Next
        </Button>
      </div>
    </section>
  );
}

export default JobType;
