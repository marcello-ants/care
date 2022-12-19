import { useState, useEffect, ChangeEvent } from 'react';
import logger from '@/lib/clientLogger';
import { useMutation } from '@apollo/client';
import { ApolloError } from '@apollo/client/errors';
import { isInvalidAuthTokenInErrors } from '@/utilities/idealCaregiverHelper';
import stripInvalidCharacters from '@/utilities/stripInvalidCharacters';
import { asyncDispatch } from '@/state/seeker/reducerHelpers';
import { useAppDispatch, useSeekerState } from '@/components/AppState';
import { SeekerPCState } from '@/types/seekerPC';
import { SeekerCCState } from '@/types/seekerCC';
import { SeekerHKState } from '@/types/seekerHK';
import { SeekerTUState } from '@/types/seekerTU';
import { SeekerState } from '@/types/seeker';

type SeekerAllowedStates = SeekerPCState | SeekerCCState | SeekerHKState | SeekerTUState;

type UsePostAJob = {
  reducer: { type: string; prefix: string };
  navigateToNextStep: () => void;
  navigateToNextStepWithNoPostJob: () => void;
  seekerSpecificState: SeekerAllowedStates;
  generateJobInput: (seekerSpecificState: any, seekerState: SeekerState) => void;
  ONE_TIME_JOB_CREATE: any;
  RECURRING_JOB_CREATE: any;
  getOneTimeJobId: (response: any) => any;
  getRecurringJobId: (response: any) => any;
};

