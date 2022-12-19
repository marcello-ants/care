import React from 'react';
import { useRouter } from 'next/router';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { AppStateProvider } from '@/components/AppState';
import useNextRoute from '@/components/hooks/useNextRoute';
import { SeniorCareAgeRangeType } from '@/__generated__/globalTypes';
import { POST_A_JOB_ROUTES } from '@/constants';
import { initialState as flowInitialState } from '@/state/flow';
import PayoffPage from '../payoff';

const testZipCode = '90001';

const windowLocationAssignMock = jest.fn();

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('@/components/hooks/useNextRoute');

jest.mock('@/components/hooks/useFlowHelper', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    currentFlow: 'SEEKER',
  })),
}));

jest.mock('@material-ui/core', () => {
  const originalMUI = jest.requireActual('@material-ui/core');

  return {
    __esModule: true,
    ...originalMUI,
    useMediaQuery: jest.fn().mockReturnValue(true),
  };
});

describe('PayoffPage', () => {
  let mockRouter: any | null = null;
  let mockRoute: any = null;
  let asFragment: any | null = null;
  const originalLocation = window.location;

  const renderComponent = (state?: AppState) => {
    const initialState: AppState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        zipcode: testZipCode,
        whoNeedsCareAge: SeniorCareAgeRangeType.FIFTIES,
      },
    };

    const view = render(
      <AppStateProvider initialStateOverride={state || initialState}>
        <PayoffPage />
      </AppStateProvider>
    );

    ({ asFragment } = view);
  };

  beforeAll(async () => {
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = {
      assign: windowLocationAssignMock,
    };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  beforeEach(async () => {
    mockRouter = {
      push: jest.fn(), // the component uses `router.push` only
      pathname: '/seeker/sc',
    };
    mockRoute = {
      pushNextRoute: jest.fn(),
    };

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useNextRoute as jest.Mock).mockReturnValue(mockRoute);
  });

  it('matches snapshot', async () => {
    renderComponent();
    expect(
      await screen.findByText('A senior care family advisor will contact you shortly!')
    ).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly', async () => {
    renderComponent();

    expect(
      await screen.findByText('A senior care family advisor will contact you shortly!')
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Here are a couple things you can do while you make your way through the process:'
      )
    ).toBeInTheDocument();
  });

  it('renders correctly if error is present', async () => {
    const errorState: AppState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        zipcode: testZipCode,
        whoNeedsCareAge: SeniorCareAgeRangeType.FIFTIES,
        seniorCareFacilityLeadGenerateMutationError: true,
      },
    };

    renderComponent(errorState);

    expect(await screen.findByText('An error has occured')).toBeInTheDocument();
    expect(
      screen.getByText('We were unable to load the content you were looking for.')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Here are a couple things you can do while you make your way through the process:'
      )
    ).toBeInTheDocument();
  });

  it('should fire Amplitude Event', async () => {
    renderComponent();

    await screen.findByText('A senior care family advisor will contact you shortly!');

    const articleLink = screen.getByText('View articles and guides');
    userEvent.click(articleLink);
    expect(articleLink).toBeInTheDocument();
  });

  it('should redirect to Post a Job page', async () => {
    renderComponent();

    await screen.findByText('A senior care family advisor will contact you shortly!');

    const postAJob = screen.getByText('Find a caregiver');
    userEvent.click(postAJob);
    expect(mockRouter.push).toHaveBeenCalledWith(POST_A_JOB_ROUTES.POST_A_JOB);
  });

  it('should redirect to in-home caregivers if user has account', async () => {
    const state: AppState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        zipcode: '99547',
      },
      flow: {
        ...initialAppState.flow,
        userHasAccount: true,
      },
    };
    renderComponent(state);

    await screen.findByText('A senior care family advisor will contact you shortly!');

    const findCaregiver = screen.getByText('Find a caregiver');
    await new Promise((resolve) => setTimeout(resolve, 0));

    userEvent.click(findCaregiver);
    expect(windowLocationAssignMock).toHaveBeenCalledWith(
      '/visitor/captureSearchBar.do?sitterService=seniorCare&zipCode=99547&milesFromZipCode=20&searchPerformed=true&searchByZip=true&defaultZip=true&searchSource=MAG_GLASS&overrideMfeRedirect=true'
    );
  });

  it('renders correctly after submitting SALC leads', async () => {
    const state: AppState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        SALCSeniorCareFacilityLeadsPublished: true,
      },
    };

    renderComponent(state);

    expect(
      await screen.findByText(
        'Thanks for using Care.com to connect with senior living communities!'
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Here are a couple things you can do while you make your way through the process:'
      )
    ).toBeInTheDocument();
  });

  it('renders correctly without having submitted leads', async () => {
    renderComponent();

    expect(
      await screen.findByText('A senior care family advisor will contact you shortly!')
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Here are a couple things you can do while you make your way through the process:'
      )
    ).toBeInTheDocument();
  });

  it('should render correct copy text when leads are submited AND in NTH day flow', async () => {
    const state: AppState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        SALCSeniorCareFacilityLeadsPublished: true,
        SALCSavedFacilitiesIds: ['1', '2', '3', '4', '5'],
      },
      flow: {
        ...flowInitialState,
        memberId: '123',
        userHasAccount: true,
      },
    };

    renderComponent(state);

    expect(
      await screen.findByText('5 communities have received your request and will be in touch soon!')
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'In the meantime, you can explore in-home care options and resources by Care.com'
      )
    ).toBeInTheDocument();
  });
});
