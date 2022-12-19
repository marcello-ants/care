import { Badge } from '@care/react-component-lib';
import { Icon24InfoBgcNeutral, Icon24UtilityCheckmark } from '@care/react-icons';
import React from 'react';
import { getTopCaregivers, getTopCaregiversVariables } from '@/__generated__/getTopCaregivers';
import {
  SeniorCareProviderQuality,
  SeniorCareServiceProvidedType,
} from '@/__generated__/globalTypes';
import {
  HelpType,
  liveInCareType as seekerRequestedLiveInCare,
  SeniorCareAttributeTags,
  SeniorCareListedAttributes,
  SeniorCareProviderProfile,
  TypeOfCare,
} from '@/types/seeker';
import { Rate } from '@/types/common';
import {
  CZEN_BASE_PATH,
  GET_TOP_CAREGIVERS_NO_RESULTS_MSG,
  LEAD_CONNECT_CZEN_REDIRECT_MSG,
  SEEKER_LEAD_CONNECT_ROUTES,
} from '@/constants';
import logger from '@/lib/clientLogger';
import { redirectToProviderSearch } from '@/components/pages/seeker/czenProviderHelper/czenProviderHelper';
import { generateInputAndCallGetTopCaregivers } from '@/components/pages/seeker/sc/getTopCaregiversHelper';
import { isLowercaseOrNumber } from '@/utilities/globalValidations';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { AppDispatch } from '@/types/app';
import { QueryLazyOptions } from '@apollo/client';
import { GetTopCaregiverStopwatch } from '@/components/features/Stopwatch/GetTopCaregiverStopWatch';
import dayjs from 'dayjs';

const qualitiesToAttributeTags: {
  [key in SeniorCareProviderQuality]: SeniorCareAttributeTags | undefined;
} = {
  [SeniorCareProviderQuality.ALZHEIMERS_OR_DEMENTIA_EXPERIENCE]: undefined,
  [SeniorCareProviderQuality.CERTIFIED_NURSING_ASSISTANT]: SeniorCareAttributeTags.nursingAssistant,
  [SeniorCareProviderQuality.COMFORTABLE_WITH_PETS]: undefined,
  [SeniorCareProviderQuality.CPR_TRAINED]: SeniorCareAttributeTags.cprTrained,
  [SeniorCareProviderQuality.DOES_NOT_SMOKE]: SeniorCareAttributeTags.nonSmoker,
  [SeniorCareProviderQuality.HOME_HEALTH_AIDE_EXPERIENCE]: SeniorCareAttributeTags.healthAide,
  [SeniorCareProviderQuality.HOSPICE_EXPERIENCE]: undefined,
  [SeniorCareProviderQuality.OWN_TRANSPORTATION]: undefined,
  [SeniorCareProviderQuality.REGISTERED_NURSE]: SeniorCareAttributeTags.registeredNurse,
};

const qualitiesToListedAttributes: {
  [key in SeniorCareProviderQuality]: SeniorCareListedAttributes | undefined;
} = {
  [SeniorCareProviderQuality.ALZHEIMERS_OR_DEMENTIA_EXPERIENCE]:
    SeniorCareListedAttributes.dementia,
  [SeniorCareProviderQuality.CERTIFIED_NURSING_ASSISTANT]: undefined,
  [SeniorCareProviderQuality.COMFORTABLE_WITH_PETS]: undefined,
  [SeniorCareProviderQuality.CPR_TRAINED]: undefined,
  [SeniorCareProviderQuality.DOES_NOT_SMOKE]: undefined,
  [SeniorCareProviderQuality.HOME_HEALTH_AIDE_EXPERIENCE]: undefined,
  [SeniorCareProviderQuality.HOSPICE_EXPERIENCE]: SeniorCareListedAttributes.hospiceServices,
  [SeniorCareProviderQuality.OWN_TRANSPORTATION]: undefined,
  [SeniorCareProviderQuality.REGISTERED_NURSE]: undefined,
};

