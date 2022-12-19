/**
 * Used to display time selction blocks in post a job follow. This includes  high level time selection (morning, afternoon etc) and specific times selection
 * Params : 
 * validateForm - this used to trigger force validation, usually validation happend on change 
 * onValidationComplete -  after validation control is passed back to parent/calling component 
 * careTimes - Type "PartsOfDay" has the list of time slots
 * specificTimes - Flag that used to display specific time selection block
 * validateDays - if this componnent is used in combination with days, we want to make sure at least one day is selected before we choose specific time. This is will trigger validation. 
 * showDisclaimer - Flag to hide and show "you can always adjust these times later" disclaimer. This needs to be hidden for childcare flow at the moment. 
 * Usage: 
 *  <RecurringJobTime
        validateForm={validateForm}
        onValidationComplete={handleTimesValidationResponse}
        careTimes={careTimes}
        specificTimes={specificTimes}
        validateDays={daysValidationResquest}
        showDisclaimer
      />
 * 
 */

import React, { useState, useEffect } from 'react';
import { Grid, Link, makeStyles, Typography } from '@material-ui/core';
import { Pill, StatelessSelector } from '@care/react-component-lib';
import { PartsOfDay } from '@/types/common';
import SpecificCareTimes from './SpecificCareTimes';
import SpecificCareTimesChildCare from './SpecificCareTimesChildCare';

const useStyles = makeStyles((theme) => ({
  errorText: {
    color: theme.palette.error.main,
    fontSize: '12px',
    lineHeight: '16px',
    marginBottom: theme.spacing(1),
  },

  careTimes: {
    '& li': {
      marginBottom: 0,
      marginRight: '12px',
    },
    '& p': {
      fontSize: '1rem',
    },
  },
  specificTimesLink: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(1.25),
  },
  adjustLaterText: {
    marginTop: theme.spacing(0),
  },
}));

// check line in this file for descrition and usage
type RecurringJobTimeProps = {
  validateForm: boolean;
  onValidationComplete: Function;
  careTimes: PartsOfDay;
  specificTimes: boolean;
  validateDays: Function;
  showDisclaimer: boolean;
  onTimeChange: (values: PartsOfDay) => void;
  onSpecificTimeChange: (isSpecificTimes: boolean) => void;
  customSeekerState?: any;
  jobReducer?: any;
};

const RecurringJobTime = (props: RecurringJobTimeProps) => {
  const classes = useStyles();

  const [showTimesError, setShowTimesError] = useState(false);
  const {
    validateForm,
    onValidationComplete,
    careTimes,
    specificTimes,
    validateDays,
    showDisclaimer,
    onTimeChange,
    onSpecificTimeChange,
    customSeekerState,
    jobReducer,
  } = props;

  const validateTimeSelection = (): boolean => {
    let isValid = true;
    // ensure at least one time block is selected
    if (!specificTimes && Object.keys(careTimes || {}).length === 0) {
      setShowTimesError(true);
      isValid = false;
    }
    return isValid;
  };

  /* we want to validate user selection on Next. 
  "validateForm" is false by default it will be set to true on click on Next */
  useEffect(() => {
    if (validateForm) {
      onValidationComplete(validateTimeSelection());
    }
  }, [validateForm]);

  const handleCareTimesChange = (values: Array<keyof PartsOfDay>) => {
    if (showTimesError && values.length > 0) {
      setShowTimesError(false);
    }

    // convert the incoming array to an object for easier lookups
    const valuesObj: PartsOfDay = {};
    values.forEach((value) => {
      valuesObj[value] = true;
    });

    onTimeChange(valuesObj);
  };

  const handleSpecificTimes = () => {
    // ensure at least one day is selected
    if (validateDays) {
      validateDays();
    }

    if (showTimesError) {
      setShowTimesError(false);
    }
    onSpecificTimeChange(true);
  };

  const pillOptions = [
    { label: 'Mornings', value: 'morning', selected: careTimes.morning },
    { label: 'Afternoons', value: 'afternoon', selected: careTimes.afternoon },
    { label: 'Evenings', value: 'evening', selected: careTimes.evening },
    { label: 'Overnight', value: 'overnight', selected: careTimes.overnight },
  ];
  return (
    <>
      {showTimesError && (
        <Grid item xs={12}>
          <div className={classes.errorText}>Please select at least 1 time from the list below</div>
        </Grid>
      )}
      {!specificTimes && (
        <Grid item xs={12}>
          <StatelessSelector
            horizontal
            name="careTimes"
            className={classes.careTimes}
            onChange={handleCareTimesChange}>
            {pillOptions.map((pill) => {
              return (
                <Pill
                  key={pill.label}
                  label={pill.label}
                  value={pill.value}
                  selected={pill.selected}
                />
              );
            })}
          </StatelessSelector>
        </Grid>
      )}

      <Grid item xs={12}>
        {
          // eslint-disable-next-line no-nested-ternary
          specificTimes ? (
            // prettier-ignore
            customSeekerState ? <SpecificCareTimesChildCare state={customSeekerState} reducer={jobReducer} /> : <SpecificCareTimes />
          ) : (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <Link
              className={classes.specificTimesLink}
              component="button"
              variant="body2"
              onClick={handleSpecificTimes}>
              Add specific times instead
            </Link>
          )
        }
      </Grid>
      {showDisclaimer && (
        <Grid item xs={12}>
          <Typography
            variant="subtitle2"
            align="center"
            color="textSecondary"
            className={classes.adjustLaterText}>
            Don&apos;t worry, you can always adjust these times later.
          </Typography>
        </Grid>
      )}
    </>
  );
};

RecurringJobTime.defaultProps = {
  customSeekerState: null,
  jobReducer: null,
};

export default RecurringJobTime;
