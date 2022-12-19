// External Dependencies
import { FormikProvider, useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { Box, makeStyles, Grid } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

// Custom Dependencies
import { Banner, Typography } from '@care/react-component-lib';

// Internal Dependencies
import NameForm from '@/components/features/accountCreation/NameForm';
import {
  FormValues,
  useAccountCreationFormConfig,
} from '@/components/features/accountCreation/accountCreationForm';
import SeekerEmailPasswordPage from '@/components/pages/seeker/account-creation/SeekerEmailPasswordPage';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import {
  useAppDispatch,
  useSeekerState,
  useFlowState,
  useAppState,
  useSeekerCCState,
} from '@/components/AppState';
import logger from '@/lib/clientLogger';
import AuthService from '@/lib/AuthService';
import {
  SKIP_AUTH_CONTEXT_KEY,
  SEEKER_CHILD_CARE_ROUTES,
  VERTICALS_NAMES,
  FLOWS,
  CARE_DATES,
} from '@/constants';
import { seekerCreate } from '@/__generated__/seekerCreate';
import {
  CareDate as GQLCareDate,
  SeekerCreateInput,
  ServiceType,
} from '@/__generated__/globalTypes';
import { SEEKER_CREATE } from '@/components/request/GQL';
import OverlaySpinner from '@/components/OverlaySpinner';
import useNearbyCaregivers from '@/components/hooks/useNearbyCaregivers';
import { handleAccountCreationValidationErrors } from '@/utilities/accountCreationValidationErrorHelper';

// Types
import { AppDispatch } from '@/types/app';
import { helpTypesToServices, SeekerState } from '@/types/seeker';
import { captureMessage, Severity } from '@sentry/nextjs';
import PageTransition from '@/components/PageTransition';

type AccountCreationVertical = {
  accountCreationStep1: string;
  accountCreationStep2: string;
  nextStep: string;
  serviceType: ServiceType;
};

// Styles
const useStyles = makeStyles((theme) => ({
  mainContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    marginTop: theme.spacing(4),
  },
  step1Container: {
    marginBottom: theme.spacing(28),
  },
  step2Container: {
    marginBottom: theme.spacing(48),
  },
  newLine: {
    display: 'block',
  },
}));

// Constants
const EVENT_NAME = 'Member Enrolled';
const ENROLLMENT_STEP = 'Email and Password';
const ENROLLMENT_FLOW = 'MW VHP';
const CTA_CLICKED = 'Join Now';
const MEMBER_TYPE = 'Seeker';
const ERROR_CREATING_ACCOUNT = 'An error occurred creating your account, please try again.';
const TRY_AGAIN = 'Try again';
const SUBMIT = 'Submit';
const CHILD_CARE_VERTICAL: AccountCreationVertical = {
  accountCreationStep1: SEEKER_CHILD_CARE_ROUTES.ACCOUNT_CREATION,
  accountCreationStep2: SEEKER_CHILD_CARE_ROUTES.ACCOUNT_CREATION_DETAILS,
  nextStep: SEEKER_CHILD_CARE_ROUTES.ACCOUNT_CREATION_CONFIRMATION,
  serviceType: ServiceType.CHILD_CARE,
};

/**
 * Handle failure case.
 *
 * @param state
 * @param dispatch
 */
function sendFailureEvent(state: SeekerState, dispatch: AppDispatch, severity = Severity.Error) {
  if (!state.initialAccountCreationFailed) {
    dispatch({ type: 'setInitialAccountCreationFailed', initialAccountCreationFailed: true });
    logger.info({ event: 'seekerAccountCreationFailedInitialAttempt' });
  }
  logger.error({ event: 'seekerAccountCreationFailed' });

  captureMessage('seekerAccountCreationFailed', severity);
}

