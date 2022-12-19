import { useRouter } from 'next/router';
import { Button, Grid, makeStyles } from '@material-ui/core';
import { StatelessSelector, Pill } from '@care/react-component-lib';
import Header from '@/components/Header';
import { useAppDispatch, useSeekerTUState } from '@/components/AppState';
import { TutoringTypeOptions, TutoringTypeOptionsLabels } from '@/types/seekerTU';
import { SEEKER_TUTORING_ROUTES } from '@/constants';
import { logCareEvent } from '@/utilities/amplitudeAnalyticsHelper';

const useStyles = makeStyles((theme) => ({
  selector: {
    marginTop: theme.spacing(2),
    '& .MuiListItem-root': {
      margin: theme.spacing(0),
    },
  },
  nextButtonContainer: {
    padding: theme.spacing(2, 0),
  },
}));

const pillOptions = [
  {
    label: TutoringTypeOptionsLabels.ONLINE,
    value: TutoringTypeOptions.ONLINE,
    description: 'Widest selection of prices and expertise.',
  },
  {
    label: TutoringTypeOptionsLabels.IN_PERSON,
    value: TutoringTypeOptions.IN_PERSON,
    description: 'Face-to-face with a tutor near you.',
  },
  {
    label: TutoringTypeOptionsLabels.EITHER,
    value: TutoringTypeOptions.EITHER,
  },
];

function VirtualOrInPerson() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { tutoringType } = useSeekerTUState();
  const { push } = useRouter();

  const onChangeHandler = (value: string[]) => {
    if (!value.length) return;
    const selection = value[0];

    dispatch({ type: 'setTutoringType', tutoringType: selection as TutoringTypeOptions });
  };

  const handleNext = () => {
    logCareEvent('Member Enrolled', 'Modes', { modes: TutoringTypeOptionsLabels[tutoringType] });
    push(SEEKER_TUTORING_ROUTES.RECAP);
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Header>Do you prefer in person or online tutoring?</Header>
      </Grid>
      <Grid item xs={12}>
        <StatelessSelector
          onChange={onChangeHandler}
          name="tutoringType"
          single
          className={classes.selector}>
          {pillOptions.map((pill) => (
            <Pill
              key={pill.value}
              label={pill.label}
              value={pill.value}
              selected={tutoringType === pill.value}
              description={pill.description}
              size={(pill.description && 'lg') || 'md'}
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
  );
}

export default VirtualOrInPerson;
