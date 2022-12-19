/**
 * Used to display days in post a job follow 
 * Params : 
 * validateForm - this used to trigger force validation, usually validation happend on change 
 * onValidationComplete -  after validation control is passed back to parent/calling component 
 * schedule - type "WeeklySchedule" thats has the data foro rendering days
 * Usage: 
 *  <PostAJobDays
        validateForm={validateForm}
        onValidationComplete={handleDaysValidationResponse}
        schedule={schedule}
      />
 * 
 */

import React, { useState, useEffect } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { DayPicker } from '@care/react-component-lib';
import { DayOfWeek, WeeklySchedule } from '@/types/common';
import { useDayFormats } from '../lib/DayFormats';

// Declaring this type to match the DayPicker component types.
declare type Day = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

const useStyles = makeStyles((theme) => ({
  errorText: {
    color: theme.palette.error.main,
    fontSize: '12px',
    lineHeight: '16px',
    marginBottom: theme.spacing(1),
  },
  careDays: {
    display: 'flex',
    flexWrap: 'wrap',
    '& li': {
      maxWidth: '49px',
      margin: 0,
      /*
        Overwrite lato font with the default font from the theme,
        TODO: we need to remove this style when https://jira.infra.carezen.net/browse/DNA-951 is done
       */
      fontFamily: theme.typography.fontFamily,
      [theme.breakpoints.up('sm')]: {
        marginRight: 'auto',
      },
    },
    '& li:last-child': {
      marginRight: 0,
    },
  },
}));

// check line in this file for descrition and usage
type PostAjobDaysProps = {
  validateForm: boolean;
  onValidationComplete: Function;
  schedule: WeeklySchedule;
  onChange: (daySelection: DayOfWeek, isPrevSelected?: boolean | undefined) => void;
};

const PostAJobDays = (props: PostAjobDaysProps) => {
  const classes = useStyles();
  const dayFormats = useDayFormats(undefined);
  const [showDaysError, setShowDaysError] = useState(false);
  const { validateForm, onValidationComplete, schedule, onChange } = props;
  // Reformatting the selected days values since the DayPicker component use three letters format.
  const selectedDays = Object.keys(schedule).map((selectedDay) => {
    const [{ shortLabel }] = dayFormats.filter((formatDay) => formatDay.day === selectedDay);
    return shortLabel as Day;
  });

  const validateDaysSelection = (): boolean => {
    let isValid = true;

    // ensure at least one day is selected
    if (Object.keys(schedule || {}).length === 0) {
      setShowDaysError(true);
      isValid = false;
    }
    return isValid;
  };

  /* we want to validate user selection on Next. 
  "validateForm" is false by default it will be set to true on click on Next */
  useEffect(() => {
    if (validateForm) {
      // call to the callback in the parent component after validation
      onValidationComplete(validateDaysSelection());
    }
  }, [validateForm]);

  const handleCareDaysChange = (values: string[]) => {
    // Reformatting the days values since the DayPicker component use three letters format.
    const formattedValues = values.map((d) => {
      const [{ day }] = dayFormats.filter((formatDay) => formatDay.shortLabel.toLowerCase() === d);
      return day;
    });
    if (showDaysError && values.length > 0) {
      setShowDaysError(false);
    }

    // convert the incoming array to an object
    const valuesObj: { [key in DayOfWeek]?: boolean } = {};
    formattedValues.forEach((value) => {
      if (value) {
        valuesObj[value] = true;
      }
    });

    // loop through the possible options to figure out which days need to be added or removed
    dayFormats.forEach((dayFormat) => {
      const { day } = dayFormat;
      const isSelected = Boolean(valuesObj[day]);
      const prevSelected = Boolean(schedule[day]);

      if (prevSelected && !isSelected) {
        onChange(day, true);
      } else if (!prevSelected && isSelected) {
        onChange(day);
      }
    });
  };

  return (
    <>
      {showDaysError && (
        <Grid item xs={12}>
          <div className={classes.errorText}>Please select at least 1 day from the list below</div>
        </Grid>
      )}
      <Grid item xs={12}>
        <DayPicker
          name="careDays"
          className={classes.careDays}
          onChange={handleCareDaysChange}
          weekStart="Sun"
          selectedDays={selectedDays}
        />
      </Grid>
    </>
  );
};

export default PostAJobDays;
