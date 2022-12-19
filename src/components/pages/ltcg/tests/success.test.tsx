import { screen, waitFor } from '@testing-library/react';
import { GraphQLError } from 'graphql';
import {
  CREATE_HOME_PAY_PROSPECT,
  HIRED_CAREGIVER_CRM_EVENT_CREATE,
} from '@/components/request/GQL';
import logger from '@/lib/clientLogger';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { preRenderPage } from '@/__setup__/testUtil';
import {
  YesOrNoAnswer,
  HomePayExpectedHireTimeFrame,
  HomepayCaregiverType,
  CareDate,
  ServiceType,
} from '@/__generated__/globalTypes';
import {
  createHomePayProspect,
  createHomePayProspectVariables,
} from '@/__generated__/createHomePayProspect';
import {
  CzenCrmEventHiredCaregiverCreate,
  CzenCrmEventHiredCaregiverCreateVariables,
} from '@/__generated__/CzenCrmEventHiredCaregiverCreate';

import Success from '../success';

const czenCrmEventHiredCaregiverCreateMock = {
  request: {
    query: HIRED_CAREGIVER_CRM_EVENT_CREATE,
    variables: {
      input: {
        czenCrmEventHiredCaregiver: {
          isEnrollment: true,
          vertical: ServiceType.SENIOR_CARE,
        },
        userId: '123456',
      },
    } as CzenCrmEventHiredCaregiverCreateVariables,
  },
  result: {
    data: {
      czenCrmEventHiredCaregiverCreate: {
        __typename: 'CzenCrmEventResponse',
        success: true,
      },
    } as CzenCrmEventHiredCaregiverCreate,
  },
};

const czenCrmEventHiredCaregiverCreateErrorMock = {
  request: {
    query: HIRED_CAREGIVER_CRM_EVENT_CREATE,
    variables: {
      input: {
        czenCrmEventHiredCaregiver: {
          isEnrollment: true,
          vertical: ServiceType.SENIOR_CARE,
        },
        userId: '123456',
      },
    } as CzenCrmEventHiredCaregiverCreateVariables,
  },
  result: {
    data: null,
    errors: [
      {
        message: 'server error',
        locations: [
          {
            line: 2,
            column: 3,
          },
        ],
      },
    ] as unknown as GraphQLError[],
  },
};

const createHomePayProspectMock = {
  request: {
    query: CREATE_HOME_PAY_PROSPECT,
    variables: {
      input: {
        address: {
          addressLine1: '5th street',
          city: 'New York',
          state: 'NY',
          zip: '10001',
        },
        caregiverType: HomepayCaregiverType.SENIOR_CARE,
        email: 'tim@care.com',
        firstName: 'Jon',
        lastName: 'Doe',
        phoneNumber: '2025551313',
        referringSite: 'LTCG',
        hasHired: true,
        planId: 'LtcgNoBilling',
        partnerId: '485',
        expectedHireTimeFrame: HomePayExpectedHireTimeFrame.AS_SOON_AS_POSSIBLE,
      },
    } as createHomePayProspectVariables,
  },
  result: {
    data: {
      createHomePayProspect: {
        __typename: 'CreateHomePayProspectSuccess',
        prospect: {
          prospectId: 'prospectId',
        },
      },
    } as createHomePayProspect,
  },
};

const createHomePayProspectHasNotHiredMock = {
  request: {
    query: CREATE_HOME_PAY_PROSPECT,
    variables: {
      input: {
        address: {
          addressLine1: '5th street',
          city: 'New York',
          state: 'NY',
          zip: '10001',
        },
        caregiverType: HomepayCaregiverType.SENIOR_CARE,
        email: 'tim@care.com',
        firstName: 'Jon',
        lastName: 'Doe',
        phoneNumber: '2025551313',
        referringSite: 'LTCG',
        hasHired: false,
        planId: 'LtcgNoBilling',
        partnerId: '485',
        expectedHireTimeFrame: HomePayExpectedHireTimeFrame.AS_SOON_AS_POSSIBLE,
      },
    } as createHomePayProspectVariables,
  },
  result: {
    data: {
      createHomePayProspect: {
        __typename: 'CreateHomePayProspectSuccess',
        prospect: {
          prospectId: 'prospectId',
        },
      },
    } as createHomePayProspect,
  },
};

