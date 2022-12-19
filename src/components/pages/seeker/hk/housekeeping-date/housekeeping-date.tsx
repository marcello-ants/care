import Head from 'next/head';
import { StatelessSelector, Pill } from '@care/react-component-lib';
import { Button, Grid, makeStyles } from '@material-ui/core';

import { useAppDispatch, useSeekerHKState } from '@/components/AppState';
import Header from '@/components/Header';
import useNextRoute from '@/components/hooks/useNextRoute';
import { logCareEvent } from '@/utilities/amplitudeAnalyticsHelper';
import { CARE_DATES, CARE_DATE_LABELS } from '@/constants';

const options = [
  { label: CARE_DATE_LABELS.RIGHT_NOW, value: CARE_DATES.RIGHT_NOW },
  { label: CARE_DATE_LABELS.WITHIN_A_WEEK, value: CARE_DATES.WITHIN_A_WEEK },
  { label: CARE_DATE_LABELS.IN_1_2_MONTHS, value: CARE_DATES.IN_1_2_MONTHS },
  { label: CARE_DATE_LABELS.JUST_BROWSING, value: CARE_DATES.JUST_BROWSING },
];

const useStyles = makeStyles((theme) => ({
  nextButtonContainer: {
    padding: theme.spacing(3, 0),
    marginBottom: theme.spacing(34.5),
  },
  selector: {
    marginTop: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(4),
    },
    '& .MuiListItem-root': {
      marginBottom: theme.spacing(0),
      [theme.breakpoints.up('md')]: {
        marginBottom: theme.spacing(-0.5),
      },
    },
  },
  mainContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

function HousekeepingDatePage() {
  const classes = useStyles();
  const { pushNextRoute } = useNextRoute();
  const { careDate } = useSeekerHKState();
  const dispatch = useAppDispatch();

  const handleNext = () => {
    logCareEvent('Member Enrolled', 'Dates', {
      intent: CARE_DATE_LABELS[careDate],
    });
    pushNextRoute();
  };

  const onChangeHandler = (value: string[]) => {
    if (!value.length) {
      return;
    }
    const selection = value[0];

    dispatch({ type: 'setHousekeepingDate', careDate: selection as CARE_DATES });
  };

  return (
    <>
      <Head>
        <title>When do you need a housekeeper?</title>
      </Head>
      <Grid container className={classes.mainContainer}>
        <Grid item xs={12}>
          <Header>When do you need a housekeeper?</Header>
        </Grid>
        <Grid item xs={12}>
          <StatelessSelector
            single
            name="housekeepingDate"
            onChange={onChangeHandler}
            className={classes.selector}>
            {options.map((option) => (
              <Pill
                key={option.value}
                size="md"
                label={option.label}
                value={option.value}
                selected={careDate === option.value}
              />
            ))}
          </StatelessSelector>
        </Grid>
        <Grid item xs={12} className={classes.nextButtonContainer}>
          <Button onClick={handleNext} variant="contained" color="primary" fullWidth size="large">
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default HousekeepingDatePage;
