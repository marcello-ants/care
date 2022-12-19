import { useCallback, useState } from 'react';
import { useFormik } from 'formik';
import { useFlowState, useSeekerState } from '@/components/AppState';
import {
  AccountCreationNameFormProps,
  FormNameValues,
  SeekerVerticalState,
} from '@/components/pages/seeker/three-step-account-creation/interfaces';
import { CareKind } from '@/types/seekerCC';
import { useSeekerAccountCreation } from '@/components/hooks/useSeekerAccountCreation';
import { useIsEligibleAndTestVariantForNameBeforeEmail } from '@/components/hooks/useNameBeforeEmail';
import { validationSchema } from '../constants';

export default function useNameForm({
  verticalState,
  vertical,
  nextPageURL,
}: AccountCreationNameFormProps) {
  const seekerState = useSeekerState();
  const { referrerCookie } = useFlowState();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    firstName,
    lastName,
    email = '',
    careKind,
    careDate,
  } = verticalState as SeekerVerticalState & {
    email?: string;
    careKind?: CareKind;
  };

  const isEligibleAndTestVariantForNameBeforeEmail =
    useIsEligibleAndTestVariantForNameBeforeEmail();

  const setFormikSubmittingFalse = () => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    formik.setSubmitting(false);
  };

  const { executeSeekerAccountCreate } = useSeekerAccountCreation({
    vertical,
    nextPageURL,
    setFormikSubmittingFalse,
    setErrorMessage,
  });

  const handleSubmission = useCallback(
    (values: FormNameValues) => {
      const skipAccountCreation = isEligibleAndTestVariantForNameBeforeEmail;
      executeSeekerAccountCreate(
        values,
        seekerState.zipcode,
        careDate,
        referrerCookie,
        careKind,
        skipAccountCreation
      );
    },
    [verticalState]
  );

  const formik = useFormik<FormNameValues>({
    initialValues: {
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      howDidYouHearAboutUs: '',
    },
    validationSchema,
    onSubmit: handleSubmission,
  });

  return {
    formik,
    errorMessage,
  };
}
