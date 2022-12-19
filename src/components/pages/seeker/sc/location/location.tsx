import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Grid } from '@material-ui/core';
import { useLazyQuery } from '@apollo/client';

import {
  FLOWS,
  SEEKER_IN_FACILITY_ROUTES,
  SEEKER_ROUTES,
  SKIP_AUTH_CONTEXT_KEY,
  CLIENT_FEATURE_FLAGS,
} from '@/constants';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import logger from '@/lib/clientLogger';

import {
  GET_NUMBER_OF_SENIOR_CARE_FACILITIES_NEARBY,
  SENIOR_CARE_ASSISTED_LIVING_PROVIDERS,
} from '@/components/request/GQL';
import BlueWrapperIcon from '@/components/BlueWrapperIcon';
import { Icon24InfoSeniorCare } from '@care/react-icons';
import Header from '@/components/Header';
import ZipInput from '@/components/ZipInput';
import useEnterKey from '@/components/hooks/useEnterKey';
import useFlowHelper from '@/components/hooks/useFlowHelper';
import useIsInFacility from '@/components/hooks/useIsInFacility';
import CareComButtonContainer from '@/components/CareComButtonContainer';
import { useAppDispatch, useFlowState, useSeekerState } from '@/components/AppState';
import { Location } from '@/types/common';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';

import {
  seniorCareAssistedLivingProviders,
  seniorCareAssistedLivingProvidersVariables,
} from '@/__generated__/seniorCareAssistedLivingProviders';
import {
  getNumberOfSeniorCareFacilitiesNearby,
  getNumberOfSeniorCareFacilitiesNearbyVariables,
} from '@/__generated__/getNumberOfSeniorCareFacilitiesNearby';
import {
  recommendedCaringFacilityFlags,
  recommendedSeniorCareCommunityType,
} from '@/utilities/senior-care-facility-utility';
import AmpliHelper from '@/utilities/ampliAnalyticsHelper';

function LocationPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    zipcode,
    city,
    state,
    visitorStartedSACFlow,
    condition,
    assistedLivingCenterFacilityCount,
    caringFacilityCountNearBy,
    helpTypes,
    typeOfCare,
  } = useSeekerState();
  const { currentFlow } = useFlowHelper();
  const { isInFacility } = useIsInFacility();
  const { userHasAccount } = useFlowState();
  const [error, setError] = useState(false);
  const [validateOnClick, setValidateOnClick] = useState(false);
  const [shouldGoNext, setShouldGoNext] = useState(false);
  const featureFlags = useFeatureFlags();
  const recommendationOptimizationVariation =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION];
  const isRecommendationOptimizationVariation =
    recommendationOptimizationVariation?.variationIndex === 1;
  const facilitiesCountType = recommendedCaringFacilityFlags(condition, helpTypes);

  const logInitialFlowStart = () => {
    if (!visitorStartedSACFlow) {
      dispatch({ type: 'setVisitorStartedSACFlow', visitorStartedSACFlow: true });
      logger.info({ event: 'seekerAccountCreationStarts' });
    }
  };

  // onComplete Caring.com query
  const onCompleteGetNumberOfSeniorCareFacilitiesNearby = (
    response: getNumberOfSeniorCareFacilitiesNearby
  ) => {
    let caringFacilitiesCount: number | undefined;
    if (
      response.getNumberOfSeniorCareFacilitiesNearby.__typename ===
      'GetNumberOfSeniorCareFacilitiesNearbySuccess'
    ) {
      caringFacilitiesCount =
        response.getNumberOfSeniorCareFacilitiesNearby.count ||
        response.getNumberOfSeniorCareFacilitiesNearby.countIndependentLivingFacilities ||
        response.getNumberOfSeniorCareFacilitiesNearby.countAssistedLivingFacilities ||
        response.getNumberOfSeniorCareFacilitiesNearby.countMemoryCareFacilities;
    }
    dispatch({
      type: 'setCaringFacilityCountNearBy',
      caringFacilityCountNearBy: caringFacilitiesCount ?? 0,
    });
  };

  // Caring.com query
  const [getCaringFacilitiesData] = useLazyQuery<
    getNumberOfSeniorCareFacilitiesNearby,
    getNumberOfSeniorCareFacilitiesNearbyVariables
  >(GET_NUMBER_OF_SENIOR_CARE_FACILITIES_NEARBY, {
    context: { [SKIP_AUTH_CONTEXT_KEY]: true },
    onCompleted: onCompleteGetNumberOfSeniorCareFacilitiesNearby,
  });

  const onCompleteSeniorCareAssistedLivingProviders = (
    response: seniorCareAssistedLivingProviders
  ) => {
    let SALCFacilitiesCount: number | undefined;
    if (
      response.seniorCareAssistedLivingProviders.__typename === 'ProviderSearchSuccess' &&
      response.seniorCareAssistedLivingProviders.providerSearchResults.length > 0
    ) {
      SALCFacilitiesCount = response.seniorCareAssistedLivingProviders.providerSearchResults.length;
    } else {
      getCaringFacilitiesData({
        variables: {
          zipcode,
          ...facilitiesCountType,
        },
      });
    }

    dispatch({
      type: 'setSeniorAssistedLivingCenterFacilityCount',
      assistedLivingCenterFacilityCount: SALCFacilitiesCount ?? 0,
    });
  };

  // onError SALC Query
  const onErrorSeniorCareAssistedLivingProviders = () => {
    getCaringFacilitiesData({
      variables: {
        zipcode,
        ...facilitiesCountType,
      },
    });
  };

  // SALC Query
  const [getSeniorCareAssistedLivingProviders] = useLazyQuery<
    seniorCareAssistedLivingProviders,
    seniorCareAssistedLivingProvidersVariables
  >(SENIOR_CARE_ASSISTED_LIVING_PROVIDERS, {
    context: { [SKIP_AUTH_CONTEXT_KEY]: true },
    onCompleted: onCompleteSeniorCareAssistedLivingProviders,
    onError: onErrorSeniorCareAssistedLivingProviders,
  });

  useEffect(() => {
    logInitialFlowStart();
  }, []);

  useEffect(() => {
    if (!shouldGoNext) {
      return;
    }

    setValidateOnClick(true);

    if (error) {
      return;
    }

    const baseData = {
      cta_clicked: 'next',
      member_type: 'Seeker',
      zip: zipcode,
      city,
      state,
    };
    let data;

    if (userHasAccount) {
      data = {
        ...baseData,
        lead_step: 'location in facility sc',
        lead_flow: 'mhp module',
      };
    } else {
      data = {
        ...baseData,
        enrollment_step:
          currentFlow === FLOWS.SEEKER_IN_FACILITY.name ? 'location in facility sc' : 'location',
      };
    }

    AnalyticsHelper.logEvent({
      name: userHasAccount ? 'Lead Create - Senior Living' : 'Member Enrolled',
      data,
    });

    if (AmpliHelper.useAmpli(featureFlags.flags, typeOfCare)) {
      AmpliHelper.ampli.memberEnrolledLocation({
        ...AmpliHelper.getCommonData(),
        member_type: 'seeker',
        zip: Number(data.zip),
        city: data.city,
        state: data.state,
      });
    }

    if (isInFacility) {
      if (
        assistedLivingCenterFacilityCount === 0 &&
        caringFacilityCountNearBy === 0 &&
        userHasAccount
      ) {
        router.push(SEEKER_IN_FACILITY_ROUTES.NO_INVENTORY);
      } else if (isRecommendationOptimizationVariation) {
        router.push(SEEKER_IN_FACILITY_ROUTES.DESCRIBE_LOVED_ONE);
      } else {
        router.push(SEEKER_IN_FACILITY_ROUTES.PAYMENT_TYPE);
      }
    } else {
      router.push(SEEKER_ROUTES.RECAP);
    }
  }, [shouldGoNext, city, error, assistedLivingCenterFacilityCount, caringFacilityCountNearBy]);

  useEffect(() => {
    if (isInFacility && zipcode.length === 5) {
      getSeniorCareAssistedLivingProviders({
        variables: {
          zipcode,
          source: 'USC',
          facilityType: recommendedSeniorCareCommunityType(condition, helpTypes),
        },
      });
    }
  }, [zipcode]);

  const onZipInputChange = (location: Location) => {
    dispatch({ type: 'setZipcode', zipcode: location.zipcode });
    dispatch({ type: 'setCityAndState', city: location.city, state: location.state });
  };

  const handleError = (e: boolean) => {
    setError(e);
  };

  useEnterKey(true, () => setShouldGoNext(true));

  return (
    <Grid container>
      {isRecommendationOptimizationVariation && isInFacility && (
        <>
          <BlueWrapperIcon icon={<Icon24InfoSeniorCare />} />
          <Grid item xs={12} style={{ marginBottom: '40px' }}>
            <Header>
              Senior living communities are a good option for those looking to balance care and
              community.
            </Header>
          </Grid>
        </>
      )}
      <Grid item xs={12}>
        <Header>Where are you looking for care?</Header>
      </Grid>
      <Grid item xs={12}>
        <ZipInput
          location={{ zipcode, city, state }}
          onError={handleError}
          onChange={onZipInputChange}
          validateOnLostFocusOrClick
          validateOnClick={validateOnClick}
          setValidateOnClick={setValidateOnClick}
          setShouldGoNext={setShouldGoNext}
        />
      </Grid>
      <Grid item xs={12}>
        <CareComButtonContainer>
          <Button
            onClick={() => setShouldGoNext(true)}
            disabled={error}
            variant="contained"
            color="primary"
            fullWidth
            size="large">
            Next
          </Button>
        </CareComButtonContainer>
      </Grid>
    </Grid>
  );
}

export default LocationPage;
