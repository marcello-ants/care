import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/client';

import logger from '@/lib/clientLogger';
import FullWidthLayout from '@/components/layouts/FullWidthLayout';
import { useAppDispatch, useSeekerCCState } from '@/components/AppState';
import { UPDATE_SEEKER_FAVORITE_LIST } from '@/components/request/GQL';
import ProviderListPage from '@/components/pages/seeker/lc/provider-list-page';
import { ProviderProfile } from '@/components/pages/seeker/lc/types';
import { SEEKER_CC_LEAD_CONNECT_ROUTES } from '@/constants';
import {
  updateSeekerFavoriteList,
  updateSeekerFavoriteListVariables,
} from '@/__generated__/updateSeekerFavoriteList';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

const {
  publicRuntimeConfig: { CZEN_GENERAL },
} = getConfig();

const logCTAInteraction = (
  screenName: string,
  ctaClicked: string,
  numCaregiversSaved: number | undefined,
  providerUserId: string | undefined,
  caregiverPosition: string | undefined
) => {
  const amplitudeData = {
    screen_name: screenName,
    cta_clicked: ctaClicked,
    caregiver_position: caregiverPosition,
  };
  AnalyticsHelper.logEvent({
    name: 'CTA Interacted',
    data: {
      ...amplitudeData,
      ...(numCaregiversSaved !== undefined ? { num_of_caregivers_saved: numCaregiversSaved } : {}),
      ...(providerUserId !== undefined ? { provider_user_id: providerUserId } : {}),
    },
  });
};

const CaregiverListPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const apolloClient = useApolloClient();
  const { lcProviders, lcFavoritedProviders, lcReviewedProviders } = useSeekerCCState();

  const updateFavoritedProviders = (id: string) => {
    let newFavoritedProviders: ProviderProfile[] = [];

    const isFavouriteProvider = lcFavoritedProviders.some(
      (p: ProviderProfile) => p.memberId === id
    );

    if (!isFavouriteProvider) {
      const provider = lcProviders.find((p: ProviderProfile) => p.memberId === id);
      if (provider) {
        newFavoritedProviders = [...lcFavoritedProviders, provider];
      }
    } else {
      newFavoritedProviders = lcFavoritedProviders.filter(
        (p: ProviderProfile) => p.memberId !== id
      );
    }

    const resultPromise = apolloClient.mutate<
      updateSeekerFavoriteList,
      updateSeekerFavoriteListVariables
    >({
      mutation: UPDATE_SEEKER_FAVORITE_LIST,
      variables: {
        input: {
          serviceProfileId: id,
          favoriteStatus: !isFavouriteProvider,
        },
      },
    });
    resultPromise.catch((e) => {
      logger.error({ event: 'favoriteProviderFailed', message: e.message });
    });

    dispatch({
      type: 'cc_setLCFavoritedProviders',
      favoritedProviders: newFavoritedProviders,
    });
  };

  return (
    <ProviderListPage
      headerText="Here's a personalized list of caregivers based on your needs"
      subheaderText="Pick the ones that you like."
      providerType="caregiver"
      providerProfiles={lcProviders}
      favoritedProviderIds={lcFavoritedProviders.map((p: ProviderProfile) => p.memberId)}
      updateFavoritedProviderIds={updateFavoritedProviders}
      reviewedProvidersIds={lcReviewedProviders}
      ctaInteractionLogger={logCTAInteraction}
      onNextClick={() => {
        logCTAInteraction(
          'Caregiver Profile - List View',
          'Next',
          lcFavoritedProviders.length,
          undefined,
          undefined
        );
        router.push(SEEKER_CC_LEAD_CONNECT_ROUTES.UPGRADE_AND_MESSAGE);
      }}
      onSkipClick={() => {
        logCTAInteraction(
          'Caregiver Profile - List View',
          'Skip and view all',
          lcFavoritedProviders.length,
          undefined,
          undefined
        );
        window.location.assign(CZEN_GENERAL);
      }}
    />
  );
};

CaregiverListPage.Layout = FullWidthLayout;
CaregiverListPage.usePageTransition = false;

export default CaregiverListPage;
