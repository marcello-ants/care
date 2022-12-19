import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { FormikProvider, useFormik } from 'formik';
import { omit } from 'lodash-es';

import {
  FormValues,
  useAccountCreationFormConfig,
} from '@/components/features/accountCreation/accountCreationForm';
import NameForm from '@/components/features/accountCreation/NameForm';
import useSCSeekerCreate from '@/components/pages/seeker/sc/account-creation/useSCSeekerCreate';
import { helpTypesToServices } from '@/types/seeker';
import AuthService from '@/lib/AuthService';
import { POST_A_JOB_ROUTES, SEEKER_ROUTES } from '@/constants';
// eslint-disable-next-line camelcase
import { seniorCareSeekerCreate_seniorCareSeekerCreate_SeniorCareSeekerCreateSuccess } from '@/__generated__/seniorCareSeekerCreate';
import OverlaySpinner from '@/components/OverlaySpinner';

import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { hash256 } from '@/utilities/account-creation-utils';
import { useAppDispatch, useAppState } from '@/components/AppState';

import useNearbyCaregivers from '@/components/hooks/useNearbyCaregivers';
import CaregiversNearby from '@/components/CaregiversNearby';
import { SENIOR_CARE_TYPE, ServiceType } from '@/__generated__/globalTypes';
import SeekerEmailPage from '@/components/pages/seeker/account-creation/SeekerEmailPage-test.b';
import PasswordForm from '@/components/features/accountCreation/PasswordForm-test-b';
import PageTransition from '@/components/PageTransition';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import { TealiumData, TealiumUtagService } from '@/utilities/utagHelper';
import AmpliHelper from '@/utilities/ampliAnalyticsHelper';

