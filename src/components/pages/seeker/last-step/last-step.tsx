/* eslint-disable react/require-default-props */
import { ChangeEventHandler, FC, MouseEventHandler, ReactNode } from 'react';
import { Button, Grid, TextField, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Banner, Typography } from '@care/react-component-lib';
import { useSeekerHKState, useSeekerPCState, useSeekerTUState } from '@/components/AppState';
import useProviderCount from '@/components/hooks/useProviderCount';
import { ServiceType } from '@/__generated__/globalTypes';
import { theme } from '@care/material-ui-theme';

const useStylesLastStep = makeStyles(() => ({
  nextButtonContainer: {
    padding: theme.spacing(4, 0, 3),
    marginBottom: theme.spacing(15.4),
  },
  sectionOneTitle: {
    marginTop: theme.spacing(3),
  },
  lastStepWrapper: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  about: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  errorText: {
    textAlign: 'center',
    paddingBottom: theme.spacing(1),
  },
  chartsCount: {
    color: theme.palette.care?.grey[600],
    textAlign: 'right',
    marginTop: theme.spacing(1),
  },
}));

const VERTICAL_STRING_SERVICE_TYPE: { [key: string]: string } = {
  [ServiceType.HOUSEKEEPING]: 'housekeepers',
  [ServiceType.TUTORING]: 'tutors',
  [ServiceType.PET_CARE]: 'pet caregivers',
};

type VerticalStateFunc =
  | typeof useSeekerHKState
  | typeof useSeekerPCState
  | typeof useSeekerTUState;

const STATE_FUNC_BY_SERVICE_TYPE: { [key: string]: VerticalStateFunc } = {
  [ServiceType.HOUSEKEEPING]: useSeekerHKState,
  [ServiceType.PET_CARE]: useSeekerPCState,
  [ServiceType.TUTORING]: useSeekerTUState,
};

interface LastStepProps {
  serviceType: ServiceType;
  handleChange: ChangeEventHandler;
  handleNoPostJob: MouseEventHandler;
  handleNext: MouseEventHandler;
  placeholderText: string;
  bannerText?: string;
  showLettersCount?: boolean;
  needSomeTipsBanner?: ReactNode;
}

export const LastStep: FC<LastStepProps> = ({
  serviceType,
  handleChange,
  handleNoPostJob,
  handleNext,
  placeholderText,
  bannerText,
  showLettersCount,
  needSomeTipsBanner,
}) => {
  const classes = useStylesLastStep();
  const MAX_JOB_POST_ATTEMPTS = 3;
  const verticalState = STATE_FUNC_BY_SERVICE_TYPE[serviceType]();
  const { jobPost } = verticalState;
  const { jobDescription, submissionInfo } = jobPost;
  const { displayProviderMessage } = useProviderCount(serviceType);

  return (
    <Grid container className={classes.lastStepWrapper}>
      {displayProviderMessage && bannerText && (
        <Box ml={1} mr={1}>
          <Banner type="information" width="100%" roundCorners>
            <Typography variant="body2">{bannerText}</Typography>
          </Banner>
        </Box>
      )}
      <Grid item xs={12}>
        <Typography
          variant={serviceType === ServiceType.HOUSEKEEPING ? 'h3' : 'h2'}
          color="textPrimary"
          className={classes.sectionOneTitle}>
          What else should {VERTICAL_STRING_SERVICE_TYPE[serviceType]} know?
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          InputLabelProps={{ shrink: true }}
          name="description"
          error={false}
          placeholder={placeholderText}
          multiline
          value={jobDescription}
          rows={12}
          inputProps={{
            maxLength: 850,
          }}
          onChange={handleChange}
          className={classes.about}
        />
        {showLettersCount && (
          <Typography careVariant="info1" color="secondary" className={classes.chartsCount}>
            <span>{jobDescription.length > 0 ? jobDescription.length : 'x'}</span>
            <span>/850</span>
          </Typography>
        )}
      </Grid>
      {needSomeTipsBanner}
      <Grid item xs={12} className={classes.nextButtonContainer}>
        {submissionInfo.attempts === MAX_JOB_POST_ATTEMPTS && (
          <>
            <Typography variant="h4" className={classes.errorText}>
              <strong>An error has occurred</strong>
            </Typography>

            <div>
              <Button color="primary" variant="contained" onClick={handleNoPostJob} fullWidth>
                Continue without submitting
              </Button>
            </div>
          </>
        )}
        {submissionInfo.attempts < MAX_JOB_POST_ATTEMPTS && (
          <Button
            color={submissionInfo.attempts > 0 ? 'secondary' : 'primary'}
            variant="contained"
            size="large"
            fullWidth
            onClick={handleNext}>
            Submit
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

const useStylesErrorLastStep = makeStyles(() => ({
  jobPosted: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(4),
  },
}));

interface ErrorLastStepPageProps {
  navigateToNextStep: MouseEventHandler;
}

export const ErrorLastStep: FC<ErrorLastStepPageProps> = ({ navigateToNextStep }) => {
  const classes = useStylesErrorLastStep();
  return (
    <Grid container spacing={1}>
      <Grid container className={classes.jobPosted} spacing={0}>
        <Banner type="confirmation" width="100%" roundCorners>
          <Typography>
            Your needs have already been shared. You can always update your preferences later.
          </Typography>
        </Banner>
      </Grid>
      <Grid item xs={12}>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={navigateToNextStep}>
          Continue
        </Button>
      </Grid>
    </Grid>
  );
};
