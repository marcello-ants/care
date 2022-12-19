// External Dependencies
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';

// Internal Dependencies
import logger from '@/lib/clientLogger';
import { ServiceType, SubServiceType } from '@/__generated__/globalTypes';
import { DAYCARE_CRM_EVENT_CREATE } from '@/components/request/GQL';
import useCrmEventDaycare from '../useCrmEventDaycare';

// Constants

const SUCCESS_UUID = '0001';
const FAILURE_UUID = '0002';
const LEADS_LIST = [
  {
    businessName: 'The Courtyard of Austin',
    phoneNumber: '',
    address: {
      addressLine1: '11012 Harris Branch Parkway',
      city: 'Austin',
      state: 'TX',
      zip: '78754',
    },
  },
];

// Mocks

const errorLogger = logger.error as jest.Mock;

const MUTATION_SUCCESS_MOCK = {
  request: {
    query: DAYCARE_CRM_EVENT_CREATE,
    variables: {
      input: {
        czenCrmEventLeadsSubmitted: {
          autoAccept: false,
          leadCount: 5,
          vertical: ServiceType.CHILD_CARE,
          subVertical: SubServiceType.DAY_CARE,
          leads: LEADS_LIST,
          enrollment: true,
        },
        userId: SUCCESS_UUID,
      },
    },
  },
  result: {
    data: {
      czenCrmEventCreateLeadsSubmitted: { success: true },
    },
  },
};

const MUTATION_ERROR_MOCK = {
  request: {
    query: DAYCARE_CRM_EVENT_CREATE,
    variables: {
      input: {
        czenCrmEventLeadsSubmitted: {
          autoAccept: false,
          leadCount: 5,
          vertical: ServiceType.CHILD_CARE,
          subVertical: SubServiceType.DAY_CARE,
          leads: LEADS_LIST,
          enrollment: true,
        },
        userId: FAILURE_UUID,
      },
    },
  },
  result: {
    data: {
      czenCrmEventCreateLeadsSubmitted: { success: false },
    },
  },
};

// Utility functions

const graphQLMocks =
  (): React.FC<{}> =>
  ({ children }) => {
    const mocks: MockedResponse[] = [MUTATION_SUCCESS_MOCK, MUTATION_ERROR_MOCK];
    return <MockedProvider mocks={mocks}>{children}</MockedProvider>;
  };

describe('useCrmEventDaycare', () => {
  beforeEach(() => {
    errorLogger.mockReset();
  });

  it('should not log errors when mutation was successful', async () => {
    const { waitFor } = renderHook(
      () => {
        const createCrmEventDaycare = useCrmEventDaycare();
        return createCrmEventDaycare({
          variables: {
            input: {
              czenCrmEventLeadsSubmitted: {
                autoAccept: false,
                leadCount: 5,
                vertical: ServiceType.CHILD_CARE,
                subVertical: SubServiceType.DAY_CARE,
                leads: LEADS_LIST,
                enrollment: true,
              },
              userId: SUCCESS_UUID,
            },
          },
        });
      },
      {
        wrapper: graphQLMocks(),
      }
    );

    await waitFor(() => {
      expect(errorLogger).not.toBeCalled();
    });
  });

  it('should log errors when mutation was not successful', async () => {
    const { waitFor } = renderHook(
      () => {
        const createCrmEventDaycare = useCrmEventDaycare();
        return createCrmEventDaycare({
          variables: {
            input: {
              czenCrmEventLeadsSubmitted: {
                autoAccept: false,
                leadCount: 5,
                vertical: ServiceType.CHILD_CARE,
                subVertical: SubServiceType.DAY_CARE,
                leads: LEADS_LIST,
                enrollment: true,
              },
              userId: FAILURE_UUID,
            },
          },
        });
      },
      {
        wrapper: graphQLMocks(),
      }
    );

    await waitFor(() => {
      expect(errorLogger).toHaveBeenCalled();
    });
  });
});
