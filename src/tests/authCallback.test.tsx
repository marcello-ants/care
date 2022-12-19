import React from 'react';
import { render, waitFor } from '@testing-library/react';
import AuthCallBack from '@/pages/authCallback';

jest.mock('@/components/AppState', () => ({
  ...(jest.requireActual('@/components/AppState') as object),
  useAppDispatch: jest.fn(),
}));

const mockSigninRedirectCallback = jest.fn();
jest.mock('oidc-client', () => ({
  // eslint-disable-next-line object-shorthand, func-names
  UserManager: function () {
    return {
      signinRedirectCallback: mockSigninRedirectCallback,
    };
  },
  // eslint-disable-next-line object-shorthand, func-names
  WebStorageStateStore: function () {
    return {};
  },
}));

jest.mock('next/config', () => () => {
  return {
    publicRuntimeConfig: {
      BASE_PATH: '/app/enrollment',
    },
  };
});

function doRender() {
  const utils = render(<AuthCallBack />);

  return utils;
}

const originalFetch = global.fetch;
const { location: originalLocation } = window;

beforeEach(() => {
  global.fetch = jest.fn();

  // @ts-ignore
  delete window.location;
  /* eslint-disable no-restricted-globals */
  (window.location as Pick<typeof window.location, 'replace'>) = {
    replace: jest.fn(),
  };
});

afterEach(() => {
  mockSigninRedirectCallback.mockClear();
  global.fetch = originalFetch;
  window.location = originalLocation;
});

describe('pages/authCallback', () => {
  const BASE_PATH = '/app/enrollment';
  it('matches snapshot', () => {
    const { asFragment } = doRender();

    expect(asFragment()).toMatchSnapshot();
  });

  describe('click event logging', () => {
    it('should wait for the click request to complete before redirecting', async () => {
      (global.fetch as jest.Mock).mockReturnValue(
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              status: 204,
            });
          }, 100);
        })
      );
      mockSigninRedirectCallback.mockReturnValue({
        profile: {
          sub: 'mem:70d7b68f-f7bf-4479-8ae7-9038f5f1dd42',
        },
        state: `${BASE_PATH}/post-redirect-url`,
      });

      doRender();

      expect(window.location.replace).not.toHaveBeenCalled();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/trackClick.do?contentType=mfeClick&contentId=70d7b68f-f7bf-4479-8ae7-9038f5f1dd42'
        );
      });

      await waitFor(() => {
        expect(window.location.replace).toHaveBeenCalledWith(`${BASE_PATH}/post-redirect-url`);
      });
    });

    it('should redirect the user even when the click request returns a non-204 status code', async () => {
      const fetchPromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            status: 503,
          });
        }, 100);
      });
      (global.fetch as jest.Mock).mockReturnValue(fetchPromise);
      mockSigninRedirectCallback.mockReturnValue({
        profile: {
          sub: 'mem:70d7b68f-f7bf-4479-8ae7-9038f5f1dd42',
        },
        state: '/app/enrollment/post-redirect-url',
      });

      doRender();

      expect(window.location.replace).not.toHaveBeenCalled();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/trackClick.do?contentType=mfeClick&contentId=70d7b68f-f7bf-4479-8ae7-9038f5f1dd42'
        );
      });

      await waitFor(() => {
        expect(window.location.replace).toHaveBeenCalledWith(`${BASE_PATH}/post-redirect-url`);
      });
    });

    it('should redirect the user even when the click request returns an error', async () => {
      const fetchPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('boom!'));
        }, 100);
      });
      (global.fetch as jest.Mock).mockReturnValue(fetchPromise);
      mockSigninRedirectCallback.mockReturnValue({
        profile: {
          sub: 'mem:70d7b68f-f7bf-4479-8ae7-9038f5f1dd42',
        },
        state: '/app/enrollment/post-redirect-url',
      });

      doRender();

      expect(window.location.replace).not.toHaveBeenCalled();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/trackClick.do?contentType=mfeClick&contentId=70d7b68f-f7bf-4479-8ae7-9038f5f1dd42'
        );
      });

      await waitFor(() => {
        expect(window.location.replace).toHaveBeenCalledWith(`${BASE_PATH}/post-redirect-url`);
      });
    });

    it('should redirect the user if the profile is missing the "sub" field', async () => {
      mockSigninRedirectCallback.mockReturnValue({
        profile: {},
        state: '/app/enrollment/post-redirect-url',
      });

      doRender();

      await waitFor(() => {
        expect(window.location.replace).toHaveBeenCalledWith(`${BASE_PATH}/post-redirect-url`);
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should redirect the user if the "sub" field is not a member UUID', async () => {
      mockSigninRedirectCallback.mockReturnValue({
        profile: {
          sub: 'not a member uuid',
        },
        state: '/app/enrollment/post-redirect-url',
      });

      doRender();

      await waitFor(() => {
        expect(window.location.replace).toHaveBeenCalledWith(`${BASE_PATH}/post-redirect-url`);
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should throw an error', async () => {
      mockSigninRedirectCallback.mockRejectedValue(new Error('Async error'));
      doRender();
      await expect(mockSigninRedirectCallback).rejects.toThrow('Async error');
    });
  });

  it('should use location.replace when redirecting outside the app', async () => {
    (global.fetch as jest.Mock).mockReturnValue(Promise.resolve());
    mockSigninRedirectCallback.mockReturnValue({
      state: '/dwb/seeker/preRateCardTest',
    });

    doRender();

    expect(window.location.replace).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(window.location.replace).toHaveBeenCalledWith('/dwb/seeker/preRateCardTest');
    });
  });

  it("should navigate to the root when there's an error", async () => {
    mockSigninRedirectCallback.mockRejectedValue(new Error('no matching user in state'));

    doRender();

    expect(window.location.replace).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(window.location.replace).toHaveBeenCalledWith('/');
    });
  });
});
