import { captureMessage, Severity } from '@sentry/nextjs';
import {
  LOCAL_STORAGE_ERROR_TAG,
  LOCAL_STORAGE_VERIFICATION_KEY,
  LOCAL_STORAGE_VERIFICATION_VALUE,
} from '../constants';
import logger from '../lib/clientLogger';

const localStorageErrorMsg = 'LocalStorage could not be used';

export function isLocalStorageAvailable(): boolean {
  if (typeof window !== 'undefined') {
    if (window.localStorage) {
      try {
        window.localStorage.setItem(
          LOCAL_STORAGE_VERIFICATION_KEY,
          LOCAL_STORAGE_VERIFICATION_VALUE
        );
        const result = window.localStorage.getItem(LOCAL_STORAGE_VERIFICATION_KEY);

        if (result === LOCAL_STORAGE_VERIFICATION_VALUE) {
          return true;
        }
      } catch (e) {
        logger.warn(localStorageErrorMsg, { error: e as Error, tags: [LOCAL_STORAGE_ERROR_TAG] });
        captureMessage(`${localStorageErrorMsg} ${e}`, Severity.Warning);
        return false;
      }
    }
  }

  logger.warn(localStorageErrorMsg, { tags: [LOCAL_STORAGE_ERROR_TAG] });
  captureMessage(localStorageErrorMsg, Severity.Warning);
  return false;
}

// eslint-disable-next-line import/prefer-default-export
export class SafeLocalStorage implements Storage {
  private static instance: SafeLocalStorage;

  private constructor() {
    this.localStorageAvailable = isLocalStorageAvailable();
    this.internalStorage = {};
    this.length = Object.keys(this.internalStorage).length;
  }

  public static getInstance(): SafeLocalStorage {
    // We only want singletons when running client side
    // If this is ever ran server side (which it shouldn't I believe),
    // then create a new instance every time

    if (typeof window === 'undefined') {
      return new SafeLocalStorage();
    }

    if (!SafeLocalStorage.instance) {
      SafeLocalStorage.instance = new SafeLocalStorage();
    }

    return SafeLocalStorage.instance;
  }

  internalStorage: { [key: string]: string };

  localStorageAvailable: boolean;

  length: number;

  clear() {
    if (this.localStorageAvailable) {
      localStorage.clear();
      this.length = 0;
    } else {
      this.internalStorage = {};
      this.length = 0;
    }
  }

  getItem(key: string): string | null {
    if (this.localStorageAvailable) {
      return localStorage.getItem(key);
    }
    if (Object.prototype.hasOwnProperty.call(this.internalStorage, key)) {
      return this.internalStorage[key];
    }
    return null;
  }

  key(index: number): string | null {
    if (this.localStorageAvailable) {
      return localStorage.key(index);
    }
    const keys = Object.keys(this.internalStorage);
    if (keys.length > 0 && index < keys.length) {
      return keys.sort()[index];
    }
    return null;
  }

  removeItem(key: string): void {
    if (this.localStorageAvailable) {
      localStorage.removeItem(key);
      this.length = localStorage.length;
    } else {
      if (Object.prototype.hasOwnProperty.call(this.internalStorage, key)) {
        delete this.internalStorage[key];
      }
      this.length = Object.keys(this.internalStorage).length;
    }
  }

  setItem(key: string, value: string): void {
    if (this.localStorageAvailable) {
      localStorage.setItem(key, value);
      this.length = localStorage.length;
    } else {
      this.internalStorage[key] = value;
      this.length = Object.keys(this.internalStorage).length;
    }
  }
}
