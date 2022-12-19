import { Pill, StatelessSelector } from '@care/react-component-lib';
import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import { AgeLevel, AgeLevelLabels } from '@/types/seekerTU';
import { logCareEvent } from '@/utilities/amplitudeAnalyticsHelper';
import { useAppDispatch, useSeekerTUState } from '@/components/AppState';
import useNextRoute from '@/components/hooks/useNextRoute';
import useQueryParamData from '@/components/hooks/useQueryParamData';

const useStyles = makeStyles((theme) => ({
  nextButtonContainer: {
    padding: theme.spacing(4, 0, 3),
    marginBottom: theme.spacing(48),
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
  wrapper: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

const levelOptions = [
  { label: AgeLevelLabels.ADULT, value: AgeLevel.ADULT },
  { label: AgeLevelLabels.COLLEGE, value: AgeLevel.COLLEGE },
  { label: AgeLevelLabels.HIGH_SCHOOL, value: AgeLevel.HIGH_SCHOOL },
  { label: AgeLevelLabels.MIDDLE_SCHOOL, value: AgeLevel.MIDDLE_SCHOOL },
  { label: AgeLevelLabels.ELEMENTARY, value: AgeLevel.ELEMENTARY },
];

const WhatLevel = () => {
  const classes = useStyles();
  const { pushNextRoute } = useNextRoute();
  const dispatch = useAppDispatch();
  const { ageLevel } = useSeekerTUState();
  useQueryParamData();

  const onChangeHandler = (value: string[]) => {
    if (!value.length) return;
    const selection = value[0];

    dispatch({ type: 'setAgeLevel', ageLevel: selection as AgeLevel });
  };

  const handleNextClick = () => {
    logCareEvent('Member Enrolled', 'Grade', { grade: AgeLevelLabels[ageLevel] });
    pushNextRoute();
  };

  return (
    <Grid container className={classes.wrapper}>
      <Grid item xs={12}>
        <Typography variant="h2" color="textPrimary">
          What level is this for?
        </Typography>
        <StatelessSelector
          single
          name="level"
          onChange={onChangeHandler}
          className={classes.selector}>
          {levelOptions.map((option) => (
            <Pill
              key={option.value}
              size="md"
              label={option.label}
              value={option.value}
              selected={ageLevel === option.value}
            />
          ))}
        </StatelessSelector>
      </Grid>
      <Grid item xs={12} className={classes.nextButtonContainer}>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={handleNextClick}>
          Next
        </Button>
      </Grid>
    </Grid>
  );
};

export default WhatLevel;
