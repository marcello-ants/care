import * as yup from 'yup';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import getConfig from 'next/config';
import { useFormik } from 'formik';
import logger from '@/lib/clientLogger';
import UserEmailStore from '@/lib/UserEmailStore';
import UserPasswordStore from '@/lib/UserPasswordStore';
import {
  useAppDispatch,
  useFlowState,
  useSeekerCCState,
  useSeekerState,
} from '@/components/AppState';
import { SeekerState } from '@/types/seeker';
import { AppDispatch } from '@/types/app';
import { seekerCreate } from '@/__generated__/seekerCreate';
import AuthService from '@/lib/AuthService';
import { handleAccountCreationValidationErrorsIB } from '@/utilities/accountCreationValidationErrorHelper';
import { logIbEmailPasswordEvent } from '@/utilities/analyticsPagesUtils';
import { SEEKER_CREATE } from '@/components/request/GQL';
import { careDateToGQLFormat } from '@/components/pages/seeker/account-creation/account-creation';
import {
  BOOKING_MFE_IB_ASSESSMENT,
  SKIP_AUTH_CONTEXT_KEY,
  SEEKER_INSTANT_BOOK_SHORT_ROUTES,
  FLOWS,
} from '@/constants';
import {
  EnrollmentSource,
  HOW_DID_YOU_HEAR_ABOUT_US,
  SeekerCreateInput,
  ServiceType,
  SubServiceType,
} from '@/__generated__/globalTypes';

const {
  publicRuntimeConfig: { CZEN_GENERAL, BASE_PATH },
} = getConfig();

const ERROR_CREATING_ACCOUNT = 'An error occurred creating your account, please try again.';

function sendAttemptEvent(state: SeekerState, dispatch: AppDispatch) {
  if (!state.initialAccountCreationAttempted) {
    dispatch({
      type: 'setInitialAccountCreationAttempted',
      initialAccountCreationAttempted: true,
    });
    logger.info({ event: 'seekerIBAccountCreationInitialAttempt' });
  }
  logger.info({ event: 'seekerIBAccountCreationAttempt' });
}

const validationSchema = () =>
  yup.object({
    email: yup.string().required('Email is required'),
  });

export interface EmailPasswordFormValues {
  email: string;
  password?: string;
}

export function useCreateAccountIB() {
  const dispatch = useAppDispatch();
  const { referrerCookie, flowName } = useFlowState();
  const seekerCCState = useSeekerCCState();
  const {
    firstName,
    lastName,
    careDate,
    instantBook: { homeAddress },
  } = seekerCCState;
  const seekerState = useSeekerState();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPasswordCreated, setIsPasswordCreated] = useState<boolean>(false);
  const authService = AuthService();
  const isIBShortenedFlow = flowName === FLOWS.SEEKER_INSTANT_BOOK_SHORT.name;

  async function handleAccountCreationSuccess(response: seekerCreate) {
    const { seekerCreate: res } = response;

    if (res.__typename === 'SeekerCreateError') {
      setErrorMessage(ERROR_CREATING_ACCOUNT);
      handleAccountCreationValidationErrorsIB(res.errors, setErrorMessage, seekerState, dispatch);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      formik.setSubmitting(false);
      return;
    }

    logger.info({ event: 'seekerIBAccountCreationSuccessful', memberId: res.memberId });

    dispatch({ type: 'setMemberId', memberId: res.memberId });
    logIbEmailPasswordEvent(isPasswordCreated);

    const nextPage = `${CZEN_GENERAL}${BOOKING_MFE_IB_ASSESSMENT}?showMatch=true&enrollFlow=true`;
    await authService.redirectLogin(nextPage, res.authToken);
  }

  function handleAccountCreationError() {
    handleAccountCreationValidationErrorsIB(
      ERROR_CREATING_ACCOUNT,
      setErrorMessage,
      seekerState,
      dispatch
    );

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    formik.setSubmitting(false);
  }

  const [seekerAccountCreate] = useMutation<seekerCreate, { input: SeekerCreateInput }>(
    SEEKER_CREATE,
    {
      context: { [SKIP_AUTH_CONTEXT_KEY]: true },
      onCompleted: handleAccountCreationSuccess,
      onError: handleAccountCreationError,
    }
  );

  function handleSubmission(values: EmailPasswordFormValues) {
    UserEmailStore.setEmail(values.email);
    if (values.password) {
      UserPasswordStore.setPassword(values.password);
    }
    setErrorMessage(null);
    sendAttemptEvent(seekerState, dispatch);
    setIsPasswordCreated(Boolean(values.password));

    if (isIBShortenedFlow) {
      window.location.assign(`${BASE_PATH}${SEEKER_INSTANT_BOOK_SHORT_ROUTES.NAME}`);
    } else {
      seekerAccountCreate({
        variables: {
          input: {
            firstName,
            lastName,
            zipcode: homeAddress.zip,
            careDate: careDateToGQLFormat(careDate),
            serviceType: ServiceType.CHILD_CARE,
            subServiceType: SubServiceType.ONE_TIME_BABYSITTER,
            password: values.password,
            email: values.email,
            referrerCookie,
            howDidYouHearAboutUs: (seekerState.hdyhau as HOW_DID_YOU_HEAR_ABOUT_US) || undefined,
            enrollmentSource: EnrollmentSource.INSTANT_BOOK,
            addressLine1: homeAddress.addressLine1
              ? `${homeAddress.addressLine1}${
                  homeAddress.addressLine2 ? `, ${homeAddress.addressLine2}` : ''
                }`
              : undefined,
          },
        },
      });
    }
  }

  const formik = useFormik<EmailPasswordFormValues>({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema(),
    onSubmit: handleSubmission,
  });

  return {
    formik,
    errorMessage,
  };
}
