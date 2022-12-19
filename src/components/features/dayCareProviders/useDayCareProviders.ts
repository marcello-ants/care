// External Dependencies
import { useEffect } from 'react';
import { ApolloError, useLazyQuery } from '@apollo/client';

// Custom Dependencies
import logger from '@/lib/clientLogger';
import { useAppDispatch } from '@/components/AppState';
import { DaycareProviderProfile } from '@/types/seekerCC';
import {
  findChildCareProviders,
  findChildCareProvidersVariables,
  findChildCareProviders_findChildCareProviders_ProviderSearchSuccess_providers as Provider,
  findChildCareProviders_findChildCareProviders_ProviderSearchSuccess_providers_reviews as ProviderReviews,
} from '@/__generated__/findChildCareProviders';
import { DistanceUnit } from '@/__generated__/globalTypes';
import { SKIP_AUTH_CONTEXT_KEY } from '@/constants';
import { CHILD_CARE_PROVIDER } from '@/components/request/GQL';
import { mapChildrenDoB, mapMonthToDate } from '@/utilities/account-creation-utils';

function calculateAverageRating(reviews: (ProviderReviews | null)[] | null): number {
  let averageRating = 0;

  if (reviews) {
    reviews.forEach((review) => {
      if (review) {
        averageRating += review.rating ? review.rating : 0;
      }
    });

    averageRating /= reviews.length;
  }

  return averageRating;
}

function mapProvidersProperties(providers: (Provider | null)[] | null): DaycareProviderProfile[] {
  if (!providers) return [];

  const list = providers.filter((provider) => provider) as Provider[];

  return list.map((provider) => ({
    ...provider,
    avgReviewRating: calculateAverageRating(provider.reviews),
    selected: true,
    hasCoordinates: provider.address
      ? Boolean(provider.address.latitude) && Boolean(provider.address.longitude)
      : false,
  }));
}

function shouldShowProvidersMap(providers: (Provider | null)[] | null): boolean {
  if (!providers) return false;

  const list = providers.filter((provider) => provider) as Provider[];

  return list.some((provider) => {
    return provider.address ? provider.address.latitude && provider.address.longitude : false;
  });
}

function handleChildCareDayCareProvidersQueryError(graphQLError: ApolloError) {
  logger.error({
    event: 'childCareDayCareLeadCreationError',
    graphQLError: graphQLError?.message,
  });
}

function useDayCareProviders(
  zipcode: string,
  childrenDateOfBirth: { year: string; month: string }[],
  startMonth: string | null,
  distanceToTravel: { distance: number; unit: DistanceUnit }
) {
  const dispatch = useAppDispatch();
  const [getChildCareProviders, { variables, loading, data }] = useLazyQuery<
    findChildCareProviders,
    findChildCareProvidersVariables
  >(CHILD_CARE_PROVIDER, {
    context: { [SKIP_AUTH_CONTEXT_KEY]: true },
    onError: handleChildCareDayCareProvidersQueryError,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    getChildCareProviders({
      variables: {
        zipcode,
        source: 'USC',
        childrenDoB: mapChildrenDoB(childrenDateOfBirth),
        careStartDate: startMonth ? mapMonthToDate(startMonth, true) : '',
        distanceWillingToTravel: {
          value: distanceToTravel.distance,
          unit: distanceToTravel.unit,
        },
      },
    });
  }, [dispatch]);

  useEffect(() => {
    if (!loading && data) {
      if (data?.findChildCareProviders?.__typename === 'ProviderSearchSuccess') {
        dispatch({
          type: 'cc_setDayCareRecommendations',
          dayCareRecommendations: mapProvidersProperties(data.findChildCareProviders.providers),
        });
        dispatch({
          type: 'cc_setDayCareRecommendationsTrackingId',
          trackingId: data.findChildCareProviders.trackingId,
        });
        dispatch({
          type: 'cc_setDayCareRecommendationsShouldShowMap',
          shouldShowMap: shouldShowProvidersMap(data.findChildCareProviders.providers),
        });
      }
    }
  }, [loading, data, variables]);
}

export default useDayCareProviders;
