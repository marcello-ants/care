import React from 'react';
import { useRouter } from 'next/router';
import { act, renderHook } from '@testing-library/react-hooks';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';

import AuthService from '@/lib/AuthService';
import { initialAppState } from '@/state';
import { AppStateProvider, useAppDispatch, useAppState } from '@/components/AppState';
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { AppState } from '@/types/app';
import { POST_CHILD_CARE_LEAD } from '@/components/request/GQL';
import { ChildCareLeadsSubmissionMethod, DayCareTimeOfDay } from '@/__generated__/globalTypes';
import { CareDayTime, DayCareFrequencyOptions, DaycareProviderProfile } from '@/types/seekerCC';
import { mapMonthToDate } from '@/utilities/account-creation-utils';
import { CARE_DATES, CLIENT_FEATURE_FLAGS } from '@/constants';
import { useDaycareAutoSubmit } from '../useDaycareAutoSubmit';

jest.mock('@/lib/AuthService');
const AuthServiceMock = AuthService as jest.Mock;

const getStoreMock = jest.fn();
AuthServiceMock.mockImplementation(() => {
  return {
    getStore: getStoreMock,
  };
});

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

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

let mockRouter: any | null = null;
const TEST_EMAIL_MOCK = '123@care.com';
const START_MONTH_MOCK = 'JANUARY';
const START_DATE_MOCK = mapMonthToDate(START_MONTH_MOCK);
const PROVIDER_ID_MOCK = '70bed9b5-e5b8-4fd3-a205-44c69758fb7e';
const TRACKING_ID_MOCK = '44c69758-4fd3-e5b8-a205-70bed9b5a72f';
const ZIPCODE_MOCK = '12345';
const ADDITIONAL_INFORMATION_MOCK = '';
const MEMBER_ID_MOCK = '11111';
const SEEKER_UUID_MOCK = '15602b3a-a77b-4983-9251-23c07d1c698f';
const FIRSTNAME_MOCK = 'dev';
const LASTNAME_MOCK = 'test';
const PHONENUMBER_MOCK = '6191234567';
const CHILDREN_DOB_MOCK = '2015-01-15';
const TIME_OF_DAY_MOCK = DayCareTimeOfDay.MORNING;
const SOURCE_MOCK = 'ENROLLMENT';
const ATTENDING_DAYS_MOCK = {
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: false,
  sunday: false,
};

const postChildcareLeadMock = {
  request: {
    query: POST_CHILD_CARE_LEAD,
    variables: {
      childCareLeadInput: {
        submissionMethod: ChildCareLeadsSubmissionMethod.AUTO,
        providerIds: [PROVIDER_ID_MOCK],
        trackingId: TRACKING_ID_MOCK,
        zipcode: ZIPCODE_MOCK,
        source: SOURCE_MOCK,
        childCareExpectations: ADDITIONAL_INFORMATION_MOCK,
        startDate: START_DATE_MOCK,
        childrenDatesOfBirth: [CHILDREN_DOB_MOCK],
        timeOfDay: TIME_OF_DAY_MOCK,
        attendingDays: ATTENDING_DAYS_MOCK,
        seekerInfo: {
          id: SEEKER_UUID_MOCK,
          email: TEST_EMAIL_MOCK,
          firstName: FIRSTNAME_MOCK,
          lastName: LASTNAME_MOCK,
          phoneNumber: PHONENUMBER_MOCK,
        },
      },
    },
  },
  result: {
    data: {
      childCareLeadCreate: {
        batchId: '1234567890',
      },
    },
  },
};

