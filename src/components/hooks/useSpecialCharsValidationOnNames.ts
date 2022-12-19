import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import { CLIENT_FEATURE_FLAGS } from '@/constants';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { useState } from 'react';

export const useSpecialCharsValidationOnNames = () => {
  const [errorEventFired, setErrorEventFired] = useState<boolean>(false);
  const featureFlags = useFeatureFlags();

  const specialCharsInNameFlag =
    featureFlags.flags[CLIENT_FEATURE_FLAGS.SEEKER_NAME_SPECIAL_CHARS_VALIDATION];
  const validateSpecialChars = specialCharsInNameFlag?.variationIndex === 2;

  const fireDedupedNameValidationEvent = () => {
    if (!errorEventFired) {
      AnalyticsHelper.logEvent({
        name: 'Error Viewed',
        data: {
          enrollment_step: 'First and Last Name',
          error_type: 'Form Validation Error',
          error: 'No special characters or numbers allowed. Please try again.',
        },
      });
    }
    setErrorEventFired(true);
  };

  const fireAmplitudeEventOnError = ({
    firstNameError,
    lastNameError,
  }: {
    firstNameError?: string;
    lastNameError?: string;
  }) => {
    const hasSpecialCharsErrorsOnFirstName =
      firstNameError && firstNameError.includes('Special characters or numbers are not allowed');
    const hasSpecialCharsErrorsOnLastName =
      lastNameError && lastNameError.includes('Special characters or numbers are not allowed');
    if (hasSpecialCharsErrorsOnFirstName || hasSpecialCharsErrorsOnLastName) {
      fireDedupedNameValidationEvent();
    }
  };

  return {
    validateSpecialChars,
    fireAmplitudeEventOnError,
    fireDedupedNameValidationEvent,
  };
};
