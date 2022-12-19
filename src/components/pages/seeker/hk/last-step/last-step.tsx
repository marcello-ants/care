import { HK_PRE_RATE_CARD_PATH } from '@/constants';
import getConfig from 'next/config';
import { generateHousekeepingJobCreateInput } from '@/utilities/gqlPayloadHelper';
import {
  HOUSEKEEPING_ONE_TIME_JOB_CREATE,
  HOUSEKEEPING_RECURRING_JOB_CREATE,
} from '@/components/request/GQL';
import OverlaySpinner from '@/components/OverlaySpinner';
import { useSeekerHKState } from '@/components/AppState';
import { ErrorLastStep, LastStep } from '@/components/pages/seeker/last-step/last-step';
import useProviderCount from '@/components/hooks/useProviderCount';
import { ServiceType } from '@/__generated__/globalTypes';
import { housekeepingOneTimeJobCreate } from '@/__generated__/housekeepingOneTimeJobCreate';
import { housekeepingRecurringJobCreate } from '@/__generated__/housekeepingRecurringJobCreate';
import usePostAJob from '../../last-step/usePostAJob';
import { getNavFunctions } from '../../last-step/getNavFunctions';

const LastStepHK = () => {
  const seekerHKState = useSeekerHKState();
  const { jobPost } = seekerHKState;
  const { jobDescription, submissionInfo } = jobPost;
  const { numOfProviders } = useProviderCount(ServiceType.HOUSEKEEPING);

  const {
    publicRuntimeConfig: { CZEN_GENERAL },
  } = getConfig();

  const reducer = {
    type: 'job_reducer',
    prefix: 'hk',
  };

  const { navigateToNextStep, navigateToNextStepWithNoPostJob } = getNavFunctions({
    jobDescription,
    slots: ['/us-subscription/action/seeker/paj/hk'],
    preRateCardPath: HK_PRE_RATE_CARD_PATH(CZEN_GENERAL),
  });

  const { isWaiting, handleNext, handleNoPostJob, handleChange } = usePostAJob<
    housekeepingOneTimeJobCreate,
    housekeepingRecurringJobCreate
  >({
    reducer,
    navigateToNextStep,
    navigateToNextStepWithNoPostJob,
    seekerSpecificState: seekerHKState,
    generateJobInput: generateHousekeepingJobCreateInput,
    RECURRING_JOB_CREATE: HOUSEKEEPING_RECURRING_JOB_CREATE,
    ONE_TIME_JOB_CREATE: HOUSEKEEPING_ONE_TIME_JOB_CREATE,
    getOneTimeJobId: (response: housekeepingOneTimeJobCreate) =>
      response.housekeepingOneTimeJobCreate?.job?.id,
    getRecurringJobId: (response: housekeepingRecurringJobCreate) =>
      response.housekeepingRecurringJobCreate?.job,
  });

  if (isWaiting) {
    return <OverlaySpinner isOpen={isWaiting} wrapped />;
  }

  if (submissionInfo.jobPostSuccessful) {
    return <ErrorLastStep navigateToNextStep={navigateToNextStep} />;
  }

  return (
    <LastStep
      serviceType={ServiceType.HOUSEKEEPING}
      handleChange={handleChange}
      handleNoPostJob={handleNoPostJob}
      handleNext={handleNext}
      placeholderText="Tell housekeepers a little more about your home or specific needs. (Optional)"
      bannerText={`Nice! ${numOfProviders} housekeepers near you!`}
      showLettersCount
    />
  );
};

LastStepHK.CheckAuthCookie = true;
export default LastStepHK;
