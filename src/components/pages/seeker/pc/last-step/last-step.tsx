import { PC_PRE_RATE_CARD_PATH } from '@/constants';
import getConfig from 'next/config';
import { generatePetCareJobCreateInput } from '@/utilities/gqlPayloadHelper';
import {
  PETCARE_ONE_TIME_JOB_CREATE,
  PETCARE_RECURRING_JOB_CREATE,
} from '@/components/request/GQL';
import OverlaySpinner from '@/components/OverlaySpinner';
import { useSeekerPCState } from '@/components/AppState';
import { petCareOneTimeJobCreate } from '@/__generated__/petCareOneTimeJobCreate';
import { petCareRecurringJobCreate } from '@/__generated__/petCareRecurringJobCreate';
import { ServiceType } from '@/__generated__/globalTypes';
import { ErrorLastStep, LastStep } from '@/components/pages/seeker/last-step/last-step';
import useProviderCount from '@/components/hooks/useProviderCount';
import NeedSomeTipsBanner from '@/components/NeedSomeTipsBanner';
import usePostAJob from '../../last-step/usePostAJob';
import { getNavFunctions } from '../../last-step/getNavFunctions';

function LastStepPC() {
  const seekerPCState = useSeekerPCState();
  const { jobPost } = seekerPCState;
  const { jobDescription, submissionInfo } = jobPost;
  const { numOfProviders } = useProviderCount(ServiceType.PET_CARE);

  const {
    publicRuntimeConfig: { CZEN_GENERAL },
  } = getConfig();

  const reducer = {
    type: 'job_reducer',
    prefix: 'pc',
  };

  const { navigateToNextStep, navigateToNextStepWithNoPostJob } = getNavFunctions({
    jobDescription,
    slots: ['/us-subscription/action/seeker/paj/pc'],
    preRateCardPath: PC_PRE_RATE_CARD_PATH(CZEN_GENERAL),
  });

  const { isWaiting, handleNext, handleNoPostJob, handleChange } = usePostAJob<
    petCareOneTimeJobCreate,
    petCareRecurringJobCreate
  >({
    reducer,
    navigateToNextStep,
    navigateToNextStepWithNoPostJob,
    seekerSpecificState: seekerPCState,
    generateJobInput: generatePetCareJobCreateInput,
    RECURRING_JOB_CREATE: PETCARE_RECURRING_JOB_CREATE,
    ONE_TIME_JOB_CREATE: PETCARE_ONE_TIME_JOB_CREATE,
    getOneTimeJobId: (response: petCareOneTimeJobCreate) =>
      response.petCareOneTimeJobCreate?.job?.id,
    getRecurringJobId: (response: petCareRecurringJobCreate) =>
      response.petCareRecurringJobCreate?.job,
  });

  if (isWaiting) {
    return <OverlaySpinner isOpen={isWaiting} wrapped />;
  }

  if (submissionInfo.jobPostSuccessful) {
    return <ErrorLastStep navigateToNextStep={navigateToNextStep} />;
  }

  return (
    <LastStep
      serviceType={ServiceType.PET_CARE}
      handleChange={handleChange}
      handleNoPostJob={handleNoPostJob}
      handleNext={handleNext}
      placeholderText="Tell pet caregivers a little more about your pet(s) or any specific needs. (Optional)"
      bannerText={`Great! ${numOfProviders} pet caregivers match your needs.`}
      needSomeTipsBanner={<NeedSomeTipsBanner verticalName="PC" />}
    />
  );
}

LastStepPC.CheckAuthCookie = true;
export default LastStepPC;
