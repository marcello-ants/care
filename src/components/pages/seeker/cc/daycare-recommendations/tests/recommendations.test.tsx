// External Dependencies
import React from 'react';
import { cloneDeep } from 'lodash-es';
import { render, screen, waitFor } from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';
import userEvent from '@testing-library/user-event';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '@care/material-ui-theme';

// Internal Dependencies
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import AuthService from '@/lib/AuthService';
import { ChildCareLeadsSubmissionMethod, DayCareTimeOfDay } from '@/__generated__/globalTypes';
import { DaycareProviderProfile, DayCareFrequencyOptions, CareDayTime } from '@/types/seekerCC';
import { AppState } from '@/types/app';
import { initialAppState } from '@/state';
import {
  POST_AUTO_ACCEPT_CHILD_CARE_LEAD,
  POST_CHILD_CARE_LEAD,
  UPDATE_SEEKER_ATTRIBUTE,
} from '@/components/request/GQL';
import { AppStateProvider } from '@/components/AppState';
import useTealiumTracking from '@/components/hooks/useTealiumTracking';
import { mapMonthToDate } from '@/utilities/account-creation-utils';
import logger from '@/lib/clientLogger';
import Recommendations from '../recommendations';

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
      CZEN_GENERAL: '/',
    },
  };
});

jest.mock('@/components/hooks/useTealiumTracking');

let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname'>;
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
        submissionMethod: ChildCareLeadsSubmissionMethod.MANUAL,
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

