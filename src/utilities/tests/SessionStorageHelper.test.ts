// eslint-disable-next-line jest/no-export
// export {};

// @ts-ignore
describe('sessionStorage Helper', () => {
  let originalSessionStorage: Storage;
  beforeAll(() => {
    originalSessionStorage = window.sessionStorage;
  });
  afterAll(() => {
    // @ts-ignore
    window.sessionStorage = originalSessionStorage;
  });

  let SessionStorageHelper: typeof import('../SessionStorageHelper')['SessionStorageHelper'];
  beforeEach(() => {
    return import('../SessionStorageHelper').then((module) => {
      ({ SessionStorageHelper } = module);
      jest.resetModules();
    });
  });

  describe('isAvailable', () => {
    it("should return false when window.sessionStorage doesn't exist", () => {
      // @ts-ignore
      delete window.sessionStorage;
      expect(SessionStorageHelper.isAvailable()).toBe(false);
      // @ts-ignore
      window.sessionStorage = originalSessionStorage;
    });

    it('should return false when window.sessionStorage setItem throws an error', () => {
      // @ts-ignore
      window.sessionStorage = {
        setItem: jest.fn().mockImplementation(() => {
          throw new Error();
        }),
      };
      expect(SessionStorageHelper.isAvailable()).toBe(false);
      // @ts-ignore
      window.sessionStorage = originalSessionStorage;
    });

    it('should return true when window.sessionStorage exists and works', () => {
      expect(SessionStorageHelper.isAvailable()).toBe(true);
    });
  });

  describe('getItem', () => {
    it('should call through to sessionStorage.getItem', () => {
      window.sessionStorage.setItem('foo', 'bar');
      expect(SessionStorageHelper.getItem('foo')).toBe('bar');
    });
  });

  describe('setItem', () => {
    it('should call through to sessionStorage.setItem', () => {
      SessionStorageHelper.setItem('foo', 'bar');
      expect(window.sessionStorage.getItem('foo')).toBe('bar');
    });

    it('should not throw if setItem throws an error', () => {
      // @ts-ignore
      window.sessionStorage = {
        setItem: jest.fn().mockImplementation(() => {
          throw new Error();
        }),
      };

      expect(() => {
        SessionStorageHelper.setItem('foo', 'bar');
      }).not.toThrow();

      // @ts-ignore
      window.sessionStorage = originalSessionStorage;
    });
  });

  describe('removeItem', () => {
    it('should call through to sessionStorage.removeItem', () => {
      window.sessionStorage.setItem('foo', 'bar');
      SessionStorageHelper.removeItem('foo');
      expect(window.sessionStorage.getItem('foo')).toBeNull();
    });
  });
});
