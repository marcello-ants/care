import { helpTypesToServices, SeekerState } from '@/types/seeker';
import { AppDispatch } from '@/types/app';
import logger from '@/lib/clientLogger';
import { useMutation } from '@apollo/client';
import { seekerCreate } from '@/__generated__/seekerCreate';
import {
  HOW_DID_YOU_HEAR_ABOUT_US,
  SeekerCreateInput,
  EnrollmentSource,
} from '@/__generated__/globalTypes';
import { SEEKER_CREATE } from '@/components/request/GQL';
import { CARE_DATES, SKIP_AUTH_CONTEXT_KEY } from '@/constants';
import { useCallback } from 'react';
import { handleAccountCreationValidationErrors } from '@/utilities/accountCreationValidationErrorHelper';
import {
  ERROR_CREATING_ACCOUNT,
  FACEBOOK_VERTICALS_ALLOWANCE,
  SERVICE_TYPE_BY_VERTICAL,
} from '@/components/pages/seeker/three-step-account-creation/constants';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import userEmailStore from '@/lib/UserEmailStore';
import userPasswordStore from '@/lib/UserPasswordStore';
import { useAppDispatch, useSeekerState } from '@/components/AppState';
import useFacebookConnection from '@/components/pages/seeker/three-step-account-creation/hooks/useFacebookConnection';
import useLoginRedirect from '@/components/pages/seeker/three-step-account-creation/hooks/useLoginRedirect';
import {
  AccountCreationGeneralFormProps,
  FormNameValues,
  SetSeekerNameAction,
} from '@/components/pages/seeker/three-step-account-creation/interfaces';
import { careDateToGQLFormat } from '@/components/pages/seeker/account-creation/account-creation';
import { CareKind, CareKindToSubServiceType } from '@/types/seekerCC';
import { logCareEvent } from '@/utilities/amplitudeAnalyticsHelper';
import { useRouter } from 'next/router';

export function sendFailureEvent(state: SeekerState, dispatch: AppDispatch) {
  if (!state.initialAccountCreationFailed) {
    dispatch({ type: 'setInitialAccountCreationFailed', initialAccountCreationFailed: true });
    logger.info({ event: 'seekerAccountCreationFailedInitialAttempt' });
  }
  logger.error({ event: 'seekerAccountCreationFailed' });
}

function sendAttemptEvent(state: SeekerState, dispatch: AppDispatch) {
  if (!state.initialAccountCreationAttempted) {
    dispatch({
      type: 'setInitialAccountCreationAttempted',
      initialAccountCreationAttempted: true,
    });
    logger.info({ event: 'seekerAccountCreationInitialAttempt' });
  }
  logger.info({ event: 'seekerAccountCreationAttempt' });
}

export const useSeekerAccountCreation = ({
  vertical,
  nextPageURL,
  setFormikSubmittingFalse,
  setErrorMessage,
}: AccountCreationGeneralFormProps) => {
  const dispatch = useAppDispatch();
  const seekerState = useSeekerState();
  const redirectToLogin =
    vertical === 'IB' ? useLoginRedirect({ nextPageURL }, true) : useLoginRedirect({ nextPageURL });
  const { connectToFacebook } = useFacebookConnection();
  const router = useRouter();
  const handleAccountCreationSuccess = useCallback(
    async (response: seekerCreate) => {
      const { seekerCreate: res } = response;

      if (res.__typename === 'SeekerCreateError') {
        sendFailureEvent(seekerState, dispatch);
        handleAccountCreationValidationErrors(res.errors, setErrorMessage);

        setFormikSubmittingFalse();
        return;
      }

      if (FACEBOOK_VERTICALS_ALLOWANCE.includes(vertical)) {
        connectToFacebook(res.authToken);
      }

      dispatch({ type: 'setMemberId', memberId: res.memberId });
      AnalyticsHelper.setMemberId(res.memberId);
      dispatch({
        type: 'setSeekerParams',
        servicesNeeded: helpTypesToServices(seekerState.helpTypes),
        typeOfCare: seekerState.typeOfCare,
        zip: seekerState.zipcode,
      });
      userEmailStore.clearEmail();
      logger.info({ event: 'seekerAccountCreationSuccessful', memberId: res.memberId });

      await redirectToLogin(res.authToken);
    },
    [seekerState]
  );

  const seekerNameActionType =
    vertical === 'DC'
      ? 'cc_setSeekerName'
      : (`${vertical.toLowerCase()}_setSeekerName` as SetSeekerNameAction);

  const handleAccountCreationError = useCallback(() => {
    setErrorMessage(ERROR_CREATING_ACCOUNT);
    sendFailureEvent(seekerState, dispatch);
    dispatch({
      type: seekerNameActionType,
      firstName: '',
      lastName: '',
    });

    setFormikSubmittingFalse();
  }, [seekerState]);

  const [seekerAccountCreate] = useMutation<seekerCreate, { input: SeekerCreateInput }>(
    SEEKER_CREATE,
    {
      context: { [SKIP_AUTH_CONTEXT_KEY]: true },
      onCompleted: handleAccountCreationSuccess,
      onError: handleAccountCreationError,
    }
  );

  const executeSeekerAccountCreate = (
    values: FormNameValues,
    zipcode: string,
    careDate: CARE_DATES,
    referrerCookie: string | null | undefined,
    careKind: CareKind | undefined,
    skipAccountCreation: boolean
  ) => {
    setErrorMessage(null);
    sendAttemptEvent(seekerState, dispatch);
    dispatch({
      type: seekerNameActionType,
      firstName: values.firstName,
      lastName: values.lastName,
    });
    if (values.howDidYouHearAboutUs) {
      dispatch({
        type: 'setHdyhau',
        hdyhau: values.howDidYouHearAboutUs,
      });
    }
    if (skipAccountCreation) {
      router.push(nextPageURL);
    } else {
      seekerAccountCreate({
        variables: {
          input: {
            ...values,
            howDidYouHearAboutUs:
              (values.howDidYouHearAboutUs as HOW_DID_YOU_HEAR_ABOUT_US) || undefined,
            email: values.email || userEmailStore.getEmail(),
            zipcode,
            serviceType: SERVICE_TYPE_BY_VERTICAL[vertical],
            careDate: careDateToGQLFormat(careDate),
            referrerCookie,
            ...(vertical === 'CC' || vertical === 'DC'
              ? {
                  subServiceType: CareKindToSubServiceType[careKind as CareKind],
                }
              : {}),
            ...(vertical === 'IB'
              ? {
                  subServiceType: CareKindToSubServiceType[careKind as CareKind],
                  enrollmentSource: EnrollmentSource.INSTANT_BOOK,
                  password: userPasswordStore.getPassword(),
                }
              : {}),
          },
        },
      });
      logCareEvent(
        'Member Enrolled',
        vertical === 'DC' ? 'day care account creation - name' : 'First and Last Name',
        { memberType: 'Seeker' },
        'Join Now',
        true
      );
    }
  };

  return { executeSeekerAccountCreate };
};
