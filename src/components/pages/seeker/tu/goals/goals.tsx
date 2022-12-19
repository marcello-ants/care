import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  makeStyles,
} from '@material-ui/core';
import { useAppDispatch, useSeekerTUState } from '@/components/AppState';
import Head from 'next/head';
import { Banner, Typography } from '@care/react-component-lib';
import { GOALS_OPTIONS, Goals, GoalsLabels } from '@/types/seekerTU';
import Header from '@/components/Header';
import useProviderCount from '@/components/hooks/useProviderCount';
import { ServiceType } from '@/__generated__/globalTypes';
import { useRouter } from 'next/router';
import { logCareEvent } from '@/utilities/amplitudeAnalyticsHelper';
import { SEEKER_TUTORING_PAJ_ROUTES } from '@/constants';

const useStyles = makeStyles((theme) => ({
  banner: {
    marginBottom: theme.spacing(4),
  },
  header: {
    marginBottom: theme.spacing(3),
  },
  mainContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  goalsWrapper: {
    margin: theme.spacing(1, 0),
  },
  goals: {
    marginTop: theme.spacing(2),
    '& .MuiFormControlLabel-label': {
      width: '90%',
    },
  },
  nextButtonContainer: {
    padding: theme.spacing(2, 0),
    margin: theme.spacing(2, 0, 57),
  },
}));

function GoalsPage() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const stateTU = useSeekerTUState();
  const { goals } = stateTU.jobPost;

  const { numOfProviders, displayProviderMessage } = useProviderCount(ServiceType.TUTORING);
  const handleNext = () => {
    const readableGoals = goals.map((goal) => GoalsLabels[goal].toLowerCase());
    logCareEvent('Job Posted', 'PAJ - Goals', {
      seeker_goals: readableGoals,
    });
    router.push(SEEKER_TUTORING_PAJ_ROUTES.LAST_STEP);
  };

  const handleChange = (event: any) => {
    const currentGoals = [...goals];
    const elementName = event.currentTarget.name;
    const elementChecked = event.currentTarget.checked;
    if (elementChecked) {
      currentGoals.push(elementName);
    } else {
      currentGoals.splice(currentGoals.indexOf(elementName), 1);
    }
    dispatch({ type: 'setGoals', goals: currentGoals });
  };

  return (
    <>
      <Head>
        <title>What are your tutoring goals?</title>
      </Head>
      {displayProviderMessage && (
        <Box ml={1} mr={1} className={classes.banner}>
          <Banner type="information" width="100%" roundCorners>
            <Typography variant="body2" data-testid="tutors-nearby">
              Nice! {numOfProviders} tutors are good matches
            </Typography>
          </Banner>
        </Box>
      )}
      <Grid container className={classes.mainContainer}>
        <Grid item xs={12}>
          <Header>What are your tutoring goals?</Header>
        </Grid>
        <Grid item xs className={classes.goalsWrapper}>
          <FormGroup>
            {GOALS_OPTIONS.map((option) => (
              <FormControlLabel
                control={
                  <Checkbox
                    name={option.value}
                    checked={goals.includes(option.value as Goals)}
                    onChange={handleChange}
                  />
                }
                label={option.label}
                labelPlacement="start"
                className={classes.goals}
                key={option.value}
              />
            ))}
          </FormGroup>
        </Grid>
        <Grid item xs={12} className={classes.nextButtonContainer}>
          <Button size="large" color="primary" variant="contained" fullWidth onClick={handleNext}>
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default GoalsPage;
