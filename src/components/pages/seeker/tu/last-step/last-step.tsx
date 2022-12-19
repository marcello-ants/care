import { TUTORING_PRE_RATE_CARD_PATH } from '@/constants';
import getConfig from 'next/config';
import {
  TUTORING_ONE_TIME_JOB_CREATE,
  TUTORING_RECURRING_JOB_CREATE,
} from '@/components/request/GQL';
import OverlaySpinner from '@/components/OverlaySpinner';
import { useSeekerTUState } from '@/components/AppState';
import { ServiceType } from '@/__generated__/globalTypes';
import useProviderCount from '@/components/hooks/useProviderCount';
import { ErrorLastStep, LastStep } from '@/components/pages/seeker/last-step/last-step';
import NeedSomeTipsBanner from '@/components/NeedSomeTipsBanner';
import { tutoringOneTimeJobCreate } from '@/__generated__/tutoringOneTimeJobCreate';
import { tutoringRecurringJobCreate } from '@/__generated__/tutoringRecurringJobCreate';
import { generateTutoringJobCreateInput } from '@/utilities/gqlPayloadHelper';
import usePostAJob from '../../last-step/usePostAJob';
import { getNavFunctions } from '../../last-step/getNavFunctions';

const LastStepTU = () => {
  const seekerTUState = useSeekerTUState();
  const { jobPost } = seekerTUState;
  const { jobDescription, submissionInfo } = jobPost;
  const { numOfProviders } = useProviderCount(ServiceType.TUTORING);

  const reducer = {
    type: 'job_reducer',
    prefix: 'tu',
  };

  const {
    publicRuntimeConfig: { CZEN_GENERAL },
  } = getConfig();

  const { navigateToNextStep, navigateToNextStepWithNoPostJob } = getNavFunctions({
    jobDescription,
    slots: ['/us-subscription/action/seeker/paj/tu'],
    preRateCardPath: TUTORING_PRE_RATE_CARD_PATH(CZEN_GENERAL),
  });

  const { isWaiting, handleNext, handleNoPostJob, handleChange } = usePostAJob<
    tutoringOneTimeJobCreate,
    tutoringRecurringJobCreate
  >({
    reducer,
    navigateToNextStep,
    navigateToNextStepWithNoPostJob,
    seekerSpecificState: seekerTUState,
    generateJobInput: generateTutoringJobCreateInput,
    RECURRING_JOB_CREATE: TUTORING_RECURRING_JOB_CREATE,
    ONE_TIME_JOB_CREATE: TUTORING_ONE_TIME_JOB_CREATE,
    getOneTimeJobId: (response: tutoringOneTimeJobCreate) =>
      response.tutoringOneTimeJobCreate?.job?.id,
    getRecurringJobId: (response: tutoringRecurringJobCreate) =>
      response.tutoringRecurringJobCreate?.job,
  });

  if (isWaiting) {
    return <OverlaySpinner isOpen={isWaiting} wrapped />;
  }

  if (submissionInfo.jobPostSuccessful) {
    return <ErrorLastStep navigateToNextStep={navigateToNextStep} />;
  }

  return (
    <LastStep
      serviceType={ServiceType.TUTORING}
      handleChange={handleChange}
      handleNoPostJob={handleNoPostJob}
      handleNext={handleNext}
      placeholderText="Tell tutors a little more about any specific needs. (Optional)"
      bannerText={`Almost done! ${numOfProviders} tutors match your needs.`}
      showLettersCount={false}
      needSomeTipsBanner={<NeedSomeTipsBanner verticalName="TU" />}
    />
  );
};

LastStepTU.CheckAuthCookie = true;
export default LastStepTU;