function usePostAJob<oneTimeJobCreateType, recurringJobCreateType>({
  reducer,
  navigateToNextStep,
  navigateToNextStepWithNoPostJob,
  seekerSpecificState,
  generateJobInput,
  ONE_TIME_JOB_CREATE,
  RECURRING_JOB_CREATE,
  getOneTimeJobId,
  getRecurringJobId,
}: UsePostAJob) {
  const MAX_JOB_POST_ATTEMPTS = 3;
  const dispatch = useAppDispatch();
  const seekerState = useSeekerState();
  const { zipcode } = seekerState;
  const { jobPost } = seekerSpecificState;
  const { jobDescription, submissionInfo } = jobPost;

  const [waitingOnNextRoute, setWaitingOnNextRoute] = useState(false);

  async function handlePostSuccess(response: recurringJobCreateType | oneTimeJobCreateType) {
    const oneTimeJobId = getOneTimeJobId(response);
    const recurringJobId = getRecurringJobId(response);
    const jobId = oneTimeJobId ?? recurringJobId ?? 'UNKNOWN';
    logger.info({ event: 'postAJobSuccess', zipcode, jobId });

    // set this to true to avoid spinner going away and revealing form momentarily
    setWaitingOnNextRoute(true);

    // reset this field to avoid weirdness with hitting the back button automatically triggering a PAJ request
    await asyncDispatch(dispatch, {
      type: 'job_setJobSubmissionInfo',
      submissionAttempted: false,
      attempts: 0,
      reducer,
    });

    await asyncDispatch(dispatch, {
      type: 'job_setJobPostSuccessful',
      jobSuccessful: true,
      reducer,
    });
    setTimeout(() => navigateToNextStep(), 1000);
  }

  function logPostErrorMessage(
    errorMessage: string,
    maxAttemptsErrorMessage: string,
    graphQLError: string
  ) {
    if (submissionInfo.attempts < MAX_JOB_POST_ATTEMPTS - 1) {
      logger.warn({ event: errorMessage, graphQLError });
    } else {
      logger.error({ event: maxAttemptsErrorMessage, graphQLError });
    }
  }

  function handlePostError(graphQLError: ApolloError) {
    let isAuthError = false;

    if (
      graphQLError.networkError &&
      'statusCode' in graphQLError.networkError &&
      graphQLError.networkError.statusCode === 401
    ) {
      logPostErrorMessage(
        'postAJobErrorFrom401',
        'postAJobMaxAttemptsFrom401',
        graphQLError.message
      );
      isAuthError = true;
    } else if (
      graphQLError.graphQLErrors &&
      graphQLError.graphQLErrors.length > 0 &&
      isInvalidAuthTokenInErrors(graphQLError.graphQLErrors)
    ) {
      logPostErrorMessage(
        'postAJobErrorFromAuthToken',
        'postAJobMaxAttemptsFromAuthToken',
        graphQLError.message
      );
      isAuthError = true;
    } else {
      logPostErrorMessage(
        'postAJobErrorNotFrom401',
        'postAJobMaxAttemptsNotFrom401',
        graphQLError.message
      );
    }

    if (isAuthError && submissionInfo.attempts < MAX_JOB_POST_ATTEMPTS) {
      dispatch({
        type: 'job_setJobSubmissionInfo',
        submissionAttempted: true,
        attempts: submissionInfo.attempts + 1,
        reducer,
      });
    }
  }

  const [recurringJobCreate, recurringStatus] = useMutation<recurringJobCreateType>(
    RECURRING_JOB_CREATE,
    {
      onCompleted(response) {
        handlePostSuccess(response);
      },
      onError(graphQLError) {
        handlePostError(graphQLError);
      },
    }
  );

  const [oneTimeJobCreate, oneTimeStatus] = useMutation<oneTimeJobCreateType>(ONE_TIME_JOB_CREATE, {
    onCompleted(response) {
      handlePostSuccess(response);
    },
    onError(graphQLError) {
      handlePostError(graphQLError);
    },
  });

  function postAJob() {
    const jobCreateInput = generateJobInput(seekerSpecificState, seekerState);
    if (jobPost.jobType === 'onetime') {
      oneTimeJobCreate({
        variables: {
          input: jobCreateInput,
        },
      });
    } else if (jobPost.jobType === 'recurring') {
      recurringJobCreate({
        variables: {
          input: jobCreateInput,
        },
      });
    }
  }

  const handleNext = () => {
    if (submissionInfo.attempts === 0) {
      logger.info({ event: 'initialPostAJobAttempt' });
    }

    dispatch({
      type: 'job_setJobSubmissionInfo',
      submissionAttempted: true,
      attempts: submissionInfo.attempts + 1,
      reducer,
    });

    postAJob();
  };

  const oneTimeLoading = // check
    (oneTimeStatus.called || oneTimeStatus.loading) && !oneTimeStatus.data && !oneTimeStatus.error;

  const recurringLoading = // check
    (recurringStatus.called || recurringStatus.loading) &&
    !recurringStatus.data &&
    !recurringStatus.error;

  // automatically submit another PAJ request on pageload if the user had previously attempted a submission
  // and was redirected back to this page (i.e., after completing the OIDC flow)
  const shouldExecutePajRequest =
    submissionInfo.submissionAttempted && !recurringStatus.error && !oneTimeStatus.error;

  const isWaiting =
    shouldExecutePajRequest || recurringLoading || oneTimeLoading || waitingOnNextRoute;

  // only once on startup check if we landed here from redirect login
  useEffect(() => {
    if (shouldExecutePajRequest) {
      postAJob();
    }
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'job_setJobDescription',
      description: stripInvalidCharacters(event.currentTarget.value) ?? undefined,
      reducer,
    });
  };

  const handleNoPostJob = () => {
    dispatch({ type: 'job_setJobPostSuccessful', jobSuccessful: false, reducer });
    dispatch({
      type: 'job_setJobSubmissionInfo',
      submissionAttempted: false,
      attempts: 0,
      reducer,
    });

    navigateToNextStepWithNoPostJob();
  };

  return {
    MAX_JOB_POST_ATTEMPTS,
    isWaiting,
    handleNext,
    handleNoPostJob,
    handleChange,
    navigateToNextStep,
    submissionInfo,
    jobDescription,
  };
}

export default usePostAJob;
