import React from 'react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, fireEvent, waitFor, act, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { AppStateProvider } from '@/components/AppState';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '@care/material-ui-theme';
import { initialAppState } from '@/state';
import { cloneDeep } from 'lodash-es';
import { FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import Preferences from '@/components/pages/provider/cc/PreferencesPage';
import {
  GET_CAREGIVER_ENROLLMENT_STATUS,
  CAREGIVER_ATTRIBUTES_UPDATE,
} from '@/components/request/GQL';
import {
  CLIENT_FEATURE_FLAGS,
  CZEN_BACKGROUND_CHECK_CC,
  PROVIDER_CHILD_CARE_ROUTES,
} from '@/constants';

const initialStateClone = cloneDeep(initialAppState);

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

initialStateClone.flow = {
  ...initialAppState.flow,
  userHasAccount: true,
};

const featureFlagsMockTrue = {
  [CLIENT_FEATURE_FLAGS.PROVIDER_CC_FREE_GATED_EXPERIENCE]: {
    value: true,
    reason: {
      kind: 'FALLTHROUGH',
    },
  },
};

const caregiverMock = {
  request: {
    query: CAREGIVER_ATTRIBUTES_UPDATE,
    variables: {
      input: {
        childcare: {
          ageGroups: 'EARLY_SCHOOL',
          careForSickChild: true,
          numberOfChildren: 1,
        },
        serviceType: 'CHILD_CARE',
      },
    },
  },
  result: {
    data: {
      caregiverAttributesUpdate: {
        __typename: 'CaregiverAttributesUpdateSuccess',
        dummy: 'Success',
      },
    },
  },
};

const completenessIncomplete = {
  request: {
    query: GET_CAREGIVER_ENROLLMENT_STATUS,
    variables: {
      serviceType: 'CHILD_CARE',
    },
  },
  result: {
    data: {
      getCaregiverProfileCompleteness: {
        __typename: 'CaregiverProfileCompletenessStatus',
        additionalInfo: false,
        availability: false,
        bio: false,
        education: false,
        jobInterest: false,
        languages: false,
        overallStatus: 'INCOMPLETE',
        photo: false,
        qualities: false,
        services: false,
        subscriptionPlanViewed: false,
        freeGated: null,
        firstName: null,
        lastName: null,
      },
    },
  },
};

const completenessJobInterestComplete = {
  request: {
    query: GET_CAREGIVER_ENROLLMENT_STATUS,
    variables: {
      serviceType: 'CHILD_CARE',
    },
  },
  result: {
    data: {
      getCaregiverProfileCompleteness: {
        __typename: 'CaregiverProfileCompletenessStatus',
        additionalInfo: false,
        availability: false,
        bio: false,
        education: false,
        jobInterest: true,
        languages: false,
        overallStatus: 'INCOMPLETE',
        photo: false,
        qualities: false,
        services: false,
        subscriptionPlanViewed: false,
        freeGated: null,
        firstName: null,
        lastName: null,
      },
    },
  },
};

const completenessAvailabilityComplete = {
  request: {
    query: GET_CAREGIVER_ENROLLMENT_STATUS,
    variables: {
      serviceType: 'CHILD_CARE',
    },
  },
  result: {
    data: {
      getCaregiverProfileCompleteness: {
        __typename: 'CaregiverProfileCompletenessStatus',
        additionalInfo: false,
        availability: true,
        bio: false,
        education: false,
        jobInterest: true,
        languages: false,
        overallStatus: 'INCOMPLETE',
        photo: false,
        qualities: false,
        services: false,
        subscriptionPlanViewed: false,
        freeGated: null,
        firstName: null,
        lastName: null,
      },
    },
  },
};

const completenessProfileComplete = {
  request: {
    query: GET_CAREGIVER_ENROLLMENT_STATUS,
    variables: {
      serviceType: 'CHILD_CARE',
    },
  },
  result: {
    data: {
      getCaregiverProfileCompleteness: {
        __typename: 'CaregiverProfileCompletenessStatus',
        additionalInfo: false,
        availability: true,
        bio: false,
        education: false,
        jobInterest: true,
        languages: true,
        overallStatus: 'INCOMPLETE',
        photo: false,
        qualities: false,
        services: false,
        subscriptionPlanViewed: false,
        freeGated: null,
        firstName: null,
        lastName: null,
      },
    },
  },
};

const completenessBioComplete = {
  request: {
    query: GET_CAREGIVER_ENROLLMENT_STATUS,
    variables: {
      serviceType: 'CHILD_CARE',
    },
  },
  result: {
    data: {
      getCaregiverProfileCompleteness: {
        __typename: 'CaregiverProfileCompletenessStatus',
        additionalInfo: false,
        availability: true,
        bio: true,
        education: false,
        jobInterest: true,
        languages: true,
        overallStatus: 'INCOMPLETE',
        photo: false,
        qualities: false,
        services: false,
        subscriptionPlanViewed: false,
        freeGated: null,
        firstName: null,
        lastName: null,
      },
    },
  },
};

const completenessPhotoComplete = {
  request: {
    query: GET_CAREGIVER_ENROLLMENT_STATUS,
    variables: {
      serviceType: 'CHILD_CARE',
    },
  },
  result: {
    data: {
      getCaregiverProfileCompleteness: {
        __typename: 'CaregiverProfileCompletenessStatus',
        additionalInfo: false,
        availability: true,
        bio: true,
        education: false,
        jobInterest: true,
        languages: true,
        overallStatus: 'INCOMPLETE',
        photo: true,
        qualities: false,
        services: false,
        subscriptionPlanViewed: false,
        freeGated: null,
        firstName: null,
        lastName: null,
      },
    },
  },
};

const completenessFreeGatedHourlyRate = {
  request: {
    query: GET_CAREGIVER_ENROLLMENT_STATUS,
    variables: {
      serviceType: 'CHILD_CARE',
    },
  },
  result: {
    data: {
      getCaregiverProfileCompleteness: {
        __typename: 'CaregiverProfileCompletenessStatus',
        additionalInfo: false,
        availability: true,
        bio: true,
        education: false,
        jobInterest: true,
        languages: true,
        overallStatus: 'INCOMPLETE',
        photo: true,
        qualities: false,
        services: false,
        subscriptionPlanViewed: true,
        freeGated: {
          hourlyRate: false,
          appDownload: false,
          welcomeBack: false,
        },
        firstName: null,
        lastName: null,
      },
    },
  },
};

const completenessFreeGatedAppDownload = {
  request: {
    query: GET_CAREGIVER_ENROLLMENT_STATUS,
    variables: {
      serviceType: 'CHILD_CARE',
    },
  },
  result: {
    data: {
      getCaregiverProfileCompleteness: {
        __typename: 'CaregiverProfileCompletenessStatus',
        additionalInfo: false,
        availability: true,
        bio: true,
        education: false,
        jobInterest: true,
        languages: true,
        overallStatus: 'INCOMPLETE',
        photo: true,
        qualities: false,
        services: false,
        subscriptionPlanViewed: true,
        freeGated: {
          hourlyRate: true,
          appDownload: false,
          welcomeBack: false,
        },
        firstName: null,
        lastName: null,
      },
    },
  },
};

const completenessFreeGatedWelcomeBack = {
  request: {
    query: GET_CAREGIVER_ENROLLMENT_STATUS,
    variables: {
      serviceType: 'CHILD_CARE',
    },
  },
  result: {
    data: {
      getCaregiverProfileCompleteness: {
        __typename: 'CaregiverProfileCompletenessStatus',
        additionalInfo: false,
        availability: true,
        bio: true,
        education: false,
        jobInterest: true,
        languages: true,
        overallStatus: 'INCOMPLETE',
        photo: true,
        qualities: false,
        services: false,
        subscriptionPlanViewed: true,
        freeGated: {
          hourlyRate: true,
          appDownload: true,
          welcomeBack: false,
        },
        firstName: null,
        lastName: null,
      },
    },
  },
};

const completenessSubscriptionPlanViewedComplete = {
  request: {
    query: GET_CAREGIVER_ENROLLMENT_STATUS,
    variables: {
      serviceType: 'CHILD_CARE',
    },
  },
  result: {
    data: {
      getCaregiverProfileCompleteness: {
        __typename: 'CaregiverProfileCompletenessStatus',
        additionalInfo: false,
        availability: true,
        bio: true,
        education: false,
        jobInterest: true,
        languages: true,
        overallStatus: 'INCOMPLETE',
        photo: true,
        qualities: false,
        services: false,
        subscriptionPlanViewed: true,
        freeGated: null,
        firstName: null,
        lastName: null,
      },
    },
  },
};

async function renderComponent(
  initialState = initialStateClone,
  mocks: MockedResponse<Record<string, any>>[] = [caregiverMock]
) {
  const result = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ThemeProvider theme={theme}>
        <AppStateProvider initialStateOverride={initialState}>
          <FeatureFlagsProvider flags={featureFlagsMockTrue}>
            <Preferences />
          </FeatureFlagsProvider>
        </AppStateProvider>
      </ThemeProvider>
    </MockedProvider>
  );
  await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
  return result;
}

