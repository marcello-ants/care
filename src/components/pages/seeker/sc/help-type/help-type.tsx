import { useRouter } from 'next/router';
import { Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { StatelessSelector, Pill, Typography } from '@care/react-component-lib';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { HelpType, HELP_TYPE_OPTIONS, SeniorLivingOptions } from '@/types/seeker';
import { SEEKER_IN_FACILITY_ROUTES, SEEKER_ROUTES, CLIENT_FEATURE_FLAGS } from '@/constants';
import Header from '@/components/Header';
import useEnterKey from '@/components/hooks/useEnterKey';
import FixElementToBottom from '@/components/FixElementToBottom';
import { useSeekerState, useAppDispatch } from '@/components/AppState';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import {
  withPotentialMember,
  WithPotentialMemberProps,
} from '@/components/features/potentialMember/withPotentialMember';
import generateDynamicHeader from '@/components/pages/seeker/sc/in-facility/dynamicHeaderHelper';

import useIsInFacility from '@/components/hooks/useIsInFacility';
import CareComButtonContainer from '@/components/CareComButtonContainer';
import { recommendedSeniorCareLivingOption } from '@/utilities/senior-care-facility-utility';
import AmpliHelper from '@/utilities/ampliAnalyticsHelper';

export const SeniorLivingOptionsRoutesMap = {
  [SeniorLivingOptions.MEMORY_CARE]: SEEKER_IN_FACILITY_ROUTES.RECOMMENDED_MEMORY_CARE,
  [SeniorLivingOptions.ASSISTED]: SEEKER_IN_FACILITY_ROUTES.RECOMMENDED_ASSISTED,
  [SeniorLivingOptions.INDEPENDENT]: SEEKER_IN_FACILITY_ROUTES.RECOMMENDED_INDEPENDENT,
  [SeniorLivingOptions.NURSING_HOME]: SEEKER_IN_FACILITY_ROUTES.RECOMMENDED_NURSING_HOME,
  [SeniorLivingOptions.NURSING_OPTIONS]: SEEKER_IN_FACILITY_ROUTES.NURSING_OPTIONS,
};

const useStyles = makeStyles((theme) => ({
  selector: {
    marginTop: theme.spacing(2),
    '& .MuiListItem-root': {
      marginBottom: theme.spacing(0),

      [theme.breakpoints.up('md')]: {
        paddingTop: `${theme.spacing(0.75)}px !important`,
        paddingBottom: `${theme.spacing(0.75)}px !important`,
        '&:first-child': {
          paddingTop: `${theme.spacing(1)}px !important`,
        },
        '&:last-child': {
          paddingBottom: '0px !important',
        },
      },
    },
  },
  memoryCareSelector: {
    marginTop: '1px', // fixes margin gap from selector to selector component
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(0.5), // 4px - fixes margin gap from selector to selector component
    },
  },
  gridList: {
    marginBottom: '60px',
    [theme.breakpoints.up('sm')]: {
      marginBottom: '0',
    },
  },
  descriptionText: {
    marginTop: theme.spacing(2),
  },
}));

function HelpTypePage({ userHasAccount }: WithPotentialMemberProps) {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { condition, helpTypes, whoNeedsCare, typeOfCare } = useSeekerState();
  const { isInFacility } = useIsInFacility();
  const featureFlags = useFeatureFlags();
  const recommendationOptimizationVariation =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION];
  const isRecommendationOptimizationVariation =
    recommendationOptimizationVariation?.variationIndex === 1;

  const inFacilityHelpOptionsValues = [
    HelpType.HOUSEHOLD as string,
    HelpType.PERSONAL as string,
    HelpType.COMPANIONSHIP as string,
    HelpType.MOBILITY as string,
    HelpType.MEMORY_CARE as string,
  ];

  const helpTypeOptions = isInFacility
    ? HELP_TYPE_OPTIONS.filter((option) => inFacilityHelpOptionsValues.includes(option.value)).map(
        (option) => {
          if (option.value === HelpType.HOUSEHOLD) {
            return {
              value: HelpType.HOUSEHOLD as string,
              label: 'Everyday tasks',
              description: 'Laundry and meal prep.',
            };
          }
          return option;
        }
      )
    : HELP_TYPE_OPTIONS.filter((option) => option.value !== HelpType.MEMORY_CARE);

  const headerText = isInFacility
    ? generateDynamicHeader(
        whoNeedsCare!,
        'What kind of help are you looking for?',
        'What kind of help is your',
        ' looking for?'
      )
    : 'What kind of help are you looking for?';

  function handleChange(values: string[]) {
    dispatch({ type: 'setHelpTypes', helpTypes: values as HelpType[] });
  }

  const handleNext = () => {
    const baseData = {
      cta_clicked: 'Next',
      member_type: 'Seeker',
      caregiver_tasks: helpTypes.join(','),
    };
    let data;

    if (userHasAccount) {
      data = {
        ...baseData,
        lead_step: 'caregiver needs',
        lead_flow: 'mhp module',
      };
    } else {
      data = {
        ...baseData,
        enrollment_step: 'caregiver needs',
      };
    }

    AnalyticsHelper.logEvent({
      name: userHasAccount ? 'Lead Create - Senior Living' : 'Member Enrolled',
      data,
    });

    if (AmpliHelper.useAmpli(featureFlags.flags, typeOfCare)) {
      AmpliHelper.ampli.memberEnrolledCaregiverNeeds({
        ...AmpliHelper.getCommonData(),
        cta_clicked: 'next',
        member_type: 'seeker',
        caregiver_tasks: helpTypes as string[],
      });
    }

    if (isInFacility) {
      if (userHasAccount || isRecommendationOptimizationVariation) {
        router.push(
          SeniorLivingOptionsRoutesMap[recommendedSeniorCareLivingOption(condition, helpTypes)]
        );
      } else {
        router.push(SEEKER_IN_FACILITY_ROUTES.LOCATION);
      }
    } else {
      router.push(SEEKER_ROUTES.LOCATION);
    }
  };

  useEnterKey(true, handleNext);
  return (
    <Grid container className={classes.gridList}>
      <Grid item xs={12}>
        <Header>
          {isRecommendationOptimizationVariation
            ? 'What kind of help are they looking for?'
            : headerText}
        </Header>
        {isRecommendationOptimizationVariation && (
          <Typography className={classes.descriptionText}>Select all that apply.</Typography>
        )}
      </Grid>
      <Grid item xs={12}>
        <StatelessSelector className={classes.selector} value={helpTypes} onChange={handleChange}>
          {helpTypeOptions.map((option) => (
            <Pill key={option.value} size="lg" {...option} />
          ))}
        </StatelessSelector>
      </Grid>
      <FixElementToBottom useFade={false}>
        <CareComButtonContainer mt={3} mb={2}>
          <Button size="large" color="primary" variant="contained" fullWidth onClick={handleNext}>
            Next
          </Button>
        </CareComButtonContainer>
      </FixElementToBottom>
    </Grid>
  );
}

HelpTypePage.defaultProps = {
  userHasAccount: false,
};

export default withPotentialMember(HelpTypePage);
