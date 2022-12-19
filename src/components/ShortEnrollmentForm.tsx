import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { FormikProvider, useFormik, useFormikContext } from 'formik';
import { Box, Button, Grid, makeStyles, Typography } from '@material-ui/core';
import { Banner } from '@care/react-component-lib';
import getConfig from 'next/config';
import { useMutation } from '@apollo/client';
import { seekerCreate } from '@/__generated__/seekerCreate';
import { SeekerCreateInput } from '@/__generated__/globalTypes';
import { Location } from '@/types/common';
import {
  ERROR_CREATING_ACCOUNT,
  validationSchema,
} from '@/components/pages/seeker/three-step-account-creation/constants';
import {
  validateFirstName,
  validateLastName,
} from '@/components/features/accountCreation/accountCreationForm';
import EmailField from '@/components/features/accountCreation/EmailField';
import useLoginRedirect from '@/components/pages/seeker/three-step-account-creation/hooks/useLoginRedirect';
import { SKIP_AUTH_CONTEXT_KEY, VerticalsAbbreviation, VERTICALS_SELECT_LABELS } from '@/constants';
import { handleAccountCreationValidationErrors } from '@/utilities/accountCreationValidationErrorHelper';
import { getSeekerAccountCreatePayload } from '@/utilities/getSeekerAccountCreatePayload';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { logger } from '@sentry/utils';
import ZipInput from '@/components/ZipInput';
import { SeekerVerticalType } from '@/types/seeker';
import { useAppDispatch, useSeekerState } from './AppState';
import CareVerticalSelect, { VerticalsType } from './CareVerticalSelect';
import FormikInlineTextField from './blocks/FormikInlineTextField';
import { HearAboutUsField } from './HearAboutUs';
import { SEEKER_CREATE } from './request/GQL';
import { sendFailureEvent } from './hooks/useSeekerAccountCreation';

interface FormProps {
  setZipError: Dispatch<SetStateAction<boolean>>;
  setShouldGoNext: Dispatch<SetStateAction<boolean>>;
  setValidateZipOnClick: Dispatch<SetStateAction<boolean>>;
  validateZipOnClick: boolean;
  errorMessage: string | null;
}
interface FormValues {
  vertical: VerticalsAbbreviation | undefined;
  firstName: string;
  lastName: string;
  email: string;
  howDidYouHearAboutUs: string;
}

const {
  publicRuntimeConfig: { CZEN_GENERAL_LOGIN },
} = getConfig();

const useStyles = makeStyles(() => ({
  inlineTextFieldOverride: {
    paddingBottom: 0,
  },
  zipInput: {
    '& > div': {
      padding: '0 8px',
    },
  },
}));

