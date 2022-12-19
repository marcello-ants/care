/* eslint-disable react/require-default-props */
import { useRouter } from 'next/router';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Typography,
  makeStyles,
  Button,
} from '@material-ui/core';
import { Icon24UtilityChevron, Icon24UtilityClose } from '@care/react-icons';
import clsx from 'clsx';
import { DailySchedule } from '@/types/common';
import { useSeekerState, useAppDispatch } from './AppState';
import TimeSlider from './TimeSlider';
import { getFormattedTimeRange, toSliderValue } from '../lib/TimeFormats';
import { useDayFormats } from '../lib/DayFormats';

type SpecificCareTimesProps = {
  locale?: string;
  // TODO: once Availability gets replaced in Post a Job we need to add correct dispatch and state types here
  dispatch?: any;
  state?: any;
  isFreeGated?: boolean;
};

type TimeBlock = {
  start: string;
  end: string;
};

const useStyles = makeStyles((theme) => ({
  timeBlocksLabel: {
    alignSelf: 'center',
    fontSize: '14px',
    marginLeft: theme.spacing(1),
  },
  applyToAllDaysLabel: {
    textAlign: 'center',
  },
  applyToAllDaysButtonWrapper: {
    textAlign: 'center',
  },
  applyToAllDaysButton: {
    width: theme.spacing(19),
    marginTop: theme.spacing(1),
  },

  accordionItem: {
    marginBottom: theme.spacing(0),
  },
  accordion: {
    padding: theme.spacing(1, 0, 0),
  },
  accordionContainer: {
    '& .MuiCollapse-hidden': {
      height: '0 !important',
    },
  },
  addMoreButton: {
    background: 'none',
    border: 'none',
    margin: '0 auto',
    outline: 'none',
    display: 'block',
    color: theme.palette?.care?.blue[700],
    textAlign: 'center',
    cursor: 'pointer',
    padding: theme.spacing(2, 0, 2),
  },
  checkboxLabel: {
    fontSize: '16px',
  },

  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(2),
  },

  iconButton: {
    border: 'none',
    background: 'none',
    outline: 'none',
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(1),
    '& :not(:disabled)': {
      cursor: 'pointer',
    },
  },
}));

function buildScheduleLabel(schedule: DailySchedule) {
  const blocks = schedule.blocks.map((timeBlock) =>
    getFormattedTimeRange(undefined, [timeBlock.start, timeBlock.end])
  );
  return blocks.join(', ');
}

function SpecificCareTimes({
  locale,
  dispatch: customDispatch = null,
  state: customState = null,
  isFreeGated,
}: SpecificCareTimesProps) {
  const classes = useStyles();
  const { jobPost } = useSeekerState();
  const state = customState ?? jobPost;
  const dispatch = customDispatch ?? useAppDispatch();
  const dayLabels = useDayFormats(locale);
  const { asPath } = useRouter();
  const path = asPath.split('?')[0];
  const { schedule, timesAppliedToAllDays } = state?.recurring ?? {};

  const dayRows = dayLabels.map(({ day, longLabel }) => {
    const daySchedule = schedule[day];
    // TODO: Multiple timeframes were disabled for MVP. Refer SC-529
    const lessThanTimeBlocksAllowed = daySchedule?.blocks.length <= 0;
    const sliderisEqualOrAbove11 =
      daySchedule?.blocks.filter(
        (block: { start: string; end: string }) => toSliderValue(block.end) >= 23
      ).length < 1;
    const canAddTimes = lessThanTimeBlocksAllowed && sliderisEqualOrAbove11;

    if (daySchedule) {
      return (
        <Accordion
          className={classes.accordionContainer}
          key={day}
          elevation={0}
          data-testid="accordion">
          <AccordionSummary
            expandIcon={<Icon24UtilityChevron />}
            className={clsx(classes.accordionItem, classes.accordion)}>
            <Typography variant="subtitle1">{longLabel}</Typography>
            <Typography
              className={classes.timeBlocksLabel}
              variant="subtitle2"
              color="textSecondary">
              {buildScheduleLabel(daySchedule)}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.accordion}>
            {daySchedule.blocks.map((timeBlock: TimeBlock, index: number) => (
              // eslint-disable-next-line react/no-array-index-key
              <div className={classes.sliderContainer} key={index}>
                <TimeSlider
                  values={[timeBlock.start, timeBlock.end]}
                  onChange={(values: string[]) => {
                    const [start, end] = values;
                    dispatch({ type: 'updateDayBlock', index, day, timeBlock: { start, end } });
                  }}
                />

                <button
                  disabled={index === 0}
                  type="button"
                  className={classes.iconButton}
                  onClick={() => dispatch({ type: 'removeTimeBlock', day, index })}>
                  <Icon24UtilityClose size="24px" height="24px" width="24px" hidden={index === 0} />
                </button>
              </div>
            ))}
            {/* TODO:  path !== '/recurring' should be removed once this gets carried over to post a job */}
            {canAddTimes && path !== '/recurring' ? (
              <button
                type="button"
                onClick={() => dispatch({ type: 'addTimeBlock', day })}
                className={classes.addMoreButton}>
                <Typography variant="body2">+ Add time</Typography>
              </button>
            ) : null}

            {isFreeGated ? (
              <div className={classes.applyToAllDaysButtonWrapper}>
                <Button
                  color="secondary"
                  variant="outlined"
                  size="small"
                  className={classes.applyToAllDaysButton}
                  onClick={() => {
                    dispatch({ type: 'applyTimesToAllDays', day });
                  }}>
                  Apply to all days
                </Button>
              </div>
            ) : (
              <div className={classes.applyToAllDaysLabel}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={timesAppliedToAllDays}
                      onChange={() => {
                        if (!timesAppliedToAllDays) {
                          dispatch({ type: 'applyTimesToAllDays', day });
                        }
                      }}
                    />
                  }
                  classes={{
                    label: classes.checkboxLabel,
                  }}
                  label="Apply this time to all days"
                  labelPlacement="end"
                />
              </div>
            )}
          </AccordionDetails>
        </Accordion>
      );
    }

    return null;
  });

  return <>{dayRows}</>;
}

SpecificCareTimes.defaultProps = {
  locale: undefined,
  isFreeGated: false,
};

export default SpecificCareTimes;
