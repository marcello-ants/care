import { redirectToProviderSearch } from '@/components/pages/seeker/czenProviderHelper/czenProviderHelper';

const windowLocationAssignMock = jest.fn();
describe('CZEN Provider Helper', () => {
  const originalLocation = window.location;

  beforeAll(() => {
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = {
      assign: windowLocationAssignMock,
    };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects correctly when zip undefined', () => {
    redirectToProviderSearch(undefined, undefined, true);
    expect(windowLocationAssignMock).toHaveBeenCalledWith('/');
  });

  it('redirects correctly when zip defined and mobile visitor', () => {
    redirectToProviderSearch('78665', undefined, false);
    expect(windowLocationAssignMock).toHaveBeenCalledWith(
      '/mwb/member/sitterSearchTest?serviceId=SENIRCARE&zip=78665&overrideMfeRedirect=true'
    );
  });

  it('redirects correctly when zip defined and desktop visitor; radius undefined', () => {
    redirectToProviderSearch('78665', undefined, true);
    expect(windowLocationAssignMock).toHaveBeenCalledWith(
      '/visitor/captureSearchBar.do?sitterService=seniorCare&zipCode=78665&milesFromZipCode=20&searchPerformed=true&searchByZip=true&defaultZip=true&searchSource=MAG_GLASS&overrideMfeRedirect=true'
    );
  });

  it('redirects correctly when zip defined and desktop visitor; radius defined', () => {
    redirectToProviderSearch('78665', 10, true);
    expect(windowLocationAssignMock).toHaveBeenCalledWith(
      '/visitor/captureSearchBar.do?sitterService=seniorCare&zipCode=78665&milesFromZipCode=10&searchPerformed=true&searchByZip=true&defaultZip=true&searchSource=MAG_GLASS&overrideMfeRedirect=true'
    );
  });
});
