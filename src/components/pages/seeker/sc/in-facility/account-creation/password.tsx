import { useEffect } from 'react';
import { makeStyles, Grid, Button, List, ListItem } from '@material-ui/core';
import { Typography } from '@care/react-component-lib';
import { useFormikContext } from 'formik';
import { useQuery } from '@apollo/client';
import { Icon24InfoSuccessFilled } from '@care/react-icons';

import Header from '@/components/Header';
import useEnterKey from '@/components/hooks/useEnterKey';
import PasswordField from '@/components/features/accountCreation/PasswordField';
import { TermsAndPrivacyPolicy } from '@/components/features/accountCreation/LegalDisclaimer';
import CareComButtonContainer from '@/components/CareComButtonContainer';
import OverlaySpinner from '@/components/OverlaySpinner';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import useIsDisqualifiedFromSeniorFacilityLeads from '@/components/hooks/useIsDisqualifiedFromSeniorFacilityLeads';
import { useAppDispatch, useFlowState, useSeekerState } from '@/components/AppState';
import { SENIOR_CARE_ASSISTED_LIVING_PROVIDERS } from '@/components/request/GQL';
import generateDynamicHeader from '@/components/pages/seeker/sc/in-facility/dynamicHeaderHelper';
import { FormValues } from '@/components/features/accountCreation/accountCreationForm';

import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import {
  CLIENT_FEATURE_FLAGS,
  SKIP_AUTH_CONTEXT_KEY,
  TEALIUM_EVENTS,
  TEALIUM_SLOTS,
} from '@/constants';
import {
  seniorCareAssistedLivingProviders,
  seniorCareAssistedLivingProvidersVariables,
} from '@/__generated__/seniorCareAssistedLivingProviders';
import { TealiumData, TealiumUtagService } from '@/utilities/utagHelper';
import logger from '@/lib/clientLogger';
import {
  recommendedSeniorCareCommunityType,
  recommendedSeniorCareLivingOption,
} from '@/utilities/senior-care-facility-utility';
import { getLeadCountSMB, getLeadCountNational } from '@/utilities/account-creation-utils';
import { parseSeniorCareAssistedLivingProviders } from '../community-list/SeniorCareAssistedLivingProvidersHelper';

const useStyles = makeStyles((theme) => ({
  terms: {
    width: '410px',
    textAlign: 'center',
    margin: theme.spacing(1, 'auto', 0),
  },
  inputContainer: {
    '& > div': {
      padding: theme.spacing(0, 0, 3),
    },
  },
  smallHeader: {
    color: theme.palette.care.grey[600],
    marginBottom: theme.spacing(1),
  },
  listContainer: {
    marginTop: theme.spacing(3),
  },
  listStyles: {
    '& .MuiListItem-root': {
      alignItems: 'flex-start',
    },
    '& .MuiListItem-root:last-child': {
      paddingBottom: '0px !important',
    },
  },
  iconSpace: {
    marginRight: 10,
  },
}));

const bulletPoints = (whoNeedsCare: any) => {
  const dynamicBulletPoint = generateDynamicHeader(
    whoNeedsCare!,
    'Receive suggestions based on the needs of your loved one',
    'Receive suggestions based on your',
    "'s needs"
  );
  return [dynamicBulletPoint, 'Get expert assistance through the process', 'It’s free and fast!'];
};

const BulletPoints = ({ classes, whoNeedsCare }: { classes: any; whoNeedsCare: any }) => (
  <Grid item xs={12} className={classes.listContainer}>
    <List className={classes.listStyles}>
      {bulletPoints(whoNeedsCare).map((item, index) => (
        <ListItem key={`item-${index + 1}`} disableGutters>
          <Icon24InfoSuccessFilled className={classes.iconSpace} />
          {item}
        </ListItem>
      ))}
    </List>
  </Grid>
);

const LongDisclaimer = ({ accountCreationCta }: { accountCreationCta: string }) => (
  <Typography careVariant="info1">
    <span>By clicking &quot;</span>
    {accountCreationCta}
    <span>&quot;, you &#40;1&#41; affirm you have read and agree to our&nbsp;</span>
    <TermsAndPrivacyPolicy />
    <span>
      &nbsp;and &#40;2&#41; you agree that Care.com may contact you by phone or email and share your
      contact information, including, but not limited to name, email, and phone number, with up to 5
      third-party partners to contact you regarding your request based on the criteria you&apos;ve
      provided.
    </span>
  </Typography>
);

const ShortDisclaimer = ({ accountCreationCta }: { accountCreationCta: string }) => (
  <Typography careVariant="info1">
    <span>By clicking &quot;</span>
    {accountCreationCta}
    <span>&quot;, you agree to Care.com&apos;s</span> <TermsAndPrivacyPolicy />
  </Typography>
);