const servicesToListedAttributes: {
  [key in SeniorCareServiceProvidedType]: SeniorCareListedAttributes | undefined;
} = {
  [SeniorCareServiceProvidedType.BATHING]: SeniorCareListedAttributes.bathingAndDressing,
  [SeniorCareServiceProvidedType.COMPANIONSHIP]: SeniorCareListedAttributes.companionship,
  [SeniorCareServiceProvidedType.ERRANDS]: SeniorCareListedAttributes.errandsOrShopping,
  [SeniorCareServiceProvidedType.FEEDING]: SeniorCareListedAttributes.feeding,
  [SeniorCareServiceProvidedType.HEAVY_LIFTING]: SeniorCareListedAttributes.heavyLifting,
  [SeniorCareServiceProvidedType.HELP_STAYING_PHYSICALLY_ACTIVE]:
    SeniorCareListedAttributes.helpPhysicallyActive,
  [SeniorCareServiceProvidedType.LIGHT_HOUSECLEANING]:
    SeniorCareListedAttributes.lightHousecleaning,
  [SeniorCareServiceProvidedType.LIVE_IN_HOME_CARE]: SeniorCareListedAttributes.liveInCare,
  [SeniorCareServiceProvidedType.MEAL_PREPARATION]: SeniorCareListedAttributes.mealPreparation,
  [SeniorCareServiceProvidedType.MOBILITY_ASSISTANCE]:
    SeniorCareListedAttributes.mobilityAssistance,
  [SeniorCareServiceProvidedType.PERSONAL_CARE]: SeniorCareListedAttributes.personalCare,
  [SeniorCareServiceProvidedType.SPECIALIZED_CARE]: SeniorCareListedAttributes.specializedCare,
  [SeniorCareServiceProvidedType.TRANSPORTATION]: SeniorCareListedAttributes.transportation,
};

const helpTypeToListedAttributes: {
  [key in HelpType]: SeniorCareListedAttributes[];
} = {
  [HelpType.COMPANIONSHIP]: [SeniorCareListedAttributes.companionship],
  [HelpType.HOUSEHOLD]: [
    SeniorCareListedAttributes.mealPreparation,
    SeniorCareListedAttributes.errandsOrShopping,
    SeniorCareListedAttributes.lightHousecleaning,
  ],
  [HelpType.PERSONAL]: [
    SeniorCareListedAttributes.feeding,
    SeniorCareListedAttributes.bathingAndDressing,
  ],
  [HelpType.TRANSPORTATION]: [SeniorCareListedAttributes.transportation],
  [HelpType.SPECIALIZED]: [SeniorCareListedAttributes.dementia], // used outside in-facility flow
  [HelpType.MOBILITY]: [SeniorCareListedAttributes.mobilityAssistance],
  [HelpType.MEMORY_CARE]: [SeniorCareListedAttributes.dementia], // used during in-facilty flow
};

function isNotUndefined<T>(input: T | undefined): input is T {
  return input !== undefined;
}

function sortListedAttributesBySeekerNeeds(
  listedAttributes: SeniorCareListedAttributes[],
  completeSeekerNeeds: SeniorCareListedAttributes[]
): SeniorCareListedAttributes[] {
  return (
    listedAttributes
      // We want the requested services to appear first in the list
      .sort((attribute1: SeniorCareListedAttributes, attribute2: SeniorCareListedAttributes) => {
        const attribute1Needed = completeSeekerNeeds.includes(attribute1);
        const attribute2Needed = completeSeekerNeeds.includes(attribute2);
        if (attribute1Needed && !attribute2Needed) {
          // we want matches to appear first in the array
          return -1;
        }
        if (!attribute1Needed && attribute2Needed) {
          return 1;
        }
        return 0;
      })
  );
}

