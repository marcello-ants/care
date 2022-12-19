/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { NextRouter } from 'next/router';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import DayJSUtils from '@date-io/dayjs';
import { theme } from '@care/material-ui-theme';
import { ThemeProvider } from '@material-ui/core';
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { AppState } from '@/types/app';

export interface PrepareTreeOptions {
  pathname?: string;
  mocks?: MockedResponse[];
  flags?: FeatureFlags;
  appState?: AppState;
  addTypeName?: boolean;
  basePath?: string;
}

const prepareTree = (options?: PrepareTreeOptions) => {
  const {
    pathname = '/path',
    mocks = [],
    flags = {},
    appState = initialAppState,
    addTypeName = false,
    basePath = '/',
  } = options || {};
  const routerMock = {
    push: jest.fn(),
    asPath: pathname,
    beforePopState: (cb: any) => {
      cb({ url: pathname });
    },
    basePath,
    pathname,
    query: {},
    back: jest.fn(),
  } as unknown as NextRouter;

  const renderFn = (children: React.ReactNode) => (
    <ThemeProvider theme={theme}>
      <RouterContext.Provider value={routerMock}>
        <MockedProvider mocks={mocks} addTypename={addTypeName}>
          <MuiPickersUtilsProvider utils={DayJSUtils}>
            <FeatureFlagsProvider flags={flags}>
              <AppStateProvider initialStateOverride={appState}>{children}</AppStateProvider>
            </FeatureFlagsProvider>
          </MuiPickersUtilsProvider>
        </MockedProvider>
      </RouterContext.Provider>
    </ThemeProvider>
  );

  return {
    renderFn,
    routerMock,
  };
};

export const preRenderHook = (options?: PrepareTreeOptions) => {
  const tree = prepareTree(options);
  const renderFn = <T,>(hook: () => T) =>
    renderHook(hook, {
      wrapper({ children }: { children: React.ReactNode }) {
        return tree.renderFn(children);
      },
    });

  return {
    ...tree,
    renderFn,
  };
};

export const preRenderPage = (options?: PrepareTreeOptions) => {
  const tree = prepareTree(options);
  const renderFn = (ComponentOrChildren: React.ComponentType | React.ReactNode) => {
    if (React.isValidElement(ComponentOrChildren)) {
      return render(tree.renderFn(ComponentOrChildren));
    }

    const Component = ComponentOrChildren as React.ComponentType;
    return render(tree.renderFn(<Component />));
  };

  return {
    ...tree,
    renderFn,
    renderTree: tree.renderFn,
  };
};

export const setupWindowLocation = () => {
  const originalLocation = window.location;
  const windowLocationMock = jest.fn();

  // @ts-ignore
  delete window.location;
  // @ts-ignore
  window.location = {
    assign: windowLocationMock,
  };

  return {
    mock: windowLocationMock,
    cleanUp() {
      window.location = originalLocation;
    },
  };
};

export const setupLocalStorage = () => {
  const originalLocalStorage: Storage = window.localStorage;
  const localStorageMock = jest.fn();
  Object.defineProperty(window, 'localStorage', localStorageMock);

  return {
    mock: localStorageMock,
    cleanUp() {
      Object.defineProperty(window, 'localStorage', originalLocalStorage);
    },
  };
};

export function mockFetch({ ok, status, data }: { ok: boolean; status: number; data: any }) {
  return () =>
    Promise.resolve({
      ok,
      status,
      json: () => Promise.resolve(data),
    } as Response);
}
