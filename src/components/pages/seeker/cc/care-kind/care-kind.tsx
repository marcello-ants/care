import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Box, Grid, makeStyles } from '@material-ui/core';
import { StatelessSelector, Pill } from '@care/react-component-lib';
import { theme } from '@care/material-ui-theme';

// Internal Dependencies
import {
  CLIENT_FEATURE_FLAGS,
  FLOWS,
  SEEKER_CHILD_CARE_ROUTES,
  SEEKER_DAYCARE_CHILD_CARE_ROUTES,
  SEEKER_INSTANT_BOOK_ROUTES,
  SEEKER_INSTANT_BOOK_SHORT_ROUTES,
  SEM_CHILDCARE,
} from '@/constants';
import {
  CareKind,
  DayCareKindLabels,
  DefaultCareKind,
  ServiceIdsForMember,
  CareKindLabels,
} from '@/types/seekerCC';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { logChildCareEvent } from '@/utilities/childCareAnalyticsHelper';
import Header from '@/components/Header';
import {
  useAppDispatch,
  useSeekerState,
  useSeekerCCState,
  useFlowState,
} from '@/components/AppState';
import useFlowNavigation from '@/components/features/flowNavigation/useFlowNavigation';
import { TravelDistance } from '@/components/shared/TravelDistance/TravelDistance';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import useLangConversational from '@/components/hooks/useLangConversational';
import getPills from './pillsOptions';