function AccountCreation() {
  const router = useRouter();
  const authService = AuthService();
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { seeker: seekerState, flow: flowState } = useAppState();
  const { helpTypes, typeOfCare, zipcode } = seekerState;
  const { flags } = useFeatureFlags();
  const [step = ''] = (router.query.param as string[]) || [];
  const isWaiting = sending;
  const dispatch = useAppDispatch();
  const { numCaregivers } = useNearbyCaregivers(zipcode);

  useEffect(() => {
    dispatch({
      type: 'setSeekerParams',
      servicesNeeded: helpTypesToServices(helpTypes),
      typeOfCare,
      zip: zipcode,
    });
  }, []);

  const handleJoinNow = () => {
    const data = {
      enrollment_step: 'Email and Password',
      cta_clicked: 'Continue',
      caregiver_count: typeOfCare !== SENIOR_CARE_TYPE.IN_FACILITY ? numCaregivers : 0,
      member_type: 'Seeker',
    };
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data,
    });

    if (AmpliHelper.useAmpli(flags, typeOfCare)) {
      AmpliHelper.ampli.memberEnrolledEmailCollection({
        ...AmpliHelper.getCommonData(),
        cta_clicked: 'join now',
        caregiver_count: data.caregiver_count,
        member_type: 'seeker',
      });
    }

    router.push(SEEKER_ROUTES.ACCOUNT_CREATION_NAME);
  };

  function handleErrorMsg(message: string | null) {
    setErrorMessage(message || '');
  }

  async function handleSuccess(
    // eslint-disable-next-line camelcase
    res: seniorCareSeekerCreate_seniorCareSeekerCreate_SeniorCareSeekerCreateSuccess
  ) {
    const nextPage = router.basePath + POST_A_JOB_ROUTES.POST_A_JOB;
    await authService.redirectLogin(nextPage, res.authToken, res.oneTimeToken);
  }

  function handleSeekerCreateError() {
    setSending(false);
  }

  const seekerCreate = useSCSeekerCreate({
    dispatch,
    seekerState,
    handleErrorMsg,
    onSuccess: handleSuccess,
    onError: handleSeekerCreateError,
  });

  function handleSubmission(values: FormValues) {
    const data = {
      enrollment_step: 'password_only_screen',
      cta_clicked: 'submit',
      member_type: 'Seeker',
    };
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data,
    });

    if (AmpliHelper.useAmpli(flags, typeOfCare)) {
      AmpliHelper.ampli.accountCreatedSeeker();
    }

    setSending(true);
    setErrorMessage('');

    seekerCreate({
      variables: {
        input: {
          ...omit(values, 'isPasswordSinglePage'),
          zipcode,
          referrerCookie: flowState.referrerCookie,
          careType: typeOfCare,
          howDidYouHearAboutUs: values.howDidYouHearAboutUs || undefined,
        },
      },
    }).then(({ data: dataResponse }) => {
      if (dataResponse?.seniorCareSeekerCreate.__typename === 'SeniorCareSeekerCreateSuccess') {
        hash256(values.email).then((hash) => {
          const emailSHA256 = hash;

          const tealiumDataView: TealiumData = {
            email: values.email,
            emailSHA256,
            slots: ['/us-subscription/conversion/seeker/basic/signup/'],
            sessionId: flowState.czenJSessionId,
            memberType: 'seeker',
            overallStatus: 'basic',
            serviceId: ServiceType.SENIOR_CARE,
            subServiceId: typeOfCare,
          };

          if (!seekerState.jobPost.initialLoggingDone) {
            if (flowState.memberId) {
              tealiumDataView.memberId = flowState.memberId;
            }
          }

          TealiumUtagService.view(tealiumDataView);
        });

        if (AmpliHelper.useAmpli(flags, typeOfCare)) {
          AmpliHelper.ampli.identify(dataResponse?.seniorCareSeekerCreate.memberId, {
            primary_service_id: 'seniorcare',
            member_overall_status: 'active_basic',
            sign_up_date: Date.now(),
          });
        }
      }
    });
  }

  const formik = useFormik<FormValues>(
    useAccountCreationFormConfig<FormValues>({
      initialValues: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        howDidYouHearAboutUs: '',
        isPasswordSinglePage: true,
      },
      onSubmit: handleSubmission,
    })
  );

  const handleNext = async () => {
    formik.setFieldTouched('firstName');
    formik.setFieldTouched('lastName');
    const validFirstName = !(await formik.validateField('firstName'));
    const validLastName = !(await formik.validateField('lastName'));
    if (validFirstName && validLastName) {
      const data = {
        enrollment_step: 'first and last name',
        cta_clicked: 'submit',
        member_type: 'Seeker',
      };
      AnalyticsHelper.logEvent({
        name: 'Member Enrolled',
        data,
      });

      if (AmpliHelper.useAmpli(flags, typeOfCare)) {
        AmpliHelper.ampli.memberEnrolledFirstAndLastName({
          ...AmpliHelper.getCommonData(),
          cta_clicked: 'submit',
          member_type: 'seeker',
        });
      }

      router.push(SEEKER_ROUTES.ACCOUNT_CREATION_PASSWORD);
    }
  };

  const renderComponent = () => {
    if (isWaiting) {
      return <OverlaySpinner isOpen={isWaiting} wrapped />;
    }

    return (
      <FormikProvider value={formik}>
        {errorMessage && (
          <Box mb={3}>
            <Alert severity="error">{errorMessage}</Alert>
          </Box>
        )}
        {step === 'password' ? (
          <PasswordForm handleJoinNow={formik.submitForm} />
        ) : (
          <>
            {step === 'name' ? (
              <NameForm submitText="Next" onSubmit={handleNext} />
            ) : (
              <>
                {typeOfCare !== SENIOR_CARE_TYPE.IN_FACILITY && <CaregiversNearby zip={zipcode} />}
                <SeekerEmailPage
                  handleJoinNow={handleJoinNow}
                  headerText="Create a free account to see caregivers who match your needs."
                />
              </>
            )}
          </>
        )}
      </FormikProvider>
    );
  };

  return (
    <PageTransition>
      <div key={router.asPath?.split('?')[0]}>{renderComponent()}</div>
    </PageTransition>
  );
}
// this will disable outter pageTransition and run the one above
AccountCreation.usePageTransition = false;
AccountCreation.CheckAuthCookie = true;

export default AccountCreation;