const createHomePayProspectErrorMock = {
  request: {
    query: CREATE_HOME_PAY_PROSPECT,
    variables: {
      input: {
        address: {
          addressLine1: '5th street',
          city: 'New York',
          state: 'NY',
          zip: '10001',
        },
        caregiverType: HomepayCaregiverType.SENIOR_CARE,
        email: 'tim@care.com',
        firstName: 'Dwight',
        lastName: 'Schrute',
        phoneNumber: '2025551313',
        referringSite: 'LTCG',
        hasHired: true,
        planId: 'LtcgNoBilling',
        partnerId: '485',
        expectedHireTimeFrame: HomePayExpectedHireTimeFrame.AS_SOON_AS_POSSIBLE,
      },
    } as createHomePayProspectVariables,
  },
  result: {
    data: {
      createHomePayProspect: {
        __typename: 'CreateHomePayProspectError',
        errors: [
          {
            message: 'Error',
          },
        ],
      },
    } as createHomePayProspect,
  },
};

const ltcgState: AppState = {
  ...initialAppState,
  ltcg: {
    ...initialAppState.ltcg,
    careDate: CareDate.RIGHT_NOW,
    caregiverNeeded: YesOrNoAnswer.NO,
    location: {
      city: 'New York',
      state: 'NY',
      zipcode: '10001',
    },
    homePayProspect: {
      address: '5th street',
      email: 'tim@care.com',
      firstName: 'Jon',
      lastName: 'Doe',
      phoneNumber: '+12025551313',
    },
  },
  flow: {
    ...initialAppState.flow,
    memberId: '123456',
  },
};

const getByChildText = () => {
  const firstNode = screen.getByText((content) => content.startsWith('Expect a call from'));
  if (!firstNode) return "Couldn't find node with text starting with 'Expect a call from'.";

  const parent = firstNode.parentElement;
  if (!parent) return 'Could not find parent node.';

  const children = parent.childNodes;
  const stringBuilder: string[] = [];
  children.forEach(({ textContent }) => textContent && stringBuilder.push(textContent));

  // Replace &nbsp; with actual spaces for testing purposes
  return stringBuilder.join('').replace(new RegExp('\u00a0', 'g'), ' ');
};

