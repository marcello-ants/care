/* eslint-disable import/prefer-default-export */
// External Dependencies
import { useState } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import getConfig from 'next/config';
import { ApolloError, useMutation } from '@apollo/client';

// External Constants
import { SKIP_AUTH_CONTEXT_KEY } from '@/constants';

// GraphQL
import { providerCreate, providerCreateVariables } from '@/__generated__/providerCreate';
import { HOW_DID_YOU_HEAR_ABOUT_US, ServiceType } from '@/__generated__/globalTypes';
import { PROVIDER_CREATE } from '@/components/request/GQL';

// Internal Dependencies
import AuthService from '@/lib/AuthService';
import logger from '@/lib/clientLogger';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { DROPOFF_URLS } from '../constants';

// Interfaces + Types
interface IProviderEnrollmentFormValues {
  providerService: string | string[];
  providerZip: string;
  email: string;
  password: string;
  howDidYouHearAboutUs?: string;
}

// Constants
const {
  publicRuntimeConfig: { CZEN_GENERAL },
} = getConfig();

// Validation scheme
const providerEnrollmentIndividualFormSchema = yup.object({
  providerService: yup.string().required('Please select a job'),
  providerZip: yup.string().required('Please enter a zip code'),
});

function useProviderEnrollmentForm() {
  const authService = AuthService();

  // State
  const [vertical, setVertical] = useState<keyof typeof ServiceType>('CHILD_CARE');
  const [isSubmitError, setIsSubmitError] = useState(false);

  // Success + Error Handlers
  async function handleFormSuccess(response: providerCreate) {
    const res = response?.providerCreate;
    if (res?.__typename === 'ProviderCreateError') {
      logger.error({
        event: 'GQLFailure',
        key: `ProviderCreateError`,
        source: 'formHandler.tsx',
        tags: ['graphql', 'voyager', 'provider'],
      });
      setIsSubmitError(true);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      formik.setSubmitting(false);
      return;
    }

    logger.error({
      event: 'GQLSuccess',
      key: `ProviderCreateSuccess`,
      source: 'formHandler.tsx',
      tags: ['graphql', 'voyager', 'provider'],
    });

    setIsSubmitError(false);

    const nextPage = CZEN_GENERAL + DROPOFF_URLS[vertical];
    await authService.redirectLogin(nextPage, res.authToken);
  }

  function handleFormError(graphQLError: ApolloError) {
    logger.error({
      event: 'GQLFailure',
      key: `ProviderCreateFailure`,
      source: 'formHandler.tsx',
      gqlError: graphQLError,
      tags: ['graphql', 'voyager', 'provider'],
    });
    setIsSubmitError(true);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    formik.setSubmitting(false);
  }

  // Mutation Configuration
  const [providerCreateMutation] = useMutation<providerCreate, providerCreateVariables>(
    PROVIDER_CREATE,
    {
      context: { [SKIP_AUTH_CONTEXT_KEY]: true },
      onCompleted: handleFormSuccess,
      onError: handleFormError,
    }
  );

  // Submission Handler
  function handleFormSubmission(values: IProviderEnrollmentFormValues) {
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data: {
        member_type: 'Seeker',
        vertical: values.providerService,
        enrollment_flow: 'MW VHP Provider Enrollment',
        enrollment_step: 'provider_webform',
        final_step: 'No',
        zip: values.providerZip,
      },
    });

    setVertical(values.providerService as ServiceType);

    providerCreateMutation({
      variables: {
        input: {
          serviceType: Array.isArray(values.providerService)
            ? (values.providerService[0] as ServiceType)
            : (values.providerService as ServiceType),
          email: values.email,
          howDidYouHearAboutUs:
            (values.howDidYouHearAboutUs as HOW_DID_YOU_HEAR_ABOUT_US) || undefined,
          password: values.password,
          zipcode: values.providerZip,
        },
      },
    });
  }

  // Formik Configuration
  const formik = useFormik<IProviderEnrollmentFormValues>({
    initialValues: {
      providerService: '',
      email: '',
      password: '',
      providerZip: '',
    },
    validationSchema: providerEnrollmentIndividualFormSchema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: handleFormSubmission,
  });

  return {
    formik,
    isSubmitError,
  };
}

export { useProviderEnrollmentForm };
