import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FormikProvider, useFormik } from 'formik';
import { omit } from 'lodash-es';

import { Box } from '@material-ui/core';
import { Banner } from '@care/react-component-lib';

import { SENIOR_CARE_TYPE, ServiceType } from '@/__generated__/globalTypes';
import AuthService from '@/lib/AuthService';
import { SEEKER_IN_FACILITY_ROUTES, CLIENT_FEATURE_FLAGS } from '@/constants';
import { useAppDispatch, useAppState, useSeekerState } from '@/components/AppState';
import {
  FormValues,
  useAccountCreationFormConfig,
} from '@/components/features/accountCreation/accountCreationForm';
import OverlaySpinner from '@/components/OverlaySpinner';
import SeekerEmailPage from '@/components/pages/seeker/account-creation/SeekerEmailPage-test.b';
import useSCSeekerCreate from '@/components/pages/seeker/sc/account-creation/useSCSeekerCreate';
import PageTransition from '@/components/PageTransition';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';

import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { TealiumData, TealiumUtagService } from '@/utilities/utagHelper';
import { hash256 } from '@/utilities/account-creation-utils';
import { SeniorLivingOptions } from '@/types/seeker';

import useInFacilityAccountCreation from './useInFacilityAccountCreation';
import DetailsPage from './details';
import PasswordPage from './password';

interface AccountFormValues extends FormValues {
  phoneNumber: string;
}

function AccountCreation() {
  const router = useRouter();
  const { seeker: seekerState, flow: flowState } = useAppState();
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState('');
  const [step = ''] = (router.query.param as string[]) || [];
  const authService = AuthService();
  const { redirectRoute, headerText, isUnhappyPath } = useInFacilityAccountCreation();
  const { typeOfCare } = useSeekerState();

  // Feature Flags
  const featureFlags = useFeatureFlags();
  const recommendationOptimizationVariation =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION];
  const isRecommendationOptimizationVariation =
    recommendationOptimizationVariation?.variationIndex === 1;

  function handleErrorMsg(message: string | null) {
    setErrorMessage(message || '');
  }

  const seekerCreate = useSCSeekerCreate({
    dispatch,
    seekerState,
    handleErrorMsg,
  });

  const formik = useFormik<AccountFormValues>(
    useAccountCreationFormConfig<AccountFormValues>({
      initialValues: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        howDidYouHearAboutUs: '',
        isPasswordSinglePage: true,
      },
      onSubmit: (values) => {
        AnalyticsHelper.logEvent({
          name: 'Member Enrolled',
          data: {
            enrollment_step: 'password page',
            cta_clicked: 'submit',
            member_type: 'Seeker',
          },
        });

        const { firstName, lastName, email, phoneNumber } = values;
        dispatch({ type: 'setSeekerInfo', firstName, lastName, email, phone: phoneNumber });

        setErrorMessage('');
        seekerCreate({
          variables: {
            input: {
              // phoneNumber is not an input field. Neither isPasswordSinglePage
              ...omit(values, 'phoneNumber', 'isPasswordSinglePage'),
              zipcode: seekerState.zipcode,
              referrerCookie: flowState.referrerCookie,
              careType: SENIOR_CARE_TYPE.IN_FACILITY,
              howDidYouHearAboutUs: values.howDidYouHearAboutUs || undefined,
            },
          },
        })
          .then(async ({ data }) => {
            if (data?.seniorCareSeekerCreate.__typename === 'SeniorCareSeekerCreateSuccess') {
              hash256(email).then((hash) => {
                const emailSHA256 = hash;

                const tealiumDataView: TealiumData = {
                  email,
                  emailSHA256,
                  slots: ['/us-subscription/conversion/seeker/basic/signup/'],
                  sessionId: flowState.czenJSessionId,
                  memberType: 'seeker',
                  overallStatus: 'basic',
                  serviceId: ServiceType.SENIOR_CARE,
                  subServiceId: typeOfCare,
                };

                if (flowState.memberId) {
                  tealiumDataView.memberId = flowState.memberId;
                }

                TealiumUtagService.view(tealiumDataView);
              });

              await authService.redirectLogin(
                `${router.basePath}${redirectRoute}`,
                data.seniorCareSeekerCreate.authToken,
                data.seniorCareSeekerCreate.oneTimeToken
              );
            } else {
              formik.setSubmitting(false);
            }
          })
          .catch(() => {
            formik.setSubmitting(false);
          });
      },
    })
  );

  useEffect(() => {
    if (
      (step === 'details' && !formik.values.email) ||
      (step === 'password' && !formik.values.lastName)
    ) {
      router.replace(SEEKER_IN_FACILITY_ROUTES.ACCOUNT_CREATION);
    }
  }, [step]);

  const handleNext = async () => {
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data: {
        enrollment_step: 'first and last name',
        cta_clicked: 'next',
        member_type: 'Seeker',
      },
    });
    setErrorMessage('');
    router.push(SEEKER_IN_FACILITY_ROUTES.ACCOUNT_CREATION_PASSWORD);
  };

  const handleJoinNow = async () => {
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data: {
        enrollment_step: 'Email and Password',
        cta_clicked: 'Continue',
        member_type: 'Seeker',
      },
    });
    router.push(SEEKER_IN_FACILITY_ROUTES.ACCOUNT_CREATION_DETAILS);
  };

  if (formik.isSubmitting) {
    return <OverlaySpinner isOpen wrapped />;
  }

  const inputHeaderText = isUnhappyPath
    ? 'It only takes a few seconds.'
    : 'Create a free account to continue.';

  const subHeaderText =
    isRecommendationOptimizationVariation &&
    seekerState.recommendedHelpType === SeniorLivingOptions.NURSING_HOME
      ? 'It’s free and fast.'
      : 'Create an account to get more information about their pricing and other details.';

  const displayPage = () => {
    switch (step) {
      case 'password':
        return <PasswordPage />;
      case 'details':
        return <DetailsPage onNext={handleNext} />;
      default:
        return (
          <SeekerEmailPage
            handleJoinNow={handleJoinNow}
            headerText={headerText}
            inputHeaderText={inputHeaderText}
            showSubHeader={
              isRecommendationOptimizationVariation &&
              (!isUnhappyPath ||
                seekerState.recommendedHelpType === SeniorLivingOptions.NURSING_HOME)
            }
            subHeaderText={subHeaderText}
          />
        );
    }
  };

  return (
    <PageTransition>
      <div key={router.asPath?.split('?')[0]}>
        <FormikProvider value={formik}>
          {errorMessage && (
            <Box mb={3}>
              <Banner type="warning">{errorMessage}</Banner>
            </Box>
          )}
          {displayPage()}
        </FormikProvider>
      </div>
    </PageTransition>
  );
}

AccountCreation.usePageTransition = false;

export default AccountCreation;