const postChildcareLeadErrorMock = {
  request: {
    query: POST_CHILD_CARE_LEAD,
    variables: {
      childCareLeadInput: {
        submissionMethod: ChildCareLeadsSubmissionMethod.AUTO,
        providerIds: [PROVIDER_ID_MOCK],
        trackingId: TRACKING_ID_MOCK,
        zipcode: ZIPCODE_MOCK,
        source: SOURCE_MOCK,
        childCareExpectations: ADDITIONAL_INFORMATION_MOCK,
        startDate: START_DATE_MOCK,
        childrenDatesOfBirth: [CHILDREN_DOB_MOCK],
        timeOfDay: TIME_OF_DAY_MOCK,
        attendingDays: ATTENDING_DAYS_MOCK,
        seekerInfo: {
          id: SEEKER_UUID_MOCK,
          email: TEST_EMAIL_MOCK,
          firstName: FIRSTNAME_MOCK,
          lastName: LASTNAME_MOCK,
          phoneNumber: PHONENUMBER_MOCK,
        },
      },
    },
  },
  result: {
    data: null,
  },
  error: new Error('An error occurred'),
};

const recommendations: DaycareProviderProfile[] = [
  {
    __typename: 'Provider',
    id: PROVIDER_ID_MOCK,
    description:
      'The Transportation Childrens Center, a non-profit child care facility, in downtown Boston, provides full day Infant, Toddler, Preschool and Pre-Kindergarten Programs year round.',
    name: 'CARE AFTER SCHOOL - COLONIAL HILLS ELEMENTARY',
    images: null,
    logo: null,
    address: null,
    reviews: null,
    avgReviewRating: 3,
    license: {
      __typename: 'License',
      name: 'Child Care',
      verifiedDate: '2021/1/1',
      certified: true,
      externalUrl: 'http://childcaresearch.ohio.gov/',
      administrativeArea: 'Ohio',
    },
    selected: true,
    hasCoordinates: true,
    centerType: null,
  },
];

const LD_FLAGS_DEFAULT: FeatureFlags = {
  [CLIENT_FEATURE_FLAGS.DAYCARE_AUTO_ACCEPT_BACKEND]: {
    reason: { kind: '' },
    value: false,
  },
};

const LD_FLAGS_VARIATION: FeatureFlags = {
  [CLIENT_FEATURE_FLAGS.DAYCARE_AUTO_ACCEPT_BACKEND]: {
    reason: { kind: '' },
    value: true,
  },
};

function getAppState(
  autosubmitStartTime: string,
  careDateType: CARE_DATES = CARE_DATES.WITHIN_A_WEEK
): AppState {
  return {
    ...initialAppState,
    flow: {
      ...initialAppState.flow,
      memberId: MEMBER_ID_MOCK,
    },
    seeker: {
      ...initialAppState.seeker,
      zipcode: ZIPCODE_MOCK,
    },
    seekerCC: {
      ...initialAppState.seekerCC,
      phoneNumber: PHONENUMBER_MOCK,
      firstName: FIRSTNAME_MOCK,
      lastName: LASTNAME_MOCK,
      careDate: careDateType,
      dayCare: {
        ...initialAppState.seekerCC.dayCare,
        recommendations,
        recommendationsTrackingId: TRACKING_ID_MOCK,
        startMonth: START_MONTH_MOCK,
        additionalInformation: ADDITIONAL_INFORMATION_MOCK,
        dayTime: CareDayTime.MORNING,
        careFrequency: {
          ...initialAppState.seekerCC.dayCare.careFrequency,
          careType: DayCareFrequencyOptions.FULL_TIME,
        },
        childrenDateOfBirth: [{ year: '2015', month: '01' }],
        autoSubmit: {
          ...initialAppState.seekerCC.dayCare.autoSubmit,
          startTime: autosubmitStartTime,
        },
      },
    },
  };
}

function mountHook(
  pathname = '/seeker/cc/care-location',
  state?: AppState,
  mocks?: MockedResponse[],
  launchDarklyFlags: FeatureFlags = LD_FLAGS_DEFAULT
) {
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  getStoreMock.mockReturnValue({
    profile: { email: TEST_EMAIL_MOCK, sub: `mem:${SEEKER_UUID_MOCK}` },
  });

  return renderHook(
    () => {
      useDaycareAutoSubmit();
      return {
        state: useAppState(),
        dispatch: useAppDispatch(),
      };
    },
    {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks} addTypename>
          <FeatureFlagsProvider flags={launchDarklyFlags}>
            <AppStateProvider initialStateOverride={state || initialAppState}>
              {children}
            </AppStateProvider>
          </FeatureFlagsProvider>
        </MockedProvider>
      ),
    }
  );
}

