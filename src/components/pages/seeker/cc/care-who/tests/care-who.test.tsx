import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';
import { cloneDeep } from 'lodash-es';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayJSUtils from '@date-io/dayjs';
import { MockedProvider } from '@apollo/client/testing';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { DefaultCareKind } from '@/types/seekerCC';
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { convertDateToISOString } from '@/utilities/dobHelper';
import { CLIENT_FEATURE_FLAGS } from '@/constants';
import CareWhoPage from '../care-who';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('@/utilities/analyticsHelper', () => ({
  ...jest.requireActual('@/utilities/analyticsHelper'),
  AnalyticsHelper: {
    logEvent: jest.fn(),
    logTestExposure: jest.fn(),
  },
}));

let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname'>;
const clonedAppState = cloneDeep(initialAppState);
const appState: AppState = {
  ...clonedAppState,
  seeker: {
    ...clonedAppState.seeker,
    zipcode: '91911',
    city: 'city',
    state: 'state',
  },
  seekerCC: {
    ...clonedAppState.seekerCC,
  },
};

function renderPage(overrideState?: AppState, ldFlags: FeatureFlags = {}) {
  const pathname = '/seeker/cc/care-who';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  return render(
    <MockedProvider mocks={[]} addTypename>
      <FeatureFlagsProvider flags={ldFlags}>
        <MuiPickersUtilsProvider utils={DayJSUtils}>
          <AppStateProvider initialStateOverride={overrideState || appState}>
            <CareWhoPage />
          </AppStateProvider>
        </MuiPickersUtilsProvider>
      </FeatureFlagsProvider>
    </MockedProvider>
  );
}

