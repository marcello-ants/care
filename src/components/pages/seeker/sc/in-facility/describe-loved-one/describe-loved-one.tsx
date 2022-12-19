import { useRouter } from 'next/router';

import { useAppDispatch, useFlowState, useSeekerState } from '@/components/AppState';
import AccountCreationConfirmation from '@/components/AccountCreationConfirmation';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';

import { SeniorCareRecipientCondition } from '@/types/seeker';
import { SEEKER_IN_FACILITY_ROUTES, CLIENT_FEATURE_FLAGS } from '@/constants';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import {
  withPotentialMember,
  WithPotentialMemberProps,
} from '@/components/features/potentialMember/withPotentialMember';
import { useEffect } from 'react';
import { GET_SEEKER_ZIP_CODE } from '@/components/request/GQL';
import { useQuery } from '@apollo/client';

const options = [
  { label: 'Independent', value: SeniorCareRecipientCondition.INDEPENDENT },
  {
    label: 'Needs monitoring or extra help',
    value: SeniorCareRecipientCondition.MONITORING_OR_EXTRA_HELP_NEEDED,
  },
  {
    label: 'Requires constant supervision',
    value: SeniorCareRecipientCondition.CONSTANT_SUPERVISION_NEEDED,
  },
  { label: 'I’m not sure', value: SeniorCareRecipientCondition.NOT_SURE },
];

function DescribeLovedOne(props: WithPotentialMemberProps) {
  const { whoNeedsCare, zipcode } = useSeekerState();
  const { memberId } = useFlowState();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { userHasAccount } = props;
  const featureFlags = useFeatureFlags();
  const recommendationOptimizationVariation =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION];
  const isRecommendationOptimizationVariation =
    recommendationOptimizationVariation?.variationIndex === 1;

  const { data: zipData, error: zipError } = useQuery(GET_SEEKER_ZIP_CODE, {
    variables: { memberId },
    skip: !memberId,
  });

  useEffect(() => {
    if (!zipcode && zipData && !zipError && userHasAccount) {
      const {
        getSeeker: {
          member: {
            address: { zip },
          },
        },
      } = zipData;
      dispatch({ type: 'setZipcode', zipcode: zip });
    }
  }, [zipData, zipError]);

  const handleChange = (values: SeniorCareRecipientCondition[]) => {
    const condition = values[0];
    dispatch({ type: 'setCondition', condition });

    const baseData = {
      cta_clicked: condition,
      member_type: 'Seeker',
    };
    let data;

    if (userHasAccount) {
      data = {
        ...baseData,
        lead_step: 'describe loved one in facility sc',
        lead_flow: 'mhp module',
      };
    } else {
      data = {
        ...baseData,
        enrollment_step: 'describe loved one in facility sc',
      };
    }

    AnalyticsHelper.logEvent({
      name: userHasAccount ? 'Lead Create - Senior Living' : 'Member Enrolled',
      data,
    });

    router.push(SEEKER_IN_FACILITY_ROUTES.HELP_TYPE);
  };

  const getWhoNeedsCare = () => {
    if (whoNeedsCare === 'OTHER' || !whoNeedsCare) {
      return 'your loved one';
    }
    if (whoNeedsCare === 'SELF') {
      return 'yourself';
    }
    return ` your ${whoNeedsCare.toLowerCase()}`;
  };
  return (
    <AccountCreationConfirmation
      header={
        isRecommendationOptimizationVariation
          ? 'How would you describe the person needing care?'
          : `How would you describe ${getWhoNeedsCare()}?`
      }
      options={options}
      onChange={handleChange}
      showIcon={false}
    />
  );
}

export default withPotentialMember(DescribeLovedOne);
