let savedLocalStorage: Storage;
describe('localStorage Helper', () => {
  beforeAll(() => {
    savedLocalStorage = window.localStorage;
  });
  afterAll(() => {
    // @ts-ignore
    window.localStorage = savedLocalStorage;
  });

  let SafeLocalStorage: typeof import('../localStorageHelper')['SafeLocalStorage'];
  let isLocalStorageAvailable: typeof import('../localStorageHelper')['isLocalStorageAvailable'];
  beforeEach(async () => {
    return import('../localStorageHelper').then((module) => {
      ({ SafeLocalStorage, isLocalStorageAvailable } = module);
      jest.resetModules();
    });
  });

  it('produces a working safeLocalStorage when localStorage unavailable', () => {
    // @ts-ignore
    delete window.localStorage;
    const safeLocalStorage = SafeLocalStorage.getInstance();
    expect(safeLocalStorage.length).toEqual(0);

    safeLocalStorage.setItem('Key', 'Value');
    expect(safeLocalStorage.length).toEqual(1);

    let result = safeLocalStorage.getItem('Key');
    expect(result).toEqual('Value');

    safeLocalStorage.setItem('Key', 'NewValue');
    expect(safeLocalStorage.length).toEqual(1);

    result = safeLocalStorage.getItem('Key');
    expect(result).toEqual('NewValue');

    safeLocalStorage.setItem('SecondKey', 'SecondValue');
    expect(safeLocalStorage.length).toEqual(2);

    result = safeLocalStorage.getItem('SecondKey');
    expect(result).toEqual('SecondValue');

    result = safeLocalStorage.key(1);
    expect(result).toEqual('SecondKey');

    safeLocalStorage.removeItem('SecondKey');
    expect(safeLocalStorage.length).toEqual(1);

    result = safeLocalStorage.getItem('SecondKey');
    expect(result).toEqual(null);

    safeLocalStorage.clear();
    expect(safeLocalStorage.length).toEqual(0);
  });

  describe('#isLocalStorageAvailable', () => {
    it('should return false when an error is thrown', () => {
      // @ts-ignore
      window.localStorage = {
        setItem: jest.fn().mockImplementation(() => {
          throw new Error();
        }),
      };
      expect(isLocalStorageAvailable()).toBe(false);
    });
  });
});