export function mapCaregiverProfiles(
  data: getTopCaregivers,
  requestedServices?: HelpType[],
  desiredTypeOfCare?: TypeOfCare
): SeniorCareProviderProfile[] {
  const baseRequestedBySeeker: SeniorCareListedAttributes[] =
    desiredTypeOfCare === seekerRequestedLiveInCare ? [SeniorCareListedAttributes.liveInCare] : [];
  const servicesRequestedBySeeker: SeniorCareListedAttributes[] = requestedServices
    ? requestedServices.flatMap((requestedService) => {
        return helpTypeToListedAttributes[requestedService];
      })
    : [];

  const completeSeekerNeeds: SeniorCareListedAttributes[] =
    baseRequestedBySeeker.concat(servicesRequestedBySeeker);

  const providerProfiles: SeniorCareProviderProfile[] = data.topCaregivers
    .filter((topCaregiver) => {
      const goodRatingOrNeverRated =
        topCaregiver.caregiver.numberOfReviews === 0 ||
        (topCaregiver.caregiver.avgReviewRating ?? 5) >= 3.5;
      return (
        topCaregiver.caregiver.member.legacyId &&
        topCaregiver.caregiver.hasCareCheck &&
        topCaregiver.caregiver.member.imageURL &&
        goodRatingOrNeverRated
      );
    })
    .map((topCaregiver) => {
      const cityAndState = topCaregiver.caregiver.member.address
        ? `${topCaregiver.caregiver.member.address.city}, ${topCaregiver.caregiver.member.address.state}`
        : undefined;

      const services: SeniorCareServiceProvidedType[] =
        topCaregiver.caregiver.seniorCareProviderProfile?.services ?? [];

      const qualities: SeniorCareProviderQuality[] =
        topCaregiver.caregiver.seniorCareProviderProfile?.qualities ?? [];

      const attributeTags: SeniorCareAttributeTags[] = qualities
        .map((quality) => {
          return qualitiesToAttributeTags[quality];
        })
        .filter(isNotUndefined);

      const listedAttributesFromQualities = qualities
        .map((quality) => {
          return qualitiesToListedAttributes[quality];
        })
        .filter(isNotUndefined);

      const listedAttributesFromServices = services
        .map((service) => {
          return servicesToListedAttributes[service];
        })
        .filter(isNotUndefined);

      const listedAttributes = sortListedAttributesBySeekerNeeds(
        listedAttributesFromQualities.concat(listedAttributesFromServices),
        completeSeekerNeeds
      );

      let seoProfileId;
      if (topCaregiver.caregiver.profileURL) {
        const fullSeoProfileUrl = topCaregiver.caregiver.profileURL;
        const seoProfileUrlParts = fullSeoProfileUrl.split('/');
        seoProfileId =
          seoProfileUrlParts.length > 2
            ? seoProfileUrlParts[seoProfileUrlParts.length - 2]
            : undefined;
      }

      let signUpDate;
      if (topCaregiver.caregiver.signUpDate) {
        signUpDate = new Date(topCaregiver.caregiver.signUpDate);
      }

      return {
        memberId: topCaregiver.caregiver.member.legacyId!,
        memberUUID: topCaregiver.caregiver.member.id!,
        imgSource: topCaregiver.caregiver.member.imageURL!,
        displayName: topCaregiver.caregiver.member.displayName!,
        cityAndState,
        distanceFromSeeker: topCaregiver.distanceFromRequestZip?.value ?? undefined,
        averageRating: topCaregiver.caregiver.avgReviewRating ?? undefined,
        numberReviews: topCaregiver.caregiver.numberOfReviews,
        yearsOfExperience: topCaregiver.caregiver.yearsOfExperience,
        minRate:
          topCaregiver.caregiver.seniorCareProviderProfile?.payRange?.hourlyRateFrom.amount ??
          undefined,
        maxRate:
          topCaregiver.caregiver.seniorCareProviderProfile?.payRange?.hourlyRateTo.amount ??
          undefined,
        attributeTags,
        listedAttributes,
        biography: topCaregiver.caregiver.seniorCareProviderProfile?.bio ?? '',
        hasCareCheck: topCaregiver.caregiver.hasCareCheck,
        responseTime: topCaregiver.caregiver.responseTime ?? undefined,
        seoProfileId,
        signUpDate,
      };
    });

  const profileMemberIds: Set<string> = new Set();
  return providerProfiles.filter((profile) => {
    const alreadyInList = profileMemberIds.has(profile.memberId);
    profileMemberIds.add(profile.memberId);
    return !alreadyInList;
  });
}

export function buildTags(currentProvider: SeniorCareProviderProfile, className: string) {
  const tags: any = currentProvider.hasCareCheck
    ? [
        <Badge
          className={className}
          icon={<Icon24InfoBgcNeutral size="16px" />}
          text="CareCheck"
          key="CareCheck"
        />,
      ]
    : [];
  currentProvider.attributeTags.forEach((attributeTag) => {
    tags.push(
      <Badge
        className={className}
        icon={<Icon24UtilityCheckmark size="16px" />}
        text={attributeTag}
        key={attributeTag}
      />
    );
  });
  return tags;
}