const postAutoAcceptChildcareLeadMock = {
  request: {
    query: POST_AUTO_ACCEPT_CHILD_CARE_LEAD,
    variables: {
      childCareLeadInput: {
        submissionMethod: ChildCareLeadsSubmissionMethod.MANUAL,
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
        submissionMethod: ChildCareLeadsSubmissionMethod.MANUAL,
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

const updateSeekerAttributeMock = {
  request: {
    query: UPDATE_SEEKER_ATTRIBUTE,
    variables: {
      input: { attributes: { daycareInterest: true } },
    },
  },
  result: {
    data: {
      seekerUpdate: {
        success: true,
      },
    },
  },
};

function renderPage(initialState: AppState, mocks: MockedResponse[] = [], ldFlags?: FeatureFlags) {
  const pathname = '/seeker/dc/recommendations';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  getStoreMock.mockReturnValue({
    profile: { email: TEST_EMAIL_MOCK, sub: `mem:${SEEKER_UUID_MOCK}` },
  });

  const flags = {
    'cc-enrollment-mfe-daycare-request-tours-copy': {
      reason: { kind: 'FALLTHROUGH' },
      value: 'control',
      variationIndex: 0,
    },
    'enrollment-mfe-daycare-auto-accept-leads-backend': {
      value: false,
      reason: { kind: 'FALLTHROUGH' },
    },
    'growth-enrollment-mfe-daycare-leads-redirection': {
      value: false,
      reason: { kind: 'FALLTHROUGH' },
    },
  };

  return render(
    <AppStateProvider initialStateOverride={initialState}>
      <ThemeProvider theme={theme}>
        <FeatureFlagsProvider flags={ldFlags || flags}>
          <MockedProvider mocks={[...mocks, updateSeekerAttributeMock]} addTypename>
            <Recommendations />
          </MockedProvider>
        </FeatureFlagsProvider>
      </ThemeProvider>
    </AppStateProvider>
  );
}

const appState = cloneDeep(initialAppState);
const recommendations: DaycareProviderProfile[] = [
  {
    __typename: 'Provider',
    id: '70bed9b5-e5b8-4fd3-a205-44c69758fb7e',
    description:
      'The Transportation Childrens Center, a non-profit child care facility, in downtown Boston, provides full day Infant, Toddler, Preschool and Pre-Kindergarten Programs year round. Open to the general public, the center is available to children 3 months through age five. The center is open from 8:00 a.m. to 6:00 p.m. with both part time and full time programs available. Every effort is made to keep tuition rates as low as possible while maintaining high quality services. The established and long-term professional staff hold degrees in early education and have extensive experience working with young children. The facility provides an outdoor roof-top play space, drop-off parking and is accessible by the MBTA.\r\nEstablished since 1986 the center is NAEYC Accredited. The beautifully designed and well-equipped center provides a stimulating and nurturing environment which will enhance the childrens self-esteem and future success in school. TCC has implemented the Creative Curriculum philosophy, a hands-on approach to learning and discovering where activities are planned to assure optimum growth and development of the whole child. Slots are filled on a first come, first served basis according to status on the wait list. Families are encouraged to visit the center and schedule a tour.',
    name: 'CARE AFTER SCHOOL - COLONIAL HILLS ELEMENTARY',
    logo: null,
    images: null,
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
    selected: false,
    hasCoordinates: true,
    centerType: null,
  },
];

const initialState: AppState = {
  ...appState,
  seekerCC: {
    ...appState.seekerCC,
    dayCare: {
      ...appState.seekerCC.dayCare,
      recommendations,
    },
  },
};

describe('Seeker - Day Care - Recommendations', () => {
  const originalScrollTo = window.scrollTo;
  const originalLocation = window.location;
  const windowScrollToMock = jest.fn();
  const windowLocationAssignMock = jest.fn();
  const loggerErrorMock = jest.fn();

  beforeAll(() => {
    // @ts-ignore
    delete window.scrollTo;
    // @ts-ignore
    window.scrollTo = windowScrollToMock;
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = {
      assign: windowLocationAssignMock,
    };
    logger.error = loggerErrorMock;
  });

  afterAll(() => {
    window.scrollTo = originalScrollTo;
    window.location = originalLocation;
  });

  it('matches snapshot', async () => {
    const view = renderPage(initialState);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: '1. CARE AFTER SCHOOL - COLONIAL HILLS ELEMENTARY' })
      ).toBeInTheDocument();
    });

    expect(useTealiumTracking).toHaveBeenCalledWith(['/us-marketplace/daycare/leads-viewed/'], {
      tealium_event: 'DAYCARE_LEADS_VIEWED',
      intent: 'WITHIN_A_WEEK',
      leadCountNational: 0,
      leadCountSMB: 0,
    });
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('opens profile details when selecting a daycare result XXXXXXXX', async () => {
    renderPage(initialState);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: '1. CARE AFTER SCHOOL - COLONIAL HILLS ELEMENTARY' })
      ).toBeInTheDocument();
    });

    userEvent.click(
      screen.getByRole('heading', { name: '1. CARE AFTER SCHOOL - COLONIAL HILLS ELEMENTARY' })
    );

    await waitFor(() => {
      expect(screen.getByText('Licensing Information')).toBeInTheDocument();
    });
  });

  it('clicking Request Info without selecting results shows an error alert', async () => {
    renderPage(initialState);

    userEvent.click(screen.getByRole('button', { name: 'Request info' }));

    await waitFor(() => {
      expect(screen.getByText('Please select at least 1 daycare to proceed')).toBeInTheDocument();
    });
  });

  it('clicking Request Info with at least one daycare selected redirects to next step', async () => {
    const state = {
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
        },
      },
    };
    renderPage(state, [postChildcareLeadMock]);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: '1. CARE AFTER SCHOOL - COLONIAL HILLS ELEMENTARY' })
      ).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('checkbox', { name: '' }));
    userEvent.click(screen.getByRole('button', { name: 'Request info' }));

    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalled();
    });
  });

  it('clicking Request Info does not redirect to next step if mutation fails', async () => {
    const state = {
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
        },
      },
    };
    renderPage(state, [postChildcareLeadErrorMock]);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: '1. CARE AFTER SCHOOL - COLONIAL HILLS ELEMENTARY' })
      ).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('checkbox', { name: '' }));
    userEvent.click(screen.getByRole('button', { name: 'Request info' }));

    await waitFor(() => {
      expect(loggerErrorMock).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  it('clicking Next redirects to next step', async () => {
    const state: AppState = {
      ...initialState,
      seekerCC: {
        ...initialState.seekerCC,
        dayCare: {
          ...initialState.seekerCC.dayCare,
          submissionCompleted: true,
        },
      },
    };
    renderPage(state);

    userEvent.click(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalled();
    });
  });

  it('clicking checkbox toggles them on and off', () => {
    renderPage(initialState);

    expect(screen.getByRole('checkbox', { name: '' })).not.toBeChecked();
    userEvent.click(screen.getByRole('checkbox', { name: '' }));
    expect(screen.getByRole('checkbox', { name: '' })).toBeChecked();
    userEvent.click(screen.getByRole('checkbox', { name: '' }));
    expect(screen.getByRole('checkbox', { name: '' })).not.toBeChecked();
  });

  it('clicking checkbox has no effect when leads have been submitted', () => {
    const state: AppState = {
      ...initialState,
      seekerCC: {
        ...initialState.seekerCC,
        dayCare: {
          ...initialState.seekerCC.dayCare,
          recommendations: initialState.seekerCC.dayCare.recommendations.map((next) => ({
            ...next,
            selected: false,
          })),
          submissionCompleted: true,
        },
      },
    };
    renderPage(state);

    expect(screen.getByRole('checkbox', { name: '' })).toBeDisabled();
    userEvent.click(screen.getByRole('checkbox', { name: '' }), undefined, {
      skipPointerEventsCheck: true,
    });
    expect(screen.getByRole('checkbox', { name: '' })).not.toBeChecked();
  });

  it('daycare selections is maintained', () => {
    const state: AppState = {
      ...initialState,
      seekerCC: {
        ...initialState.seekerCC,
        dayCare: {
          ...initialState.seekerCC.dayCare,
          recommendations: initialState.seekerCC.dayCare.recommendations.map((next) => ({
            ...next,
            selected: true,
          })),
          submissionCompleted: true,
        },
      },
    };
    renderPage(state);

    expect(screen.getByRole('checkbox', { name: '' })).toBeChecked();
    expect(screen.queryByRole('button', { name: 'Request info' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('redirects to nth day and logs an error when required data is missing', async () => {
    const selectedRecommendations = recommendations.map((el) => ({
      ...el,
      selected: true,
    }));
    const state = {
      ...initialAppState,
      flow: {
        ...initialAppState.flow,
        memberId: MEMBER_ID_MOCK,
      },
      seekerCC: {
        ...initialAppState.seekerCC,
        dayCare: {
          ...initialAppState.seekerCC.dayCare,
          recommendations: selectedRecommendations,
          recommendationsTrackingId: TRACKING_ID_MOCK,
        },
      },
    };
    const flags = {
      'enrollment-mfe-daycare-auto-accept-leads-backend': {
        value: true,
        reason: { kind: 'FALLTHROUGH' },
      },
      'growth-enrollment-mfe-daycare-leads-redirection': {
        value: true,
        reason: { kind: 'FALLTHROUGH' },
      },
    };
    renderPage(state, [postAutoAcceptChildcareLeadMock], flags);

    expect(loggerErrorMock).toHaveBeenCalledWith({
      event: 'childCareDayCareLeadCreationMissingData',
      data: {
        email: 'exists',
        phoneNumber: 'empty',
        firstName: '',
        lastName: '',
        memberId: MEMBER_ID_MOCK,
        seekerUuid: SEEKER_UUID_MOCK,
        zipcode: '',
        recommendationsTrackingId: TRACKING_ID_MOCK,
        childrenDateOfBirth: [],
        recommendations: selectedRecommendations,
        careType: DayCareFrequencyOptions.FULL_TIME,
        distance: initialAppState.seeker.maxDistanceFromSeekerDayCare,
      },
    });
    expect(windowLocationAssignMock).toHaveBeenCalledWith('//app/job/dc');
  });

  it('redirects to nth day and logs an error when required data is missing on Requesting info click', async () => {
    const selectedRecommendations = recommendations.map((el) => ({
      ...el,
      selected: true,
    }));
    const state = {
      ...initialAppState,
      flow: {
        ...initialAppState.flow,
        memberId: MEMBER_ID_MOCK,
      },
      seekerCC: {
        ...initialAppState.seekerCC,
        dayCare: {
          ...initialAppState.seekerCC.dayCare,
          recommendations: selectedRecommendations,
          recommendationsTrackingId: TRACKING_ID_MOCK,
        },
      },
    };
    const flags = {
      'enrollment-mfe-daycare-auto-accept-leads-backend': {
        value: false,
        reason: { kind: 'FALLTHROUGH' },
      },
      'growth-enrollment-mfe-daycare-leads-redirection': {
        value: true,
        reason: { kind: 'FALLTHROUGH' },
      },
    };
    renderPage(state, [postChildcareLeadMock], flags);

    userEvent.click(screen.getByRole('button', { name: 'Request info' }));

    expect(loggerErrorMock).toHaveBeenCalledWith({
      event: 'childCareDayCareLeadCreationMissingData',
      data: {
        email: 'exists',
        phoneNumber: 'empty',
        firstName: '',
        lastName: '',
        memberId: MEMBER_ID_MOCK,
        seekerUuid: SEEKER_UUID_MOCK,
        zipcode: '',
        recommendationsTrackingId: TRACKING_ID_MOCK,
        childrenDateOfBirth: [],
        recommendations: selectedRecommendations,
        careType: DayCareFrequencyOptions.FULL_TIME,
      },
    });
    expect(windowLocationAssignMock).toHaveBeenCalledWith('//app/job/dc');
  });
});
