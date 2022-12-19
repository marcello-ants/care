import React from 'react';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { MockedProvider } from '@apollo/client/testing';
import { act, render, waitFor, screen, fireEvent, within } from '@testing-library/react';

import { initialAppState } from '@/state';
import GET_TOP_CAREGIVERS from '@/components/request/TopCaregiversGQL';
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { AppStateProvider } from '@/components/AppState';
import CaregiverProfileListView from '@/components/pages/seeker/sc/lc/caregiver-profile/caregiver-profile-list-view';
import {
  CLIENT_FEATURE_FLAGS,
  SEEKER_LEAD_CONNECT_ROUTES,
  NUMBER_OF_LEAD_CONNECT_RESULTS,
} from '@/constants';
import { AppState } from '@/types/app';

const topCaregiversZip = '78665';
const noTopCaregiversZip = '78702';
const topCaregivers = [
  {
    caregiver: {
      avgReviewRating: 0,
      numberOfReviews: 0,
      yearsOfExperience: 10,
      hasCareCheck: true,
      responseTime: 8,
      member: {
        address: {
          city: 'Boston',
          state: 'MA',
        },
        displayName: 'Michelle T.',
        firstName: 'Michelle',
        imageURL: '/app/enrollment/joanna.jpg',
        legacyId: '23135',
        id: '6fc30c0a-c4c1-4fba-a0dd-cc15bb87ac41',
      },
      seniorCareProviderProfile: {
        bio: 'I have a masters degree in speech language pathology and I have 3 years of experience caring for the elderly.',
        services: ['ERRANDS'],
        payRange: {
          hourlyRateFrom: {
            amount: '15',
            currencyCode: 'USD',
          },
          hourlyRateTo: {
            amount: '25',
            currencyCode: 'USD',
          },
        },
        qualities: ['CPR_TRAINED', 'DOES_NOT_SMOKE'],
      },
      profileURL: 'https://www.care.com/p/michelleq31/sc',
      signUpDate: null,
      profiles: {
        commonCaregiverProfile: {
          id: '1',
        },
        childCareCaregiverProfile: {
          bio: {
            experienceSummary: 'bio',
          },
          qualities: {
            certifiedNursingAssistant: false,
            certifiedRegisterNurse: false,
            certifiedTeacher: false,
            childDevelopmentAssociate: false,
            comfortableWithPets: false,
            cprTrained: false,
            crn: false,
            doesNotSmoke: false,
            doula: false,
            earlyChildDevelopmentCoursework: false,
            earlyChildhoodEducation: false,
            firstAidTraining: false,
            nafccCertified: false,
            ownTransportation: false,
            specialNeedsCare: false,
            trustlineCertifiedCalifornia: false,
          },
          supportedServices: {
            carpooling: false,
            craftAssistance: false,
            errands: false,
            groceryShopping: false,
            laundryAssistance: false,
            lightHousekeeping: false,
            mealPreparation: false,
            swimmingSupervision: false,
            travel: false,
          },
          payRange: {
            hourlyRateFrom: {
              amount: '10',
              currencyCode: 'USD',
            },
            hourlyRateTo: {
              amount: '20',
              currencyCode: 'USD',
            },
          },
        },
      },
    },
    distanceFromRequestZip: {
      unit: 'MILES',
      value: 1.2,
    },
  },
  {
    caregiver: {
      avgReviewRating: 0,
      numberOfReviews: 0,
      yearsOfExperience: 9,
      hasCareCheck: true,
      responseTime: 8,
      member: {
        address: {
          city: 'Boston',
          state: 'MA',
        },
        displayName: 'Lauren K.',
        firstName: 'Lauren',
        imageURL: '/app/enrollment/joanna.jpg',
        legacyId: '69817',
        id: '22d53b55-3e94-4b58-88ae-f76a9dd01714',
      },
      seniorCareProviderProfile: {
        bio: '',
        services: ['LIGHT_HOUSECLEANING'],
        payRange: {
          hourlyRateFrom: {
            amount: '15',
            currencyCode: 'USD',
          },
          hourlyRateTo: {
            amount: '25',
            currencyCode: 'USD',
          },
        },
        qualities: ['CPR_TRAINED', 'DOES_NOT_SMOKE'],
      },
      profileURL: 'https://www.care.com/p/laurena21/sc',
      signUpDate: null,
      profiles: {
        commonCaregiverProfile: {
          id: '2',
        },
        childCareCaregiverProfile: {
          bio: {
            experienceSummary: 'bio',
          },
          qualities: {
            certifiedNursingAssistant: false,
            certifiedRegisterNurse: false,
            certifiedTeacher: false,
            childDevelopmentAssociate: false,
            comfortableWithPets: false,
            cprTrained: false,
            crn: false,
            doesNotSmoke: false,
            doula: false,
            earlyChildDevelopmentCoursework: false,
            earlyChildhoodEducation: false,
            firstAidTraining: false,
            nafccCertified: false,
            ownTransportation: false,
            specialNeedsCare: false,
            trustlineCertifiedCalifornia: false,
          },
          supportedServices: {
            carpooling: false,
            craftAssistance: false,
            errands: false,
            groceryShopping: false,
            laundryAssistance: false,
            lightHousekeeping: false,
            mealPreparation: false,
            swimmingSupervision: false,
            travel: false,
          },
          payRange: {
            hourlyRateFrom: {
              amount: '10',
              currencyCode: 'USD',
            },
            hourlyRateTo: {
              amount: '20',
              currencyCode: 'USD',
            },
          },
        },
      },
    },
    distanceFromRequestZip: {
      unit: 'MILES',
      value: 1.2,
    },
  },
  {
    caregiver: {
      avgReviewRating: 0,
      numberOfReviews: 0,
      yearsOfExperience: 9,
      hasCareCheck: true,
      responseTime: 8,
      member: {
        address: {
          city: 'Boston',
          state: 'MA',
        },
        displayName: 'Michael V.',
        firstName: 'Michael',
        imageURL: '/app/enrollment/joanna.jpg',
        legacyId: '3501',
        id: '26f1f1f9-794f-4393-b394-37e522025fab',
      },
      seniorCareProviderProfile: {
        bio: '',
        services: [],
        payRange: {
          hourlyRateFrom: {
            amount: '15',
            currencyCode: 'USD',
          },
          hourlyRateTo: {
            amount: '15',
            currencyCode: 'USD',
          },
        },
        qualities: ['CPR_TRAINED', 'DOES_NOT_SMOKE'],
      },
      profileURL: 'https://www.care.com/p/michalef231/sc',
      signUpDate: null,
      profiles: {
        commonCaregiverProfile: {
          id: '3',
        },
        childCareCaregiverProfile: {
          bio: {
            experienceSummary: 'bio',
          },
          qualities: {
            certifiedNursingAssistant: false,
            certifiedRegisterNurse: false,
            certifiedTeacher: false,
            childDevelopmentAssociate: false,
            comfortableWithPets: false,
            cprTrained: false,
            crn: false,
            doesNotSmoke: false,
            doula: false,
            earlyChildDevelopmentCoursework: false,
            earlyChildhoodEducation: false,
            firstAidTraining: false,
            nafccCertified: false,
            ownTransportation: false,
            specialNeedsCare: false,
            trustlineCertifiedCalifornia: false,
          },
          supportedServices: {
            carpooling: false,
            craftAssistance: false,
            errands: false,
            groceryShopping: false,
            laundryAssistance: false,
            lightHousekeeping: false,
            mealPreparation: false,
            swimmingSupervision: false,
            travel: false,
          },
          payRange: {
            hourlyRateFrom: {
              amount: '10',
              currencyCode: 'USD',
            },
            hourlyRateTo: {
              amount: '20',
              currencyCode: 'USD',
            },
          },
        },
      },
    },
    distanceFromRequestZip: {
      unit: 'MILES',
      value: 1.2,
    },
  },
];