const areButtonsVisible = (buttonsElement: HTMLDivElement) => {
  const { bottom } = buttonsElement.getBoundingClientRect();
  return bottom >= 0 && bottom <= window.innerHeight;
};

export interface updateInfoContainerHeightProps {
  buttonsRef: React.RefObject<HTMLDivElement> | null;
  containerInfoRef: React.RefObject<HTMLDivElement> | null;
  innerContainerInfoRef: React.RefObject<HTMLDivElement> | null;
  isDesktopOrUp: boolean;
  currentProfileIndex: number;
}

export const updateInfoContainerHeight = ({
  buttonsRef,
  containerInfoRef,
  innerContainerInfoRef,
  isDesktopOrUp,
  currentProfileIndex,
}: updateInfoContainerHeightProps) => {
  if (!buttonsRef?.current || !containerInfoRef?.current || !innerContainerInfoRef?.current) {
    return;
  }

  const currentButtons = buttonsRef.current as unknown as HTMLDivElement;
  const currentContainer = containerInfoRef.current as unknown as HTMLDivElement;
  const currentInnerContainer = innerContainerInfoRef.current as unknown as HTMLDivElement;

  if (isDesktopOrUp && !areButtonsVisible(currentButtons)) {
    const lcHeaderHeight = currentProfileIndex === 0 ? 148 : 0;
    const buttonsHeight = currentButtons.getBoundingClientRect().height;

    const otherElementsHeight =
      lcHeaderHeight +
      buttonsHeight +
      64 + // navigation bar height in desktop
      64 + // inner padding top and Bottom (32px each)
      96; // margin top and Bottom (48px each)

    currentContainer.style.maxHeight = `${window.innerHeight - otherElementsHeight}px`;
    currentContainer.style.overflow = 'auto';
  } else if (isDesktopOrUp && areButtonsVisible(currentButtons)) {
    // avoiding the resize if the container is already shrinked
    if (currentInnerContainer.getBoundingClientRect().height < window.innerHeight / 3) {
      currentContainer.style.maxHeight = 'none';
      currentContainer.style.overflow = 'none';
    }
  } else {
    currentContainer.style.maxHeight = 'none';
    currentContainer.style.overflow = 'none';
  }
};

export const generateCaregiverPath = (targetCaregiver: SeniorCareProviderProfile) => {
  const nextCaregiverMemberId = targetCaregiver.memberId;
  const nextCaregiverSeoProfileId = targetCaregiver.seoProfileId;
  const basePath = `${SEEKER_LEAD_CONNECT_ROUTES.CAREGIVER_PROFILE}/${nextCaregiverMemberId}`;
  if (nextCaregiverSeoProfileId) {
    return `${basePath}?seoProfileId=${nextCaregiverSeoProfileId}`;
  }
  return basePath;
};

export const nextCaregiverPath = (
  caregiverProfiles: SeniorCareProviderProfile[],
  currentProfileIndex: number
) => {
  const nextCaregiverProfile = caregiverProfiles[currentProfileIndex + 1];
  return generateCaregiverPath(nextCaregiverProfile);
};

export const findMatchingIndex = (
  targetMemberId: string,
  caregiverProfiles: SeniorCareProviderProfile[]
) => {
  return caregiverProfiles.findIndex((caregiverProfile) => {
    return caregiverProfile.memberId === targetMemberId;
  });
};

export type handleViewAllParams = {
  leadConnectBucket: number | undefined;
  zip: string | undefined;
  caregiversNearbySearchRadius: number | undefined;
  isDesktop: boolean;
};

export const handleViewAllCaregivers = (handleViewAll: handleViewAllParams) => {
  logger.info({
    event: LEAD_CONNECT_CZEN_REDIRECT_MSG,
    leadConnectBucket: handleViewAll.leadConnectBucket,
  });
  redirectToProviderSearch(
    handleViewAll.zip,
    handleViewAll.caregiversNearbySearchRadius,
    handleViewAll.isDesktop
  );
};

