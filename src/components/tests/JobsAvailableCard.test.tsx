import { MockedProvider } from '@apollo/client/testing';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '@care/material-ui-theme';
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { CLIENT_FEATURE_FLAGS } from '@/constants';
import { FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { ServiceType, DistanceUnit } from '@/__generated__/globalTypes';
import { GET_NUMBER_OF_JOBS_NEARBY, GET_AVERAGE_JOB_WAGE } from '../request/GQL';
import JobsAvailableCard from '../JobsAvailableCard';

let mockRouter: NextRouter;
const testZipCode = '90001';

const initialStateOverride: AppState = {
  ...initialAppState,
  providerCC: {
    ...initialAppState.providerCC,
    city: 'Los Angeles County',
  },
};

const featureFlagsMockTrue = {
  [CLIENT_FEATURE_FLAGS.PROVIDER_CC_FREE_GATED_EXPERIENCE]: {
    value: true,
    reason: {
      kind: 'FALLTHROUGH',
    },
  },
};

function getJobsMock(numJobsNearby: number, serviceType: string = 'SENIOR_CARE') {
  return {
    request: {
      query: GET_NUMBER_OF_JOBS_NEARBY,
      variables: {
        zipcode: testZipCode,
        serviceType,
        radius: { value: 15, unit: DistanceUnit.MILES },
      },
    },
    result: {
      data: {
        getNumberOfNewJobsNearby: numJobsNearby,
      },
    },
  };
}
function getJobsMockError(serviceType: string = 'SENIOR_CARE') {
  return {
    request: {
      query: GET_NUMBER_OF_JOBS_NEARBY,
      variables: {
        zipcode: testZipCode,
        serviceType,
        radius: { value: 15, unit: DistanceUnit.MILES },
      },
    },
    error: new Error('aw shucks'),
  };
}
function getWageMock(averageWage: number, serviceType: string = 'SENIOR_CARE') {
  return {
    request: {
      query: GET_AVERAGE_JOB_WAGE,
      variables: {
        zipcode: testZipCode,
        serviceType,
      },
    },
    result: {
      data: {
        getJobWages: { averages: { average: { amount: averageWage } } },
      },
    },
  };
}
function getWageMockError(serviceType: string = 'SENIOR_CARE') {
  return {
    request: {
      query: GET_AVERAGE_JOB_WAGE,
      variables: {
        zipcode: testZipCode,
        serviceType,
      },
    },
    error: new Error('aw shucks'),
  };
}

const getByChildText = () => {
  const firstNode = screen.getByText((content) => content.startsWith('There are'));
  if (!firstNode) return "Couldn't find node with text starting with 'There are'.";

  const parent = firstNode.parentElement;
  if (!parent) return 'Could not find parent node.';

  const children = parent.childNodes;
  const stringBuilder: string[] = [];
  children.forEach(({ textContent }) => textContent && stringBuilder.push(textContent));

  // Replace &nbsp; with actual spaces for testing purposes
  return stringBuilder.join('').replace(new RegExp('\u00a0', 'g'), ' ');
};

async function renderComponent({
  mocks,
  expectedString,
  pathname = '/seeker/sc/location',
  zipcode = testZipCode,
  appState = initialAppState,
  serviceType = ServiceType.SENIOR_CARE,
}: {
  mocks: any;
  expectedString: string;
  pathname?: string;
  zipcode?: string;
  appState?: any;
  serviceType?: any;
}) {
  // @ts-ignore
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
    basePath: '',
  };
  render(
    <RouterContext.Provider value={mockRouter}>
      <AppStateProvider initialStateOverride={appState}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <ThemeProvider theme={theme}>
            <FeatureFlagsProvider flags={featureFlagsMockTrue}>
              <JobsAvailableCard zipcode={zipcode} serviceType={serviceType} distance={15} />
            </FeatureFlagsProvider>
          </ThemeProvider>
        </MockedProvider>
      </AppStateProvider>
    </RouterContext.Provider>
  );

  await waitFor(() => {
    expect(getByChildText()).toBe(expectedString);
  });

  return true;
}

describe('JobsAvailableCard', () => {
  describe('Senior Care', () => {
    it('should display specific messaging when average wage is retrieved and there are more than 10 jobs', async () => {
      await expect(
        renderComponent({
          mocks: [getWageMock(22), getJobsMock(11)],
          expectedString: 'There are 11 new jobs near you at an average rate of $22/hr.',
        })
      ).resolves.toBe(true);
    });

    it('should display specific messaging when average wage is retrieved and there are 10 jobs', async () => {
      await expect(
        renderComponent({
          mocks: [getWageMock(22), getJobsMock(10)],
          expectedString: 'There are 10 new jobs near you at an average rate of $22/hr.',
        })
      ).resolves.toBe(true);
    });

    it('should display the generic messaging when average wage is retrieved and there are less than 10 jobs', async () => {
      await expect(
        renderComponent({
          mocks: [getWageMock(22), getJobsMock(9)],
          expectedString: 'There are new jobs near you.',
        })
      ).resolves.toBe(true);
    });

    it('should display the generic messaging when average wage not is retrieved and number of jobs is not retrieved', async () => {
      await expect(
        renderComponent({
          mocks: [getWageMockError(), getJobsMockError()],
          expectedString: 'There are new jobs near you.',
        })
      ).resolves.toBe(true);
    });

    it('should display the generic messaging when the zipcode is missing', async () => {
      await expect(
        renderComponent({
          mocks: [getWageMock(22), getJobsMock(10)],
          expectedString: 'There are new jobs near you.',
          zipcode: '',
        })
      ).resolves.toBe(true);
    });
  });

  describe('Child Care', () => {
    it('should display messaging related to free gated when jobs are available', async () => {
      await expect(
        renderComponent({
          mocks: [getWageMock(22, 'CHILD_CARE'), getJobsMock(11, 'CHILD_CARE')],
          expectedString: 'There are 11 jobs near you—earn up to $22/hr in Los Angeles County.',
          appState: initialStateOverride,
          serviceType: ServiceType.CHILD_CARE,
        })
      ).resolves.toBe(true);
    });

    it('should display the generic messaging when there are less than 10 jobs', async () => {
      await expect(
        renderComponent({
          mocks: [getWageMock(22, 'CHILD_CARE'), getJobsMock(9, 'CHILD_CARE')],
          expectedString: 'There are new jobs near you.',
          appState: initialStateOverride,
          serviceType: ServiceType.CHILD_CARE,
        })
      ).resolves.toBe(true);
    });

    it('should display the generic messaging when average wage is not retrieved and number of jobs is not retrieved', async () => {
      await expect(
        renderComponent({
          mocks: [getWageMockError('CHILD_CARE'), getJobsMockError('CHILD_CARE')],
          expectedString: 'There are new jobs near you.',
          appState: initialStateOverride,
          serviceType: ServiceType.CHILD_CARE,
        })
      ).resolves.toBe(true);
    });
  });
});
