import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { WhenLookingToMoveIntoCommunity } from '@/types/seeker';
import { SeniorCareRecipientRelationshipType } from '@/__generated__/globalTypes';

import AccountCreationConfirmation from '@/components/AccountCreationConfirmation';
import { useSeekerState, useAppDispatch } from '@/components/AppState';
import { SEEKER_IN_FACILITY_ROUTES, VERTICALS_NAMES } from '@/constants';
import generateDynamicHeader from '@/components/pages/seeker/sc/in-facility/dynamicHeaderHelper';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import {
  withPotentialMember,
  WithPotentialMemberProps,
} from '@/components/features/potentialMember/withPotentialMember';

const options = [
  { label: 'Within the next 30 days', value: WhenLookingToMoveIntoCommunity.IMMEDIATELY },
  { label: 'Within the next 6 months', value: WhenLookingToMoveIntoCommunity.SIX_MONTHS },
  { label: 'Within the next year', value: WhenLookingToMoveIntoCommunity.TWELVE_MONTHS },
  { label: "I'm just browsing", value: WhenLookingToMoveIntoCommunity.JUST_BROWSING },
];

const whoNeedsCareFormat = (lovedOne: SeniorCareRecipientRelationshipType | null) => {
  const message = generateDynamicHeader(
    lovedOne!,
    'How soon would you be looking to move into a community?',
    'How soon would your',
    ' be looking to move into a community?'
  );

  return message;
};

const Urgency = (props: WithPotentialMemberProps) => {
  const { whoNeedsCare, whenLookingToMove } = useSeekerState();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { userHasAccount } = props;

  useEffect(() => {
    if (!userHasAccount) {
      AnalyticsHelper.logEvent({
        name: 'Screen Viewed',
        data: {
          screen_name: 'urgency',
        },
      });
    }
  }, []);

  const handleSelection = ([urgency]: WhenLookingToMoveIntoCommunity[]) => {
    dispatch({ type: 'setWhenLookingToMove', whenLookingToMove: urgency });
    router.push(SEEKER_IN_FACILITY_ROUTES.DESCRIBE_LOVED_ONE);

    const baseData = {
      cta_clicked: urgency,
      member_type: 'Seeker',
      vertical: VERTICALS_NAMES.SENIOR_CARE,
    };
    let data;

    if (userHasAccount) {
      data = {
        ...baseData,
        lead_step: 'in facility intent',
        lead_flow: 'mhp module',
      };
    } else {
      data = {
        ...baseData,
        screen_name: 'urgency',
        enrollment_step: 'in facility intent',
      };
    }

    AnalyticsHelper.logEvent({
      name: userHasAccount ? 'Lead Create - Senior Living' : 'Member Enrolled',
      data,
    });
  };

  return (
    <AccountCreationConfirmation
      header={`${whoNeedsCareFormat(whoNeedsCare)}`}
      options={options}
      onChange={handleSelection}
      showIcon={false}
      value={whenLookingToMove}
    />
  );
};

Urgency.disableScreenViewed = true;

export default withPotentialMember(Urgency);
