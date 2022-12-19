import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { ThemeProvider } from '@material-ui/core';
import { cloneDeep } from 'lodash-es';
import { theme } from '@care/material-ui-theme';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';

import Profile from '@/pages/provider/sc/profile';
import { CLIENT_FEATURE_FLAGS, PROVIDER_ROUTES } from '@/constants';
import { EducationLevel, SeniorCareProviderQuality } from '@/__generated__/globalTypes';
import { SENIOR_CARE_PROVIDER_ATTRIBUTES_UPDATE } from '@/components/request/GQL';
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const initialStateClone = cloneDeep(initialAppState);

describe('Provider Profile Page', () => {
  let mockRouter: any | null = null;

  const successMock = {
    request: {
      query: SENIOR_CARE_PROVIDER_ATTRIBUTES_UPDATE,
      variables: {
        input: {
          qualities: ['ALZHEIMERS_OR_DEMENTIA_EXPERIENCE'],
          languages: [],
          vaccinated: false,
        },
      },
    },
    result: {
      data: {
        seniorCareProviderAttributesUpdate: {
          __typename: 'SeniorCareProviderAttributesUpdateSuccess',
        },
      },
    },
  };

  const errorMock = {
    request: {
      query: SENIOR_CARE_PROVIDER_ATTRIBUTES_UPDATE,
      variables: {
        input: {
          qualities: ['ALZHEIMERS_OR_DEMENTIA_EXPERIENCE'],
          languages: [],
          vaccinated: false,
        },
      },
    },
    error: new Error('Unexpected Error Occurred'),
  };

  const featureFlagsMock: FeatureFlags = {
    [CLIENT_FEATURE_FLAGS.PROVIDER_VACCINE_INDICATOR_SENIOR]: {
      value: true,
      reason: {
        kind: 'FALLTHROUGH',
      },
    },
  };

  function renderComponent(
    initialState = initialStateClone,
    featureFlagOverride = featureFlagsMock
  ) {
    return render(
      <FeatureFlagsProvider flags={featureFlagOverride}>
        <MockedProvider mocks={[successMock, errorMock]} addTypename={false}>
          <ThemeProvider theme={theme}>
            <AppStateProvider initialStateOverride={initialState}>
              <Profile />
            </AppStateProvider>
          </ThemeProvider>
        </MockedProvider>
      </FeatureFlagsProvider>
    );
  }

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(), // the component uses `router.push` only
      query: { param: [] },
      pathname: '',
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    // cleanup on exiting
    mockRouter = null;
  });

  it('matches snapshot', () => {
    const { asFragment } = renderComponent();
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly', () => {
    renderComponent();
    expect(screen.getByText('Share a few more details about yourself.')).toBeInTheDocument();
  });

  it("shouldn't break if feature flags are empty", () => {
    renderComponent(initialStateClone, {});
    expect(screen.getByText('Share a few more details about yourself.')).toBeInTheDocument();
  });

  it('should display "Add another language" button when first loaded', () => {
    renderComponent();
    expect(screen.getByText(/Add another language/i)).toBeInTheDocument();
  });

  it('should display input when "Add another language" gets clicked', () => {
    renderComponent();
    const addLanguageBtn = screen.getByText(/Add another language/i);
    fireEvent.click(addLanguageBtn);
    const input = screen.getByLabelText('Add another language');
    expect(addLanguageBtn).not.toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('should update input value', () => {
    renderComponent();
    const addLanguageBtn = screen.getByText(/Add another language/i);
    fireEvent.click(addLanguageBtn);
    const input = screen.getByLabelText('Add another language');
    fireEvent.change(input, { target: { value: 'k' } });
    expect(input).toHaveValue('k');
  });

  it('should add the selected detail to state when clicked', () => {
    renderComponent();
    const option = screen.getByRole('checkbox', { name: /dementia/ });
    expect(option).not.toBeChecked();
    fireEvent.click(option);
    expect(option).toBeChecked();
  });

  it('should remove the selected detail from state when clicked', () => {
    renderComponent({
      ...initialStateClone,
      provider: {
        ...initialStateClone.provider,
        additionalDetails: [SeniorCareProviderQuality.ALZHEIMERS_OR_DEMENTIA_EXPERIENCE],
      },
    });
    const option = screen.getByRole('checkbox', { name: /dementia/ });
    expect(option).toBeChecked();
    fireEvent.click(option);
    expect(option).not.toBeChecked();
  });

  it('should route to the pay range page when next is clicked', async () => {
    renderComponent({
      ...initialStateClone,
      provider: {
        ...initialStateClone.provider,
        additionalDetails: [SeniorCareProviderQuality.ALZHEIMERS_OR_DEMENTIA_EXPERIENCE],
        languages: [],
      },
    });

    fireEvent.click(screen.getByText('No'));

    const nextButton = screen.getByRole('button', { name: 'Next' });
    expect(nextButton).toBeEnabled();
    fireEvent.click(nextButton);
    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_ROUTES.PAY_RANGE));
  });

  it('should have English selected as a spoken language by default', async () => {
    renderComponent();
    const englishInput = screen.getByDisplayValue('ENGLISH');
    expect(englishInput).toBeChecked();
  });

  it('should add the selected language to state when clicked', async () => {
    renderComponent();
    const languageInput = screen.getByDisplayValue('SPANISH');
    const languagePill = screen.getByText('Spanish');
    expect(languageInput).not.toBeChecked();
    fireEvent.click(languagePill);
    await waitFor(() => expect(languageInput).toBeChecked());
  });

  it('should add selected search languages to the list of spoken languages when clicked', async () => {
    renderComponent();
    const addLanguageBtn = screen.getByText(/Add another language/i);
    fireEvent.click(addLanguageBtn);
    const input = screen.getByLabelText('Add another language');
    fireEvent.change(input, { target: { value: 'Fre' } });
    const frenchPill = screen.getByText('French');
    fireEvent.click(frenchPill);
    const languagesSpoken = screen.getByText('Languages spoken');
    await waitFor(() =>
      expect(languagesSpoken.nextSibling).toContainElement(screen.getByDisplayValue('FRENCH'))
    );
    expect(input).toHaveValue('');
  });

  it('should add the education Level to state when clicked', () => {
    renderComponent({
      ...initialStateClone,
      provider: {
        ...initialStateClone.provider,
        additionalDetails: [SeniorCareProviderQuality.ALZHEIMERS_OR_DEMENTIA_EXPERIENCE],
        education: null,
      },
    });
    const option = screen.getByRole('checkbox', { name: 'Have a college degree' });
    expect(option).not.toBeChecked();
    fireEvent.click(option);
    expect(option).toBeChecked();
  });

  it('should have "Have a college degree" checkbox checked when education is set', () => {
    renderComponent({
      ...initialStateClone,
      provider: {
        ...initialStateClone.provider,
        additionalDetails: [SeniorCareProviderQuality.ALZHEIMERS_OR_DEMENTIA_EXPERIENCE],
        education: EducationLevel.COLLEGE,
      },
    });
    const option = screen.getByRole('checkbox', { name: 'Have a college degree' });
    expect(option).toBeChecked();
  });
});
