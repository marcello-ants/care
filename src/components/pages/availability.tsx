/* eslint-disable no-param-reassign */
import React, { useState, useReducer } from 'react';
import dayjs from 'dayjs';
import produce from 'immer';
import { Grid, Link, makeStyles, Button } from '@material-ui/core';
import {
  Pill,
  StatelessSelector,
  SelectorOption,
  KeyboardDatePicker,
  Typography,
  DayPicker,
} from '@care/react-component-lib';

import { calculateBoundaryDatesAndTimes } from '@/utilities/oneTimeHelper';
import { mapCareTimes } from '@/state/seeker/reducerHelpers';
import { fromSliderToString, toSliderValue } from '@/lib/TimeFormats';
import { DAYS, useDayFormats } from '@/lib/DayFormats';
import {
  DayOfWeek,
  DEFAULT_START_TIME,
  DEFAULT_END_TIME,
  PartsOfDay,
  WeeklySchedule,
  AvailabilityAction,
} from '@/types/common';

import Header from '../Header';
import FixElementToBottom from '../FixElementToBottom';
import SpecificCareTimes from '../SpecificCareTimes';
import { withTimeZoneSupport } from '../polyfills/withTimeZoneSupport';

// Styles
const useStyles = makeStyles((theme) => ({
  // TODO: should be able to replace this with the "info1" typography variant once available
  errorText: {
    marginTop: theme.spacing(1),
  },
  datePickerContainer: {
    paddingTop: theme.spacing(2),
    '& > div': {
      // datepicker has a lot of spacing... removing some margin to match mock
      padding: 0,
      marginTop: theme.spacing(-3),
    },
  },
  headerDescription: {
    marginTop: theme.spacing(2),
  },
  endDateDescription: {
    fontSize: 12,
    marginTop: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
  },
  specificTimesLink: {
    marginTop: theme.spacing(2),
  },
  dateSubheader: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  daySubheader: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(0),
  },
  timeSubheader: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(0),
  },
  adjustLaterText: {
    marginTop: theme.spacing(4),
  },
  dayPicker: {
    margin: theme.spacing(2.5, 0),
  },
  careDays: {
    paddingTop: theme.spacing(1),
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
      // fixes caredays right spacing
      marginRight: 'auto',
    },
    '& li:last-child': {
      marginRight: 0,
    },
    '& .control-label': {
      fontSize: '14px',
    },
  },
  careTimes: {
    paddingTop: theme.spacing(1),
    '& li': {
      marginBottom: 0,
      marginRight: '12px',
    },
    '& p': {
      fontSize: '1rem',
    },
  },
}));

function sanitizeDate(date: any) {
  if (date && dayjs(date).isValid()) {
    return date;
  }
  return null;
}

export interface IAvailability {
  header: string;
  handleNext: (state: any) => void;
  appState: any;
  isFreeGated?: boolean;
}

// used to match values from DayPicker to needed format
const dayPickerDaysMatch: { [key: string]: keyof WeeklySchedule } = {
  mon: 'monday',
  tue: 'tuesday',
  wed: 'wednesday',
  thu: 'thursday',
  fri: 'friday',
  sat: 'saturday',
  sun: 'sunday',
};

type selectedDayPickerDay = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

