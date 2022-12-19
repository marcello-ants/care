import { useAppState } from '@/components/AppState';
import useIsDisqualifiedFromSeniorFacilityLeads from '@/components/hooks/useIsDisqualifiedFromSeniorFacilityLeads';
import logger from '@/lib/clientLogger';
import { WhenLookingToMoveIntoCommunity } from '@/types/seeker';
import { useEffect } from 'react';

const useIsDisqualifiedFromCaringLeads = () => {
  const isDisqualifiedFromSeniorFacilityLeads = useIsDisqualifiedFromSeniorFacilityLeads();
  const { seeker: seekerState } = useAppState();
  let isDisqualifiedFromCaringLeads: boolean = false;
  const caringFacilityCount = seekerState.caringFacilityCountNearBy ?? 0;

  const noCaringFacility = caringFacilityCount < 1;
  const lookingToMoveIntoCommunityInTwelveMonths =
    seekerState.whenLookingToMove === WhenLookingToMoveIntoCommunity.TWELVE_MONTHS;

  if (
    isDisqualifiedFromSeniorFacilityLeads ||
    noCaringFacility ||
    lookingToMoveIntoCommunityInTwelveMonths
  ) {
    isDisqualifiedFromCaringLeads = true;
  }

  useEffect(() => {
    if (isDisqualifiedFromCaringLeads) {
      logger.info({
        event: 'isDisqualifiedFromCaringLeads',
        isDisqualifiedFromSeniorFacilityLeads,
        noCaringFacility,
        lookingToMoveIntoCommunityInTwelveMonths,
      });
    }
  }, [
    isDisqualifiedFromCaringLeads,
    isDisqualifiedFromSeniorFacilityLeads,
    noCaringFacility,
    lookingToMoveIntoCommunityInTwelveMonths,
  ]);

  return isDisqualifiedFromCaringLeads;
};

export default useIsDisqualifiedFromCaringLeads;
