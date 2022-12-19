import { cloneDeep } from 'lodash-es';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { preRenderPage } from '@/__setup__/testUtil';
import IbRecapPage from '../recap';

const clonedAppState = cloneDeep(initialAppState);
const appState: AppState = {
  ...clonedAppState,
  seeker: {
    ...clonedAppState.seeker,
    zipcode: '44056',
    city: 'Akron',
    state: 'OH',
  },
};

// Render Functions

function renderPage() {
  const { renderFn } = preRenderPage({
    pathname: '/seeker/ib/recap',
    appState,
  });

  const view = renderFn(<IbRecapPage />);

  return view;
}

describe('/ib/recap', () => {
  it('matches snapshot', async () => {
    const view = renderPage();
    expect(view.asFragment()).toMatchSnapshot();
  });
});