const useStyles = makeStyles(() => ({
  heroContainer: {
    display: 'flex',
    width: '100%',
    height: 225,
    position: 'relative',
    borderRadius: 16,
    backgroundSize: 'cover',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(10),
  },
  heroTextContainer: {
    position: 'absolute',
    top: '85%',
    width: '100%',
    padding: theme.spacing(2, 2),
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: theme.palette.care?.grey[900],
  },
  heroText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    lineHeight: '1.75rem',
    color: 'white',
  },
  nextButtonContainer: {
    padding: theme.spacing(3, 0),
    marginBottom: theme.spacing(42.6),
  },
  nextButtonContainerDayCareOption: {
    padding: theme.spacing(1, 0),
    marginBottom: theme.spacing(42.6),
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
  pillContent: {
    height: 'auto',
    padding: `${theme.spacing(2, 1, 2, 2.5)} !important`,
  },
  pillLabel: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const getOptionLabel = (optionsArray: any[], targetName: string) => {
  const seekOption = optionsArray.find((option: any) => option.value === targetName);
  return seekOption ? seekOption.label : targetName;
};

function CareKindPage() {
  // Dependencies
  const dispatch = useAppDispatch();
  const { goNext } = useFlowNavigation();
  const router = useRouter();
  const featureFlags = useFeatureFlags();
  // Styles
  const classes = useStyles();

  // State
  const { flowName } = useFlowState();
  const { maxDistanceFromSeekerDayCare } = useSeekerState(); // Remove as part of GROW-187
  const {
    careKind,
    enrollmentSource,
    czenServiceIdForMember,
    instantBook: { eligibleLocation },
  } = useSeekerCCState();

  // Options to be displayed on page
  const shouldShowDayCareOptions = czenServiceIdForMember === 'dayCare';

  const shouldShowOptionsWithoutDaycare =
    enrollmentSource === SEM_CHILDCARE &&
    featureFlags.flags[CLIENT_FEATURE_FLAGS.GROWTH_CC_REMOVE_DC_OPTION]?.value === 2;

  const ibMerchandisingFlagValue =
    featureFlags.flags[CLIENT_FEATURE_FLAGS.INSTANT_BOOK_CARE_KIND_MERCHANDISING]?.value;

  let options = getPills({
    ibMerchandisingFlagValue,
    shouldShowDayCareOptions,
  });

  if (shouldShowOptionsWithoutDaycare) {
    options = options.filter(({ value }) => {
      return value !== 'DAY_CARE_CENTERS';
    });
  }

  const instantBookFlag =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.INSTANT_BOOK_ENROLLMENT_DIRECT_TO_BOOKING];
  const instantBookFlagValue = instantBookFlag?.value;

  const instantBookShortenedFlag = featureFlags?.flags[CLIENT_FEATURE_FLAGS.IB_SHORTENED_FLOW];
  const instantBookShortenedFlagValue = instantBookShortenedFlag?.value;

  const languageConversationalFlag =
    czenServiceIdForMember === ServiceIdsForMember.dayCare
      ? 0
      : featureFlags.flags[CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]?.value;

  const languageConversationalText = useLangConversational(
    SEEKER_CHILD_CARE_ROUTES.CARE_KIND,
    languageConversationalFlag
  );

  // A/B test to display distance willing to travel for Preschool & Afterschool care too
  const travelDistanceFlag =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.DAYCARE_DISTANCE_TRAVELED_SELECTION];
  const showTravelDistanceControl =
    careKind === DefaultCareKind.DAY_CARE_CENTERS ||
    (travelDistanceFlag?.value === 'distance' && shouldShowDayCareOptions);

  const resetFlowName = (kindOfCare: CareKind) => {
    let flow = 'SEEKER_CHILD_CARE';
    if (kindOfCare === DefaultCareKind.DAY_CARE_CENTERS) {
      flow = 'SEEKER_DAYCARE_CHILD_CARE';
    }
    dispatch({ type: 'setFlowName', flowName: flow });
  };

  useEffect(() => {
    AnalyticsHelper.logTestExposure(
      CLIENT_FEATURE_FLAGS.INSTANT_BOOK_CARE_KIND_MERCHANDISING,
      featureFlags.flags[CLIENT_FEATURE_FLAGS.INSTANT_BOOK_CARE_KIND_MERCHANDISING]
    );

    if (enrollmentSource === SEM_CHILDCARE) {
      AnalyticsHelper.logTestExposure(
        CLIENT_FEATURE_FLAGS.GROWTH_CC_REMOVE_DC_OPTION,
        featureFlags.flags[CLIENT_FEATURE_FLAGS.GROWTH_CC_REMOVE_DC_OPTION]
      );
    }
  }, []);

  useEffect(() => {
    resetFlowName(careKind);

    if (shouldShowDayCareOptions) {
      AnalyticsHelper.logTestExposure(
        CLIENT_FEATURE_FLAGS.DAYCARE_DISTANCE_TRAVELED_SELECTION,
        travelDistanceFlag
      );
    }
  }, []);

  const disableNext = !careKind;

  const handleNext = () => {
    // Analytics
    let optionsToLog = {};

    if (shouldShowDayCareOptions) {
      optionsToLog = {
        subvertical: DayCareKindLabels.DAY_CARE_CENTERS,
        user_choice: getOptionLabel(options, careKind),
      };
    } else if (careKind === DefaultCareKind.ONE_TIME_BABYSITTERS) {
      optionsToLog = {
        subvertical: CareKindLabels.ONE_TIME_BABYSITTERS,
      };
    } else {
      optionsToLog = {
        subvertical: getOptionLabel(options, careKind),
      };
    }

    if (showTravelDistanceControl) {
      optionsToLog = {
        ...optionsToLog,
        extraData: {
          user_distance: maxDistanceFromSeekerDayCare.distance,
          user_distance_unit: maxDistanceFromSeekerDayCare.unit,
        },
      };
    }

    logChildCareEvent('Member Enrolled', 'Care Kind', enrollmentSource, optionsToLog);
    // End Analytics

    if (careKind === DefaultCareKind.DAY_CARE_CENTERS || shouldShowDayCareOptions) {
      const nextStep = SEEKER_DAYCARE_CHILD_CARE_ROUTES.WHO;
      router.push(nextStep);
    } else if (eligibleLocation && careKind === DefaultCareKind.ONE_TIME_BABYSITTERS) {
      AnalyticsHelper.logTestExposure(
        CLIENT_FEATURE_FLAGS.INSTANT_BOOK_ENROLLMENT_DIRECT_TO_BOOKING,
        instantBookFlag
      );

      AnalyticsHelper.logTestExposure(
        CLIENT_FEATURE_FLAGS.IB_SHORTENED_FLOW,
        instantBookShortenedFlag
      );

      if (instantBookFlagValue === 2 && flowName === FLOWS.SEEKER_CHILD_CARE.name) {
        dispatch({ type: 'setFlowName', flowName: FLOWS.SEEKER_INSTANT_BOOK.name });
        router.push(SEEKER_INSTANT_BOOK_ROUTES.WHO);
      } else if (instantBookShortenedFlagValue === 2 && flowName === FLOWS.SEEKER_CHILD_CARE.name) {
        dispatch({ type: 'setFlowName', flowName: FLOWS.SEEKER_INSTANT_BOOK_SHORT.name });
        router.push(SEEKER_INSTANT_BOOK_SHORT_ROUTES.EMAIL);
      } else {
        goNext();
      }
    } else {
      goNext();
    }
  };

  const onChangeHandler = (value: string[]) => {
    if (!value.length) return;
    const selection = value[0];

    dispatch({ type: 'setCareKind', careKind: selection as CareKind });

    resetFlowName(selection as CareKind);
  };

  return (
    <>
      <Head>
        <title>What kind of care?</title>
      </Head>
      <Grid container className={classes.mainContainer}>
        <Grid item xs={12}>
          <Header>{languageConversationalText}</Header>
        </Grid>
        <Grid item xs={12}>
          <StatelessSelector
            single
            name="careKind"
            onChange={onChangeHandler}
            className={classes.selector}>
            {options.map((option) => (
              <Pill
                key={option.value}
                size={option.description ? 'lg' : 'md'}
                label={option.label}
                value={option.value}
                selected={careKind === option.value}
                description={option.description}
                classes={{ controlIndicator: classes.pillContent, label: classes.pillLabel }}
              />
            ))}
          </StatelessSelector>
        </Grid>
        {showTravelDistanceControl && (
          <Box mt={3}>
            <TravelDistance />
          </Box>
        )}
        <Grid
          item
          xs={12}
          className={`${
            showTravelDistanceControl
              ? classes.nextButtonContainerDayCareOption
              : classes.nextButtonContainer
          }`}>
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

export default CareKindPage;
