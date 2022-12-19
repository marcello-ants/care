// External Dependencies
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, Grid, Typography, RadioGroup, Radio, FormControlLabel } from '@material-ui/core';
import { Pill, StatelessSelector, Checkbox } from '@care/react-component-lib';

// Internal Dependencies
import { CLIENT_FEATURE_FLAGS } from '@/constants';
import { useDayFormats } from '@/lib/DayFormats';
import { DayOfWeek } from '@/types/common';
import { DayCareFrequencyOptions } from '@/types/seekerCC';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { useSeekerCCState, useAppDispatch } from '@/components/AppState';
import useFlowNavigation from '@/components/features/flowNavigation/useFlowNavigation';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';

// Styles
import useStyles from './styles';

export default function DayCareFrequency() {
  // Styles
  const classes = useStyles();

  // Component's State
  const state = useSeekerCCState();
  const { careType, specifcDays } = state?.dayCare?.careFrequency;
  const [showSpecificDaysError, setSpecificDaysError] = useState(false);
  const [daysSelected, setDaysSelected] = useState(false);
  const [allDaysSelected, setAllDaysSelected] = useState(false);
  const [selectAllDaysCheckboxUsed, setSelectedAllDaysChecboxUsed] = useState(false);

  // Utils
  const dayFormats = useDayFormats(undefined);
  const dispatch = useAppDispatch();
  const { goNext } = useFlowNavigation();

  // A/B Test - growth-daycare-days-selector
  const featureFlags = useFeatureFlags();
  const dcDaysSelectorFlagEvaluation =
    featureFlags.flags[CLIENT_FEATURE_FLAGS.DAYCARE_DAYS_SELECTOR];

  // Amplitude
  const data: any = {
    vertical: 'Childcare',
    cta_clicked: 'Next',
    final_step: false,
    enrollment_step: 'care-frequency',
    enrollment_flow: 'MW VHP',
    subvertical: 'Daycare centers',
  };
  if (dcDaysSelectorFlagEvaluation?.value === 'variation1') {
    data.days_selected = specifcDays.toString();
    data.select_all = selectAllDaysCheckboxUsed;
  }

  // Handlers

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'setDayCareFrequency', careType: event.target.value });
  };

  const handleSpecificDaysChange = (values: DayOfWeek[]) => {
    // A/B Test - growth-daycare-days-selector
    if (dcDaysSelectorFlagEvaluation?.value === 'variation1') {
      // Enable / Disable "Next" Button
      setDaysSelected(values.length > 0);

      // Reflect changes on the "Select all days" checkbox
      setAllDaysSelected(values.length === 5);
    }
    dispatch({ type: 'setDayCareSpecificDays', specifcDays: values });
    setSpecificDaysError(false);
  };

  const handleNext = () => {
    if (careType === DayCareFrequencyOptions.PART_TIME && specifcDays.length === 0) {
      setSpecificDaysError(true);
    } else {
      AnalyticsHelper.logEvent({
        name: 'Member Enrolled',
        data,
      });
      goNext();
    }
  };

  // Hooks

  useEffect(() => {
    if (dcDaysSelectorFlagEvaluation?.value === 'variation1') {
      // Enable / Disable "Next" Button
      setDaysSelected(specifcDays.length > 0);

      // Reflect changes on the "Select all days" checkbox
      setAllDaysSelected(specifcDays.length === 5);
    }

    // Amplitude - Test Exposure
    AnalyticsHelper.logTestExposure(
      CLIENT_FEATURE_FLAGS.DAYCARE_DAYS_SELECTOR,
      dcDaysSelectorFlagEvaluation
    );
  }, []);

  return (
    <>
      <Grid container className={classes.careFreqWrapper}>
        <Grid item xs={12}>
          <Typography variant="h2" color="textPrimary">
            Which days do you need to send them to daycare?
          </Typography>
        </Grid>
        {dcDaysSelectorFlagEvaluation?.value === 'control' && (
          <>
            <Grid item xs={12} className={classes.frequency}>
              <RadioGroup name="careFrequency" value={careType} onChange={handleChange}>
                <FormControlLabel
                  value={DayCareFrequencyOptions.FULL_TIME}
                  control={<Radio />}
                  label="Every weekday (Monday to Friday)"
                />
                <FormControlLabel
                  value={DayCareFrequencyOptions.PART_TIME}
                  control={<Radio />}
                  label="Custom"
                />
              </RadioGroup>
            </Grid>
            {careType === DayCareFrequencyOptions.PART_TIME && (
              <Grid item xs={12}>
                {showSpecificDaysError && (
                  <div className={classes.errorText}>
                    Please select at least 1 day from the list below
                  </div>
                )}
                <StatelessSelector
                  horizontal
                  name="specificDays"
                  onChange={handleSpecificDaysChange}
                  className={classes.daysPills}>
                  {dayFormats
                    .filter((dayFormat, index) => index !== 0 && index !== 6)
                    .map((dayFormat) => (
                      <Pill
                        label={dayFormat.shortLabel}
                        value={dayFormat.day}
                        size="xs"
                        variant="fill"
                        key={dayFormat.shortLabel}
                        selected={specifcDays.includes(dayFormat.day)}
                      />
                    ))}
                </StatelessSelector>
              </Grid>
            )}
            <Grid item xs={12} className={classes.nextButtonContainer}>
              <Button
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                onClick={handleNext}>
                Next
              </Button>
            </Grid>
          </>
        )}
        {dcDaysSelectorFlagEvaluation?.value !== 'control' && (
          <>
            <StatelessSelector
              horizontal
              name="specificDays"
              onChange={handleSpecificDaysChange}
              className={classes.daysSelectorTestDaysPills}>
              {dayFormats
                .filter((dayFormat, index) => index !== 0 && index !== 6)
                .map((dayFormat) => (
                  <Pill
                    label={dayFormat.shortLabel}
                    value={dayFormat.day}
                    size="xs"
                    variant="fill"
                    key={dayFormat.shortLabel}
                    selected={specifcDays.includes(dayFormat.day)}
                  />
                ))}
            </StatelessSelector>
            <FormControlLabel
              control={<Checkbox />}
              label="Select all days"
              checked={allDaysSelected}
              onChange={(event, checked) => {
                if (checked) {
                  handleSpecificDaysChange([
                    'monday',
                    'tuesday',
                    'wednesday',
                    'thursday',
                    'friday',
                  ]);
                  setSelectedAllDaysChecboxUsed(true);
                } else {
                  handleSpecificDaysChange([]);
                  setSelectedAllDaysChecboxUsed(false);
                }
              }}
            />
            <Grid item xs={12} className={classes.nextButtonContainer}>
              <Button
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                disabled={!daysSelected}
                onClick={handleNext}>
                Next
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
}
