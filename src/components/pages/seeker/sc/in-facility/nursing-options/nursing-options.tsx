import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useAppDispatch, useSeekerState } from '@/components/AppState';
import AccountCreationConfirmation from '@/components/AccountCreationConfirmation';

import { SeniorCareNursingOptions } from '@/types/seeker';
import { CLIENT_FEATURE_FLAGS, SEEKER_IN_FACILITY_ROUTES } from '@/constants';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import {
  withPotentialMember,
  WithPotentialMemberProps,
} from '@/components/features/potentialMember/withPotentialMember';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';

const options = [
  { label: 'Little to no help', value: SeniorCareNursingOptions.LITTLE },
  {
    label: 'Minimal assistance getting up',
    value: SeniorCareNursingOptions.MINIMAL,
  },
  {
    label: 'Extensive support (multiple people or special technology)',
    value: SeniorCareNursingOptions.EXTENSIVE,
  },
];

function NursingOptions(props: WithPotentialMemberProps) {
  const { whoNeedsCare, nursingType } = useSeekerState();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { userHasAccount } = props;
  const { flags } = useFeatureFlags();

  const recommendationOptimizationVariation =
    flags[CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION];
  const isRecommendationOptimizationVariation =
    recommendationOptimizationVariation?.variationIndex === 1 && !userHasAccount;

  useEffect(() => {
    if (userHasAccount) {
      AnalyticsHelper.logEvent({
        name: 'Screen Viewed',
        data: {
          lead_flow: 'mhp module',
        },
      });
    } else {
      AnalyticsHelper.logEvent({
        name: 'Screen Viewed',
        data: {},
      });
    }
  }, []);

  const handleChange = (values: SeniorCareNursingOptions[]) => {
    const [nursingTypeSelected] = values;
    dispatch({ type: 'setNursingType', nursingType: nursingTypeSelected });

    const baseData = {
      cta_clicked: nursingType,
      member_type: 'Seeker',
    };
    let data;

    if (userHasAccount) {
      data = {
        ...baseData,
        lead_step: 'nursing_home_question',
        lead_flow: 'mhp module',
      };
    } else {
      data = {
        ...baseData,
        enrollment_step: 'Nursing type in facility sc',
      };
    }
    AnalyticsHelper.logEvent({
      name: userHasAccount ? 'Lead Create - Senior Living' : 'Member Enrolled',
      data,
    });
    if (nursingTypeSelected === SeniorCareNursingOptions.EXTENSIVE) {
      if (isRecommendationOptimizationVariation) {
        router.push(SEEKER_IN_FACILITY_ROUTES.RECOMMENDED_NURSING_HOME_IN_FACILITY);
      } else {
        router.push(SEEKER_IN_FACILITY_ROUTES.RECOMMENDED_NURSING_HOME);
      }
    } else {
      router.push(SEEKER_IN_FACILITY_ROUTES.RECOMMENDED_ASSISTED);
    }
  };

  const getWhoNeedsCare = () => {
    if (whoNeedsCare === 'OTHER' || !whoNeedsCare) {
      return 'does your loved one';
    }
    if (whoNeedsCare === 'SELF') {
      return 'do you';
    }
    return `does your ${whoNeedsCare.toLowerCase()}`;
  };
  return (
    <AccountCreationConfirmation
      header={`How much help ${getWhoNeedsCare()} need with daily tasks like bathing, dressing and using the restroom?`}
      options={options}
      onChange={handleChange}
      showIcon={false}
      value={nursingType}
    />
  );
}

NursingOptions.disableScreenViewed = true;

export default withPotentialMember(NursingOptions);
