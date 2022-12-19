import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { cloneDeep } from 'lodash-es';
import userEvent from '@testing-library/user-event';
import { initialAppState } from '@/state';

import { SeniorCareRecipientCondition } from '@/types/seeker';
import {
  SeniorCareFacilityAmenity,
  SeniorCareRecipientRelationshipType,
  YesOrNoAnswer,
  SeniorCareAgeRangeType,
  SeniorCarePaymentSource,
} from '@/__generated__/globalTypes';
import { AppState } from '@/types/app';
import { AppStateProvider, useAppDispatch } from '@/components/AppState';
import {
  GET_NUMBER_OF_SENIOR_CARE_FACILITIES_NEARBY,
  SENIOR_CARE_FACILITY_LEAD_GENERATE,
} from '@/components/request/GQL';
import { SEEKER_IN_FACILITY_ROUTES } from '@/constants';
import CaringLeads from '../caring-leads';

const defaultZipCode = '90001';
const noFacilitiesZipCode = '81006';

const initialState: AppState = cloneDeep(initialAppState);
const appState = {
  ...initialState,
  seeker: {
    ...initialState.seeker,
    zipcode: defaultZipCode,
  },
  flow: {
    ...initialState.flow,
    memberId: '123',
  },
};

const noFacilitiesAppState = {
  ...initialState,
  seeker: {
    ...initialState.seeker,
    zipcode: noFacilitiesZipCode,
  },
  flow: {
    ...initialState.flow,
    memberId: '123',
  },
};

const leadGenerateAppState: AppState = {
  ...initialState,
  seeker: {
    ...initialState.seeker,
    whoNeedsCare: SeniorCareRecipientRelationshipType.SPOUSE,
    whoNeedsCareAge: SeniorCareAgeRangeType.EIGHTIES,
    helpTypes: [],
    zipcode: defaultZipCode,
    seekerInfo: {
      email: 'tsetso@test.com',
      firstName: 'Tsvetan',
      lastName: 'Iliev',
      phone: '(202) 456-1111',
    },
    condition: SeniorCareRecipientCondition.NOT_SURE,
    amenities: [SeniorCareFacilityAmenity.PET_FRIENDLY, SeniorCareFacilityAmenity.EXERCISE_GROUPS],
    paymentDetailTypes: [SeniorCarePaymentSource.PRIVATE_PAY],
  },
  flow: {
    ...initialState.flow,
    memberId: '123',
  },
};

const getNumberOfSeniorCareFacilitiesNearbyMock = {
  request: {
    query: GET_NUMBER_OF_SENIOR_CARE_FACILITIES_NEARBY,
    variables: {
      zipcode: defaultZipCode,
      notSure: false,
      independentLivingFacilities: false,
      assistedLivingFacilities: true,
      memoryCareFacilities: false,
    },
  },
  result: {
    data: {
      getNumberOfSeniorCareFacilitiesNearby: {
        __typename: 'GetNumberOfSeniorCareFacilitiesNearbySuccess',
        countAssistedLivingFacilities: 6,
      },
    },
  },
};

const getNumberOfSeniorCareFacilitiesNearbyNullMock = {
  request: {
    query: GET_NUMBER_OF_SENIOR_CARE_FACILITIES_NEARBY,
    variables: {
      zipcode: noFacilitiesZipCode,
      notSure: false,
      independentLivingFacilities: false,
      assistedLivingFacilities: true,
      memoryCareFacilities: false,
    },
  },
  result: {
    data: {
      getNumberOfSeniorCareFacilitiesNearby: {
        __typename: 'GetNumberOfSeniorCareFacilitiesNearbySuccess',
        countAssistedLivingFacilities: 0,
      },
    },
  },
};

const seniorCareFacilityLeadGenerateMutationMock = {
  request: {
    query: SENIOR_CARE_FACILITY_LEAD_GENERATE,
    variables: {
      input: {
        acceptedCaringTermsOfUse: true,
        relationship: SeniorCareRecipientRelationshipType.SPOUSE as string,
        serviceNeeded: [],
        memoryCareFacilityNeeded: YesOrNoAnswer.NO as string,
        zipcode: defaultZipCode,
        email: 'tsetso@test.com',
        firstName: 'Tsvetan',
        lastName: 'Iliev',
        phone: '(202) 456-1111',
        careRecipientCondition: SeniorCareRecipientCondition.NOT_SURE as string,
        ageRange: SeniorCareAgeRangeType.EIGHTIES as string,
        amenities: [
          SeniorCareFacilityAmenity.PET_FRIENDLY as string,
          SeniorCareFacilityAmenity.EXERCISE_GROUPS as string,
        ],
        paymentSources: [SeniorCarePaymentSource.PRIVATE_PAY as string],
      },
    },
  },
  result: {
    data: {
      seniorCareFacilityLeadGenerate: {
        __typename: 'SeniorCareFacilityLeadGenerateSuccess',
        dummy: 'Senior care facility lead generated successfully',
      },
    },
  },
};