describe('PreferencesPage', () => {
  let mockRouter: any = null;
  beforeEach(async () => {
    window.HTMLElement.prototype.scrollIntoView = () => {};
    mockRouter = {
      push: jest.fn(), // the component uses `router.push` only
      pathname: '/provider/cc',
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    // cleanup on exiting
    mockRouter = null;
  });

  it('matches snapshot', async () => {
    const renderSnapshotResult = await renderComponent();
    expect(renderSnapshotResult.asFragment()).toMatchSnapshot();
  });
  it('renders correctly', async () => {
    await renderComponent();
    expect(screen.getByText('Who would you like to care for?')).toBeInTheDocument();
  });
  it('should be able to select "Ages" all that apply', async () => {
    const { container } = await renderComponent();
    const pill = container.querySelector('input[value="EARLY_SCHOOL"]') as Element;
    await waitFor(() => expect(pill).not.toBeChecked());
    fireEvent.click(screen.getByText('4 - 5 yrs'));
    const btn = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(btn);
    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledTimes(1));
  });
  it('should be able to select number of children willling to care', async () => {
    const { container } = await renderComponent();
    const increment = container.querySelector('#increment') as Element;
    fireEvent.click(increment);
    expect(screen.getByText('Children')).toBeInTheDocument();
  });
  it('should able to redirect with out any selection', async () => {
    await renderComponent();
    const btn = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(btn);
    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledTimes(1));
  });
  it('should be able to select willing to care for sick children', async () => {
    await renderComponent();
    const sickChildrenCheckbox = screen.getByRole('checkbox', {
      name: 'Willing to care for sick children',
    });
    await waitFor(() => expect(sickChildrenCheckbox).not.toBeChecked());
    fireEvent.click(sickChildrenCheckbox);
  });
  it('should redirect to job-types page', async () => {
    await renderComponent(initialStateClone, [caregiverMock, completenessIncomplete]);

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_CHILD_CARE_ROUTES.JOB_TYPES)
    );
  });
  it('should redirect to availability page when the caregiver profile is incomplete', async () => {
    await renderComponent(initialStateClone, [caregiverMock, completenessJobInterestComplete]);

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_CHILD_CARE_ROUTES.AVAILABILITY)
    );
  });
  it('should redirect to profile page', async () => {
    await renderComponent(initialStateClone, [caregiverMock, completenessAvailabilityComplete]);

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_CHILD_CARE_ROUTES.PROFILE)
    );
  });
  it('should redirect to bio page', async () => {
    await renderComponent(initialStateClone, [caregiverMock, completenessProfileComplete]);

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_CHILD_CARE_ROUTES.BIO)
    );
  });
  it('should redirect to photo page', async () => {
    await renderComponent(initialStateClone, [caregiverMock, completenessBioComplete]);

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_CHILD_CARE_ROUTES.PHOTO)
    );
  });
  it('should redirect to preferences free gated page', async () => {
    await renderComponent(initialStateClone, [caregiverMock, completenessFreeGatedHourlyRate]);

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_CHILD_CARE_ROUTES.PREFERENCES)
    );
  });
  it('should redirect to app download page', async () => {
    await renderComponent(initialStateClone, [caregiverMock, completenessFreeGatedAppDownload]);

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_CHILD_CARE_ROUTES.APP_DOWNLOAD)
    );
  });
  it('should redirect to welcome back page', async () => {
    await renderComponent(initialStateClone, [caregiverMock, completenessFreeGatedWelcomeBack]);

    await waitFor(() =>
      // TODO: uncomment WELCOME_BACK route condition when BE is fixed
      // expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_CHILD_CARE_ROUTES.WELCOME_BACK)
      expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_CHILD_CARE_ROUTES.APP_DOWNLOAD)
    );
  });
  it('should redirect to czen page when photo submitted', async () => {
    await renderComponent(initialStateClone, [caregiverMock, completenessPhotoComplete]);

    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith(CZEN_BACKGROUND_CHECK_CC));
  });
  it('should redirect to czen page', async () => {
    await renderComponent(initialStateClone, [
      caregiverMock,
      completenessSubscriptionPlanViewedComplete,
    ]);

    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith(CZEN_BACKGROUND_CHECK_CC));
  });
});