const Form = ({
  setZipError,
  setShouldGoNext,
  setValidateZipOnClick,
  validateZipOnClick,
  errorMessage,
}: FormProps) => {
  const dispatch = useAppDispatch();
  const { zipcode, city, state, vertical: seekerVertical } = useSeekerState();
  const {
    values: { vertical: verticalInput },
  } = useFormikContext();

  const classes = useStyles();
  const handleZipError = (e: boolean) => {
    setZipError(e);
  };

  const onZipInputChange = (location: Location) => {
    dispatch({ type: 'setZipcode', zipcode: location.zipcode });
    dispatch({
      type: 'setCityAndState',
      city: location.city,
      state: location.state,
    });
  };

  useEffect(() => {
    dispatch({
      type: 'setVertical',
      vertical: null,
    });
  }, []);

  useEffect(() => {
    if (verticalInput && seekerVertical !== verticalInput) {
      const vertical = VERTICALS_SELECT_LABELS[verticalInput as keyof VerticalsType].replace(
        /\s/g,
        ''
      ) as SeekerVerticalType;

      dispatch({
        type: 'setVertical',
        vertical: vertical!,
      });
    }
  }, [verticalInput]);

  const handleSubmitClick = () => {
    AnalyticsHelper.logEvent({
      name: 'CTA Interacted',
      data: {
        vertical: seekerVertical,
        cta_clicked: 'Join free now',
        enrollment_flow: 'SingleEnrollment',
        job_flow: 'SingleEnrollment',
        memberType: 'seeker',
      },
    });

    setShouldGoNext(true);
  };

  return (
    <Grid container spacing={0}>
      {errorMessage && (
        <Box mb={3}>
          <Banner type="warning" width="100%" roundCorners>
            <Typography variant="body2">{errorMessage}</Typography>
          </Banner>
        </Box>
      )}
      <Grid item xs={12}>
        <CareVerticalSelect name="vertical" />
      </Grid>
      <Grid container>
        <Grid item xs={6}>
          <FormikInlineTextField
            id="firstName"
            name="firstName"
            label="First name"
            validate={validateFirstName}
            hiddenLabel
            classes={{ root: classes.inlineTextFieldOverride }}
          />
        </Grid>
        <Grid item xs={6}>
          <FormikInlineTextField
            id="lastName"
            name="lastName"
            label="Last name"
            validate={validateLastName}
            hiddenLabel
            classes={{ root: classes.inlineTextFieldOverride }}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <EmailField
          id="email"
          name="email"
          label="Email address"
          czenGeneralLoginUrl={CZEN_GENERAL_LOGIN}
          showErrorWhenTouched
          classes={{ root: classes.inlineTextFieldOverride }}
        />
      </Grid>
      <Grid item xs={12}>
        <ZipInput
          className={classes.zipInput}
          location={{ zipcode, city, state }}
          onError={handleZipError}
          onChange={onZipInputChange}
          validateOnLostFocusOrClick
          validateOnClick={validateZipOnClick}
          setValidateOnClick={setValidateZipOnClick}
          setShouldGoNext={setShouldGoNext}
          showLocationIcon={false}
        />
      </Grid>
      <Grid item xs={12}>
        <Box pt={0.5}>
          <HearAboutUsField name="howDidYouHearAboutUs" withLabelText={false} />
        </Box>
      </Grid>
      <Grid container justifyContent="center">
        <Grid item xs={8}>
          <Box mt={1}>
            <Button
              color="primary"
              variant="contained"
              size="large"
              fullWidth
              onClick={() => handleSubmitClick()}
              tabIndex={0}>
              {errorMessage ? 'Try Again' : 'Join free now'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

const ShortEnrollmentForm = ({ nextPageURL }: { nextPageURL: string }) => {
  const dispatch = useAppDispatch();
  const { zipcode, vertical: seekerVertical } = useSeekerState();
  const [zipError, setZipError] = useState(false);
  const [validateZipOnClick, setValidateZipOnClick] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shouldGoNext, setShouldGoNext] = useState(false);
  const seekerState = useSeekerState();
  const redirectToLogin = useLoginRedirect({ nextPageURL });

  useEffect(() => {
    if (!shouldGoNext) {
      return;
    }

    setValidateZipOnClick(true);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    formik.submitForm();
    setShouldGoNext(false);
  }, [shouldGoNext]);

  const setFormikSubmittingFalse = () => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    formik.setSubmitting(false);
  };

  const handleAccountCreationError = useCallback(() => {
    setErrorMessage(ERROR_CREATING_ACCOUNT);
    sendFailureEvent(seekerState, dispatch);

    setFormikSubmittingFalse();
  }, [seekerState]);

  const handleAccountCreationSuccess = useCallback(
    async (response: seekerCreate) => {
      const { seekerCreate: res } = response;

      if (res.__typename === 'SeekerCreateError') {
        sendFailureEvent(seekerState, dispatch);
        handleAccountCreationValidationErrors(res.errors, setErrorMessage);

        setFormikSubmittingFalse();
        return;
      }

      dispatch({ type: 'setMemberId', memberId: res.memberId });

      AnalyticsHelper.setMemberId(res.memberId);
      logger.info({ event: 'seekerAccountCreationSuccessful', memberId: res.memberId });
      AnalyticsHelper.logEvent({
        name: 'Member Enrolled',
        data: {
          vertical: seekerVertical,
          final_step: true,
          enrollment_step: 'SingleEnrollment',
          cta_clicked: 'Join free now',
          enrollment_flow: 'SingleEnrollment',
          memberType: 'seeker',
        },
      });

      await redirectToLogin(res.authToken);
    },
    [seekerState]
  );

  const [seekerAccountCreate] = useMutation<seekerCreate, { input: SeekerCreateInput }>(
    SEEKER_CREATE,
    {
      context: { [SKIP_AUTH_CONTEXT_KEY]: true },
      onCompleted: handleAccountCreationSuccess,
      onError: handleAccountCreationError,
    }
  );

  const handleSubmit = (values: FormValues) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (!formik.isValid || zipError) {
      return;
    }

    const { vertical, firstName, lastName, email, howDidYouHearAboutUs } = values;
    dispatch({
      type: 'setSeekerInfo',
      firstName: firstName ?? '',
      lastName: lastName ?? '',
      email: email ?? '',
      phone: '',
    });
    seekerAccountCreate(
      getSeekerAccountCreatePayload({
        zipcode,
        vertical: vertical as VerticalsAbbreviation, // need to cast type here as its intially undefined
        firstName,
        lastName,
        email,
        howDidYouHearAboutUs,
      })
    );
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      vertical: undefined,
      firstName: '',
      lastName: '',
      email: '',
      howDidYouHearAboutUs: '',
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <FormikProvider value={formik}>
      <Form
        setZipError={setZipError}
        validateZipOnClick={validateZipOnClick}
        setValidateZipOnClick={setValidateZipOnClick}
        errorMessage={errorMessage}
        setShouldGoNext={setShouldGoNext}
      />
    </FormikProvider>
  );
};

export default ShortEnrollmentForm;
