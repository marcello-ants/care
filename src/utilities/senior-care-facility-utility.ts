import { HelpType, SeekerState, SeniorLivingOptions } from '@/types/seeker';
import { SeniorCareRecipientCondition, SeniorCommunityType } from '@/__generated__/globalTypes';

const { PERSONAL, MOBILITY } = HelpType;
const { INDEPENDENT, CONSTANT_SUPERVISION_NEEDED, MONITORING_OR_EXTRA_HELP_NEEDED, NOT_SURE } =
  SeniorCareRecipientCondition;

const requiresPersonalOrMobilityHelp = (helpRequired: HelpType[]) =>
  helpRequired.some((help) => [PERSONAL, MOBILITY].includes(help));

export const isMemoryCareNeeded = (helpTypes: HelpType[]) =>
  helpTypes.includes(HelpType.MEMORY_CARE);

type RecommendedSeniorCareLivingOptionArgs = [SeekerState['condition'], SeekerState['helpTypes']];

// Base function determines community type from conditions and help required
export const recommendedSeniorCareLivingOption = (
  ...args: RecommendedSeniorCareLivingOptionArgs
): SeniorLivingOptions => {
  const [condition, helpRequired] = args;
  const memoryCareNeeded = isMemoryCareNeeded(helpRequired);

  if (memoryCareNeeded) return SeniorLivingOptions.MEMORY_CARE;

  if (condition === CONSTANT_SUPERVISION_NEEDED) {
    if (helpRequired.length === 0 || requiresPersonalOrMobilityHelp(helpRequired))
      return SeniorLivingOptions.NURSING_OPTIONS;
    return SeniorLivingOptions.ASSISTED;
  }

  if (condition === INDEPENDENT) {
    if (requiresPersonalOrMobilityHelp(helpRequired)) return SeniorLivingOptions.ASSISTED;
    return SeniorLivingOptions.INDEPENDENT;
  }

  if (condition && [MONITORING_OR_EXTRA_HELP_NEEDED, NOT_SURE].includes(condition)) {
    if (helpRequired.length === 0 || requiresPersonalOrMobilityHelp(helpRequired))
      return SeniorLivingOptions.ASSISTED;
    return SeniorLivingOptions.INDEPENDENT;
  }

  // This should never actually happen given we only provide the four options for recipient conditions
  return SeniorLivingOptions.ASSISTED;
};

export function recommendedSeniorCareCommunityType(
  ...args: RecommendedSeniorCareLivingOptionArgs
): SeniorCommunityType | undefined {
  const seniorCareLivingOption: SeniorLivingOptions = recommendedSeniorCareLivingOption(...args);

  switch (seniorCareLivingOption) {
    case SeniorLivingOptions.ASSISTED:
      return SeniorCommunityType.ASSISTED_LIVING;
    case SeniorLivingOptions.INDEPENDENT:
      return SeniorCommunityType.INDEPENDENT_LIVING;
    case SeniorLivingOptions.MEMORY_CARE:
      return SeniorCommunityType.MEMORY_CARE;
    default:
      return undefined;
  }
}

type CaringFacilityFlags = {
  notSure: boolean;
  independentLivingFacilities: boolean;
  assistedLivingFacilities: boolean;
  memoryCareFacilities: boolean;
};

export function recommendedCaringFacilityFlags(
  ...args: RecommendedSeniorCareLivingOptionArgs
): CaringFacilityFlags {
  const seniorCommunityType = recommendedSeniorCareCommunityType(...args);

  return {
    notSure: false,
    independentLivingFacilities: seniorCommunityType === SeniorCommunityType.INDEPENDENT_LIVING,
    assistedLivingFacilities: seniorCommunityType === SeniorCommunityType.ASSISTED_LIVING,
    memoryCareFacilities: seniorCommunityType === SeniorCommunityType.MEMORY_CARE,
  };
}