export default function PasswordPage() {
  const classes = useStyles();
  const formik = useFormikContext<FormValues>();
  const { memberId: seekerId, czenJSessionId } = useFlowState();
  const isDisqualifiedFromSeniorFacilityLeads = useIsDisqualifiedFromSeniorFacilityLeads();
  const {
    assistedLivingCenterFacilityCount,
    zipcode,
    condition,
    helpTypes,
    whoNeedsCare,
    seekerInfo,
  } = useSeekerState();

  const dispatch = useAppDispatch();
  const targetType = recommendedSeniorCareLivingOption(condition, helpTypes);
  const isButtonDisabled =
    formik.isValidating || Boolean(formik.errors.password) || !formik.values.password;

  // feature flags
  const featureFlags = useFeatureFlags();
  const recommendationOptimizationVariation =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION];
  const isRecommendationOptimizationVariation =
    recommendationOptimizationVariation?.variationIndex === 1;

  let accountCreationCta = 'View results';
  if (isRecommendationOptimizationVariation) {
    accountCreationCta = 'Create account';
  }

  const qualifiesBudgetAndFacilities =
    !isDisqualifiedFromSeniorFacilityLeads && assistedLivingCenterFacilityCount! > 0;

  useEnterKey(!isButtonDisabled, formik.submitForm);

  const submitForm = () => {
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data: {
        enrollment_step: 'password in facility sc',
        cta_clicked: accountCreationCta,
        member_type: 'Seeker',
      },
    });
    formik.submitForm();
  };

  useEffect(() => {
    AnalyticsHelper.logTestExposure(
      CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION,
      recommendationOptimizationVariation
    );

    formik.validateForm();
  }, []);

  const { data: salcData, loading: salcLoading } = useQuery<
    seniorCareAssistedLivingProviders,
    seniorCareAssistedLivingProvidersVariables
  >(SENIOR_CARE_ASSISTED_LIVING_PROVIDERS, {
    variables: {
      zipcode,
      source: 'USC',
      facilityType: recommendedSeniorCareCommunityType(condition, helpTypes),
    },
    skip: !qualifiesBudgetAndFacilities,
    context: { [SKIP_AUTH_CONTEXT_KEY]: true },
  });

  useEffect(() => {
    if (
      qualifiesBudgetAndFacilities &&
      salcData &&
      salcData.seniorCareAssistedLivingProviders.__typename === 'ProviderSearchSuccess' &&
      salcData.seniorCareAssistedLivingProviders.providerSearchResults.length > 0
    ) {
      const searchResultTrackingId = salcData.seniorCareAssistedLivingProviders.trackingId;
      dispatch({
        type: 'setSALCTrackingId',
        SALCTrackingId: searchResultTrackingId,
      });

      const resultingCommunities = parseSeniorCareAssistedLivingProviders(
        salcData.seniorCareAssistedLivingProviders.providerSearchResults,
        targetType
      );

      dispatch({
        type: 'setSALCCommunities',
        SALCCommunities: resultingCommunities,
      });
      const ids = resultingCommunities.map((community) => community.id);
      dispatch({
        type: 'setSALCSavedFacilitiesIds',
        SALCSavedFacilitiesIds: ids,
      });

      // Remove or consolidate this eventing after AB test SALC_AUTO_LEADS is done
      const leadCountSMB = getLeadCountSMB(resultingCommunities);
      const leadCountNational = getLeadCountNational(resultingCommunities);

      const commonData = {
        leadCount: resultingCommunities.length,
        leadCountSMB,
        leadCountNational,
      };

      const tealiumDataViewed: TealiumData = {
        ...(seekerId && { memberId: seekerId }),
        ...commonData,
        tealium_event: TEALIUM_EVENTS.SENIORCARE_LEADS_VIEW,
        sessionId: czenJSessionId,
        slots: TEALIUM_SLOTS.SENIORCARE_LEADS_VIEWED_ENROLLMENT,
        email: seekerInfo.email,
      };
      TealiumUtagService.view(tealiumDataViewed);

      const tealiumDataSubmitted: TealiumData = {
        ...(seekerId && { memberId: seekerId }),
        ...commonData,
        tealium_event: TEALIUM_EVENTS.SENIORCARE_LEADS_SUBMITTED,
        sessionId: czenJSessionId,
        slots: TEALIUM_SLOTS.SENIORCARE_LEADS_SUBMITTED_ENROLLMENT,
        email: seekerInfo.email,
      };
      TealiumUtagService.view(tealiumDataSubmitted);
    } else if (
      salcData?.seniorCareAssistedLivingProviders?.__typename === 'ProviderSearchSuccess' &&
      salcData?.seniorCareAssistedLivingProviders?.providerSearchResults.length === 0
    ) {
      logger.info({
        event: 'seniorCareAssistedLivingProviders',
        message: 'Found zero senior care assisted living providers.',
      });
    } else if (salcData?.seniorCareAssistedLivingProviders?.__typename === 'ProviderSearchError') {
      logger.error({
        event: 'seniorCareAssistedLivingProviders',
        graphQLError: salcData?.seniorCareAssistedLivingProviders?.message,
      });
    }
  }, [salcData]);

  if (salcLoading) {
    return <OverlaySpinner isOpen wrapped />;
  }

  return (
    <Grid container>
      {qualifiesBudgetAndFacilities ? (
        <>
          <Grid item xs={12}>
            <Typography variant="h4" className={classes.smallHeader}>
              One final step
            </Typography>
            <Header>Create a password to connect with communities.</Header>
            <BulletPoints classes={classes} whoNeedsCare={whoNeedsCare} />
          </Grid>
        </>
      ) : (
        <Header>One final step. Create a password</Header>
      )}
      <Grid item xs={12} className={classes.inputContainer}>
        <PasswordField
          id="password"
          name="password"
          label="Password"
          defaultHelperText="At least 6 characters"
        />
      </Grid>
      <Grid item xs={12}>
        {qualifiesBudgetAndFacilities ? (
          <LongDisclaimer accountCreationCta={accountCreationCta} />
        ) : (
          <ShortDisclaimer accountCreationCta={accountCreationCta} />
        )}
      </Grid>
      <Grid item xs={12}>
        <CareComButtonContainer mt={4}>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            disabled={isButtonDisabled}
            onClick={submitForm}>
            {accountCreationCta}
          </Button>
        </CareComButtonContainer>
      </Grid>
    </Grid>
  );
}
