import { RouterContext } from 'next/dist/shared/lib/router-context';
import React from 'react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '@care/material-ui-theme';
import { AppStateProvider } from '@/components/AppState';
import AuthService from '@/lib/AuthService';
import { initialAppState } from '@/state';

// eslint-disable-next-line camelcase
import { validateMemberEmail_validateMemberEmail_errors } from '@/__generated__/validateMemberEmail';
// eslint-disable-next-line camelcase
import { validateMemberPassword_validateMemberPassword_errors } from '@/__generated__/validateMemberPassword';
import {
  CenterType,
  DistanceUnit,
  SeniorCarePaymentSource,
  SeniorCareRecipientRelationshipType,
  SeniorCareSeekerCreateInput,
  SeniorCommunityType,
  SENIOR_CARE_TYPE,
} from '@/__generated__/globalTypes';
// eslint-disable-next-line camelcase
import { seniorCareSeekerCreate_seniorCareSeekerCreate } from '@/__generated__/seniorCareSeekerCreate';
import { AppState } from '@/types/app';
import { SEEKER_IN_FACILITY_ROUTES, CLIENT_FEATURE_FLAGS } from '@/constants';
import {
  SENIOR_CARE_ASSISTED_LIVING_PROVIDERS,
  SENIOR_CARE_SEEKER_CREATE,
  VALIDATE_MEMBER_EMAIL,
  VALIDATE_MEMBER_PASSWORD,
} from '@/components/request/GQL';
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import {
  SeniorCareRecipientCondition,
  SeniorLivingOptions,
  WhenLookingToMoveIntoCommunity,
} from '@/types/seeker';
import { TealiumUtagService } from '@/utilities/utagHelper';
import AccountCreation from '../account-creation';

jest.mock('next/config', () => () => {
  return {
    publicRuntimeConfig: {
      OIDC_STS_AUTHORITY: 'OIDC_STS_AUTHORITY',
      OIDC_CLIENT_ID: 'OIDC_CLIENT_ID',
      OIDC_RESPONSE_TYPE: 'OIDC_RESPONSE_TYPE',
      OIDC_CLIENT_SCOPE: 'OIDC_CLIENT_SCOPE',
      OIDC_CALLBACK_PATH: 'OIDC_CALLBACK_PATH',
      OIDC_LOGOUT_URL: 'OIDC_LOGOUT_URL',
    },
  };
});

jest.mock('@/lib/AuthService');
const AuthServiceMock = AuthService as jest.Mock;

const redirectLoginSpy = jest.fn();
AuthServiceMock.mockImplementation(() => {
  return {
    redirectLogin: redirectLoginSpy,
  };
});

jest.mock('@/utilities/utagHelper', () => ({
  ...jest.requireActual('@/utilities/utagHelper'),
  TealiumUtagService: {
    view: jest.fn(),
  },
}));

function emailValidationMock(
  email: string,
  // eslint-disable-next-line camelcase
  error?: validateMemberEmail_validateMemberEmail_errors
) {
  return {
    request: {
      query: VALIDATE_MEMBER_EMAIL,
      variables: {
        email,
      },
    },
    result: {
      data: {
        validateMemberEmail: { errors: [error] },
      },
    },
  };
}

function passwordValidationMock(
  password: string,
  // eslint-disable-next-line camelcase
  error?: validateMemberPassword_validateMemberPassword_errors
) {
  return {
    request: {
      query: VALIDATE_MEMBER_PASSWORD,
      variables: {
        password,
      },
    },
    result: {
      data: {
        validateMemberPassword: { errors: [error] },
      },
    },
  };
}

function seekerCreateMock(
  input: SeniorCareSeekerCreateInput,
  // eslint-disable-next-line camelcase
  result?: seniorCareSeekerCreate_seniorCareSeekerCreate,
  error?: Error
) {
  return {
    request: {
      query: SENIOR_CARE_SEEKER_CREATE,
      variables: {
        input,
      },
    },
    result: result
      ? {
          data: {
            seniorCareSeekerCreate: result,
          },
        }
      : undefined,
    error,
  };
}

