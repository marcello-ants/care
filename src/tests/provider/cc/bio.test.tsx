import { CAREGIVER_BIOGRAPHY_UPDATE } from '@/components/request/GQL';
import { TEXT_DETECT_CONCERNS } from '@/components/request/TextDetectConcernsGQL';
import { fireEvent, waitFor, screen } from '@testing-library/react';
import { preRenderPage } from '@/__setup__/testUtil';

import { CLIENT_FEATURE_FLAGS, PROVIDER_CHILD_CARE_ROUTES } from '@/constants';
import BioPage from '@/pages/provider/cc/bio';
import { FeatureFlagsProvider } from '@/components/FeatureFlagsContext';

describe('Bio Page', () => {
  let mockRouter: any | null = null;

  const successBio =
    'I’m a self-starter who loves caring for seniors. I started this work when my nana fell ill. I’m a self-starter who loves caring for seniors. I started this work when my nana fell ill.';
  const successHeadline = 'Provides Child care';
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
  const textAnalysisPass = {
    request: {
      query: TEXT_DETECT_CONCERNS,
      variables: {
        bio: successBio,
        headline: successHeadline,
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
  };

  const errorBio =
    'Quis suspendisse potenti tellus, semper ornare cubilia phasellus fringilla. Risus enim dolor elit, justo platea curae, tellus pulvinar aenean adipiscing vivamus nisl lacinia sem.';
  const errorHeadline =
    'Quis suspendisse potenti tellus, semper ornare cubilia phasellus fringilla. Risus enim dolor elit, justo platea curae, tellus pulvinar aenean adipiscing vivamus nisl lacinia sem.';
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

  const setup = () => {
    const { renderFn, routerMock } = preRenderPage({
      mocks: [successMock, successEmptyHeadlineMock, textAnalysisPass, errorMock],
      pathname: '/provider/cc/headline-bio',
    });

    mockRouter = routerMock;
    return renderFn(
      <FeatureFlagsProvider flags={featureFlagsMock}>
        <BioPage />
      </FeatureFlagsProvider>
    );
  };

  it('matches snapshot', async () => {
    const { asFragment } = setup();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled());
    expect(asFragment()).toMatchSnapshot();
  });

  it('Checks if the Next button redirects to the next flow screen when at least bio input field is filled', async () => {
    setup();
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
    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_CHILD_CARE_ROUTES.PHOTO)
    );
  });
  it('should submit the Bio when the Headline is empty', async () => {
    setup();
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
    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_CHILD_CARE_ROUTES.PHOTO)
    );
  });

  it('should  navigate to the photo upload page after acknowledging the error message', async () => {
    setup();
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
    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_CHILD_CARE_ROUTES.PHOTO)
    );
  });
});
