import {
  CZEN_BASE_PATH,
  CZEN_DESKTOP_SC_PROVIDER_SEARCH_PATH,
  CZEN_MW_SC_PROVIDER_SEARCH_PATH,
} from '@/constants';

// eslint-disable-next-line import/prefer-default-export
export function redirectToProviderSearch(
  zip: string | undefined,
  caregiversNearbySearchRadius: number | undefined,
  desktopVisitor: boolean
) {
  if (zip) {
    if (desktopVisitor) {
      if (caregiversNearbySearchRadius) {
        window.location.assign(
          CZEN_DESKTOP_SC_PROVIDER_SEARCH_PATH(zip, caregiversNearbySearchRadius)
        );
      } else {
        // defaults to a wide net
        window.location.assign(CZEN_DESKTOP_SC_PROVIDER_SEARCH_PATH(zip, 20));
      }
    } else {
      window.location.assign(CZEN_MW_SC_PROVIDER_SEARCH_PATH(zip));
    }
  } else {
    window.location.assign(CZEN_BASE_PATH);
  }
}