const topCaregiversMock = {
  request: {
    query: GET_TOP_CAREGIVERS,
    variables: {
      zipcode: topCaregiversZip,
      serviceID: 'SENIOR_CARE',
      numResults: NUMBER_OF_LEAD_CONNECT_RESULTS(false),
      hourlyRate: null,
      hasCareCheck: true,
      qualities: null,
      services: null,
      maxDistanceFromSeeker: {
        unit: 'MILES',
        value: 10,
      },
    },
  },
  result: {
    data: {
      topCaregivers,
    },
  },
};
const topCaregiversMockNoResults = {
  request: {
    query: GET_TOP_CAREGIVERS,
    variables: {
      zipcode: noTopCaregiversZip,
      serviceID: 'SENIOR_CARE',
      numResults: NUMBER_OF_LEAD_CONNECT_RESULTS(false),
      hourlyRate: null,
      hasCareCheck: true,
      qualities: null,
      services: null,
      maxDistanceFromSeeker: {
        unit: 'MILES',
        value: 10,
      },
    },
  },
  result: {
    data: {
      topCaregivers: [],
    },
  },
};

interface RenderVarsOptions {
  mocks: any;
  ldFlags?: FeatureFlags | undefined;
  zip: string | undefined;
}

interface ReactElementOptions extends RenderVarsOptions {
  router: any;
}
const controlLCFlagState: FeatureFlags = {
  [CLIENT_FEATURE_FLAGS.LEAD_CONNECT_PROVIDER_NETWORK]: {
    value: 0,
    variationIndex: 0,
    reason: {
      kind: 'test control',
    },
  },
  [CLIENT_FEATURE_FLAGS.LEAD_CONNECT_FIFTEEN_CAREGIVERS]: {
    value: 0,
    variationIndex: 0,
    reason: {
      kind: 'test control',
    },
  },
};

