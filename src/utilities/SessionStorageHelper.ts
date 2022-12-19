import { captureException } from '@sentry/nextjs';

let isSessionStorageAvailable: boolean;

// eslint-disable-next-line import/prefer-default-export
export const SessionStorageHelper = {
  isAvailable() {
    if (typeof isSessionStorageAvailable !== 'undefined') {
      return isSessionStorageAvailable;
    }

    isSessionStorageAvailable = false;
    const sessionStorage = window?.sessionStorage;
    if (typeof sessionStorage !== 'undefined') {
      const testKey = 'enrollment-mfe-session-storage-test';
      try {
        sessionStorage.setItem(testKey, testKey);
        sessionStorage.removeItem(testKey);
        isSessionStorageAvailable = true;
      } catch (e) {
        isSessionStorageAvailable = false;
        captureException(e);
      }
    }
    return isSessionStorageAvailable;
  },

  getItem(key: string) {
    return window?.sessionStorage?.getItem(key) ?? null;
  },

  removeItem(key: string) {
    window?.sessionStorage?.removeItem(key);
  },

  setItem(key: string, value: string) {
    try {
      window?.sessionStorage?.setItem(key, value);
    } catch (e) {
      captureException(e);
    }
  },
};
