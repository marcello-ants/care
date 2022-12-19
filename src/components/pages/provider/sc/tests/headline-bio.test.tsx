import { CAREGIVER_BIOGRAPHY_UPDATE } from '@/components/request/GQL';
import { TEXT_DETECT_CONCERNS } from '@/components/request/TextDetectConcernsGQL';
import { render, fireEvent, waitFor, screen, RenderResult } from '@testing-library/react';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { MockedProvider } from '@apollo/client/testing';
import { AppStateProvider } from '@/components/AppState';
import { preRenderPage } from '@/__setup__/testUtil';
import { GraphQLError } from 'graphql';

import { ServiceType } from '@/__generated__/globalTypes';
import { CLIENT_FEATURE_FLAGS, PROVIDER_ROUTES } from '@/constants';
import { FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import HeadlineBioPage from '@/pages/provider/sc/headline-bio';
import HeadlineBio from '../../headline-bio';

const getTextAnalysisMock = (headline: string, bio: string) => ({
  request: {
    query: TEXT_DETECT_CONCERNS,
    variables: {
      bio,
      headline,
    },
  },
  result: {
    data: {
      bio: {
        detectedEntities: [],
      },
      title: {
        detectedEntities: [],
      },
    },
  },
});

describe('HeadlineBio Page', () => {
  let renderResult: RenderResult;
  let mockRouter: any | null = null;

  const successBio =
    'I’m a self-starter who loves caring for seniors. I started this work when my nana fell ill. I’m a self-starter who loves caring for seniors. I started this work when my nana fell ill.';
  const successHeadline = 'Provides Elderly care';
  const successMock = {
    request: {
      query: CAREGIVER_BIOGRAPHY_UPDATE,
      variables: {
        input: {
          bio: successBio,
          headline: successHeadline,
        },
      },
    },
    result: {
      data: {
        caregiverBiographyUpdate: {
          __typename: 'CaregiverBiographyUpdateSuccess',
        },
      },
    },
  };

  const successEmptyHeadlineMock = {
    request: {
      query: CAREGIVER_BIOGRAPHY_UPDATE,
      variables: {
        input: {
          bio: successBio,
          headline: '',
        },
      },
    },
    result: {
      data: {
        caregiverBiographyUpdate: {
          __typename: 'CaregiverBiographyUpdateSuccess',
        },
      },
    },
  };

  const errorBio =
    'Quis suspendisse potenti tellus, semper ornare cubilia phasellus fringilla. Risus enim dolor elit, justo platea curae, tellus pulvinar aenean adipiscing vivamus nisl lacinia sem.';
  const errorHeadline =
    'Quis suspendisse potenti tellus, semper ornare cubilia phasellus fringilla.';
  const errorMock = {
    request: {
      query: CAREGIVER_BIOGRAPHY_UPDATE,
      variables: {
        input: {
          bio: errorBio,
          headline: errorHeadline,
        },
      },
    },
    error: new Error('Unexpected Error Occurred'),
  };

  const htmlErrorBio =
    '<div>Quis suspendisse potenti tellus, semper ornare cubilia phasellus fringilla. Risus enim dolor elit, justo platea curae, tellus pulvinar aenean adipiscing vivamus nisl lacinia sem.</div>';
  const htmlErrorMessage = 'test html message';
  const errorObj = new GraphQLError(
    htmlErrorMessage,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    { code: 'CROSS_SITE_SCRIPT_ERROR' }
  );
  const htmlErrorMock = {
    request: {
      query: CAREGIVER_BIOGRAPHY_UPDATE,
      variables: {
        input: {
          bio: htmlErrorBio,
          headline: '',
        },
      },
    },
    result: {
      errors: [errorObj],
    },
  };

  const validationErrorBio =
    'Quis suspendisse potenti tellus, semper ornare cubilia phasellus fringilla. Risus enim dolor elit, justo platea curae, tellus pulvinar aenean adipiscing vivamus nisl lacinia sem. My phone +380554438557';
  const validationErrorHeadline = 'Lorem ipsum dolor sit amet consectetuer';
  const summaryError =
    'Reminder: You may not include or exchange personal contact information when communicating with families. Please remove any instances of email addresses, phone numbers, website URLs or Skype IDs from your bio.';
  const headlineError = 'Please enter a title for your profile that is less than 100 characters.';

  const validationErrorMock = {
    request: {
      query: CAREGIVER_BIOGRAPHY_UPDATE,
      variables: {
        input: {
          bio: validationErrorBio,
          headline: validationErrorHeadline,
        },
      },
    },
    result: {
      data: {
        caregiverBiographyUpdate: {
          __typename: 'CaregiverBiographyUpdateResultError',
          errors: [
            {
              message: summaryError,
              __typename: 'CaregiverBioExperienceSummaryUpdateError',
            },
            {
              message: headlineError,
              __typename: 'CaregiverBioHeadlineUpdateError',
            },
          ],
        },
      },
    },
  };

  const textAnalysisPass = getTextAnalysisMock(successHeadline, successBio);
  const textAnalysisPassEmptyHeadline = getTextAnalysisMock('', successBio);
  const textAnalysisPassValidationError = getTextAnalysisMock(
    validationErrorHeadline,

    validationErrorBio
  );
  const textAnalysisPassHtmlErrorBio = getTextAnalysisMock('', htmlErrorBio);

  const featureFlagsMock = {
    [CLIENT_FEATURE_FLAGS.PROVIDER_CC_FREE_GATED_EXPERIENCE]: {
      value: false,
      reason: {
        kind: 'FALLTHROUGH',
      },
    },
    [CLIENT_FEATURE_FLAGS.PROVIDER_CC_ENROLLMENT_TEXT_ANALYZER]: {
      value: false,
      reason: {
        kind: 'FALLTHROUGH',
      },
    },
  };

  const bioPageCCBaseProps = {
    title: 'My bio',
    firstName: 'test',
    lastName: 'test',
    headline: 'test',
    bio: 'test',
    onFirstNameChange: () => {},
    onLastNameChange: () => {},
    onBioChange: () => {},
    onHeadlineChange: () => {},
    nextRoute: '/',
    onSuccess: () => {},
    examples: [
      'Your prior child care experience',
      'Why you love working with children',
      'Any additional relevant information',
    ],
  };

  beforeEach(async () => {
    const { renderFn, routerMock } = preRenderPage({
      mocks: [
        successMock,
        textAnalysisPass,
        errorMock,
        successEmptyHeadlineMock,
        textAnalysisPassEmptyHeadline,
        validationErrorMock,
        textAnalysisPassValidationError,
        htmlErrorMock,
        textAnalysisPassHtmlErrorBio,
      ],
      pathname: '/provider/sc/headline-bio',
    });

    renderResult = renderFn(
      <FeatureFlagsProvider flags={featureFlagsMock}>
        <HeadlineBioPage />
      </FeatureFlagsProvider>
    );
    mockRouter = routerMock;
  });

  afterEach(() => {
    // cleanup on exiting
    mockRouter = null;
  });

  it('matches snapshot', async () => {
    await waitFor(() => expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled());
    expect(renderResult.asFragment()).toMatchSnapshot();
  });

  it('renders correctly', async () => {
    await waitFor(() => expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled());
    expect(screen.getByText('Help your profile stand out!')).toBeInTheDocument();
  });

  it('should render Child Care form with Free Gated elements when Launch Darkly is true, freeGated context is true and serviceType is child care', async () => {
    const featureFlagsMockTrue = {
      [CLIENT_FEATURE_FLAGS.PROVIDER_CC_FREE_GATED_EXPERIENCE]: {
        value: true,
        reason: {
          kind: 'FALLTHROUGH',
        },
      },
      [CLIENT_FEATURE_FLAGS.PROVIDER_CC_ENROLLMENT_TEXT_ANALYZER]: {
        value: false,
        reason: {
          kind: 'FALLTHROUGH',
        },
      },
    };

    render(
      <RouterContext.Provider value={mockRouter}>
        <MockedProvider>
          <AppStateProvider>
            <FeatureFlagsProvider flags={featureFlagsMockTrue}>
              <HeadlineBio {...bioPageCCBaseProps} freeGated serviceType={ServiceType.CHILD_CARE} />
            </FeatureFlagsProvider>
          </AppStateProvider>
        </MockedProvider>
      </RouterContext.Provider>
    );

    expect(screen.getByText('My bio')).toBeInTheDocument();
  });

  it('should NOT render Child Care form with Free Gated elements when Launch Darkly is false and serviceType is child care', async () => {
    const featureFlagsMockTrue = {
      [CLIENT_FEATURE_FLAGS.PROVIDER_CC_FREE_GATED_EXPERIENCE]: {
        value: false,
        reason: {
          kind: 'FALLTHROUGH',
        },
      },
      [CLIENT_FEATURE_FLAGS.PROVIDER_CC_ENROLLMENT_TEXT_ANALYZER]: {
        value: false,
        reason: {
          kind: 'FALLTHROUGH',
        },
      },
    };

    render(
      <RouterContext.Provider value={mockRouter}>
        <MockedProvider>
          <AppStateProvider>
            <FeatureFlagsProvider flags={featureFlagsMockTrue}>
              <HeadlineBio {...bioPageCCBaseProps} serviceType={ServiceType.CHILD_CARE} />
            </FeatureFlagsProvider>
          </AppStateProvider>
        </MockedProvider>
      </RouterContext.Provider>
    );

    expect(screen.queryByLabelText('First name')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Last name')).not.toBeInTheDocument();
  });

  it('should not break with empty feature flags', async () => {
    const emptyFeatureFlags = {};

    render(
      <RouterContext.Provider value={mockRouter}>
        <MockedProvider>
          <AppStateProvider>
            <FeatureFlagsProvider flags={emptyFeatureFlags}>
              <HeadlineBio {...bioPageCCBaseProps} serviceType={ServiceType.CHILD_CARE} />
            </FeatureFlagsProvider>
          </AppStateProvider>
        </MockedProvider>
      </RouterContext.Provider>
    );

    expect(screen.getByText('My bio')).toBeInTheDocument();
    expect(screen.queryByLabelText('First name')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Last name')).not.toBeInTheDocument();
  });

  it('should NOT render Senior Care form with Free Gated elements when Launch Darkly is true and serviceType is NOT set', async () => {
    const featureFlagsMockTrue = {
      [CLIENT_FEATURE_FLAGS.PROVIDER_CC_FREE_GATED_EXPERIENCE]: {
        value: true,
        reason: {
          kind: 'FALLTHROUGH',
        },
      },
      [CLIENT_FEATURE_FLAGS.PROVIDER_CC_ENROLLMENT_TEXT_ANALYZER]: {
        value: false,
        reason: {
          kind: 'FALLTHROUGH',
        },
      },
    };

    render(
      <RouterContext.Provider value={mockRouter}>
        <MockedProvider>
          <AppStateProvider>
            <FeatureFlagsProvider flags={featureFlagsMockTrue}>
              <HeadlineBioPage />
            </FeatureFlagsProvider>
          </AppStateProvider>
        </MockedProvider>
      </RouterContext.Provider>
    );

    expect(screen.queryByLabelText('First name')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Last name')).not.toBeInTheDocument();
  });

  it('should NOT render SC with Free Gated elements when Launch Darkly is false and serviceType is NOT child care', async () => {
    expect(screen.queryByLabelText('First name')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Last name')).not.toBeInTheDocument();
  });

  it('Checks the Next button when the two input fields are not filled', async () => {
    const nextButton = screen.getByRole('button', { name: 'Next' });
    await waitFor(() => expect(nextButton).toBeDisabled());
  });

  it('Checks if the Next button is enabled when both input fields are filled', async () => {
    const nextButton = screen.getByRole('button', { name: 'Next' });
    const headlineInputField = screen.getByTestId('headline-details');
    await waitFor(() => expect(nextButton).toBeDisabled());
    fireEvent.change(headlineInputField, { target: { value: 'Nurse' } });
    const bioInputField = screen.getByTestId('TextArea');
    fireEvent.change(bioInputField, { target: { value: successBio } });
    await waitFor(() => expect(nextButton).toBeEnabled());
  });

  it('Checks if the Next button redirects to the next flow screen when at least bio input field is filled', async () => {
    const nextButton = screen.getByRole('button', { name: 'Next' });
    const bioInputField = screen.getByTestId('TextArea');
    const HeadlineInputField = screen.getByTestId('headline-details');
    await waitFor(() => expect(nextButton).toBeDisabled());
    fireEvent.change(bioInputField, {
      target: {
        value: successBio,
      },
    });
    fireEvent.change(HeadlineInputField, {
      target: {
        value: successHeadline,
      },
    });
    await waitFor(() => expect(nextButton).toBeEnabled());
    fireEvent.click(nextButton);
    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_ROUTES.PHOTO));
  });

  it('should display a message when an error is thrown', async () => {
    const nextButton = screen.getByRole('button', { name: 'Next' });
    const bioInputField = screen.getByTestId('TextArea');
    await waitFor(() => expect(nextButton).toBeDisabled());
    fireEvent.change(bioInputField, {
      target: {
        value: errorBio,
      },
    });
    await waitFor(() => expect(nextButton).toBeEnabled());
    fireEvent.click(nextButton);
    await waitFor(() =>
      expect(screen.getByText(/An error occurred updating your profile./)).toBeVisible()
    );
  });

  it('should submit the Bio when the Headline is empty', async () => {
    const nextButton = screen.getByRole('button', { name: 'Next' });
    const bioInputField = screen.getByTestId('TextArea');
    const HeadlineInputField = screen.getByTestId('headline-details');
    await waitFor(() => expect(nextButton).toBeDisabled());
    fireEvent.change(bioInputField, {
      target: {
        value: successBio,
      },
    });
    fireEvent.change(HeadlineInputField, {
      target: {
        value: '',
      },
    });
    await waitFor(() => expect(nextButton).toBeEnabled());
    fireEvent.click(nextButton);
    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_ROUTES.PHOTO));
  });

  it('should render validation errors', async () => {
    const nextButton = screen.getByRole('button', { name: 'Next' });
    const bioInputField = screen.getByTestId('TextArea');
    const HeadlineInputField = screen.getByTestId('headline-details');
    await waitFor(() => expect(nextButton).toBeDisabled());
    fireEvent.change(bioInputField, {
      target: {
        value: validationErrorBio,
      },
    });
    fireEvent.change(HeadlineInputField, {
      target: {
        value: validationErrorHeadline,
      },
    });
    await waitFor(() => expect(nextButton).toBeEnabled());
    fireEvent.click(nextButton);
    await screen.findByText(headlineError);
    await screen.findByText(summaryError);
    expect(screen.getByText(summaryError)).toBeInTheDocument();
  });

  it('should  navigate to the photo upload page after acknowledging the error message', async () => {
    const nextButton = screen.getByRole('button', { name: 'Next' });
    const bioInputField = screen.getByTestId('TextArea');
    await waitFor(() => expect(nextButton).toBeDisabled());
    fireEvent.change(bioInputField, {
      target: {
        value: errorBio,
      },
    });
    await waitFor(() => expect(nextButton).toBeEnabled());
    fireEvent.click(nextButton);
    await screen.findByText(/An error occurred updating your profile./);
    fireEvent.click(screen.getByRole('button', { name: 'Got it' }));
    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_ROUTES.PHOTO));
  });

  it('should render html errors', async () => {
    const nextButton = screen.getByRole('button', { name: 'Next' });
    const bioInputField = screen.getByTestId('TextArea');
    await waitFor(() => expect(nextButton).toBeDisabled());
    fireEvent.change(bioInputField, {
      target: {
        value: htmlErrorBio,
      },
    });
    await waitFor(() => expect(nextButton).toBeEnabled());
    fireEvent.click(nextButton);
    await screen.findByText(htmlErrorMessage);
    expect(screen.getByText(htmlErrorMessage)).toBeInTheDocument();
  });

  describe('bio input', () => {
    it('should show correct label when no text is entered', async () => {
      await waitFor(() => expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled());
      expect(screen.getByText('Minimum 100 characters')).toBeInTheDocument();
    });

    it('show change label when more than 100 characters', async () => {
      await waitFor(() => expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled());
      const bioInputField = screen.getByTestId('TextArea');
      fireEvent.change(bioInputField, {
        target: {
          value:
            'It is a long established fact that a reader will be distracted by the readable content of a page whe',
        },
      });
      expect(await screen.findByText('100/1000 characters')).toBeInTheDocument();
    });

    it('shows error message when less than 100 characters', async () => {
      await waitFor(() => expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled());
      const bioInputField = screen.getByTestId('TextArea');
      fireEvent.change(bioInputField, {
        target: {
          value:
            'It is a long established fact that a reader will be distracted by the readable content',
        },
      });

      fireEvent.blur(bioInputField);
      await screen.findByText('Please type at least 100 characters');
      expect(screen.queryByText('Minimum 100 characters')).not.toBeInTheDocument();
    });
  });
});
