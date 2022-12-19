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
} from '@material-ui/core';
import { Icon24UtilityChevron, Icon24UtilityClose } from '@care/react-icons';
import clsx from 'clsx';
import { DailySchedule } from '@/types/common';
import { useAppDispatch, useSeekerCCState } from './AppState';
import TimeSlider from './TimeSlider';
import { getFormattedTimeRange, toSliderValue } from '../lib/TimeFormats';
import { useDayFormats } from '../lib/DayFormats';

type SpecificCareTimesChildCareProps = {
  locale?: string;
  // TODO: once Availability gets replaced in Post a Job we need to add correct dispatch and state types here
  dispatch?: any;
  state?: any;
  reducer?: any;
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

  accordionItem: {
    marginBottom: theme.spacing(0),
  },
  accordion: {
    padding: theme.spacing(0, 0, 1, 0),
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
  specificTime: {
    marginBottom: theme.spacing(1),
  },
}));

function buildScheduleLabel(schedule: DailySchedule) {
  const blocks = schedule.blocks.map((timeBlock) =>
    getFormattedTimeRange(undefined, [timeBlock.start, timeBlock.end])
  );
  return blocks.join(', ');
}

function SpecificCareTimesChildCare({
  locale,
  dispatch: customDispatch = null,
  state: customState = null,
  reducer,
}: SpecificCareTimesChildCareProps) {
  const classes = useStyles();
  const state = customState ?? useSeekerCCState();
  const dispatch = customDispatch ?? useAppDispatch();
  const dayLabels = useDayFormats(locale);
  const { asPath } = useRouter();
  const path = asPath.split('?')[0];
  const { schedule, timesAppliedToAllDays } = state?.jobPost?.recurring ?? {};

  const dayRows = dayLabels.map(({ day, longLabel }) => {
    const daySchedule = schedule[day];
    const lessThanTimeBlocksAllowed = daySchedule?.blocks.length <= 2;
    const sliderisEqualOrAbove11 =
      daySchedule?.blocks.filter(
        (block: { start: string; end: string }) => toSliderValue(block.end) >= 23
      ).length < 1;
    const canAddTimes = lessThanTimeBlocksAllowed && sliderisEqualOrAbove11;
    if (daySchedule) {
      return (
        <Accordion key={day} elevation={0} data-testid="accordion">
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
                    dispatch({
                      type: 'job_updateDayBlock',
                      index,
                      day,
                      timeBlock: { start, end },
                      reducer,
                    });
                  }}
                />

                <button
                  disabled={index === 0}
                  type="button"
                  className={classes.iconButton}
                  onClick={() => dispatch({ type: 'cc_removeTimeBlock', day, index })}>
                  <Icon24UtilityClose size="24px" height="24px" width="24px" hidden={index === 0} />
                </button>
              </div>
            ))}
            {canAddTimes && !path.includes('/schedule') ? (
              <button
                type="button"
                onClick={() => dispatch({ type: 'cc_addTimeBlock', day })}
                className={classes.addMoreButton}>
                <Typography variant="body2">+ Add time</Typography>
              </button>
            ) : null}

            <div className={classes.applyToAllDaysLabel}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={timesAppliedToAllDays}
                    onChange={() => {
                      if (!timesAppliedToAllDays) {
                        dispatch({ type: 'job_applyTimesToAllDays', day, reducer });
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
          </AccordionDetails>
        </Accordion>
      );
    }

    return null;
  });

  return <div className={classes.specificTime}>{dayRows}</div>;
}

SpecificCareTimesChildCare.defaultProps = {
  locale: undefined,
};

export default SpecificCareTimesChildCare;
