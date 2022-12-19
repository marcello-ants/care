import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@material-ui/core';

import { CLIENT_FEATURE_FLAGS, POST_A_JOB_ROUTES } from '@/constants';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import useEnterKey from '@/components/hooks/useEnterKey';
import { useAppDispatch, useAppState } from '@/components/AppState';
import AccountCreationConfirmation from '@/components/AccountCreationConfirmation';
import { CareFrequency } from '@/types/seeker';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { TealiumData, TealiumUtagService } from '@/utilities/utagHelper';
import logger from '@/lib/clientLogger';
import { getUserEmail } from '@/lib/AuthService';
import AmpliHelper from '@/utilities/ampliAnalyticsHelper';
import { hash256 } from '@/utilities/account-creation-utils';
import { ServiceType } from '@/__generated__/globalTypes';

const options = [
  { label: 'Recurring', value: 'recurring' },
  { label: 'One-time', value: 'onetime' },
  { label: 'Live-in', value: 'livein' },
];

// A/B Test - growth-senior-care-type-of-care
const optionsV1 = [
  { label: 'Regular help', value: 'recurring' },
  { label: 'Single visit', value: 'onetime' },
  { label: 'Live-in', value: 'livein' },
];

function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    flow: flowState,
    seeker: { jobPost: jobPostState, typeOfCare },
  } = useAppState();
  const { careFrequency, servicesNeeded, initialLoggingDone } = jobPostState;
  const handleCareTypeChange = ([selectedCaredFrequency]: Array<CareFrequency>) => {
    dispatch({ type: 'setCareFrequency', careFrequency: selectedCaredFrequency });
  };

  // Feature Flags
  const featureFlags = useFeatureFlags();
  const seniorCareTypeOfCareEvaluation =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.GROWTH_SC_TYPE_OF_CARE];
  const showSeniorCareTypeOfCareVariation = seniorCareTypeOfCareEvaluation?.variationIndex === 1;

  const data = {
    job_step: 'start PAJ',
    cta_clicked: 'Next',
  };

  const handleNext = () => {
    AnalyticsHelper.logEvent({
      name: 'Job Posted',
      data,
    });

    if (AmpliHelper.useAmpli(featureFlags.flags, typeOfCare)) {
      AmpliHelper.ampli.jobPostedType({
        ...AmpliHelper.getCommonData(),
        cta_clicked: 'next',
        type_of_care: AmpliHelper.mapCareFrequencyToTypeOfCare(careFrequency),
      });
    }

    dispatch({ type: 'setCareType', careFrequency, servicesNeeded });
    if (careFrequency === 'recurring' || careFrequency === 'livein') {
      router.push(POST_A_JOB_ROUTES.RECURRING);
    } else if (careFrequency === 'onetime') {
      router.push(POST_A_JOB_ROUTES.ONE_TIME);
    }
  };

  const logInitialFlowStart = () => {
    hash256(getUserEmail()).then((hash) => {
      const emailSHA256 = hash;
      const tealiumDataView: TealiumData = {
        email: getUserEmail(),
        slots: ['/us-subscription/conversion/seeker/basic/signup/cj/'],
        sessionId: flowState.czenJSessionId,
        emailSHA256,
        memberType: 'seeker',
        overallStatus: 'basic',
        serviceId: ServiceType.SENIOR_CARE,
        subServiceId: typeOfCare,
      };

      if (!initialLoggingDone) {
        if (flowState.memberId) {
          tealiumDataView.memberId = flowState.memberId;
        }

        dispatch({ type: 'setInitialLoggingDone', initialLoggingDone: true });
        logger.info({ event: 'postAJobPageViewed' });
      }

      TealiumUtagService.view(tealiumDataView);
    });
  };

  useEffect(() => {
    logInitialFlowStart();

    // Amplitude - Test Exposure
    AnalyticsHelper.logTestExposure(
      CLIENT_FEATURE_FLAGS.GROWTH_SC_TYPE_OF_CARE,
      seniorCareTypeOfCareEvaluation
    );
  }, []);

  useEnterKey(careFrequency !== undefined, handleNext);

  return (
    <AccountCreationConfirmation
      header="Your account has been created!"
      description="Now, share a bit more about your schedule and needs in a job post to help you quickly match with caregivers."
      subheader="What type of care are you looking for?"
      options={showSeniorCareTypeOfCareVariation ? optionsV1 : options}
      onChange={handleCareTypeChange}
      value={careFrequency}
      cta={
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          disabled={!careFrequency}
          onClick={handleNext}>
          Next
        </Button>
      }
    />
  );
}

export default Home;