const seniorCareAssistedLivingProvidersMock = {
  request: {
    query: SENIOR_CARE_ASSISTED_LIVING_PROVIDERS,
    variables: {
      zipcode: '12345',
      source: 'USC',
      facilityType: SeniorCommunityType.INDEPENDENT_LIVING,
    },
  },
  result: {
    data: {
      seniorCareAssistedLivingProviders: {
        __typename: 'ProviderSearchSuccess',
        trackingId: '6ee2d3be-a636-42a9-8d3c-fedffa5829f6',
        providerSearchResults: [
          {
            distanceFromSearchCenter: {
              __typename: 'PreciseDistance',
              value: 8.883927,
              unit: DistanceUnit.MILES,
            },
            provider: {
              __typename: 'Provider',
              name: 'Signature Senior Living',
              description:
                "Your comfort and happiness is our top priority at ACTIVCARE AT 4S RANCH. When here, residents can participate in small, organized group activities unique to the residents' lives.",
              id: 'afc29491-6d87-4f32-9bff-a4f35300766c',
              centerType: CenterType.SMALL_MEDIUM_BUSINESS,
              images: [],
              address: {
                city: 'CARLSBAD',
                state: 'California',
                latitude: 33.1257895,
                longitude: -117.2553947,
                addressLine1: '11012 Harris Branch Parkway',
                zip: '78754',
              },
              license: {
                certified: false,
              },
              seniorAssistedLivingCenter: {
                attributes: {
                  careServices: {
                    alsCare: true,
                    callSystemTwentyFourHours: false,
                    dailyLivingAssistance: false,
                    diabetesCare: false,
                    healthCareProviderCoordination: false,
                    hospiceCare: false,
                    insulinInjections: false,
                    mealPreparationAndService: false,
                    medicationManagement: false,
                    memoryCare: false,
                    mentalWellnessCare: false,
                    mildCognitiveImpairmentCare: false,
                    nursingTwelveToSixteenHours: true,
                    nursingTwentyFourHours: true,
                    parkinsonsCare: false,
                    physicalTherapy: false,
                    preventativeHealthScreenings: false,
                    rehabilitationProgram: false,
                    respiteCare: false,
                    strokeCare: false,
                    supervisionTwentyFourHours: true,
                    transportationArrangement: false,
                    transportationArrangementMedical: true,
                  },
                  communityTypes: {
                    assistedLiving: true,
                    continuingCare: false,
                    independentLiving: true,
                    memoryCare: false,
                  },
                  facilityAmenities: {
                    barberOrBeautySalon: false,
                    cafeOrBistro: false,
                    computerCenter: false,
                    diningRoom: false,
                    fitnessRoom: false,
                    gameRoom: false,
                    garden: false,
                    library: false,
                    marketOnSite: false,
                    outdoorPatio: false,
                    outdoorSpace: false,
                    privateDiningRooms: false,
                    religiousOrMeditationCenter: false,
                    spaOrJacuzzi: false,
                    swimmingPool: true,
                    wellnessCenter: false,
                  },
                  foodAmenities: {
                    allMealsProvided: true,
                    anytimeDining: false,
                    diabetic: false,
                    glutenFree: true,
                    guestMeals: true,
                    halaal: false,
                    kosher: false,
                    lowOrNoSodium: false,
                    noSugar: false,
                    professionalChef: false,
                    roomService: false,
                    someMealsProvided: false,
                    specialDietaryRestrictions: false,
                    vegan: false,
                    vegetarian: false,
                  },
                  onSiteServices: {
                    beautician: true,
                    concierge: false,
                    familyEducationAndSupport: false,
                    housekeeping: false,
                    laundryOrDryCleaning: false,
                    moveInCoordination: false,
                  },
                },
                offerings: [
                  {
                    monthlyRent: {
                      amount: '2000',
                      currencyCode: 'USD',
                    },
                    communityType: 'ASSISTED_LIVING',
                  },
                  {
                    monthlyRent: {
                      amount: '2500',
                      currencyCode: 'USD',
                    },
                    communityType: 'INDEPENDENT_LIVING',
                  },
                ],
              },
            },
          },
        ],
      },
    },
  },
};

interface RenderOptions {
  mocks?: ReadonlyArray<MockedResponse>;
  ldFlags?: FeatureFlags;
  state?: AppState;
}

const inFacilitySate = {
  ...initialAppState,
  seeker: {
    ...initialAppState.seeker,
    zipcode: '12345',
    city: 'Austin',
    state: 'TX',
    typeOfCare: SENIOR_CARE_TYPE.IN_FACILITY,
  },
};

