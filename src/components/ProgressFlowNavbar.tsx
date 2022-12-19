import { makeStyles } from '@material-ui/core';
import { ProgressFlow } from '@care/react-component-lib';
import clsx from 'clsx';
import { theme } from '@care/material-ui-theme';
import useFlowHelper from '@/components/hooks/useFlowHelper';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import { CLIENT_FEATURE_FLAGS, FLOWS } from '@/constants';
import { useSeekerCCState } from './AppState';

const useStyles = makeStyles(() => ({
  wrapper: {
    '& .progress-flow-status': {
      borderBottom: 0,
    },
  },
  bottomBorder: {
    borderBottom: `1px solid ${theme.palette.care?.grey[300]}`,
  },
}));

const ProgressFlowNavbar = () => {
  const classes = useStyles();
  const featureFlags = useFeatureFlags();
  const {
    stepNumber,
    totalSteps,
    currentFlow,
    hideStepNumber,
    hideProgressIndicator,
    showBottomBorder,
  } = useFlowHelper();
  const { isHomeAddress } = useSeekerCCState().instantBook;

  const providerCCFreeGatedExperience =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.PROVIDER_CC_FREE_GATED_EXPERIENCE]?.value;
  const isProviderCCAccountCreationFlow = currentFlow === 'PROVIDER_CC_ACCOUNT_CREATION';
  const isFreeGatedProviderCCAccountCreationFlow =
    providerCCFreeGatedExperience && isProviderCCAccountCreationFlow;

  let label = '';
  let hideSteps = hideStepNumber || !currentFlow;

  // on childcare freeGated flow, we should hide 1 step of account creation
  let currentStep =
    isFreeGatedProviderCCAccountCreationFlow && stepNumber !== 1 ? stepNumber - 1 : stepNumber;
  let totalStepsNumber = isFreeGatedProviderCCAccountCreationFlow ? totalSteps - 1 : totalSteps;
  if (
    currentFlow === FLOWS.SEEKER_INSTANT_BOOK.name ||
    currentFlow === FLOWS.SEEKER_INSTANT_BOOK_SHORT.name
  ) {
    totalStepsNumber = isHomeAddress ? totalSteps + 3 : totalSteps + 4;
  }

  if (currentFlow === 'PROVIDER_CC_INFORMATIONAL_STEPS') {
    hideSteps = true;
    currentStep = 0;

    if (stepNumber === 1) {
      label = 'Great start!';
    } else if (stepNumber === 2) {
      label = 'Nice!';
    }
  } else if (currentFlow === 'PROVIDER_CC_PROFILE_DETAILS') {
    label = 'Build your profile';
  } else if (isProviderCCAccountCreationFlow) {
    label = 'Create your account';
  }

  return (
    <div className={clsx(classes.wrapper, showBottomBorder && classes.bottomBorder)}>
      <ProgressFlow
        step={currentStep}
        total={totalStepsNumber}
        label={label}
        hideSteps={hideSteps}
        hideProgress={hideProgressIndicator}
        showLogoMobile
      />
    </div>
  );
};

ProgressFlowNavbar.defaultProps = {
  currentFlow: '',
};

export default ProgressFlowNavbar;
