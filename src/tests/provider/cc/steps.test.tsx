import React from 'react';
import { render, waitFor, screen, act } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { CAREGIVER_ATTRIBUTES_UPDATE } from '@/components/request/GQL';
import { AppStateProvider } from '@/components/AppState';
import { ThemeProvider } from '@material-ui/core';
import { useRouter } from 'next/router';
import { theme } from '@care/material-ui-theme';
import { FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { CLIENT_FEATURE_FLAGS, PROVIDER_CHILD_CARE_ROUTES } from '@/constants';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import StepsPage from '../../../pages/provider/cc/steps';

const childCareGroup = ['TODDLER'];
const initialState: AppState = {
  ...initialAppState,
  providerCC: {
    ...initialAppState.providerCC,
    ageGroups: ['TODDLER'],
    careForSickChild: false,
    numberOfChildren: 1,
    caregiverPreferencesPersisted: false,
    freeGated: false,
    callFreeGatedMutation: false,
  },
};
const stateOverride: AppState = {
  ...initialAppState,
  providerCC: {
    ...initialAppState.providerCC,
    ageGroups: ['TODDLER'],
    careForSickChild: false,
    numberOfChildren: 1,
    caregiverPreferencesPersisted: true,
    freeGated: false,
    callFreeGatedMutation: false,
  },
};
const stateOverrideFreegated: AppState = {
  ...initialAppState,
  providerCC: {
    ...initialAppState.providerCC,
    ageGroups: ['TODDLER'],
    careForSickChild: false,
    numberOfChildren: 1,
    caregiverPreferencesPersisted: false,
    freeGated: true,
    callFreeGatedMutation: false,
  },
};

const featureFlagsMockTrue = {
  [CLIENT_FEATURE_FLAGS.PROVIDER_CC_FREE_GATED_EXPERIENCE]: {
    value: true,
    reason: {
      kind: 'FALLTHROUGH',
    },
  },
};

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

describe('StepsPage', () => {
  let mockRouter: any | null = null;
  const successMock: MockedResponse[] = [];
  successMock.push({
    request: {
      query: CAREGIVER_ATTRIBUTES_UPDATE,
      variables: {
        input: {
          childcare: {
            ageGroups: childCareGroup,
            careForSickChild: false,
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
  });

  interface RenderComponentOptions {
    freeGated?: boolean;
  }

  async function renderComponent({ freeGated }: RenderComponentOptions = {}) {
    const view = render(
      <MockedProvider mocks={successMock} addTypename={false}>
        <ThemeProvider theme={theme}>
          <AppStateProvider
            initialStateOverride={freeGated ? stateOverrideFreegated : initialState}>
            <FeatureFlagsProvider flags={featureFlagsMockTrue}>
              <StepsPage />
            </FeatureFlagsProvider>
          </AppStateProvider>
        </ThemeProvider>
      </MockedProvider>
    );
    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));

    return view;
  }

  async function renderComponentOnBackButton() {
    const view = render(
      <MockedProvider mocks={successMock} addTypename={false}>
        <ThemeProvider theme={theme}>
          <AppStateProvider initialStateOverride={stateOverride}>
            <FeatureFlagsProvider flags={featureFlagsMockTrue}>
              <StepsPage />
            </FeatureFlagsProvider>
          </AppStateProvider>
        </ThemeProvider>
      </MockedProvider>
    );
    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));

    return view;
  }

  beforeEach(async () => {
    jest.clearAllMocks();
    mockRouter = {
      push: jest.fn(), // the component uses `router.push` only
      pathname: '/provider/cc/steps',
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    // cleanup on exiting
    mockRouter = null;
  });

  it('matches snapshot', async () => {
    const { asFragment } = await renderComponent();
    expect(asFragment()).toMatchSnapshot();
  });
  it('renders correctly', async () => {
    await renderComponent();
    expect(screen.getByText('Here’s what comes next')).toBeInTheDocument();
  });
  it('should update the loadMutationOnBackButton value once the page loads', async () => {
    await renderComponentOnBackButton();
    expect(screen.getByText('Here’s what comes next')).toBeInTheDocument();
  });
  it('routes to the /provider/cc/job-types page after button click', async () => {
    await renderComponent();
    const nextButton = screen.getByRole('button', { name: 'Build your profile' });
    await waitFor(() => expect(nextButton).toBeEnabled());
    nextButton.click();
    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_CHILD_CARE_ROUTES.JOB_TYPES)
    );
  });
  it('routes to the /provider/cc/preferences page after button click', async () => {
    const freeGated = true;
    await renderComponent({ freeGated });
    const nextButton = screen.getByRole('button', { name: 'Build your profile' });
    await waitFor(() => expect(nextButton).toBeEnabled());
    nextButton.click();
    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_CHILD_CARE_ROUTES.PREFERENCES)
    );
  });
});
