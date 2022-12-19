// External Dependencies
import React from 'react';
import { render, screen } from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { initialAppState } from '@/state';

// Internal Dependencies
import { AppStateProvider } from '@/components/AppState';
import DaycareToursRequested from '../daycare-tours-requested';
// Mocks

const windowLocationAssignMock = jest.fn();

const analyticsMock = jest
  .spyOn(AnalyticsHelper, 'logEvent')
  .mockImplementation(() => Promise.resolve());

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

let mockRouter: Pick<NextRouter, 'push' | 'pathname'>;

function renderPage(state = initialAppState, pathname = '/seeker/dc/tours-requested') {
  mockRouter = {
    push: jest.fn(), // the component uses `router.push` only
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  return render(
    <AppStateProvider initialStateOverride={state}>
      <DaycareToursRequested />
    </AppStateProvider>
  );
}

describe('Day Care - Tours Requested', () => {
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

  it('matches snapshot', async () => {
    const view = renderPage();
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('handles click on "Learn more" links - Licensing', async () => {
    renderPage();
    const learnMoreLinks = await screen.findAllByText('Learn more');
    const licensingLink = learnMoreLinks[0];

    licensingLink.click();
    expect(windowLocationAssignMock).toHaveBeenCalledWith(
      'https://www.care.com/c/stories/16111/child-care-center-licensing-by-state/'
    );
  });

  it('handles click on "Learn more" links - Interview', async () => {
    renderPage();
    const learnMoreLinks = await screen.findAllByText('Learn more');
    const licensingLink = learnMoreLinks[1];

    licensingLink.click();
    expect(windowLocationAssignMock).toHaveBeenCalledWith(
      'https://www.care.com/c/stories/10258/the-day-care-guide-interviewing-day-cares/'
    );
  });

  it('handles click on "Learn more" links - Costs', async () => {
    renderPage();
    const learnMoreLinks = await screen.findAllByText('Learn more');
    const licensingLink = learnMoreLinks[2];

    licensingLink.click();
    expect(windowLocationAssignMock).toHaveBeenCalledWith(
      'https://www.care.com/c/stories/10259/the-day-care-guide-the-cost-of-day-care/'
    );
  });

  it('handles click on "Continue" SEEKER_DAYCARE_CHILD_CARE flow', async () => {
    renderPage();
    const continueButton = await screen.findByText('Continue');

    continueButton.click();

    expect(analyticsMock).toHaveBeenCalledWith({
      name: 'Member Enrolled',
      data: {
        cta_clicked: 'continue',
      },
    });
  });
});