const seniorCareFacilityLeadGenerateMutationErrorMock = {
  request: {
    query: SENIOR_CARE_FACILITY_LEAD_GENERATE,
    variables: {
      input: {
        acceptedCaringTermsOfUse: true,
        relationship: 'OTHER',
        serviceNeeded: ['COMPANIONSHIP', 'MEDICATION'],
        memoryCareFacilityNeeded: 'YES',
        zipcode: '78721',
        email: 'tsetso@test.com',
        firstName: 'Tsvetan',
        lastName: 'Iliev',
        phone: '(202) 456-1111',
        careRecipientCondition: 'CONSTANT_SUPERVISION_NEEDED',
        ageRange: 'EIGHTIES',
        amenities: ['PET_FRIENDLY', 'EXERCISE_GROUPS'],
        paymentSources: ['GOVERNMENT_HEALTH_PROGRAM', 'PRIVATE_PAY', 'VETERANS_BENEFITS'],
      },
    },
  },
  result: {
    data: null,
  },
  error: new Error('An error ocurred'),
};

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('@/components/hooks/useNextRoute');

jest.mock('next/config', () => () => {
  return {
    publicRuntimeConfig: {
      CZEN_GENERAL: 'https://www.dev.carezen.net',
    },
  };
});

jest.mock('@/components/AppState', () => ({
  ...(jest.requireActual('@/components/AppState') as object),
  useAppDispatch: jest.fn(),
}));

let mockAppDispatch: ReturnType<typeof useAppDispatch> | null;