export const populateCaregiverProfiles = (
  data: getTopCaregivers,
  requestedServices: HelpType[],
  desiredTypeOfCare: TypeOfCare,
  setCaregiverProfiles: (arg0: SeniorCareProviderProfile[]) => void,
  handleViewAll: handleViewAllParams
) => {
  const resultingProviders: SeniorCareProviderProfile[] = mapCaregiverProfiles(
    data!,
    requestedServices,
    desiredTypeOfCare
  );

  if (resultingProviders.length > 0) {
    logger.info({
      event: 'LeadAndConnectProfilesRetrieved',
      numProfiles: resultingProviders.length,
      leadConnectBucket: handleViewAll.leadConnectBucket,
    });
    setCaregiverProfiles(resultingProviders);
    return resultingProviders.length;
  }
  logger.info({
    event: GET_TOP_CAREGIVERS_NO_RESULTS_MSG,
    leadConnectBucket: handleViewAll.leadConnectBucket,
  });
  handleViewAllCaregivers(handleViewAll);
  return 0;
};

export const performInitialActions = (
  initialProviderSeen: boolean | undefined,
  dispatch: AppDispatch,
  zip: string | undefined,
  rate: Rate,
  requestedServices: HelpType[],
  leadConnectBucket: number | undefined,
  getTopCaregiver: (options?: QueryLazyOptions<getTopCaregiversVariables> | undefined) => void,
  maxDistanceFromSeeker: number,
  seoProfileId: string | undefined,
  getTopCaregiverStopwatch: React.MutableRefObject<GetTopCaregiverStopwatch> | undefined,
  leadConnectFifteenCaregiversBucket: number | undefined
) => {
  if (!initialProviderSeen) {
    logger.info({ event: 'LeadAndConnectProfilesViewed' });
    dispatch({ type: 'setInitialProviderSeen', initialProviderSeen: true });
  }
  if (zip) {
    if (getTopCaregiverStopwatch) {
      getTopCaregiverStopwatch.current.start();
    }
    const getTopCaregiversPartialParams = { zipcode: zip, rate, helpTypes: requestedServices };
    generateInputAndCallGetTopCaregivers(
      leadConnectBucket,
      getTopCaregiversPartialParams,
      getTopCaregiver,
      maxDistanceFromSeeker,
      leadConnectFifteenCaregiversBucket
    );
  } else if (seoProfileId && isLowercaseOrNumber(seoProfileId)) {
    logger.error({ event: 'ZipcodeUnavailable', seoProfileId });
    window.location.assign(`/p/${seoProfileId}/sc`);
  } else {
    logger.error({ event: 'ZipcodeUnavailableAndBadSeoProfile', seoProfileId });
    window.location.assign(CZEN_BASE_PATH);
  }
};

export const logInteraction = (
  screenName: string,
  ctaClicked: string,
  matchingIndex: number | undefined,
  seekerId: string | undefined,
  ctaLinkType: string | undefined = 'lead and connect',
  numCaregiversSaved: number | undefined,
  providerId: string | undefined
) => {
  const amplitudeData = {
    screen_name: screenName,
    cta_link_type: ctaLinkType,
    user_id: seekerId,
    cta_clicked: ctaClicked,
  };
  AnalyticsHelper.logEvent({
    name: 'CTA Interacted',
    data: {
      ...amplitudeData,
      ...(numCaregiversSaved !== undefined ? { num_of_caregivers_saved: numCaregiversSaved } : {}),
      ...(matchingIndex !== undefined ? { caregiver_position: matchingIndex + 1 } : {}),
      ...(providerId !== undefined ? { provider_user_id: providerId } : {}),
    },
  });
};

export const logScreenViewed = (
  screenName: string,
  seekerId: string | undefined,
  numCaregivers: number | undefined,
  matchingIndex: number | undefined
) => {
  const amplitudeData = {
    screen_name: screenName,
    source: 'lead and connect',
    num_of_caregivers: numCaregivers,
    user_id: seekerId,
  };
  AnalyticsHelper.logEvent({
    name: 'Screen Viewed',
    data: {
      ...amplitudeData,
      ...(numCaregivers !== undefined ? { num_of_caregivers: numCaregivers } : {}),
      ...(matchingIndex !== undefined ? { caregiver_position: matchingIndex + 1 } : {}),
    },
  });
};

export function providerGetDaysSinceSignup(signUpDate: Date | undefined): number {
  const now = dayjs();
  if (signUpDate) {
    return now.diff(signUpDate, 'day');
  }
  return 0;
}
