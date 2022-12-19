import userPasswordStore from '../UserPasswordStore';

const expiredPasswordRecord = '{"password":"letmein1","expiresAt": "1000"}';
const activePasswordRecord = `{"password":"letmein1","expiresAt": "1000000000000000"}`;

describe('userPasswordStore', () => {
  let originalSessionStorage: Storage;
  beforeAll(() => {
    originalSessionStorage = window.sessionStorage;
  });
  afterAll(() => {
    Object.defineProperty(window, 'sessionStorage', originalSessionStorage);
  });

  beforeEach(() => {
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        setItem: jest.fn(),
        getItem: jest.fn(() => activePasswordRecord),
        clearItem: jest.fn(),
        removeItem: jest.fn(),
        clear: () => {},
      },
    });
  });

  describe('setPassword', () => {
    it('saves password in session storage temporarily', () => {
      jest.useFakeTimers('legacy');
      userPasswordStore.setPassword('letmein1');

      expect(sessionStorage.setItem).toHaveBeenCalled();
      expect(setTimeout).toHaveBeenCalled();
    });
  });

  describe('getPassword', () => {
    it("returns password if it's present in session storage", () => {
      const password = userPasswordStore.getPassword();

      expect(sessionStorage.getItem).toHaveBeenCalled();
      expect(password).toBe('letmein1');
    });

    it('returns empty string if password is not present in session storage', () => {
      (window.sessionStorage.getItem as jest.Mock).mockReturnValue('');

      const password = userPasswordStore.getPassword();

      expect(sessionStorage.getItem).toHaveBeenCalled();
      expect(password).toBe('');
    });

    it('returns empty string if password is expired', () => {
      (window.sessionStorage.getItem as jest.Mock).mockReturnValue(expiredPasswordRecord);

      const password = userPasswordStore.getPassword();

      expect(sessionStorage.getItem).toHaveBeenCalled();
      expect(sessionStorage.removeItem).toHaveBeenCalled();
      expect(password).toBe('');
    });
  });

  describe('clearPassword', () => {
    it('deletes password from session storage', () => {
      userPasswordStore.clearPassword();

      expect(sessionStorage.removeItem).toHaveBeenCalled();
    });
  });
});