describe('caring-leads screen - in facility', () => {
  let mockRouter: any = null;
  let asFragment: any | null = null;

  const renderComponent = (mocks: MockedResponse[], state?: AppState) => {
    const view = render(
      <MockedProvider mocks={mocks} addTypename>
        <AppStateProvider initialStateOverride={state || appState}>
          <CaringLeads />
        </AppStateProvider>
      </MockedProvider>
    );
    ({ asFragment } = view);
    return view;
  };

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
      pathname: '/seeker/sc/in-facility/caring-leads',
      asPath: '/seeker/sc/in-facility/caring-leads',
    };

    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    mockAppDispatch = jest.fn();
    (useAppDispatch as jest.Mock).mockReturnValue(mockAppDispatch);
  });

  afterEach(() => {
    // cleanup on exiting
    mockRouter = null;
    asFragment = null;
    mockAppDispatch = null;
  });

  it('matches snapshot', () => {
    renderComponent([getNumberOfSeniorCareFacilitiesNearbyMock]);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly', async () => {
    renderComponent([getNumberOfSeniorCareFacilitiesNearbyMock], undefined);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Get connected' })).toBeVisible()
    );

    expect(
      screen.getByText(/Get personalized help finding the best community for your loved one/)
    ).toBeInTheDocument();
  });

  it('navigates to options page if no senior care facilities', async () => {
    renderComponent(
      [
        getNumberOfSeniorCareFacilitiesNearbyNullMock,
        seniorCareFacilityLeadGenerateMutationErrorMock,
      ],
      noFacilitiesAppState
    );
    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
    expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.OPTIONS);
  });

  it('navigates to path on successful request', async () => {
    renderComponent([
      getNumberOfSeniorCareFacilitiesNearbyMock,
      seniorCareFacilityLeadGenerateMutationMock,
    ]);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Get connected' })).toBeVisible()
    );

    const button = screen.getByRole('button', { name: 'Get connected' });

    userEvent.click(button);
    expect(
      screen.getByText(/Get personalized help finding the best community for your loved one/)
    ).toBeInTheDocument();
  });

  it('should call setSeniorCareFacilityLeadGenerateMutationError as true', async () => {
    renderComponent(
      [getNumberOfSeniorCareFacilitiesNearbyMock, seniorCareFacilityLeadGenerateMutationErrorMock],
      leadGenerateAppState
    );

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Get connected' })).toBeVisible()
    );

    fireEvent.click(screen.getByRole('button', { name: 'Get connected' }));

    expect(
      await screen.findByText(/Get personalized help finding the best community for your loved one/)
    ).toBeInTheDocument();

    await waitFor(() =>
      expect(mockAppDispatch).toHaveBeenCalledWith({
        type: 'setSeniorCareFacilityLeadGenerateMutationError',
        value: true,
      })
    );
  });

  it('should call setSeniorCareFacilityLeadGenerateMutationError as false', async () => {
    renderComponent(
      [getNumberOfSeniorCareFacilitiesNearbyMock, seniorCareFacilityLeadGenerateMutationMock],
      leadGenerateAppState
    );

    await waitFor(
      () => expect(screen.getByRole('button', { name: 'Get connected' })).toBeVisible(),
      {
        timeout: 5000,
      }
    );

    fireEvent.click(screen.getByRole('button', { name: 'Get connected' }));

    expect(
      await screen.findByText(/Get personalized help finding the best community for your loved one/)
    ).toBeInTheDocument();

    expect(mockAppDispatch).toHaveBeenCalledWith({
      type: 'setSeniorCareFacilityLeadGenerateMutationError',
      value: false,
    });
  });

  it("prompts for a phone number when it's missing and request info is clicked", async () => {
    const currentState = {
      ...initialState,
      seeker: {
        ...initialState.seeker,
        zipcode: defaultZipCode,
        seekerInfo: {
          firstName: 'Joseph',
          lastName: 'Distler',
          email: 'joseph@care.com',
          phone: '',
        },
      },
      flow: {
        ...initialState.flow,
        memberId: '123',
      },
    };

    renderComponent(
      [getNumberOfSeniorCareFacilitiesNearbyMock, seniorCareFacilityLeadGenerateMutationMock],
      currentState
    );

    await waitFor(
      () => expect(screen.getByRole('button', { name: 'Get connected' })).toBeVisible(),
      {
        timeout: 5000,
      }
    );

    const button = screen.getByRole('button', { name: 'Get connected' });

    userEvent.click(button);
    await waitFor(() =>
      expect(
        screen.getByText(/What’s the best number for a senior care advisor to reach you at?/)
      ).toBeVisible()
    );
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });

  it("prompts for seeker info when it's missing and get connected is clicked", async () => {
    const currentState = {
      ...initialState,
      seeker: {
        ...initialState.seeker,
        zipcode: defaultZipCode,
        seekerInfo: {
          firstName: '',
          lastName: '',
          email: 'joseph@care.com',
          phone: '',
        },
      },
      flow: {
        ...initialState.flow,
        memberId: '123',
      },
    };

    renderComponent(
      [getNumberOfSeniorCareFacilitiesNearbyMock, seniorCareFacilityLeadGenerateMutationMock],
      currentState
    );

    await waitFor(
      () => expect(screen.getByRole('button', { name: 'Get connected' })).toBeVisible(),
      {
        timeout: 5000,
      }
    );

    const button = screen.getByRole('button', { name: 'Get connected' });

    userEvent.click(button);
    await waitFor(() =>
      expect(
        screen.getByText(/Share the best contact info for a senior care advisor to reach you at./)
      ).toBeVisible()
    );
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });

  it("prompts for a phone number when it's undefined and request info is clicked", async () => {
    const currentState = {
      ...initialState,
      seeker: {
        ...initialState.seeker,
        zipcode: defaultZipCode,
        seekerInfo: {
          firstName: 'Joseph',
          lastName: 'Distler',
        },
      },
      flow: {
        ...initialState.flow,
        memberId: '123',
      },
    };

    renderComponent(
      [getNumberOfSeniorCareFacilitiesNearbyMock, seniorCareFacilityLeadGenerateMutationMock],
      currentState as unknown as AppState
    );

    await waitFor(
      () => expect(screen.getByRole('button', { name: 'Get connected' })).toBeVisible(),
      {
        timeout: 5000,
      }
    );

    const button = screen.getByRole('button', { name: 'Get connected' });

    userEvent.click(button);
    await waitFor(() =>
      expect(
        screen.getByText(/What’s the best number for a senior care advisor to reach you at?/)
      ).toBeVisible()
    );
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });

  it("prompts for the seeker info when it's undefined and get connected is clicked", async () => {
    const currentState = {
      ...initialState,
      seeker: {
        ...initialState.seeker,
        zipcode: defaultZipCode,
        seekerInfo: {
          email: 'joseph@care.com',
        },
      },
      flow: {
        ...initialState.flow,
        memberId: '123',
      },
    };

    renderComponent(
      [getNumberOfSeniorCareFacilitiesNearbyMock, seniorCareFacilityLeadGenerateMutationMock],
      currentState as unknown as AppState
    );

    await waitFor(
      () => expect(screen.getByRole('button', { name: 'Get connected' })).toBeVisible(),
      {
        timeout: 5000,
      }
    );

    const button = screen.getByRole('button', { name: 'Get connected' });

    userEvent.click(button);
    await waitFor(() =>
      expect(
        screen.getByText(/Share the best contact info for a senior care advisor to reach you at./)
      ).toBeVisible()
    );
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });

  it('continues with the submission once the missing phone is added', async () => {
    const currentState = {
      ...leadGenerateAppState,
      seeker: {
        ...leadGenerateAppState.seeker,
        zipcode: defaultZipCode,
        seekerInfo: {
          email: 'tsetso@test.com',
          firstName: 'Tsvetan',
          lastName: 'Iliev',
          phone: '',
        },
      },
      flow: {
        ...leadGenerateAppState.flow,
        memberId: '123',
      },
    };

    renderComponent(
      [getNumberOfSeniorCareFacilitiesNearbyMock, seniorCareFacilityLeadGenerateMutationMock],
      currentState
    );

    await waitFor(
      () => expect(screen.getByRole('button', { name: 'Get connected' })).toBeVisible(),
      {
        timeout: 5000,
      }
    );

    const button = screen.getByRole('button', { name: 'Get connected' });

    userEvent.click(button);
    await waitFor(() =>
      expect(
        screen.getByText(/What’s the best number for a senior care advisor to reach you at?/)
      ).toBeVisible()
    );
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();

    await userEvent.type(screen.getByLabelText('Phone number'), '(202) 456-1111', { delay: 1 });

    const continueBtn = screen.getByRole('button', { name: 'Continue' });
    await waitFor(() => expect(continueBtn).toBeEnabled());
    userEvent.click(continueBtn);

    // await waitFor(() =>
    //   expect(
    //     screen.getByText(/Get personalized help finding the best community for your loved one/)
    //   ).toBeInTheDocument()
    // );

    expect(
      await screen.findByText(/Get personalized help finding the best community for your loved one/)
    ).toBeInTheDocument();
  });

  it('continues with the submission once the missing info is added', async () => {
    const currentState = {
      ...leadGenerateAppState,
      seeker: {
        ...leadGenerateAppState.seeker,
        zipcode: defaultZipCode,
        seekerInfo: {
          email: 'tsetso@test.com',
          firstName: '',
          lastName: '',
          phone: '',
        },
      },
      flow: {
        ...leadGenerateAppState.flow,
        memberId: '123',
      },
    };

    renderComponent(
      [getNumberOfSeniorCareFacilitiesNearbyMock, seniorCareFacilityLeadGenerateMutationMock],
      currentState
    );

    await waitFor(
      () => expect(screen.getByRole('button', { name: 'Get connected' })).toBeVisible(),
      {
        timeout: 5000,
      }
    );

    const button = screen.getByRole('button', { name: 'Get connected' });

    userEvent.click(button);
    await waitFor(() =>
      expect(
        screen.getByText(/Share the best contact info for a senior care advisor to reach you at./)
      ).toBeVisible()
    );
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();

    await userEvent.type(screen.getByLabelText('First name'), 'Tsvetan', { delay: 1 });
    await userEvent.type(screen.getByLabelText('Last name'), 'Iliev', { delay: 1 });
    await userEvent.type(screen.getByLabelText('Phone number'), '(202) 456-1111', { delay: 1 });

    const continueBtn = screen.getByRole('button', { name: 'Continue' });
    await waitFor(() => expect(continueBtn).toBeEnabled());
    userEvent.click(continueBtn);

    expect(
      await screen.findByText(/Get personalized help finding the best community for your loved one/)
    ).toBeInTheDocument();
  });
});