// Reducer
const reducer = produce((draft, action: AvailabilityAction) => {
  switch (action.type) {
    case 'setStartDate': {
      draft.recurring.start = action.date;
      return draft;
    }

    case 'setEndDate':
      draft.recurring.end = action.date;
      return draft;

    case 'addDayBlock': {
      const { specificTimes, schedule } = draft.recurring;

      const daySchedule = draft.recurring.schedule[action.day] ?? { blocks: [] };

      const { start, end } = mapCareTimes(draft.recurring.careTimes);

      // get last day time to be copied in the new day
      const prevDays = DAYS.slice(0, DAYS.indexOf(action.day));
      const [day] = prevDays.reverse().filter((key) => schedule[key]);
      const prevDay = schedule[day];

      if (specificTimes && prevDay) {
        // copy the previous schedule to the new day
        daySchedule.blocks = prevDay.blocks;
      } else if (specificTimes && start && end) {
        // set range time from Times pills
        daySchedule.blocks.push({ end, start });
      } else if (specificTimes) {
        daySchedule.blocks.push({ end: DEFAULT_END_TIME, start: DEFAULT_START_TIME });
      }
      draft.recurring.schedule[action.day] = daySchedule;
      draft.recurring.timesAppliedToAllDays = false;

      return draft;
    }
    case 'removeDayBlock':
      if (!action.index) {
        // remove all blocks
        delete draft.recurring.schedule[action.day];
      }

      return draft;

    case 'setSpecificTimes': {
      draft.recurring.specificTimes = action.isSpecificTimes;
      draft.recurring.scheduleMayVary = false;

      // if days are selected, pre-populate the blocks with the pill times or use default times
      const selectedDays = Object.keys(draft.recurring.schedule) as DayOfWeek[];
      const { start = '', end = '' } =
        selectedDays.length > 0 ? mapCareTimes(draft.recurring.careTimes) : {};

      selectedDays.forEach((day) => {
        const daySchedule = draft.recurring.schedule[day] ?? { blocks: [] };
        if (daySchedule.blocks.length === 0 && start && end) {
          daySchedule.blocks.push({ end, start });
        } else if (daySchedule.blocks.length === 0) {
          daySchedule.blocks.push({ end: DEFAULT_END_TIME, start: DEFAULT_START_TIME });
        }
      });

      // wipe out old careTimes configuration if present since we are going with specific times instead
      draft.recurring.careTimes = {};
      return draft;
    }

    case 'setPartsOfDay':
      draft.recurring.careTimes = action.partsOfDay;

      return draft;

    case 'updateDayBlock': {
      const daySchedule = draft.recurring.schedule[action.day];
      const dayScheduleLength = daySchedule.blocks.length;
      let { timeBlock } = action;

      if (daySchedule) {
        // will not allow values from second and third slider to be before  previous slider's
        if (action.index > 0) {
          const previousBlock = daySchedule.blocks[action.index - 1];
          const prevEnd = toSliderValue(previousBlock.end);
          const currentStart = toSliderValue(timeBlock.start);

          timeBlock =
            currentStart < prevEnd ? { start: previousBlock.end, end: timeBlock.end } : timeBlock;
        }

        // will not allow values from first and second slider to be after next slider's
        if (
          (action.index < 2 && dayScheduleLength > 2) ||
          (action.index === 0 && dayScheduleLength > 1)
        ) {
          const nextBlock = daySchedule.blocks[action.index + 1];
          const nextStart = toSliderValue(nextBlock.start);
          const currentEnd = toSliderValue(timeBlock.end);

          timeBlock =
            currentEnd > nextStart ? { start: timeBlock.start, end: nextBlock.start } : timeBlock;
        }
      }

      draft.recurring.timesAppliedToAllDays = false;
      daySchedule.blocks[action.index] = timeBlock;

      return draft;
    }

    case 'applyTimesToAllDays': {
      const { schedule } = draft.recurring;
      const daySchedule = schedule[action.day];
      if (daySchedule) {
        (Object.keys(schedule) as DayOfWeek[]).forEach((otherDay) => {
          if (otherDay !== action.day) {
            const otherSchedule = schedule[otherDay];
            if (otherSchedule) {
              otherSchedule.blocks = daySchedule.blocks;
            }
          }
        });
        draft.recurring.timesAppliedToAllDays = true;
      }
      return draft;
    }

    case 'addTimeBlock': {
      const daySchedule = draft.recurring.schedule[action.day];
      const dayScheduleLength = daySchedule.blocks.length;
      let start = DEFAULT_START_TIME;
      let end = DEFAULT_END_TIME;
      const prevTimeBlock = daySchedule.blocks[dayScheduleLength - 1].end;

      // makes sure that no new block gets added if end time is past 10:30 pm
      if (toSliderValue(prevTimeBlock) < 23) {
        draft.recurring.canAddTimes = true;
        start = daySchedule.blocks[dayScheduleLength - 1].end;
        end = fromSliderToString(
          toSliderValue(daySchedule.blocks[dayScheduleLength - 1].end) + 1.5
        );

        daySchedule.blocks.push({ end, start });
      }

      return draft;
    }

    case 'removeTimeBlock': {
      const daySchedule = draft.recurring.schedule[action.day];

      daySchedule.blocks.splice(action.index, 1);

      return draft;
    }

    default:
      return draft;
  }
});

