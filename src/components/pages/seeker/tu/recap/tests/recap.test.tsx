import { NextRouter, useRouter } from 'next/router';
import { cloneDeep } from 'lodash-es';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayJSUtils from '@date-io/dayjs';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { render } from '@testing-library/react';
import InterstitialWithReviews from '../recap';

const clonedAppState = cloneDeep(initialAppState);
const appState: AppState = {
  ...clonedAppState,
  seeker: {
    ...clonedAppState.seeker,
    zipcode: '91911',
    city: 'city',
    state: 'state',
  },
};

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));
let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname'>;

// Render Functions

function renderPage(overrideState?: AppState, ldFlags: FeatureFlags = {}) {
  const pathname = '/seeker/tu/recap';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  return render(
    <FeatureFlagsProvider flags={ldFlags}>
      <MuiPickersUtilsProvider utils={DayJSUtils}>
        <AppStateProvider initialStateOverride={overrideState || appState}>
          <InterstitialWithReviews />
        </AppStateProvider>
      </MuiPickersUtilsProvider>
    </FeatureFlagsProvider>
  );
}

describe('/tu/recap', () => {
  it('matches snapshot', async () => {
    const view = renderPage();
    expect(view.asFragment()).toMatchSnapshot();
  });
});