export function careDateToGQLFormat(careDate: CARE_DATES): GQLCareDate {
  const careDates = {
    [CARE_DATES.RIGHT_NOW]: GQLCareDate.RIGHT_NOW,
    [CARE_DATES.WITHIN_A_WEEK]: GQLCareDate.WITHIN_A_WEEK,
    [CARE_DATES.IN_1_2_MONTHS]: GQLCareDate.WITHIN_A_MONTH,
    [CARE_DATES.JUST_BROWSING]: GQLCareDate.JUST_BROWSING,
  };

  return careDates[careDate];
}

/**
 * Account creation - Any Vertical
 */
function SeekerAccountCreation() {
  const classes = useStyles();
  const authService = AuthService();
  const dispatch = useAppDispatch();
  const { flowName } = useFlowState();
  const { flow: flowState } = useAppState();
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { helpTypes, typeOfCare, zipcode } = useSeekerState();
  const { careDate } = useSeekerCCState();
  const { displayCaregiverMessage, numCaregivers } = useNearbyCaregivers(
    zipcode,
    ServiceType.CHILD_CARE
  );
  const state = useSeekerState();
  const router = useRouter();
  const data = {
    enrollment_step: ENROLLMENT_STEP,
    enrollment_flow: ENROLLMENT_FLOW,
    cta_clicked: CTA_CLICKED,
    caregiver_count: numCaregivers,
    member_type: MEMBER_TYPE,
    vertical: '',
    screen_name: '',
    screen_template: '',
    final_step: false,
  };

  const [step = ''] = (router.query.param as string[]) || [];
  const isWaiting = sending;
  const submitText = errorMessage ? TRY_AGAIN : SUBMIT;
  let verticalValues: AccountCreationVertical = {
    accountCreationStep1: '',
    accountCreationStep2: '',
    nextStep: '',
    serviceType: ServiceType.CHILD_CARE,
  };

  const { enrollmentSource } = useSeekerCCState();
  if (flowName === FLOWS.SEEKER_CHILD_CARE.name) {
    verticalValues = CHILD_CARE_VERTICAL;
    data.vertical = VERTICALS_NAMES.CHILD_CARE;
    data.enrollment_flow = enrollmentSource;
  }

  // Handlers - View 1 - Sign Up (Username and Password)

  /**
   * Handle "Join now" button click.
   */
  const handleJoinNow = () => {
    // Log analytics data.
    AnalyticsHelper.logEvent({
      name: EVENT_NAME,
      data,
    });

    // Continue to next step in the account creation flow.
    router.push(verticalValues.accountCreationStep2);
  };

  /**
   * Handle error messages.
   *
   * Change them in the state just when there's a new error message.
   *
   * @param message {string} - Error message.
   */
  function handleError(message: string | null) {
    if (message !== errorMessage) {
      setErrorMessage(message || '');
    }
  }

  // Handlers - View 2 - Details (First Name and Last Name)

  /**
   * Handle successful account creation.
   *
   * Executed after "handleSubmission".
   *
   * @param response
   */
  async function handleAccountCreationSuccess(response: seekerCreate) {
    const { seekerCreate: res } = response;

    if (res.__typename === 'SeekerCreateError') {
      setSending(false);

      // Logs event when a seeker account creation fails having the error in a 200 OK response.
      sendFailureEvent(state, dispatch, Severity.Info);

      // Error handling.
      handleAccountCreationValidationErrors(res.errors, handleError);

      return;
    }

    dispatch({
      type: 'setSeekerParams',
      servicesNeeded: helpTypesToServices(helpTypes), // @TODO: New help types for Child Care?
      typeOfCare, // @TODO: Type of care for Child Care
      zip: zipcode,
    });

    dispatch({
      type: 'setMemberId',
      memberId: res.memberId,
    });
    AnalyticsHelper.setMemberId(res.memberId);

    // Logs event when a seeker account is successfully created.
    logger.info({ event: 'seekerAccountCreationSuccessful', memberId: res.memberId });

    // Build URL and redirect.
    const nextPage = router.basePath + verticalValues.nextStep;
    await authService.redirectLogin(nextPage, res.authToken);
  }

  /**
   * Handle failed account creation.
   *
   * Executed after "handleSubmission".
   */
  function handleAccountCreationError() {
    setSending(false);
    handleError(ERROR_CREATING_ACCOUNT);

    // Logs event when seeker account creation fails in GraphQL mutation.
    sendFailureEvent(state, dispatch, Severity.Error);
  }

  // GraphQL Queries and Mutations

  const [seekerAccountCreate] = useMutation<seekerCreate, { input: SeekerCreateInput }>(
    SEEKER_CREATE,
    {
      context: { [SKIP_AUTH_CONTEXT_KEY]: true },
      onCompleted: handleAccountCreationSuccess,
      onError: handleAccountCreationError,
    }
  );

  // Handlers - View 2 - Details (First Name and Last Name)

  /**
   * Handle form submission.
   *
   * First handler to be executed. This one triggers the execution of the GraphQL mutation.
   */
  function handleSubmission(values: FormValues) {
    // Log analytics data.
    data.enrollment_step = 'first and last name';
    data.final_step = true;
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data,
    });

    // Display loader and remove errors.
    setSending(true);
    setErrorMessage('');

    // Validate if 1st attempt to create account, or the user has been trying before.
    if (!state.initialAccountCreationAttempted) {
      dispatch({
        type: 'setInitialAccountCreationAttempted',
        initialAccountCreationAttempted: true,
      });
      logger.info({ event: 'seekerAccountCreationInitialAttempt' });
    }

    // Log event on each seeker account creation attempt.
    logger.info({ event: 'seekerAccountCreationAttempt' });

    // Trigger GraphQL mutation.
    seekerAccountCreate({
      variables: {
        input: {
          ...values,
          zipcode,
          careDate: careDateToGQLFormat(careDate),
          serviceType: verticalValues.serviceType,
          referrerCookie: flowState.referrerCookie,
          howDidYouHearAboutUs: values.howDidYouHearAboutUs || undefined,
        },
      },
    });
  }

  const formik = useFormik<FormValues>(
    useAccountCreationFormConfig({
      onSubmit: handleSubmission,
    })
  );

  // Redirect to first screen of the account creation flow if user has no password set.
  useEffect(() => {
    if (step === 'details' && !formik.values.password) {
      router.replace(verticalValues.accountCreationStep1);
    }
  }, [step]);

  // Display spinner if something is loading.
  if (isWaiting) {
    return <OverlaySpinner isOpen={isWaiting} wrapped />;
  }

  return (
    <PageTransition>
      <div key={router.asPath?.split('?')[0]}>
        <Grid container>
          <FormikProvider value={formik}>
            {step !== 'details' && displayCaregiverMessage && (
              <Box ml={1} mr={1}>
                <Banner type="information" width="100%" roundCorners>
                  <Typography variant="body2">
                    Nice! {numCaregivers} caregivers are near you!
                  </Typography>
                </Banner>
              </Box>
            )}
            {errorMessage && (
              <Box mb={3}>
                <Alert severity="error">{errorMessage}</Alert>
              </Box>
            )}
            <Grid
              container
              className={
                step === 'details'
                  ? `${classes.mainContainer} ${classes.step2Container}`
                  : `${classes.mainContainer} ${classes.step1Container}`
              }>
              {step === 'details' ? (
                <NameForm submitText={submitText} onSubmit={formik.submitForm} />
              ) : (
                <SeekerEmailPasswordPage
                  handleJoinNow={handleJoinNow}
                  headerText="Create a free account"
                  subHeaderText={
                    <>
                      <span>See caregivers who match your needs.</span>
                      <span className={classes.newLine}>It only takes a few seconds.</span>
                    </>
                  }
                />
              )}
            </Grid>
          </FormikProvider>
        </Grid>
      </div>
    </PageTransition>
  );
}

SeekerAccountCreation.usePageTransition = false;

export default SeekerAccountCreation;
