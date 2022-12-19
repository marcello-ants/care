import React from 'react';
import { render, screen, waitFor, MatcherFunction } from '@testing-library/react';
import { useRouter } from 'next/router';

import { SENIOR_CARE_TYPE } from '@/__generated__/globalTypes';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { SEEKER_IN_FACILITY_ROUTES } from '@/constants';
import CareTrust from '../care-trust';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.setTimeout(7600);

const initialState: AppState = {
  ...initialAppState,
  seeker: {
    ...initialAppState.seeker,
    zipcode: '90001',
    city: 'Los Angeles',
    state: 'CA',
    typeOfCare: SENIOR_CARE_TYPE.IN_FACILITY,
  },
};

const withMarkup =
  (query: (fn: MatcherFunction) => Element | null) =>
  (target: string | RegExp): Element | null =>
    query((content: string, element: Element | null) => {
      if (!element) return false;
      const hasText = (el: Element) => {
        if (typeof target === 'string') return el.textContent === target;

        return target.test(element.textContent || '');
      };
      const childrenDontHaveText = Array.from(element.children).every(
        (child) => !hasText(child as Element)
      );
      return hasText(element) && childrenDontHaveText;
    });
const queryByTextWithMarkup = withMarkup(screen.queryByText);

describe('Care trust page', () => {
  let asFragment: any | null = null;
  let mockRouter: any = null;

  const renderComponent = (initialInnerState: AppState) => {
    const view = render(
      <AppStateProvider initialStateOverride={initialInnerState}>
        <CareTrust />
      </AppStateProvider>
    );
    ({ asFragment } = view);
  };

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(), // the component uses `router.push` only
      pathname: '/seeker/sc',
      asPath: '/seeker/sc',
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    // cleanup on exiting
    asFragment = null;
    mockRouter = null;
  });

  it('matches snapshot', () => {
    renderComponent(initialState);
    expect(asFragment()).toMatchSnapshot();
  });

  it('match strings in document', async () => {
    renderComponent(initialState);

    await waitFor(() => {
      const el = queryByTextWithMarkup(
        'Did you know? Care.com is trusted by over 3 million families'
      );
      if (!el) return;
      expect(el).toBeInTheDocument();
    });
  });

  it('routes to the who needs care page', async () => {
    renderComponent(initialState);
    await waitFor(
      () => expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.WHO_NEEDS_CARE),
      { timeout: 7600 }
    );
  });
});
