import { useRouter } from 'next/router';
import getConfig from 'next/config';
import { SEEKER_CHILD_CARE_PAJ_ROUTES, CC_PRE_RATE_CARD_PATH } from '@/constants';
import { logChildCareEvent } from '@/utilities/childCareAnalyticsHelper';
import { logCareEvent } from '@/utilities/amplitudeAnalyticsHelper';
import { TealiumData, TealiumUtagService } from '@/utilities/utagHelper';
import { useAppState } from '@/components/AppState';
import { getUserEmail } from '@/lib/AuthService';

const email = getUserEmail();

type GetNavFunctions = {
  jobDescription: string;
  slots: Array<string>;
  preRateCardPath: string;
};

type GetNavFunctionsForCC = {
  jobDescription: string;
  enrollmentSource: string;
};

export const getNavFunctionsForCC = ({
  enrollmentSource,
  jobDescription,
}: GetNavFunctionsForCC) => {
  const router = useRouter();

  const {
    flow: { memberId, czenJSessionId },
  } = useAppState();
  const {
    publicRuntimeConfig: { CZEN_GENERAL },
  } = getConfig();

  const navigateToNextStep = () => {
    logChildCareEvent(
      'Job Posted',
      'PAJ - Family info',
      enrollmentSource,
      {
        what_else_text: jobDescription.length > 0 ? 1 : 0,
      },
      undefined,
      true // final step
    );

    const slots = ['/us-subscription/action/seeker/paj/cc'];
    const tealiumData: TealiumData = {
      ...(memberId && { memberId }),
      sessionId: czenJSessionId,
      slots,
      email,
    };
    TealiumUtagService.view(tealiumData);

    logChildCareEvent('Job Posted', 'PAJ - Finish', enrollmentSource);
    window.location.assign(CC_PRE_RATE_CARD_PATH(CZEN_GENERAL));
  };

  const navigateToNextStepWithNoPostJob = async () => {
    await router.push(SEEKER_CHILD_CARE_PAJ_ROUTES.WHAT_NEXT);
  };

  return { navigateToNextStep, navigateToNextStepWithNoPostJob };
};

export const getNavFunctions = ({ jobDescription, slots, preRateCardPath }: GetNavFunctions) => {
  const {
    flow: { memberId, czenJSessionId },
  } = useAppState();

  const navigateToNextStep = () => {
    logCareEvent(
      'Job Posted',
      'PAJ - Extra info',
      {
        what_else_text: jobDescription.length > 0 ? 1 : 0,
      },
      'next',
      true
    );

    const tealiumData: TealiumData = {
      ...(memberId && { memberId }),
      sessionId: czenJSessionId,
      slots,
      email,
    };
    TealiumUtagService.view(tealiumData);

    window.location.assign(preRateCardPath);
  };

  const navigateToNextStepWithNoPostJob = () => {
    window.location.assign(preRateCardPath);
  };

  return { navigateToNextStep, navigateToNextStepWithNoPostJob };
};