function buildReactElements(options: ReactElementOptions) {
  const { mocks, router, ldFlags, zip } = options;
  const initialState: AppState = {
    ...initialAppState,

    seeker: {
      ...initialAppState.seeker,
      jobPost: {
        ...initialAppState.seeker.jobPost,
        ...(zip ? { zip } : {}),
      },
    },
  };

  return (
    <RouterContext.Provider value={router}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <FeatureFlagsProvider flags={ldFlags || {}}>
          <AppStateProvider initialStateOverride={initialState}>
            <CaregiverProfileListView />
          </AppStateProvider>
        </FeatureFlagsProvider>
      </MockedProvider>
    </RouterContext.Provider>
  );
}

describe('Caregiver Profile list', () => {
  const renderPage = async (zip: string | undefined, featureFlags: FeatureFlags = {}) => {
    let mockRouter: any | null = null;
    let rerender: () => void = () => {};

    const pushOrReplace = (url: string) => {
      const urlSegments = url.split('/');
      const lastSegment = urlSegments[urlSegments.length - 1];
      const lastSegmentParts = lastSegment.split('?');
      const memberId = lastSegmentParts[0];
      const seoProfileId = lastSegmentParts.length === 2 ? lastSegmentParts[1] : undefined;
      const param = memberId === 'caregiver-profile' ? '' : memberId;
      mockRouter.query.param = [param];
      if (seoProfileId) {
        mockRouter.query.seoProfileId = seoProfileId;
      }
      mockRouter.pathname = `/seeker/sc/lc/caregiver-profile/${param}`;
      mockRouter.asPath = `/seeker/sc/lc/caregiver-profile/${param}`;
      // since we're mocking the router, we need to manually rerender on pushes
      rerender();
    };

    const initialPath = '/seeker/sc/lc/caregiver-profile';

    mockRouter = {
      push: jest.fn((url) => {
        pushOrReplace(url);
      }),
      replace: jest.fn((url) => {
        pushOrReplace(url);
      }),
      pathname: initialPath,
      asPath: initialPath,
      query: { param: [] },
      beforePopState: () => {},
    };

    const view = render(
      buildReactElements({
        mocks: [topCaregiversMock, topCaregiversMockNoResults],
        router: mockRouter,
        ldFlags: {
          ...controlLCFlagState,
          ...featureFlags,
        },
        zip,
      })
    );
    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
    rerender = async () => {
      view.rerender(
        buildReactElements({
          mocks: [topCaregiversMock],
          router: mockRouter,
          ldFlags: {
            ...controlLCFlagState,
          },
          zip,
        })
      );
    };

    return { view, mockRouter };
  };

  it('matches snapshot', async () => {
    const { view } = await renderPage(topCaregiversZip);
    await screen.findByText(/Here's a personalized list of caregivers based on your needs/);
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('renders correctly with exit button shown', async () => {
    await renderPage(topCaregiversZip);
    await waitFor(() => {
      expect(
        screen.getByText(/Here's a personalized list of caregivers based on your needs/)
      ).toBeInTheDocument();
    });
    await screen.findByText(/Skip and view all/);
    const allCaregivers = screen.getAllByTestId('caregiverCard');
    expect(allCaregivers.length).toBe(topCaregivers.length); // checking that all caregivers are rendered
  });

  it('should load selected caregiver when clicked on card and add to shortlist', async () => {
    await renderPage(topCaregiversZip);
    // Load and accept Michelle's profile with 10 years of experience
    await screen.findByText('Michelle T.');
    const selectedProvider = screen.getByText('Michelle T.');
    selectedProvider.click();

    await screen.findByText(/Add to list/);
    fireEvent.click(screen.getByText(/Add to list/));

    // wait for the drawer to close
    await waitFor(() => expect(screen.queryByText('Errands')).not.toBeInTheDocument(), {
      timeout: 2000,
    });

    // We automatically load the next provider (the only one that has the housekeeping service)
    await screen.findByText('Housekeeping');
  });

  it('goes directly to search results when no top caregivers retrieved', async () => {
    const assignMock = jest.fn();

    const { location } = window;
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = { assign: assignMock };
    await renderPage(noTopCaregiversZip);

    // Mobile search results is loaded
    window.location = location;
    await waitFor(() =>
      expect(assignMock).toHaveBeenCalledWith(
        `/mwb/member/sitterSearchTest?serviceId=SENIRCARE&zip=${noTopCaregiversZip}&overrideMfeRedirect=true`
      )
    );
  });

  it('should set the checkbox as enabled', async () => {
    await renderPage(topCaregiversZip);
    await screen.findByText('Michelle T.');

    const selectedProvider = screen.getAllByTestId('caregiverCard')[0];
    const providerCheckbox = within(selectedProvider).getByRole('checkbox');

    fireEvent.click(providerCheckbox);
    expect(providerCheckbox).toBeChecked();

    fireEvent.click(providerCheckbox);
    expect(providerCheckbox).not.toBeChecked();
  });

  it('should open drawer and remove from shortlist', async () => {
    await renderPage(topCaregiversZip);
    // Load and accept Michelle's profile with 10 years of experience
    await screen.findByText('Michelle T.');
    const selectedProviders = screen.getAllByTestId('caregiverCard');
    const selectedProvider = selectedProviders[0];
    const secondSelectedProvider = selectedProviders[1];
    const thirdSelectedProvider = selectedProviders[2];
    const providerCheckbox = within(selectedProvider).getByRole('checkbox');
    const secondProviderCheckbox = within(secondSelectedProvider).getByRole('checkbox');
    const thirdProviderCheckbox = within(thirdSelectedProvider).getByRole('checkbox');

    fireEvent.click(providerCheckbox);
    fireEvent.click(secondProviderCheckbox);
    fireEvent.click(thirdProviderCheckbox);

    await screen.findByText(/You've shortlisted 3 caregivers/);

    fireEvent.click(thirdSelectedProvider);
    await screen.findByText(/Remove from list/);

    fireEvent.click(screen.getByText(/Remove from list/));

    // wait for the drawer to close
    await waitFor(() => expect(screen.queryByText('Errands')).not.toBeInTheDocument(), {
      timeout: 2000,
    });

    await screen.findByText(/You've shortlisted 2 caregivers/);
  });

  it('should open shortlist drawer and go to recap screen', async () => {
    const ldFlags: FeatureFlags = {
      [CLIENT_FEATURE_FLAGS.LEAD_CONNECT_RECAP_SCREEN]: {
        value: 0,
        variationIndex: 0,
        reason: {
          kind: 'test control',
        },
      },
    };
    const { mockRouter } = await renderPage(topCaregiversZip, ldFlags);
    await screen.findByText('Michelle T.');

    const selectedProviders = screen.getAllByTestId('caregiverCard');
    const selectedProvider = selectedProviders[0];
    const providerCheckbox = within(selectedProvider).getByRole('checkbox', { hidden: true });

    fireEvent.click(providerCheckbox);

    await waitFor(() => expect(providerCheckbox).toBeChecked());

    await screen.findByText(/You've shortlisted 1 caregiver/);

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_LEAD_CONNECT_ROUTES.RECAP)
    );
  });
  it('should open shortlist drawer and go to upgrade or skip screen for test', async () => {
    const ldFlags: FeatureFlags = {
      [CLIENT_FEATURE_FLAGS.LEAD_CONNECT_RECAP_SCREEN]: {
        value: 1,
        variationIndex: 1,
        reason: {
          kind: 'test control',
        },
      },
    };
    const { mockRouter } = await renderPage(topCaregiversZip, ldFlags);
    await screen.findByText('Michelle T.');

    const selectedProviders = screen.getAllByTestId('caregiverCard');
    const selectedProvider = selectedProviders[0];
    const providerCheckbox = within(selectedProvider).getByRole('checkbox', { hidden: true });

    fireEvent.click(providerCheckbox);

    await waitFor(() => expect(providerCheckbox).toBeChecked());

    await screen.findByText(/You've shortlisted 1 caregiver/);

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_LEAD_CONNECT_ROUTES.UPGRADE_OR_SKIP)
    );
  });
  it('should open drawer if caregiver was already selected', async () => {
    await renderPage(topCaregiversZip);
    // Load and accept Michelle's profile with 10 years of experience
    await screen.findByText('Michelle T.');
    const selectedProvider = screen.getByText('Michelle T.');
    selectedProvider.click();

    await screen.findByText(/Pass/);
    fireEvent.click(screen.getByText(/Pass/));

    // wait for the drawer to close
    await waitFor(() => expect(screen.queryByText('Errands')).not.toBeInTheDocument(), {
      timeout: 2000,
    });

    selectedProvider.click();
    await screen.findByText(/Add to list/);
    fireEvent.click(screen.getByText(/Add to list/));

    // wait for the drawer to close
    await waitFor(() => expect(screen.queryByText('Errands')).not.toBeInTheDocument(), {
      timeout: 2000,
    });

    // We automatically load the next provider
    await screen.findByText('Housekeeping');
  });

  it('should open drawer and close (implicit)', async () => {
    await renderPage(topCaregiversZip);
    // Load and accept Michelle's profile with 10 years of experience
    await screen.findByText('Michelle T.');
    const selectedProvider = screen.getByText('Michelle T.');
    selectedProvider.click();

    await screen.findByText(/Add to list/);
    fireEvent.click(screen.getByText(/Add to list/));

    // wait for the drawer to close
    await waitFor(() => expect(screen.queryByText('Errands')).not.toBeInTheDocument(), {
      timeout: 2000,
    });

    // We automatically load the next provider (drawer reopens)
    await screen.findByText('Housekeeping');

    fireEvent.click(screen.getByRole('presentation').firstChild as Element);

    await screen.findByText(/You've shortlisted 1 caregiver/);
  });

  it('should render "Can help with:" only when attributes list is not empty', async () => {
    await renderPage(topCaregiversZip);

    await screen.findByText('Michael V.');
    const selectedProvider = screen.getByText('Michael V.');
    selectedProvider.click();

    expect(screen.queryByText('Can help with:')).not.toBeInTheDocument();
  });
});