describe('in facility account creation', () => {
  let mockRouter: any = null;
  let initialState: AppState;
  let rerender: () => void;

  function buildReactElements(options: RenderOptions = {}) {
    const { mocks, ldFlags, state } = options;

    return (
      <ThemeProvider theme={theme}>
        <RouterContext.Provider value={mockRouter}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <FeatureFlagsProvider flags={ldFlags || {}}>
              <AppStateProvider initialStateOverride={state || initialState}>
                <AccountCreation />
              </AppStateProvider>
            </FeatureFlagsProvider>
          </MockedProvider>
        </RouterContext.Provider>
      </ThemeProvider>
    );
  }

  function renderPage(options: RenderOptions = {}) {
    const view = render(buildReactElements(options));
    rerender = () => view.rerender(buildReactElements(options));
    return view;
  }

  async function navigateToDetailsPage(options: RenderOptions = {}) {
    const mergedOptions: RenderOptions = {
      ...options,
      mocks: [...(options.mocks || []), emailValidationMock('tim@care.com')],
    };

    renderPage(mergedOptions);
    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
    const joinNowBtn = screen.getByRole('button', { name: 'Continue' });
    await waitFor(() => expect(joinNowBtn).toBeDisabled());

    const emailField = screen.getByLabelText('Email address');
    await userEvent.type(emailField, 'tim@care.com', { delay: 1 });

    await waitFor(() => expect(joinNowBtn).toBeEnabled());

    userEvent.click(joinNowBtn);

    await waitFor(() =>
      expect(screen.getByText('Add a few more details about yourself.')).toBeVisible()
    );
  }

  async function navigateToPasswordPage(options: RenderOptions = {}) {
    const mergedOptions: RenderOptions = {
      ...options,
      mocks: [...(options.mocks || []), passwordValidationMock('test123')],
    };
    await navigateToDetailsPage(mergedOptions);
    const button = screen.getByRole('button', { name: 'Next' });
    const nameInput = screen.getByLabelText(/First name/);
    const lastNameInput = screen.getByLabelText(/Last name/);
    const phoneInput = screen.getByLabelText(/Phone number/);
    expect(button).toBeDisabled();
    userEvent.type(nameInput, 'testname');
    userEvent.type(lastNameInput, 'lastname');
    userEvent.type(phoneInput, '3644547777');
    await waitFor(() => expect(button).toBeEnabled());

    userEvent.click(button);

    await waitFor(() => expect(screen.getByText(/One final step/)).toBeVisible());
  }

  beforeEach(() => {
    initialState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        zipcode: '12345',
        city: 'Austin',
        state: 'TX',
        assistedLivingCenterFacilityCount: 6,
        caringFacilityCountNearBy: 1,
      },
    };

    mockRouter = {
      push: jest.fn((url) => {
        if (url === SEEKER_IN_FACILITY_ROUTES.ACCOUNT_CREATION_DETAILS) {
          mockRouter.query.param = ['details'];
        } else if (url === SEEKER_IN_FACILITY_ROUTES.ACCOUNT_CREATION_PASSWORD) {
          mockRouter.query.param = ['password'];
        } else {
          mockRouter.query.param = [];
        }
        // since we're mocking the router, we need to manually rerender on pushes
        rerender();
      }),
      query: { param: [] },
      pathname: '/seeker/sc/in-facility/account-creation',
      asPath: '/seeker/sc/in-facility/account-creation',
      beforePopState: () => {},
    };
  });

  afterEach(() => {
    mockRouter = null;
    redirectLoginSpy.mockClear();
  });

  it('matches snapshot', () => {
    const { asFragment } = renderPage();
    expect(asFragment()).toMatchSnapshot();
  });

  describe('Email screen', () => {
    it('renders correctly', async () => {
      renderPage();
      await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
      expect(
        screen.getByText(/There are 6 senior living communities near you!/)
      ).toBeInTheDocument();
    });

    it('should initially render the Continue button as disabled', async () => {
      renderPage();
      await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
      const joinNowBtn = screen.getByRole('button', { name: 'Continue' });
      await waitFor(() => expect(joinNowBtn).toBeDisabled());
    });

    it('should render View results message when is in facility', async () => {
      renderPage({
        state: inFacilitySate,
      });
      await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
      expect(screen.getByText(/It only takes a few seconds./)).toBeInTheDocument();
    });

    it('should enable the Continue button when a valid email is entered', async () => {
      renderPage({
        mocks: [emailValidationMock('tim@care.com'), passwordValidationMock('test123')],
      });
      await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
      const joinNowBtn = screen.getByRole('button', { name: 'Continue' });
      await waitFor(() => expect(joinNowBtn).toBeDisabled());

      const emailField = screen.getByLabelText('Email address');
      await userEvent.type(emailField, 'tim@care.com', { delay: 1 });

      await waitFor(() => expect(joinNowBtn).toBeEnabled());
    });

    it('should disable the Continue button when an invalid email is entered', async () => {
      renderPage({
        mocks: [
          emailValidationMock('tim@care.com', {
            __typename: 'MemberEmailAlreadyRegistered',
            message: 'email is already taken',
          }),
          emailValidationMock('tim2@care.com'),
        ],
      });
      await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
      const joinNowBtn = screen.getByRole('button', { name: 'Continue' });
      await waitFor(() => expect(joinNowBtn).toBeDisabled());

      const emailField = screen.getByLabelText('Email address');
      await userEvent.type(emailField, 'tim2@care.com', { delay: 1 });

      await waitFor(() => expect(joinNowBtn).toBeEnabled());

      await userEvent.type(emailField, 'tim@care.com', { delay: 1 });
      await waitFor(() => expect(joinNowBtn).toBeDisabled());
    });

    it('should render a generic header with an input header describing the ease of account creation if there are no facilities nearby', async () => {
      renderPage({
        state: inFacilitySate,
      });
      await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
      expect(
        screen.getByText(/Almost there! Please create a free account to continue./)
      ).toBeInTheDocument();
      expect(screen.getByText(/It only takes a few seconds./)).toBeInTheDocument();
    });

    it('should show the unHappy path header if selected +12 months', () => {
      const customOptions: RenderOptions = {
        mocks: [emailValidationMock('tim@care.com')],
        state: {
          ...inFacilitySate,
          seeker: {
            ...inFacilitySate.seeker,
            caringFacilityCountNearBy: 10,
            whenLookingToMove: WhenLookingToMoveIntoCommunity.TWELVE_MONTHS,
            paymentDetailTypes: [SeniorCarePaymentSource.GOVERNMENT_HEALTH_PROGRAM],
          },
        },
      };

      renderPage(customOptions);

      expect(
        screen.getByText(/Almost there! Please create a free account to continue./)
      ).toBeInTheDocument();
    });

    it('Should not show number of facilities when less than 5', () => {
      const options: RenderOptions = {
        state: {
          ...inFacilitySate,
          seeker: {
            ...inFacilitySate.seeker,
            caringFacilityCountNearBy: 4,
          },
        },
      };

      renderPage(options);

      expect(screen.getByText(/There are senior living communities near you!/)).toBeInTheDocument();
    });

    it('Should show number of facilities when more than 5', () => {
      const options: RenderOptions = {
        state: {
          ...inFacilitySate,
          seeker: {
            ...inFacilitySate.seeker,
            caringFacilityCountNearBy: 14,
          },
        },
      };

      renderPage(options);

      expect(
        screen.getByText(/There are 14 senior living communities near you!/)
      ).toBeInTheDocument();
    });

    it('Should update email UI with FF enrollment-mfe-in-facility-enrollment-recommendations-and-flow-optimizations', async () => {
      renderPage({
        mocks: [emailValidationMock('tim@care.com'), seniorCareAssistedLivingProvidersMock],
        ldFlags: {
          [CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]: {
            reason: { kind: 'variant' },
            value: '',
            variationIndex: 1,
          },
        },
        state: {
          ...initialAppState,
          seeker: {
            ...initialAppState.seeker,
            zipcode: '92075',
            assistedLivingCenterFacilityCount: 1,
            whoNeedsCare: SeniorCareRecipientRelationshipType.PARENT,
          },
        },
      });
      await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));

      expect(screen.getByText(/We found communities in your area!/)).toBeInTheDocument();
      expect(
        screen.getByText(
          /Create an account to get more information about their pricing and other details/
        )
      ).toBeInTheDocument();
    });

    it('Should update email UI with FF enrollment-mfe-in-facility-enrollment-recommendations-and-flow-optimizations with facility count', async () => {
      renderPage({
        mocks: [emailValidationMock('tim@care.com'), seniorCareAssistedLivingProvidersMock],
        ldFlags: {
          [CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]: {
            reason: { kind: 'variant' },
            value: '',
            variationIndex: 1,
          },
        },
        state: {
          ...initialAppState,
          seeker: {
            ...initialAppState.seeker,
            zipcode: '92075',
            assistedLivingCenterFacilityCount: 13,
            whoNeedsCare: SeniorCareRecipientRelationshipType.PARENT,
            recommendedHelpType: SeniorLivingOptions.INDEPENDENT,
          },
        },
      });
      await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));

      expect(
        screen.getByText(/We found 13 independent living communities in your area!/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /Create an account to get more information about their pricing and other details/
        )
      ).toBeInTheDocument();
    });

    it('Should update email UI with FF enrollment-mfe-in-facility-enrollment-recommendations-and-flow-optimizations for nursing home', async () => {
      renderPage({
        mocks: [emailValidationMock('tim@care.com'), seniorCareAssistedLivingProvidersMock],
        ldFlags: {
          [CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]: {
            reason: { kind: 'variant' },
            value: '',
            variationIndex: 1,
          },
        },
        state: {
          ...initialAppState,
          seeker: {
            ...initialAppState.seeker,
            recommendedHelpType: SeniorLivingOptions.NURSING_HOME,
          },
        },
      });
      await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));

      expect(
        screen.getByText(/Create an account to get more information about nursing homes./)
      ).toBeInTheDocument();
      expect(screen.getByText(/It’s free and fast./)).toBeInTheDocument();
    });
  });

  describe('Details screen', () => {
    it('should render the details form after clicking the Continue button', async () => {
      await navigateToDetailsPage();
      expect(mockRouter.push).toHaveBeenCalledWith(
        SEEKER_IN_FACILITY_ROUTES.ACCOUNT_CREATION_DETAILS
      );
    });

    it('should show an error when name is less than 2 characters', async () => {
      await navigateToDetailsPage();

      const nameInput = screen.getByLabelText(/First name/);
      userEvent.type(nameInput, 'X');
      fireEvent.blur(nameInput);
      expect(await screen.findByText(/Please enter a valid first name/i)).toBeInTheDocument();
    });

    it('should show an error when no name is entered', async () => {
      await navigateToDetailsPage();

      const nameInput = screen.getByLabelText(/First name/);
      fireEvent.focus(nameInput);
      fireEvent.blur(nameInput);
      expect(await screen.findByText(/Please enter a valid first name/i)).toBeInTheDocument();
    });

    it('should show an error when last name is less than 2 characters', async () => {
      await navigateToDetailsPage();

      const lastNameInput = screen.getByLabelText(/Last name/);
      userEvent.type(lastNameInput, 'X');
      fireEvent.blur(lastNameInput);
      expect(await screen.findByText(/Please enter a valid last name/i)).toBeInTheDocument();
    });

    it('should show an error when no lastname is entered', async () => {
      await navigateToDetailsPage();

      const lastNameInput = screen.getByLabelText(/Last name/);
      fireEvent.focus(lastNameInput);
      fireEvent.blur(lastNameInput);
      expect(await screen.findByText(/Please enter a valid last name/i)).toBeInTheDocument();
    });

    it('should show an error when an invalid phone number is entered', async () => {
      await navigateToDetailsPage();

      const phoneInput = screen.getByLabelText(/Phone number/);
      userEvent.type(phoneInput, '123');
      fireEvent.blur(phoneInput);
      expect(await screen.findByText(/Please enter a valid phone number/i)).toBeInTheDocument();
    });

    it('should enable the next button when valid data for the name and phone is entered', async () => {
      await navigateToDetailsPage();
      const button = screen.getByRole('button', { name: 'Next' });
      const nameInput = screen.getByLabelText(/First name/);
      const lastNameInput = screen.getByLabelText(/Last name/);
      const phoneInput = screen.getByLabelText(/Phone number/);
      expect(button).toBeDisabled();
      userEvent.type(nameInput, 'testname');
      userEvent.type(lastNameInput, 'lastname');
      userEvent.type(phoneInput, '3644547777');
      await waitFor(() => expect(button).toBeEnabled());
    });
  });

  describe('Password screen', () => {
    it('should disable the View results button when password screen is rendered', async () => {
      await navigateToPasswordPage({
        state: {
          ...initialAppState,
          seeker: {
            ...initialAppState.seeker,
            condition: SeniorCareRecipientCondition.INDEPENDENT,
            assistedLivingCenterFacilityCount: 5,
          },
        },
      });
      const viewResultsButton = screen.getByRole('button', { name: 'View results' });
      expect(viewResultsButton).toBeDisabled();
    });

    it('should disable the View results button when an invalid password is entered', async () => {
      await navigateToPasswordPage({
        mocks: [
          passwordValidationMock('test123', {
            __typename: 'MemberPasswordInvalid',
            message: 'invalid password',
          }),
          passwordValidationMock('hunter22'),
        ],
        state: {
          ...initialAppState,
          seeker: {
            ...initialAppState.seeker,
            condition: SeniorCareRecipientCondition.INDEPENDENT,
            assistedLivingCenterFacilityCount: 5,
          },
        },
      });
      const submitBtn = screen.getByRole('button', { name: 'View results' });
      expect(submitBtn).toBeDisabled();

      const passwordField = screen.getByLabelText('Password');
      await userEvent.type(passwordField, 'test123', { delay: 1 });
      await waitFor(() => expect(submitBtn).toBeDisabled());

      await userEvent.type(passwordField, 'hunter22', { delay: 1 });
      await waitFor(() => expect(submitBtn).toBeEnabled());
    });

    it('should disable the View results button when the email and password are equal', async () => {
      await navigateToPasswordPage({
        mocks: [emailValidationMock('tim@care.com'), seniorCareAssistedLivingProvidersMock],
      });
      const button = screen.getByRole('button', { name: 'View results' });
      const passwordField = screen.getByLabelText(/Password/);
      expect(button).toBeDisabled();

      await userEvent.type(passwordField, 'test123', { delay: 1 });
      await waitFor(() => expect(button).toBeEnabled());

      await userEvent.type(passwordField, 'tim@care.com', { delay: 1 });
      await waitFor(() => expect(button).toBeDisabled());
    });

    it('should enable the View results button when valid data is entered', async () => {
      await navigateToPasswordPage({
        mocks: [emailValidationMock('tim@care.com'), seniorCareAssistedLivingProvidersMock],
      });

      const button = screen.getByRole('button', { name: 'View results' });

      const passwordField = screen.getByLabelText(/Password/);
      expect(button).toBeDisabled();
      userEvent.type(passwordField, 'test123');
      await waitFor(() => expect(button).toBeEnabled());
    });

    it('should disable the View results button when first name is in the password', async () => {
      await navigateToPasswordPage();

      const button = screen.getByRole('button', { name: 'View results' });
      const passwordField = screen.getByLabelText(/Password/);
      expect(button).toBeDisabled();
      userEvent.type(passwordField, 'testname');
      fireEvent.blur(passwordField);

      await waitFor(() => expect(button).toBeDisabled());
      expect(
        await screen.findByText("Please don't use your first name in your password.")
      ).toBeVisible();
    });

    it('should disable the View results button when last name is in the password', async () => {
      await navigateToPasswordPage();

      const button = screen.getByRole('button', { name: 'View results' });
      const passwordField = screen.getByLabelText(/Password/);
      expect(button).toBeDisabled();
      userEvent.type(passwordField, 'lastname');
      fireEvent.blur(passwordField);

      await waitFor(() => expect(button).toBeDisabled());
      expect(
        await screen.findByText("Please don't use your last name in your password.")
      ).toBeVisible();
    });

    it('should display the error message when the mutation for account creation fails', async () => {
      await navigateToDetailsPage({
        mocks: [
          seekerCreateMock(
            {
              email: 'tim@care.com',
              password: 'test123',
              firstName: 'Tim',
              lastName: 'Allen',
              zipcode: initialState.seeker.zipcode,
              referrerCookie: initialState.flow.referrerCookie,
              careType: SENIOR_CARE_TYPE.IN_FACILITY,
              howDidYouHearAboutUs: undefined,
            },
            {
              __typename: 'SeniorCareSeekerCreateError',
              errors: [{ __typename: 'MemberEmailInvalidLength', message: 'oh noes!' }],
            }
          ),
        ],
        state: {
          ...initialState,
          seeker: {
            ...initialState.seeker,
            assistedLivingCenterFacilityCount: 0,
          },
        },
      });

      const button = screen.getByRole('button', { name: 'Next' });
      const nameInput = screen.getByLabelText(/First name/);
      const lastNameInput = screen.getByLabelText(/Last name/);
      const phoneInput = screen.getByLabelText(/Phone number/);
      userEvent.type(nameInput, 'Tim');
      userEvent.type(lastNameInput, 'Allen');
      userEvent.type(phoneInput, '3644547777');
      await waitFor(() => expect(button).toBeEnabled());

      fireEvent.click(button);

      await screen.findByText(/One final step/);

      const submitBtn = screen.getByRole('button', { name: 'View results' });
      const passwordField = screen.getByLabelText(/Password/);
      userEvent.type(passwordField, 'test123');
      await waitFor(() => expect(submitBtn).toBeEnabled());

      fireEvent.click(submitBtn);
      expect(await screen.findByText('oh noes!')).toBeVisible();
    });

    it('should display a generic error message when the mutation for account creation fails for an unknown reason', async () => {
      await navigateToPasswordPage({
        mocks: [
          seekerCreateMock(
            {
              email: 'tim@care.com',
              password: 'test123',
              firstName: 'Tim',
              lastName: 'Allen',
              zipcode: initialState.seeker.zipcode,
              referrerCookie: initialState.flow.referrerCookie,
              careType: SENIOR_CARE_TYPE.IN_FACILITY,
              howDidYouHearAboutUs: undefined,
            },
            undefined,
            new Error('ruh roh')
          ),
        ],
        state: {
          ...initialState,
          seeker: {
            ...initialState.seeker,
            assistedLivingCenterFacilityCount: 0,
          },
        },
      });

      const submitBtn = screen.getByRole('button', { name: 'View results' });
      const passwordField = screen.getByLabelText(/Password/);
      userEvent.type(passwordField, 'test123');
      await waitFor(() => expect(submitBtn).toBeEnabled());

      fireEvent.click(submitBtn);

      expect(
        await screen.findByText('An error occurred creating your account, please try again.')
      ).toBeVisible();
    });

    it('should navigate to the "caring leads" page after successfully creating the account', async () => {
      await navigateToDetailsPage({
        mocks: [
          seekerCreateMock(
            {
              email: 'tim@care.com',
              password: 'test123',
              firstName: 'Tim',
              lastName: 'Allen',
              zipcode: initialState.seeker.zipcode,
              referrerCookie: initialState.flow.referrerCookie,
              careType: SENIOR_CARE_TYPE.IN_FACILITY,
              howDidYouHearAboutUs: undefined,
            },
            {
              __typename: 'SeniorCareSeekerCreateSuccess',
              authToken: 'authToken',
              memberId: 'memberId',
              oneTimeToken: 'oneTimeToken',
            }
          ),
        ],
        state: {
          ...initialState,
          seeker: {
            ...initialState.seeker,
            assistedLivingCenterFacilityCount: 0,
          },
        },
      });

      const button = screen.getByRole('button', { name: 'Next' });
      const nameInput = screen.getByLabelText(/First name/);
      const lastNameInput = screen.getByLabelText(/Last name/);
      const phoneInput = screen.getByLabelText(/Phone number/);
      userEvent.type(nameInput, 'Tim');
      userEvent.type(lastNameInput, 'Allen');
      userEvent.type(phoneInput, '3644547777');
      await waitFor(() => expect(button).toBeEnabled());

      fireEvent.click(button);

      await screen.findByText(/One final step. Create a password/);

      const submitBtn = screen.getByRole('button', { name: 'View results' });
      const passwordField = screen.getByLabelText(/Password/);
      userEvent.type(passwordField, 'test123');
      await waitFor(() => expect(submitBtn).toBeEnabled());

      fireEvent.click(submitBtn);

      await waitFor(() =>
        expect(redirectLoginSpy).toHaveBeenCalledWith(
          expect.stringContaining(SEEKER_IN_FACILITY_ROUTES.CARING_LEADS),
          'authToken',
          'oneTimeToken'
        )
      );
    });

    it('should navigate to the "community-list" page after successfully creating the account', async () => {
      await navigateToDetailsPage({
        mocks: [
          seekerCreateMock(
            {
              email: 'tim@care.com',
              password: 'test123',
              firstName: 'Tim',
              lastName: 'Allen',
              zipcode: inFacilitySate.seeker.zipcode,
              referrerCookie: inFacilitySate.flow.referrerCookie,
              careType: SENIOR_CARE_TYPE.IN_FACILITY,
              howDidYouHearAboutUs: undefined,
            },
            {
              __typename: 'SeniorCareSeekerCreateSuccess',
              authToken: 'authToken',
              memberId: 'memberId',
              oneTimeToken: 'oneTimeToken',
            }
          ),
          seniorCareAssistedLivingProvidersMock,
        ],
        state: {
          ...inFacilitySate,
          seeker: {
            ...inFacilitySate.seeker,
            assistedLivingCenterFacilityCount: 5,
            condition: SeniorCareRecipientCondition.INDEPENDENT,
          },
        },
      });

      const button = screen.getByRole('button', { name: 'Next' });
      const nameInput = screen.getByLabelText(/First name/);
      const lastNameInput = screen.getByLabelText(/Last name/);
      const phoneInput = screen.getByLabelText(/Phone number/);
      userEvent.type(nameInput, 'Tim');
      userEvent.type(lastNameInput, 'Allen');
      userEvent.type(phoneInput, '3025555555');
      await waitFor(() => expect(button).toBeEnabled());

      fireEvent.click(button);

      await screen.findByText(/One final step/);

      const submitBtn = screen.getByRole('button', { name: 'View results' });
      expect(submitBtn).toBeDisabled();

      const passwordField = screen.getByLabelText(/Password/);
      userEvent.type(passwordField, 'test123');
      await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));

      await waitFor(() => expect(submitBtn).toBeEnabled());
      fireEvent.click(submitBtn);

      await waitFor(() =>
        expect(redirectLoginSpy).toHaveBeenCalledWith(
          expect.stringContaining(SEEKER_IN_FACILITY_ROUTES.COMMUNITY_LIST),
          'authToken',
          'oneTimeToken'
        )
      );
    });

    it('should navigate to the "options" page after successfully creating the account when 12+ months is selected', async () => {
      await navigateToDetailsPage({
        mocks: [
          seekerCreateMock(
            {
              email: 'tim@care.com',
              password: 'test123',
              firstName: 'Tim',
              lastName: 'Allen',
              zipcode: inFacilitySate.seeker.zipcode,
              referrerCookie: inFacilitySate.flow.referrerCookie,
              careType: SENIOR_CARE_TYPE.IN_FACILITY,
              howDidYouHearAboutUs: undefined,
            },
            {
              __typename: 'SeniorCareSeekerCreateSuccess',
              authToken: 'authToken',
              memberId: 'memberId',
              oneTimeToken: 'oneTimeToken',
            }
          ),
        ],
        state: {
          ...inFacilitySate,
          seeker: {
            ...inFacilitySate.seeker,
            caringFacilityCountNearBy: 0,
            whenLookingToMove: WhenLookingToMoveIntoCommunity.TWELVE_MONTHS,
            paymentDetailTypes: [SeniorCarePaymentSource.GOVERNMENT_HEALTH_PROGRAM],
          },
        },
      });

      const button = screen.getByRole('button', { name: 'Next' });
      const nameInput = screen.getByLabelText(/First name/);
      const lastNameInput = screen.getByLabelText(/Last name/);
      const phoneInput = screen.getByLabelText(/Phone number/);
      userEvent.type(nameInput, 'Tim');
      userEvent.type(lastNameInput, 'Allen');
      userEvent.type(phoneInput, '3644547777');
      await waitFor(() => expect(button).toBeEnabled());

      fireEvent.click(button);

      await screen.findByText(/One final step. Create a password/);

      const submitBtn = screen.getByRole('button', { name: 'View results' });
      const passwordField = screen.getByLabelText(/Password/);
      userEvent.type(passwordField, 'test123');
      await waitFor(() => expect(submitBtn).toBeEnabled());

      fireEvent.click(submitBtn);

      await waitFor(() =>
        expect(redirectLoginSpy).toHaveBeenCalledWith(
          expect.stringContaining(SEEKER_IN_FACILITY_ROUTES.OPTIONS),
          'authToken',
          'oneTimeToken'
        )
      );
    });

    it('Should trigger TealiumUtagService.view when creating the account', async () => {
      await navigateToDetailsPage({
        mocks: [
          seekerCreateMock(
            {
              email: 'tim@care.com',
              password: 'test123',
              firstName: 'Tim',
              lastName: 'Allen',
              zipcode: initialState.seeker.zipcode,
              referrerCookie: initialState.flow.referrerCookie,
              careType: SENIOR_CARE_TYPE.IN_FACILITY,
              howDidYouHearAboutUs: undefined,
            },
            {
              __typename: 'SeniorCareSeekerCreateSuccess',
              authToken: 'authToken',
              memberId: 'memberId',
              oneTimeToken: 'oneTimeToken',
            }
          ),
        ],
        state: {
          ...initialState,
          seeker: {
            ...initialState.seeker,
            assistedLivingCenterFacilityCount: 0,
          },
        },
      });

      const button = screen.getByRole('button', { name: 'Next' });
      const nameInput = screen.getByLabelText(/First name/);
      const lastNameInput = screen.getByLabelText(/Last name/);
      const phoneInput = screen.getByLabelText(/Phone number/);
      userEvent.type(nameInput, 'Tim');
      userEvent.type(lastNameInput, 'Allen');
      userEvent.type(phoneInput, '3644547777');
      await waitFor(() => expect(button).toBeEnabled());

      fireEvent.click(button);

      await screen.findByText(/One final step. Create a password/);

      const submitBtn = screen.getByRole('button', { name: 'View results' });
      const passwordField = screen.getByLabelText(/Password/);
      userEvent.type(passwordField, 'test123');
      await waitFor(() => expect(submitBtn).toBeEnabled());

      fireEvent.click(submitBtn);

      await waitFor(() => expect(TealiumUtagService.view).toHaveBeenCalled());
    });

    it('Should update UI qualifies budget and facilities', async () => {
      renderPage({
        mocks: [emailValidationMock('tim@care.com'), seniorCareAssistedLivingProvidersMock],
        state: {
          ...initialAppState,
          seeker: {
            ...initialAppState.seeker,
            zipcode: '12345',
            assistedLivingCenterFacilityCount: 5,
            condition: SeniorCareRecipientCondition.INDEPENDENT,
            whoNeedsCare: SeniorCareRecipientRelationshipType.PARENT,
          },
        },
      });
      await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));

      expect(screen.getByText(/Create a free account to continue./)).toBeInTheDocument();
      const emailInput = screen.getByLabelText('Email address');
      const continueButton = screen.getByRole('button', { name: 'Continue' });
      await userEvent.type(emailInput, 'tim@care.com', { delay: 1 });
      await waitFor(() => expect(continueButton).toBeEnabled());
      fireEvent.click(continueButton);

      await waitFor(async () => screen.findByText(/Add a few more details about yourself./));
      const firstNameInput = screen.getByLabelText('First name');
      const lastNameInput = screen.getByLabelText('Last name');
      const phoneNumberInput = screen.getByLabelText('Phone number');

      userEvent.type(firstNameInput, 'Tim');
      userEvent.type(lastNameInput, 'Allen');
      userEvent.type(phoneNumberInput, '3644547777');
      const nextButton = screen.getByRole('button', { name: 'Next' });
      await waitFor(() => expect(nextButton).toBeEnabled());
      fireEvent.click(nextButton);

      await waitFor(() =>
        expect(screen.getByText(/Create a password to connect with communities./))
      );
      expect(
        screen.getByText(/Create a password to connect with communities./)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Receive suggestions based on your parent's needs/)
      ).toBeInTheDocument();
      expect(screen.getByText(/Get expert assistance through the process/)).toBeInTheDocument();
      expect(screen.getByText(/It’s free and fast!/)).toBeInTheDocument();
    });

    it('Should update UI with FF enrollment-mfe-in-facility-enrollment-recommendations-and-flow-optimizations', async () => {
      renderPage({
        mocks: [emailValidationMock('tim@care.com'), seniorCareAssistedLivingProvidersMock],
        ldFlags: {
          [CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]: {
            reason: { kind: '' },
            value: '',
            variationIndex: 1,
          },
        },
        state: {
          ...initialAppState,
          seeker: {
            ...initialAppState.seeker,
            zipcode: '12345',
            assistedLivingCenterFacilityCount: 1,
            whoNeedsCare: SeniorCareRecipientRelationshipType.PARENT,
          },
        },
      });
      await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));

      const emailInput = screen.getByLabelText('Email address');
      const continueButton = screen.getByRole('button', { name: 'Continue' });
      await userEvent.type(emailInput, 'tim@care.com', { delay: 1 });
      await waitFor(() => expect(continueButton).toBeEnabled());
      fireEvent.click(continueButton);

      await waitFor(async () => screen.findByText(/Add a few more details about yourself./));
      const firstNameInput = screen.getByLabelText('First name');
      const lastNameInput = screen.getByLabelText('Last name');
      const phoneNumberInput = screen.getByLabelText('Phone number');

      userEvent.type(firstNameInput, 'Tim');
      userEvent.type(lastNameInput, 'Allen');
      userEvent.type(phoneNumberInput, '3644547777');
      const nextButton = screen.getByRole('button', { name: 'Next' });
      await waitFor(() => expect(nextButton).toBeEnabled());
      fireEvent.click(nextButton);

      await waitFor(() =>
        expect(screen.getByText(/Create a password to connect with communities./))
      );
      expect(
        screen.getByText(/Receive suggestions based on your parent's needs/)
      ).toBeInTheDocument();
      expect(screen.getByText(/Get expert assistance through the process/)).toBeInTheDocument();
      expect(screen.getByText(/It’s free and fast!/)).toBeInTheDocument();

      const button = screen.getByRole('button', { name: 'Create account' });
      const passwordField = screen.getByLabelText(/Password/);
      userEvent.type(passwordField, 'test123');
      await waitFor(() => expect(button).toBeEnabled());
    });
  });
});