function Availability({ header, handleNext, appState, isFreeGated }: IAvailability) {
  const classes = useStyles();
  const dayFormats = useDayFormats(undefined);
  const [showDaysError, setShowDaysError] = useState(false);
  const [showTimesError, setShowTimesError] = useState(false);
  const [state, dispatch] = useReducer(reducer, appState);

  const startDate = state?.recurring.start;
  const endDate = state?.recurring.end;

  const { earliestStartDate, latestStartDate, earliestStartDatePlusOneDay, latestEndDate } =
    calculateBoundaryDatesAndTimes(startDate, dayjs());

  const { schedule, careTimes, specificTimes } = state.recurring;

  const dayPickerSelectedDays: selectedDayPickerDay[] = Object.keys(schedule).map(
    (day: any): selectedDayPickerDay => day[0].toUpperCase() + day.slice(1, 3)
  );

  function handleCareDaysChange(values: Array<keyof WeeklySchedule>) {
    if (showDaysError && values.length > 0) {
      setShowDaysError(false);
    }

    // convert the incoming array to an object
    const valuesObj: { [key in DayOfWeek]?: boolean } = {};
    values.forEach((value) => {
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
        dispatch({ type: 'removeDayBlock', day });
      } else if (!prevSelected && isSelected) {
        dispatch({ type: 'addDayBlock', day });
      }
    });
  }

  function handleDayPickerChange(values: string[]) {
    // convert values to needed format and send to main function
    const formattedValues: Array<keyof WeeklySchedule> = values.map(
      (day: string) => dayPickerDaysMatch[day]
    );

    handleCareDaysChange(formattedValues);
  }

  function handleCareTimesChange(values: Array<keyof PartsOfDay>) {
    if (showTimesError && values.length > 0) {
      setShowTimesError(false);
    }

    // convert the incoming array to an object for easier lookups
    const valuesObj: PartsOfDay = {};
    values.forEach((value) => {
      valuesObj[value] = true;
    });

    dispatch({ type: 'setPartsOfDay', partsOfDay: valuesObj });
  }

  function handleSpecificTimes() {
    // ensure at least one day is selected
    if (Object.keys(schedule || {}).length === 0) {
      setShowDaysError(true);
    }
    if (showTimesError) {
      setShowTimesError(false);
    }
    dispatch({ type: 'setSpecificTimes', isSpecificTimes: true });
  }

  function validateForm() {
    let isValid = true;

    // ensure at least one day is selected
    if (Object.keys(schedule || {}).length === 0) {
      setShowDaysError(true);
      isValid = false;
    }

    // ensure at least one time block is selected
    if (!specificTimes && Object.keys(careTimes || {}).length === 0) {
      setShowTimesError(true);
      isValid = false;
    }

    return isValid;
  }

  const onNext = () => {
    const isFormValid = validateForm();
    if (!isFormValid) {
      return;
    }

    handleNext(state);
  };

  const isButtonEnabled = () =>
    (specificTimes && Object.keys(schedule).length) ||
    (!specificTimes && Object.keys(schedule).length && Object.keys(careTimes).length);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Header>{header}</Header>
      </Grid>

      {isFreeGated && (
        <Grid item xs={12}>
          <Typography variant="body2" className={classes.headerDescription}>
            When are you typically available to babysit? Easily update your schedule any time.
          </Typography>
        </Grid>
      )}

      {!isFreeGated && (
        <>
          <Grid item xs={12} className={classes.datePickerContainer}>
            <Typography variant="h4" className={classes.dateSubheader}>
              Dates
            </Typography>
            <KeyboardDatePicker
              selectDate
              label="Estimated start date"
              format="MM/DD/YYYY"
              id="startDate"
              minDate={earliestStartDate ?? undefined}
              maxDate={latestStartDate ?? undefined}
              value={sanitizeDate(startDate)}
              onChange={(date: any) => {
                if (date && date.isValid()) {
                  dispatch({
                    type: 'setStartDate',
                    date: date.format('YYYY-MM-DD'),
                  });
                } else {
                  dispatch({
                    type: 'setStartDate',
                    date: null,
                  });
                }
              }}
            />
          </Grid>
          <Grid item xs={12} className={classes.datePickerContainer}>
            <KeyboardDatePicker
              selectDate
              label="Estimated end date"
              format="MM/DD/YYYY"
              id="endDate"
              minDate={earliestStartDatePlusOneDay ?? undefined}
              maxDate={latestEndDate ?? undefined}
              value={sanitizeDate(endDate)}
              onChange={(date: any) => {
                if (date && date.isValid()) {
                  dispatch({ type: 'setEndDate', date: date.format('YYYY-MM-DD') });
                } else {
                  dispatch({ type: 'setEndDate', date: null });
                }
              }}
            />
          </Grid>
        </>
      )}
      <Grid item xs={12}>
        <Typography variant="h4" className={classes.daySubheader}>
          Days
        </Typography>
      </Grid>
      {showDaysError && (
        <Grid item xs={12}>
          <Typography careVariant="info1" color="error" className={classes.errorText}>
            Please select at least 1 day from the list below
          </Typography>
        </Grid>
      )}
      <Grid item xs={12}>
        {isFreeGated ? (
          <DayPicker
            name="careDays"
            selectedDays={dayPickerSelectedDays}
            onChange={handleDayPickerChange}
            className={classes.dayPicker}
          />
        ) : (
          <StatelessSelector
            name="careDays"
            className={classes.careDays}
            onChange={handleCareDaysChange}>
            {dayFormats.map((dayFormat) => (
              <SelectorOption
                key={dayFormat.day}
                label={dayFormat.shortLabel}
                indicator={dayFormat.narrowLabel}
                value={dayFormat.day}
                selected={Boolean(schedule[dayFormat.day])}
              />
            ))}
          </StatelessSelector>
        )}
      </Grid>

      {!isFreeGated && (!specificTimes || Object.keys(schedule).length > 0) && (
        <Grid item xs={12}>
          <Typography variant="h4" className={classes.timeSubheader}>
            Times
          </Typography>
        </Grid>
      )}
      {showTimesError && (
        <Grid item xs={12}>
          <Typography careVariant="info1" color="error" className={classes.errorText}>
            Please select at least 1 time from the list below
          </Typography>
        </Grid>
      )}
      {!specificTimes && (
        <Grid item xs={12}>
          <StatelessSelector
            horizontal
            name="careTimes"
            className={classes.careTimes}
            onChange={handleCareTimesChange}>
            <Pill label="Mornings" value="morning" selected={careTimes.morning} />
            <Pill label="Afternoons" value="afternoon" selected={careTimes.afternoon} />
            <Pill label="Evenings" value="evening" selected={careTimes.evening} />
            <Pill label="Overnight" value="overnight" selected={careTimes.overnight} />
          </StatelessSelector>
        </Grid>
      )}
      {!isFreeGated && (
        <>
          <Grid item xs={12}>
            {specificTimes ? (
              <SpecificCareTimes dispatch={dispatch} state={state} isFreeGated={isFreeGated} />
            ) : (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <Link
                className={classes.specificTimesLink}
                component="button"
                variant="body2"
                onClick={handleSpecificTimes}>
                Add specific times instead
              </Link>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              align="center"
              color="textSecondary"
              className={classes.adjustLaterText}>
              Don&apos;t worry, you can always adjust these times later.
            </Typography>
          </Grid>
        </>
      )}
      <FixElementToBottom>
        <Button
          size="large"
          color="primary"
          variant="contained"
          onClick={onNext}
          fullWidth
          disabled={!isButtonEnabled()}>
          Next
        </Button>
      </FixElementToBottom>
    </Grid>
  );
}

export default withTimeZoneSupport(Availability);
