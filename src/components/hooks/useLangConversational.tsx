import { SEEKER_CHILD_CARE_ROUTES } from '@/constants';
import { DefaultCareKind } from '@/types/seekerCC';
import { ServiceType } from '@/__generated__/globalTypes';
import { Typography } from '@material-ui/core';
import { capitalize } from 'lodash-es';
import { useSeekerCCState, useSeekerState } from '../AppState';
import Header from '../Header';
import useProviderCount from './useProviderCount';

const useLangConversational = (pageUrl: string, variant: number) => {
  const { careKind, firstName } = useSeekerCCState();
  const { city, state } = useSeekerState();

  let headingElement;
  const caregiver = {
    careKind: 'caregiver',
    recap: 'caregivers',
  };

  if (careKind === DefaultCareKind.NANNIES_RECURRING_BABYSITTERS) {
    caregiver.careKind = 'nanny';
    caregiver.recap = 'nannies';
  } else if (careKind === DefaultCareKind.ONE_TIME_BABYSITTERS) {
    caregiver.careKind = 'sitter';
    caregiver.recap = 'babysitters';
  } else if (careKind === DefaultCareKind.DAY_CARE_CENTERS) {
    caregiver.careKind = 'daycare';
    caregiver.recap = 'daycares';
  }

  if (pageUrl === SEEKER_CHILD_CARE_ROUTES.CARE_LOCATION) {
    if (variant === 2) {
      headingElement = (
        <div>
          <span>Hi there, let&apos;s get started.</span>
          <br />
          <span>Where do you need care?</span>
        </div>
      );
    } else {
      headingElement = 'Where do you need care?';
    }
  }

  if (pageUrl === SEEKER_CHILD_CARE_ROUTES.CARE_DATE) {
    if (variant === 2 || variant === 4) {
      headingElement = (
        <div>
          <span>Great, we&apos;ve got you covered.&nbsp;</span>
          <br />
          <span>How soon do you need help?</span>
        </div>
      );
    } else {
      headingElement = 'When do you need care?';
    }
  }

  if (pageUrl === SEEKER_CHILD_CARE_ROUTES.CARE_KIND) {
    if (variant === 2) {
      headingElement = (
        <div>
          <span>Got it.&nbsp;</span>
          <br />
          <span>What kind of care do you need?</span>
        </div>
      );
    } else if (variant === 4) {
      headingElement = 'What kind of care do you need?';
    } else {
      headingElement = 'What kind of care?';
    }
  }

  if (pageUrl === SEEKER_CHILD_CARE_ROUTES.CARE_WHO) {
    if (variant === 2) {
      headingElement = (
        <div>
          <Header>Tell us about your kids.</Header>
          <Typography style={{ marginTop: '8px' }}>
            This helps you connect with a great {caregiver.careKind}.
          </Typography>
        </div>
      );
    } else {
      headingElement = <Header>Who needs care?</Header>;
    }
  }

  if (pageUrl === SEEKER_CHILD_CARE_ROUTES.RECAP) {
    if (variant === 2 || variant === 4) {
      headingElement = `We're searching for ${caregiver.recap} ${
        city ? `in ${city}` : 'nearby'
      } that fit your needs...`;
    } else {
      const hasCityAndState = city && state;
      const cityAndStateHeader = `${city}, ${state}`;
      const headerText = `Looking for ${
        careKind === DefaultCareKind.NANNIES_RECURRING_BABYSITTERS ? 'nannies' : 'one-time sitters'
      }`;
      headingElement = `${headerText} ${hasCityAndState ? `in ${cityAndStateHeader}` : ''}...`;
    }
  }

  if (pageUrl === SEEKER_CHILD_CARE_ROUTES.ACCOUNT_CREATION_EMAIL) {
    const { numOfProviders } = useProviderCount(ServiceType.CHILD_CARE);

    if ((variant === 2 || variant === 4) && numOfProviders >= 10) {
      headingElement = {
        heading: `Great news! There are ${numOfProviders} ${caregiver.recap} nearby.`,
        additionalText: 'Create a free account to see your matches.',
      };
    } else {
      headingElement = {
        heading: 'Create a free account',
        additionalText: 'See caregivers who match your needs. It only takes a few seconds.',
      };
    }
  }

  if (pageUrl === SEEKER_CHILD_CARE_ROUTES.ACCOUNT_CREATION_NAME) {
    if (variant === 2 || variant === 4) {
      headingElement = (
        <div>
          <span>Almost done.&nbsp;</span>
          <br />
          <span>What&apos;s your name?</span>
        </div>
      );
    } else {
      headingElement = 'Almost done, add a few details about yourself.';
    }
  }

  if (pageUrl === SEEKER_CHILD_CARE_ROUTES.ACCOUNT_PASSWORD) {
    if (variant === 2 || variant === 4) {
      headingElement = {
        heading: (
          <div>
            <span>Welcome</span>
            <span>{firstName ? `, ${capitalize(firstName)}` : ''}</span>
            <span>!</span>
            <br />
            <span>Set a password for next time.</span>
          </div>
        ),
        additionalText: 'If you don’t have time now, we’ll help you create a password later.',
      };
    } else {
      headingElement = {
        heading: 'Finish setting up your account',
        additionalText:
          'We created a temporary password, but you can set a new one now to save time.',
      };
    }
  }

  return headingElement;
};

export default useLangConversational;
