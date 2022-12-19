import { screen, fireEvent } from '@testing-library/react';

import { preRenderPage } from '@/__setup__/testUtil';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';

import NoInventory from '../NoInventory';

const windowLocationAssignMock = jest.fn();
describe('Unhappy screen No Inventory', () => {
  const originalLocation = window.location;

  beforeAll(() => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should match snapshot', () => {
    const { renderFn } = preRenderPage();
    const { asFragment } = renderFn(NoInventory);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should redirect correctly to search results if clicked on in home card', () => {
    const appState: AppState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        zipcode: '78665',
      },
    };

    const { renderFn } = preRenderPage({ appState });
    renderFn(NoInventory);

    const link = screen.getByRole('button', { name: 'Find a caregiver' });
    fireEvent.click(link);

    expect(windowLocationAssignMock).toHaveBeenCalledWith(
      '/mwb/member/sitterSearchTest?serviceId=SENIRCARE&zip=78665&overrideMfeRedirect=true'
    );
  });

  it('should redirect correctly if clicked on learning card', () => {
    const { renderFn } = preRenderPage();
    renderFn(NoInventory);

    const link = screen.getByRole('button', { name: 'View articles and guides' });
    fireEvent.click(link);
    expect(windowLocationAssignMock).toHaveBeenCalledWith(
      'https://www.care.com/c/stories/15645/questions-ask-assisted-living-facility/'
    );
  });
});
