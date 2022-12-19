import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import { FormikProvider, useFormik } from 'formik';
import { Box } from '@material-ui/core';
import { Banner } from '@care/react-component-lib';
import { LTCG_ROUTES, SKIP_AUTH_CONTEXT_KEY } from '@/constants';
import { useAppDispatch, useLtcgState } from '@/components/AppState';
import { useAccountCreationFormConfig } from '@/components/features/accountCreation/accountCreationForm';
import PageTransition from '@/components/PageTransition';
import FormPage from '@/components/features/multiPageForm/FormPage';
import OverlaySpinner from '@/components/OverlaySpinner';
import { ENROLL_SEEKER_FOR_ENTERPRISE_CLIENT } from '@/components/request/GQL';
import {
  enrollSeekerForEnterpriseClient,
  enrollSeekerForEnterpriseClientVariables,
} from '@/__generated__/enrollSeekerForEnterpriseClient';
import AuthService from '@/lib/AuthService';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

import { AccountFormValues, buildLTCGEnrollmentVariables } from './accountCreationHelpers';
import DetailsAboutYourselfForm from './details-about-yourself';
import ContactInfoForm from './contact-info';

const STEPS = [
  { route: LTCG_ROUTES.DETAILS_ABOUT_YOURSELF, component: DetailsAboutYourselfForm },
  { route: LTCG_ROUTES.CONTACT_INFO, component: ContactInfoForm },
];

function AccountCreation() {
  const router = useRouter();
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const state = useLtcgState();
  const stepNumber = STEPS.findIndex(({ route }) => router.route === route);
  // this useRef keeps track of the previous step number so we can continue to display
  // the form while transitioning to a page that's not one of the STEPS
  const prevStepNumber = useRef<number>(stepNumber);
  useEffect(() => {
    if (stepNumber !== -1) {
      prevStepNumber.current = stepNumber;
    }
  }, [stepNumber]);
  const isSubmitStep = stepNumber === STEPS.length - 1;

  const [enrollSeeker] = useMutation<
    enrollSeekerForEnterpriseClient,
    enrollSeekerForEnterpriseClientVariables
  >(ENROLL_SEEKER_FOR_ENTERPRISE_CLIENT, {
    context: { [SKIP_AUTH_CONTEXT_KEY]: true },
    onCompleted: async (response) => {
      const { enrollSeekerForEnterpriseClient: res } = response;
      if (res.__typename === 'EnterpriseEnrollmentProcessFailure') {
        let responseErrorMessages: string[] = [];
        res.errors.forEach((error) => {
          responseErrorMessages = responseErrorMessages.concat(error.errorMessages);
        });
        setErrorMessages(responseErrorMessages);

        return;
      }

      dispatch({
        type: 'setMemberId',
        memberId: res.memberId,
      });
      AnalyticsHelper.setMemberId(res.memberId);

      await AuthService().redirectLogin(
        `${router.basePath}${LTCG_ROUTES.SUCCESS}`,
        res.authToken,
        res.oneTimeToken
      );
    },
    onError: () => {
      setErrorMessages(['An error occurred creating your account, please try again.']);
    },
  });

  const formik = useFormik<AccountFormValues>(
    useAccountCreationFormConfig<AccountFormValues>({
      initialValues: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        howDidYouHearAboutUs: '',
        isPasswordSinglePage: true,
        dateOfBirth: '',
        address: '',
        phoneNumber: '',
        zip: '',
      },

      onSubmit: (values) => {
        if (errorMessages.length > 0) {
          setErrorMessages([]);
        }
        if (isSubmitStep) {
          dispatch({
            type: 'setLtcgHomePayProspect',
            homePayProspect: {
              firstName: values.firstName,
              lastName: values.lastName,
              phoneNumber: values.phoneNumber,
              email: values.email,
              address: values.address,
            },
          });
          // eslint-disable-next-line no-console
          enrollSeeker({
            variables: buildLTCGEnrollmentVariables(values, state),
          })
            .then(({ data }) => {
              if (
                data?.enrollSeekerForEnterpriseClient.__typename !==
                'EnterpriseEmployeeEnrollmentSuccess'
              ) {
                formik.setSubmitting(false);
              }
            })
            .catch(() => {
              formik.setSubmitting(false);
            });
        } else {
          formik.setSubmitting(false);
          // reset the touched fields as formik marks all fields touched when submitting
          formik.setTouched({});
          router.push(STEPS[stepNumber + 1].route);
        }
      },
      validateOnBlur: true,
    })
  );

  const FormFields = STEPS[stepNumber > -1 ? stepNumber : prevStepNumber.current].component;

  if (formik.isSubmitting) {
    return <OverlaySpinner isOpen wrapped />;
  }

  return (
    <FormikProvider value={formik}>
      <PageTransition>
        <div key={router.route}>
          {errorMessages.length > 0 && (
            <Box mb={3}>
              <Banner type="warning" fullWidth>
                {errorMessages.map((errorMsg) => (
                  <div key={errorMsg}>{errorMsg}</div>
                ))}
              </Banner>
            </Box>
          )}
          <FormPage>
            <FormFields />
          </FormPage>
        </div>
      </PageTransition>
    </FormikProvider>
  );
}

AccountCreation.usePageTransition = false;
AccountCreation.transitionKey = 'ltcgAccountCreation';

export default AccountCreation;
