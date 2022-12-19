import { useEffect } from 'react';
import Head from 'next/head';
import { StatelessSelector, Pill } from '@care/react-component-lib';
import { Button, Grid, makeStyles } from '@material-ui/core';

import Header from '@/components/Header';
import { ServiceIdsForMember } from '@/types/seekerCC';
import {
  CARE_DATES,
  CLIENT_FEATURE_FLAGS,
  SEEKER_CHILD_CARE_ROUTES,
  CARE_DATE_LABELS,
  DAY_CARE_DATE_LABELS,
} from '@/constants';
import { useAppDispatch, useSeekerCCState } from '@/components/AppState';
import useFlowNavigation from '@/components/features/flowNavigation/useFlowNavigation';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { logChildCareEvent } from '@/utilities/childCareAnalyticsHelper';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import useLangConversational from '@/components/hooks/useLangConversational';
import { useLoadInstantBookEligibleLocation } from '@/components/hooks/useLoadIBLocationEligible';

const dateOptions = [
  { label: CARE_DATE_LABELS.RIGHT_NOW, value: CARE_DATES.RIGHT_NOW },
  { label: CARE_DATE_LABELS.WITHIN_A_WEEK, value: CARE_DATES.WITHIN_A_WEEK },
  { label: CARE_DATE_LABELS.IN_1_2_MONTHS, value: CARE_DATES.IN_1_2_MONTHS },
  { label: CARE_DATE_LABELS.JUST_BROWSING, value: CARE_DATES.JUST_BROWSING },
];

const dayCareDateOptions = [
  { label: DAY_CARE_DATE_LABELS.IMMEDIATELY, value: CARE_DATES.RIGHT_NOW },
  { label: DAY_CARE_DATE_LABELS.WITHIN_A_WEEK, value: CARE_DATES.WITHIN_A_WEEK },
  { label: DAY_CARE_DATE_LABELS.IN_1_2_MONTHS, value: CARE_DATES.IN_1_2_MONTHS },
  { label: DAY_CARE_DATE_LABELS.NO_RUSH, value: CARE_DATES.JUST_BROWSING },
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
  inputGrid: {
    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(1),
    },
    marginBottom: theme.spacing(2),
  },
}));

// @TODO extract and reuse for other components
const getOptionLabel = (optionsArray: any[], targetName: string) => {
  const seekOption = optionsArray.find((option: any) => option.value === targetName);
  return seekOption ? seekOption.label : targetName;
};

function CareDatePage() {
  const classes = useStyles();
  const { careDate, enrollmentSource, czenServiceIdForMember } = useSeekerCCState();
  const dispatch = useAppDispatch();
  const { goNext } = useFlowNavigation();
  const featureFlags = useFeatureFlags();

  useLoadInstantBookEligibleLocation();

  const isDayCare = czenServiceIdForMember === ServiceIdsForMember.dayCare;

  const languageConversationalFlag = isDayCare
    ? 0
    : featureFlags?.flags[CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]?.value;
  const noRushFlag = featureFlags?.flags[CLIENT_FEATURE_FLAGS.DAYCARE_JUST_BROWSING_VS_NO_RUSH];

  useEffect(() => {
    if (isDayCare) {
      AnalyticsHelper.logTestExposure(
        CLIENT_FEATURE_FLAGS.DAYCARE_JUST_BROWSING_VS_NO_RUSH,
        noRushFlag
      );
    }
  }, []);

  const languageConversationalText = useLangConversational(
    SEEKER_CHILD_CARE_ROUTES.CARE_DATE,
    languageConversationalFlag
  );
  const options = isDayCare && noRushFlag?.value === 2 ? dayCareDateOptions : dateOptions;

  const disableNext = !careDate;

  const handleNext = () => {
    logChildCareEvent('Member Enrolled', 'Care Dates', enrollmentSource, {
      intent: getOptionLabel(options, careDate),
    });
    goNext();
  };
  const onChangeHandler = (value: string[]) => {
    if (!value.length) return;
    const selection = value[0];

    dispatch({ type: 'setCareDate', careDate: selection as CARE_DATES });
  };

  return (
    <>
      <Head>
        <title>When do you need care?</title>
      </Head>
      <Grid container className={classes.mainContainer}>
        <Grid item xs={12}>
          <Header>{languageConversationalText}</Header>
        </Grid>
        <Grid item xs={12}>
          <StatelessSelector
            single
            name="careDate"
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
          <Button
            onClick={handleNext}
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={disableNext}>
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default CareDatePage;