let windowAddEventMock: jest.Mock;
let windowRemoveEventMock: jest.Mock;

describe('useDaycareAutoSubmit', () => {
  const originalAddEvent = window.addEventListener;
  const originalRemove = window.removeEventListener;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    windowAddEventMock = jest.fn();
    windowRemoveEventMock = jest.fn();
    // @ts-ignore
    delete window.addEventListener;
    // @ts-ignore
    delete window.removeEventListener;
    window.addEventListener = windowAddEventMock;
    window.removeEventListener = windowRemoveEventMock;
  });

  afterAll(() => {
    window.addEventListener = originalAddEvent;
    window.removeEventListener = originalRemove;
  });

  it('adds and removes beforeunload event to window', async () => {
    const utils = mountHook();

    await utils.waitFor(() => {
      expect(windowAddEventMock).toHaveBeenCalled();
    });

    utils.unmount();

    await utils.waitFor(() => {
      expect(windowRemoveEventMock).toHaveBeenCalled();
    });
  });

  it('triggers autosubmit when start time has been setup in app state', async () => {
    const state = getAppState(new Date('2020-01-01').toISOString());
    const utils = mountHook('/seeker/cc/care-location', state, [postChildcareLeadMock]);

    await utils.waitFor(() => {
      expect(utils.result.current.state.seekerCC.dayCare.autoSubmit.submitted).toBe(true);
    });
  });

  it('updates autosubmit timeout when start time is updated app state', async () => {
    const state = getAppState(new Date('2040-01-01').toISOString());

    const utils = mountHook('/seeker/cc/care-location', state, [postChildcareLeadMock]);

    jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-01').getTime());
    utils.result.current.dispatch({ type: 'cc_startDayCareAutoSubmitCountdown' });
    jest.useRealTimers();

    await utils.waitFor(() => {
      expect(utils.result.current.state.seekerCC.dayCare.autoSubmit.submitted).toBe(true);
    });
  });

  it('doesnt autosubmit when a submission has already been done manually', async () => {
    const state = getAppState(new Date('2020-01-01').toISOString());

    const utils = mountHook('/seeker/cc/care-location', state, [postChildcareLeadMock]);

    act(() => {
      utils.result.current.dispatch({
        type: 'cc_setDayCareRecommendationsSubmissionInfo',
        completed: true,
      });
    });

    await utils.waitFor(() => {
      expect(utils.result.current.state.seekerCC.dayCare.submissionCompleted).toBe(true);
    });
  });

  it('does not auto submit when an user is just browsing', async () => {
    const state = getAppState(new Date('2020-01-01').toISOString(), CARE_DATES.JUST_BROWSING);
    const utils = mountHook('/seeker/cc/care-location', state, [postChildcareLeadMock]);

    await utils.waitFor(() => {
      expect(utils.result.current.state.seekerCC.dayCare.autoSubmit.submitted).toBe(false);
      expect(utils.result.current.state.seekerCC.dayCare.autoSubmit.attempts).toBe(0);
    });
  });

  it('does not auto submit when LD Flag is set to true', async () => {
    const state = getAppState(new Date('2020-01-01').toISOString(), CARE_DATES.IN_1_2_MONTHS);
    const utils = mountHook(
      '/seeker/cc/care-location',
      state,
      [postChildcareLeadMock],
      LD_FLAGS_VARIATION
    );

    await utils.waitFor(() => {
      expect(utils.result.current.state.seekerCC.dayCare.autoSubmit.submitted).toBe(false);
      expect(utils.result.current.state.seekerCC.dayCare.autoSubmit.attempts).toBe(0);
    });
  });

  it('retries autosubmit up to 3 times', async () => {
    const state = getAppState(new Date('2020-01-01').toISOString());

    const utils = mountHook('/seeker/dc/recommendations', state, [postChildcareLeadErrorMock]);

    await utils.waitFor(
      () => {
        expect(utils.result.current.state.seekerCC.dayCare.autoSubmit.attempts).toBe(3);
      },
      { timeout: 20000 }
    );
  }, 20000);
});