describe('/care-who', () => {
  const initialDate = '2021-04-30';
  const fiveYearsAgo = '2016-04-30';
  const lessThanMinDate = '1800-01-01';
  const moreThanMaxDate = convertDateToISOString(
    new Date(new Date().getFullYear(), new Date().getMonth() + 13, new Date().getDate())
  );

  it('matches snapshot', async () => {
    const state: AppState = {
      ...appState,
      seekerCC: {
        ...appState.seekerCC,
        careExpecting: true,
        careChildrenDOB: [initialDate],
      },
    };
    const view = renderPage(state);
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('matches snapshot when age qualifies for distance learning', async () => {
    const state: AppState = {
      ...appState,
      seekerCC: {
        ...appState.seekerCC,
        careExpecting: true,
        careChildrenDOB: [fiveYearsAgo],
      },
    };
    const view = renderPage(state);
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('renders correctly', async () => {
    const state: AppState = {
      ...appState,
      seekerCC: {
        ...appState.seekerCC,
        careExpecting: true,
        careChildrenDOB: [initialDate],
      },
    };
    renderPage(state);

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Birth Month and Year (MM/YYYY)')).toBeInTheDocument();
    expect(screen.getByText('Add another child')).toBeInTheDocument();
    expect(screen.getByText("I'm expecting")).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(
      screen.queryByText('Will they need help with distance learning?')
    ).not.toBeInTheDocument();
  });

  it('renders correctly when the user adds more than 1 child', async () => {
    const state: AppState = {
      ...appState,
      seekerCC: {
        ...appState.seekerCC,
        careExpecting: true,
        careChildrenDOB: [initialDate, initialDate],
      },
    };
    renderPage(state);
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('renders correctly when age qualifies for distance learning', async () => {
    const state: AppState = {
      ...appState,
      seekerCC: {
        ...appState.seekerCC,
        careExpecting: true,
        careChildrenDOB: [initialDate, fiveYearsAgo],
      },
    };
    renderPage(state);

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText("I'm expecting")).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Will they need help with distance learning?')).toBeInTheDocument();
  });

  it('does not display distance learning question with growth-cc-enrollment-distance-learning-removal flag', () => {
    const state: AppState = {
      ...appState,
      seekerCC: {
        ...appState.seekerCC,
        careChildrenDOB: [fiveYearsAgo],
      },
    };
    const flags = {
      [CLIENT_FEATURE_FLAGS.DISTANCE_LEARNING_REMOVAL]: {
        variationIndex: 2,
        value: 2,
        reason: { kind: '' },
      },
    };

    renderPage(state, flags);

    expect(AnalyticsHelper.logTestExposure).toHaveBeenCalled();
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(
      screen.queryByText('Will they need help with distance learning?')
    ).not.toBeInTheDocument();
  });

  it('renders error when wrong DOB is selected and careExpecting is false', async () => {
    const state: AppState = {
      ...appState,
      seekerCC: {
        ...appState.seekerCC,
        careExpecting: false,
        careChildrenDOB: [lessThanMinDate, moreThanMaxDate],
      },
    };
    renderPage(state);

    const nextButton = screen.getByRole('button', { name: 'Next' });

    nextButton.click();
    const error = await screen.findAllByText('Oops! Enter valid MM/YYYY format');
    expect(error.length).toEqual(2);
  });

  it('renders no error when wrong DOB is selected and careExpecting is true', async () => {
    const state: AppState = {
      ...appState,
      seekerCC: {
        ...appState.seekerCC,
        careExpecting: false,
        careChildrenDOB: [lessThanMinDate, moreThanMaxDate],
      },
    };
    renderPage(state);

    const nextButton = screen.getByRole('button', { name: 'Next' });

    nextButton.click();
    await waitFor(() => {
      expect(screen.queryByText('Oops! Enter valid MM/YYYY format')).not.toBeInTheDocument();
    });
  });

  it('next button is always enabled', async () => {
    const state: AppState = {
      ...appState,
      seekerCC: {
        ...appState.seekerCC,
        careExpecting: false,
        careChildrenDOB: [null],
      },
    };
    renderPage(state);

    await waitFor(async () => {
      expect(await screen.findByRole('button', { name: 'Next' })).toBeEnabled();
    });
  });

  it('add child and log CTA Interacted event', async () => {
    const state: AppState = {
      ...appState,
      seekerCC: {
        ...appState.seekerCC,
        careExpecting: false,
        careChildrenDOB: [initialDate],
      },
    };
    renderPage(state);

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.queryByText('Child 2')).not.toBeInTheDocument();

    const addChild = screen.getByText('Add another child');

    addChild.click();

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(AnalyticsHelper.logEvent).toHaveBeenCalledWith({
      name: 'CTA Interacted',
      data: {
        cta_clicked: 'Add additional child',
      },
    });
  });

  it('delete child', async () => {
    const state: AppState = {
      ...appState,
      seekerCC: {
        ...appState.seekerCC,
        careExpecting: false,
        careChildrenDOB: [initialDate, fiveYearsAgo],
      },
    };
    renderPage(state);

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();

    const deleteChild = screen.getAllByText('Remove')[0];

    deleteChild.click();

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.queryByText('Child 2')).not.toBeInTheDocument();
  });

  it('type wrong DOB', async () => {
    const state: AppState = {
      ...appState,
      seekerCC: {
        ...appState.seekerCC,
        careExpecting: false,
        careChildrenDOB: [null],
      },
    };
    renderPage(state);
    const DOBInput = screen.getByRole('textbox');
    const nextButton = screen.getByRole('button', { name: 'Next' });

    fireEvent.change(DOBInput, { target: { value: '011800' } });
    nextButton.click();

    const error = await screen.findByText('Oops! Enter valid MM/YYYY format');
    expect(error).toBeInTheDocument();
  });

  it('should render with SEEKER_CC_CONVERSATIONAL_LANGUAGE text', () => {
    renderPage(appState, {
      [CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]: {
        variationIndex: 2,
        value: 2,
        reason: { kind: '' },
      },
    });
    expect(screen.getByText('Tell us about your kids.')).toBeInTheDocument();
  });

  it('should render without SEEKER_CC_CONVERSATIONAL_LANGUAGE text', () => {
    renderPage(appState, {
      [CLIENT_FEATURE_FLAGS.SEEKER_CC_CONVERSATIONAL_LANGUAGE]: {
        variationIndex: 0,
        value: 0,
        reason: { kind: '' },
      },
    });
    expect(screen.getByText('Who needs care?')).toBeInTheDocument();
  });

  it('should log CTA Interacted event when "I am expecting" checkbox is clicked', () => {
    const state: AppState = {
      ...appState,
      seekerCC: {
        ...appState.seekerCC,
        careExpecting: true,
        careChildrenDOB: [initialDate],
      },
    };
    renderPage(state);

    const iAmExpecting = screen.getByText("I'm expecting");
    iAmExpecting.click();

    expect(AnalyticsHelper.logEvent).toHaveBeenCalledWith({
      name: 'CTA Interacted',
      data: {
        cta_clicked: 'I am expecting',
      },
    });
  });

  it('should NOT render "I am expecting" checkbox when "One-Time Sitter" is selected', () => {
    const state: AppState = {
      ...appState,
      seekerCC: {
        ...appState.seekerCC,
        careKind: DefaultCareKind.ONE_TIME_BABYSITTERS,
      },
    };

    renderPage(state);
    expect(screen.queryByLabelText("I'm expecting")).not.toBeInTheDocument();
  });

  it('should log Member Enrolled event when "Next" button is clicked', async () => {
    const state: AppState = {
      ...appState,
      seekerCC: {
        ...appState.seekerCC,
        careExpecting: false,
        careChildrenDOB: [initialDate],
      },
    };
    renderPage(state);
    const nextButton = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(nextButton);

    await waitFor(() =>
      expect(AnalyticsHelper.logEvent).toHaveBeenCalledWith({
        name: 'Member Enrolled',
        data: {
          final_step: false,
          enrollment_step: 'Care Details',
          cta_clicked: 'next',
          ageList: [initialDate],
          number_of_kids: 1,
          vertical: 'Childcare',
          distance_learning: null,
          enrollment_flow: '',
        },
      })
    );
  });
});
