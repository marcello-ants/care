import { useEffect } from 'react';
import Head from 'next/head';
import { Button, Grid, makeStyles, Checkbox, FormControlLabel } from '@material-ui/core';
import { SelectorOption, StatelessSelector, Typography } from '@care/react-component-lib';
import { DefaultCareKind } from '@/types/seekerCC';
import { useDOBInputForm } from '@/components/features/careWho/useChildrenForm';
import ChildDOBInput from '@/components/features/careWho/ChildDOBInput';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { CLIENT_FEATURE_FLAGS, FLOWS, SEEKER_CHILD_CARE_ROUTES } from '@/constants';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import useLangConversational from '@/components/hooks/useLangConversational';
import { useFlowState, useSeekerCCState } from '@/components/AppState';

const DISTANCE_LEARNING_OPTIONS = [
  { indicator: 'Y', label: 'Yes', value: 'yes' },
  { indicator: 'N', label: 'No', value: 'no' },
];

const getHandlerWithAnalyticsHelper =
  (handler: (e?: any) => void, callToAction: string) => (e?: any) => {
    AnalyticsHelper.logEvent({ name: 'CTA Interacted', data: { cta_clicked: callToAction } });
    handler(e);
  };

const useStyles = makeStyles((theme) => ({
  nextButtonContainer: {
    padding: theme.spacing(0, 0, 3, 0),
    marginBottom: theme.spacing(40.75),
    marginTop: theme.spacing(4),
  },
  header: {
    marginBottom: theme.spacing(3),
  },
  expecting: {
    marginTop: theme.spacing(3),
  },
  distanceLearning: {
    textAlign: 'center',
  },
  distanceLearningTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  distanceLearningSelector: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(1),
  },
  mainContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

const CareWhoPage = () => {
  const classes = useStyles();

  const {
    formikDOB,
    isNextDisabledDOB,
    errorMessageDOB,
    validateDistanceLearningDOB,
    handleNextDOB,
    handleDistanceLearningChangeDOB,
    handleAgeChangeDOB,
    handleAddChildDOB,
    handleDeleteChildDOB,
  } = useDOBInputForm();
  const { careKind } = useSeekerCCState();
  const { flowName } = useFlowState();
  const { handleChange, values: chosenValues } = formikDOB;

  const featureFlags = useFeatureFlags();

  const languageConversationalFlag =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]?.value;
  const distanceLearningRemovalFlag =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.DISTANCE_LEARNING_REMOVAL];

  useEffect(() => {
    AnalyticsHelper.logTestExposure(
      CLIENT_FEATURE_FLAGS.DISTANCE_LEARNING_REMOVAL,
      distanceLearningRemovalFlag
    );
  }, []);

  const hideExpectingCheckbox = careKind === DefaultCareKind.ONE_TIME_BABYSITTERS;
  const hideDistanceLearning =
    distanceLearningRemovalFlag?.value === 2 || !validateDistanceLearningDOB();

  const languageConversationalText = useLangConversational(
    SEEKER_CHILD_CARE_ROUTES.CARE_WHO,
    languageConversationalFlag
  );

  const isIbFlow = flowName === FLOWS.SEEKER_INSTANT_BOOK.name;

  return (
    <>
      <Head>
        <title>Who needs care?</title>
      </Head>
      <Grid container className={classes.mainContainer}>
        <Grid item xs={12} className={classes.header}>
          {languageConversationalText}
        </Grid>
        <ChildDOBInput
          childrenList={formikDOB.values.childrenDOB}
          handleAgeChange={handleAgeChangeDOB}
          handleAddChild={getHandlerWithAnalyticsHelper(handleAddChildDOB, 'Add additional child')}
          handleDeleteChild={handleDeleteChildDOB}
          errorMessage={errorMessageDOB || ''}
          fieldsWithErrors={formikDOB.errors.childrenDOB || []}
        />
        {!hideExpectingCheckbox && !isIbFlow && (
          <Grid item xs={12} className={classes.expecting}>
            <FormControlLabel
              labelPlacement="end"
              label="I'm expecting"
              control={
                <Checkbox
                  checked={chosenValues.expecting}
                  onChange={getHandlerWithAnalyticsHelper(handleChange, 'I am expecting')}
                  name="expecting"
                />
              }
            />
          </Grid>
        )}
        {!hideDistanceLearning && (
          <Grid item xs={12} className={classes.distanceLearning}>
            <Typography className={classes.distanceLearningTitle}>
              Will they need help with distance learning?
            </Typography>
            <Typography careVariant="body3">
              Ensure kids attend their school&apos;s online classes and keep up with assignments.
            </Typography>
            <Grid item xs={12} className={classes.distanceLearningSelector}>
              <StatelessSelector
                single
                horizontal
                onChange={([value]: string[]) =>
                  handleDistanceLearningChangeDOB('distanceLearning', value)
                }>
                {DISTANCE_LEARNING_OPTIONS.map((option) => (
                  <SelectorOption
                    key={option.value}
                    label={option.label}
                    selected={chosenValues.distanceLearning === (option.value === 'yes')}
                    indicator={option.indicator}
                    value={option.value}
                  />
                ))}
              </StatelessSelector>
            </Grid>
          </Grid>
        )}
        <Grid item xs={12} className={classes.nextButtonContainer}>
          <Button
            onClick={handleNextDOB}
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={isNextDisabledDOB}>
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default CareWhoPage;
