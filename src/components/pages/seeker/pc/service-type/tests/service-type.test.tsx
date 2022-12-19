import React from 'react';
import { NextRouter, useRouter } from 'next/router';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppStateProvider, useAppDispatch } from '@/components/AppState';
import { ServiceTypes, ServiceTypesLabels } from '@/types/seekerPC';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import ServiceTypePage from '../service-type';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname'>;
jest.mock('@/components/AppState', () => ({
  ...(jest.requireActual('@/components/AppState') as object),
  useAppDispatch: jest.fn(),
}));
let mockAppDispatch: ReturnType<typeof useAppDispatch>;
let nextBtn: HTMLElement;

const appState: AppState = {
  ...initialAppState,
};
function renderPage(overrideState?: AppState) {
  const pathname = '/seeker/pc/service-type';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  const view = render(
    <AppStateProvider initialStateOverride={overrideState || appState}>
      <ServiceTypePage />
    </AppStateProvider>
  );
  nextBtn = screen.getByRole('button', { name: 'Next' });
  return view;
}

describe('What tasks page', () => {
  it('renders correctly', () => {
    expect(renderPage().asFragment()).toMatchSnapshot();
  });

  it('dispatch a `setServiceType` action on radio button click', async () => {
    mockAppDispatch = jest.fn();
    (useAppDispatch as jest.Mock).mockReturnValue(mockAppDispatch);
    renderPage();
    const walkingRadio = screen.getByText(ServiceTypesLabels.WALKING);
    walkingRadio.click();
    expect(mockAppDispatch).toHaveBeenCalledWith({
      type: 'setServiceType',
      serviceType: ServiceTypes.WALKING,
    });
  });

  it('should display the error message when clicking Next with no service types selected', async () => {
    await renderPage();
    userEvent.click(nextBtn);
    expect(screen.getByText('Please select the type of service needed')).toBeVisible();
  });

  it('routes to the next page after selection and button click', async () => {
    const overrideState = {
      ...initialAppState,
      seekerPC: {
        ...initialAppState.seekerPC,
        serviceType: ServiceTypes.WALKING,
      },
    };
    await renderPage(overrideState);
    userEvent.click(nextBtn);
    expect(mockRouter.push).toHaveBeenCalled();
  });
});