describe('Success', () => {
  const realLoggerInfo = logger.info;
  const realLoggerError = logger.error;
  const loggerInfoMock = jest.fn();
  const loggerErrorMock = jest.fn();

  beforeAll(() => {
    logger.info = loggerInfoMock;
    logger.error = loggerErrorMock;
  });

  afterEach(() => {
    loggerInfoMock.mockReset();
    loggerErrorMock.mockReset();
  });

  afterAll(() => {
    logger.info = realLoggerInfo;
    logger.error = realLoggerError;
  });
  it('matches snapshot', () => {
    const { renderFn } = preRenderPage({ appState: ltcgState });
    const { asFragment } = renderFn(Success);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the default list', () => {
    const { renderFn } = preRenderPage({ appState: ltcgState });
    renderFn(Success);

    expect(screen.getByText('Reviewing how reimbursement works.')).toBeInTheDocument();
    expect(
      screen.getByText('Setting up payroll between you and your caregiver.')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Ensuring your caregiver has the right tools to capture needed reimbursement information.'
      )
    ).toBeInTheDocument();

    expect(screen.getByText('Be on the lookout for a call from us.')).toBeInTheDocument();
    expect(getByChildText()).toBe(
      ' Expect a call from our team within 1 business day. They are ready to help you learn more about the following:'
    );
  });

  it('should render the looking for caregivers list', () => {
    const customLtcgState = {
      ...ltcgState,
      ltcg: { ...ltcgState.ltcg, caregiverNeeded: YesOrNoAnswer.YES },
    };

    const { renderFn } = preRenderPage({ appState: customLtcgState });
    renderFn(Success);

    expect(screen.getByText('Assessing your needs.')).toBeInTheDocument();
    expect(screen.getByText('Finding great caregivers near you.')).toBeInTheDocument();
    expect(screen.getByText('Working with you to hire the best option.')).toBeInTheDocument();
    expect(screen.getByText('Want to speak with an expert now?')).toBeInTheDocument();
    expect(getByChildText()).toBe(
      ' Expect a call from our team within 1 business day. They are ready to help by doing the following:'
    );
  });

  it('should log a success event for the createHomePayProspect mutation', async () => {
    const { renderFn } = preRenderPage({ appState: ltcgState, mocks: [createHomePayProspectMock] });
    renderFn(Success);

    await waitFor(() =>
      expect(loggerInfoMock).toHaveBeenCalledWith({
        event: 'createHomePayProspectMutationSuccess',
        prospectId: 'prospectId',
      })
    );
  });

  it('should log an error for the createHomePayProspect mutation', async () => {
    const errorLtcgState: AppState = {
      ...initialAppState,
      ltcg: {
        ...initialAppState.ltcg,
        careDate: CareDate.RIGHT_NOW,
        caregiverNeeded: YesOrNoAnswer.NO,
        location: {
          city: 'New York',
          state: 'NY',
          zipcode: '10001',
        },
        homePayProspect: {
          address: '5th street',
          email: 'tim@care.com',
          firstName: 'Dwight',
          lastName: 'Schrute',
          phoneNumber: '+12025551313',
        },
      },
    };

    const { renderFn } = preRenderPage({
      appState: errorLtcgState,
      mocks: [createHomePayProspectErrorMock],
    });
    renderFn(Success);

    await waitFor(() =>
      expect(loggerErrorMock).toHaveBeenCalledWith({
        event: 'createHomePayProspectMutationError',
      })
    );
  });

  it('should log a success event for the czenCrmEventHiredCaregiverCreate mutation when caregiver has been hired', async () => {
    const { renderFn } = preRenderPage({
      appState: ltcgState,
      mocks: [czenCrmEventHiredCaregiverCreateMock, createHomePayProspectMock],
    });
    await renderFn(Success);

    await waitFor(
      () =>
        expect(loggerInfoMock).toHaveBeenCalledWith({
          event: 'createHomePayProspectMutationSuccess',
          prospectId: 'prospectId',
        }),
      { timeout: 1000 }
    );

    expect(loggerInfoMock).toHaveBeenCalledWith({
      event: 'CzenCrmEventHiredCaregiverCreateSuccess',
    });

    expect(loggerErrorMock).toHaveBeenCalledTimes(0);

    expect(loggerInfoMock).toHaveBeenCalledTimes(2);
  });

  it('should not call czenCrmEventHiredCaregiverCreate mutation when caregiver has not been hired', async () => {
    const { renderFn } = preRenderPage({
      appState: {
        ...ltcgState,
        ltcg: {
          ...ltcgState.ltcg,
          careDate: CareDate.RIGHT_NOW,
          caregiverNeeded: YesOrNoAnswer.YES,
        },
      },
      mocks: [createHomePayProspectHasNotHiredMock],
    });
    renderFn(Success);

    await waitFor(
      () =>
        expect(loggerInfoMock).toHaveBeenCalledWith({
          event: 'createHomePayProspectMutationSuccess',
          prospectId: 'prospectId',
        }),
      { timeout: 1000 }
    );
  });

  it('should log error when czenCrmEventHiredCaregiverCreate mutation throws', async () => {
    const { renderFn } = preRenderPage({
      appState: ltcgState,
      mocks: [createHomePayProspectMock, czenCrmEventHiredCaregiverCreateErrorMock],
    });
    renderFn(Success);

    await waitFor(
      () =>
        expect(loggerInfoMock).toHaveBeenCalledWith({
          event: 'createHomePayProspectMutationSuccess',
          prospectId: 'prospectId',
        }),
      { timeout: 1000 }
    );
    expect(loggerErrorMock).toHaveBeenCalledWith({
      error: new Error('server error'),
      event: 'CzenCrmEventHiredCaregiverCreateError',
    });

    expect(loggerErrorMock).toHaveBeenCalledTimes(1);

    expect(loggerInfoMock).toHaveBeenCalledTimes(1);
  });
});
