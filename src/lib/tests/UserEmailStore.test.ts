import userEmailStore from '../UserEmailStore';

const expiredEmailRecord = '{"email":"test@email.com","expiresAt": "1000"}';
const activeEmailRecord = `{"email":"test@email.com","expiresAt": "1000000000000000"}`;

describe('userEmailStore', () => {
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
        getItem: jest.fn(() => activeEmailRecord),
        clearItem: jest.fn(),
        removeItem: jest.fn(),
        clear: () => {},
      },
    });
  });

  describe('setEmail', () => {
    it('saves email in session storage temporarily', () => {
      jest.useFakeTimers('legacy');
      userEmailStore.setEmail('test@email.com');

      expect(sessionStorage.setItem).toHaveBeenCalled();
      expect(setTimeout).toHaveBeenCalled();
    });
  });

  describe('getEmail', () => {
    it("returns email if it's present in session storage", () => {
      const email = userEmailStore.getEmail();

      expect(sessionStorage.getItem).toHaveBeenCalled();
      expect(email).toBe('test@email.com');
    });

    it('returns empty string if email is not present in session storage', () => {
      (window.sessionStorage.getItem as jest.Mock).mockReturnValue('');

      const email = userEmailStore.getEmail();

      expect(sessionStorage.getItem).toHaveBeenCalled();
      expect(email).toBe('');
    });

    it('returns empty string if email is expired', () => {
      (window.sessionStorage.getItem as jest.Mock).mockReturnValue(expiredEmailRecord);

      const email = userEmailStore.getEmail();

      expect(sessionStorage.getItem).toHaveBeenCalled();
      expect(sessionStorage.removeItem).toHaveBeenCalled();
      expect(email).toBe('');
    });
  });

  describe('clearEmail', () => {
    it('deletes email from session storage', () => {
      userEmailStore.clearEmail();

      expect(sessionStorage.removeItem).toHaveBeenCalled();
    });
  });
});
