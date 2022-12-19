import { NextRouter, useRouter } from 'next/router';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { cloneDeep } from 'lodash-es';
import { MockedProvider } from '@apollo/client/testing';
import { AppState } from '@/types/app';
import { initialAppState } from '@/state';
import { AppStateProvider } from '@/components/AppState';
import { GET_CAREGIVER_COUNT_FOR_JOB } from '@/components/request/GQL';
import IdealCaregiver from '../ideal-caregiver';

const TEST_DATA_ZIP_CODE = '78665';
jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const useProvidersCountMock = {
  request: {
    query: GET_CAREGIVER_COUNT_FOR_JOB,
    variables: {
      zipcode: TEST_DATA_ZIP_CODE,
      serviceType: 'CHILD_CARE',
    },
  },
  result: {
    data: {
      getCaregiverCountForJob: {
        count: 100,
      },
    },
  },
};
let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname'>;
const clonedAppState = cloneDeep(initialAppState);
const appState: AppState = {
  ...clonedAppState,
};

function renderPage() {
  const pathname = '/seeker/cc/ideal-caregiver';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  return render(
    <MockedProvider mocks={[useProvidersCountMock]} addTypename={false}>
      <AppStateProvider initialStateOverride={appState}>
        <IdealCaregiver />
      </AppStateProvider>
    </MockedProvider>
  );
}

describe('Seeker - Child Care - Ideal Caregiver', () => {
  it('matches snapshot', async () => {
    const view = renderPage();
    expect(view.asFragment()).toMatchSnapshot();
  });
  it('Test ideal caregiver options are rendering', async () => {
    renderPage();
    expect(screen.getByText('Patient')).toBeInTheDocument();
    expect(screen.getByText('Loving')).toBeInTheDocument();
  });
  it('Test ideal caregiver options click', async () => {
    renderPage();
    const pillCheckBox = screen.getByDisplayValue('PATIENT');
    const pill = screen.getByText('Patient').nextElementSibling || screen.getByText('Patient');
    expect(pill).not.toBeNull();
    expect(pillCheckBox).not.toBeChecked();
    fireEvent.click(pill);
    fireEvent.change(pill);
    expect(pillCheckBox).toBeChecked();
  });
  it('Test ideal caregiver test input filter out invalid chars', async () => {
    renderPage();
    const personalityInput = screen.getByRole('textbox');
    fireEvent.change(personalityInput, { target: { value: 'Need very nice person!Ὣ♂' } });
    await waitFor(() => expect(personalityInput).toHaveDisplayValue('Need very nice person!'));
  });
});
