import { Typography, makeStyles, Grid } from '@material-ui/core';
import clsx from 'clsx';
import { Icon24UtilityCheckmark } from '@care/react-icons';

const useStyles = makeStyles((theme) => ({
  textSpacing: {
    padding: theme.spacing(2, 0),
  },
  numberCircle: {
    borderRadius: '50%',
    width: '28px',
    border: `2px solid ${theme.palette.care?.blue[500]}`,
  },
  numberCircleCompleted: {
    display: 'inline-block',
    textAlign: 'center',
    width: '28px',
  },
  numberCircleText: {
    display: 'inline-block',
    textAlign: 'center',
    color: theme.palette.care?.grey[900],
    verticalAlign: 'middle',
  },
  numberCircleInactive: {
    opacity: '0.5',
  },
  whatsNextList: {
    marginBottom: theme.spacing(2),
    display: 'inline-block',
    marginLeft: theme.spacing(2),
  },
}));

export enum ProviderWhatsNextListStep {
  CREATE_AN_ACCOUNT,
  COMPLETE_YOUR_PROFILE,
  PASS_REQUIRED_SCREENINGS,
  APPLY_TO_JOBS,
}

const STEPS = [
  { key: ProviderWhatsNextListStep.CREATE_AN_ACCOUNT, text: 'Create an account' },
  { key: ProviderWhatsNextListStep.COMPLETE_YOUR_PROFILE, text: 'Complete your profile' },
  { key: ProviderWhatsNextListStep.PASS_REQUIRED_SCREENINGS, text: 'Pass required screenings' },
  { key: ProviderWhatsNextListStep.APPLY_TO_JOBS, text: 'Apply to jobs' },
];

type ProviderWhatsNextListProps = {
  currentStep: ProviderWhatsNextListStep;
};

const ProviderWhatsNextList = (prop: ProviderWhatsNextListProps) => {
  const classes = useStyles();
  const { currentStep } = prop;

  function isInactiveStep(value: ProviderWhatsNextListStep) {
    return currentStep !== value;
  }

  function isCompletedStep(value: ProviderWhatsNextListStep) {
    return currentStep > value;
  }

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h4" className={classes.textSpacing}>
          Here&apos;s what&apos;s next:
        </Typography>
      </Grid>
      {STEPS.map((step, index) => (
        <Grid
          key={step.key}
          item
          xs={12}
          className={clsx({ [classes.numberCircleInactive]: isInactiveStep(step.key) })}>
          <Typography
            variant="body2"
            className={clsx(
              {
                [classes.numberCircle]: !isCompletedStep(step.key),
                [classes.numberCircleCompleted]: isCompletedStep(step.key),
              },
              classes.numberCircleText
            )}>
            {isCompletedStep(step.key) ? <Icon24UtilityCheckmark size="28px" /> : index + 1}
          </Typography>
          <Typography variant="body2" className={classes.whatsNextList}>
            {step.text}
          </Typography>
        </Grid>
      ))}
    </>
  );
};

export default ProviderWhatsNextList;
