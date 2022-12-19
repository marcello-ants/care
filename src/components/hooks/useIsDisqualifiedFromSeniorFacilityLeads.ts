import { useSeekerState } from '@/components/AppState';
import logger from '@/lib/clientLogger';
import { PaymentTypeOptions, SeniorLivingOptions } from '@/types/seeker';
import { recommendedSeniorCareLivingOption } from '@/utilities/senior-care-facility-utility';
import { SeniorCarePaymentSource } from '@/__generated__/globalTypes';
import { useEffect } from 'react';

function getIsDisqualifiedForBudget(
  paymentType: PaymentTypeOptions | undefined,
  paymentDetailTypes: SeniorCarePaymentSource[] | undefined
) {
  const paymentDetailsOther =
    paymentDetailTypes?.length === 1 && paymentDetailTypes?.includes(SeniorCarePaymentSource.OTHER);

  const selectedGovernmentPaymentType =
    paymentType === PaymentTypeOptions.GOVERNMENT && (paymentDetailTypes?.length ?? 0) === 0;

  const onlySelectedGovernmentInDetailList =
    paymentDetailTypes?.length === 1 &&
    paymentDetailTypes?.includes(SeniorCarePaymentSource.GOVERNMENT_HEALTH_PROGRAM);

  return paymentDetailsOther || selectedGovernmentPaymentType || onlySelectedGovernmentInDetailList;
}

function determineDisqualifiedFromSeniorFacilityLeads() {
  const { paymentDetailTypes, condition, paymentType, helpTypes } = useSeekerState();

  const isNursingFacilityNeeded =
    recommendedSeniorCareLivingOption(condition, helpTypes) === SeniorLivingOptions.NURSING_OPTIONS;
  const isDisqualifiedForBudget = getIsDisqualifiedForBudget(paymentType, paymentDetailTypes);

  const isDisqualifiedFromSeniorFacilityLeads = isDisqualifiedForBudget || isNursingFacilityNeeded;

  useEffect(() => {
    if (isDisqualifiedFromSeniorFacilityLeads) {
      logger.info({
        event: 'isDisqualifiedFromSeniorFacilityLeads',
        isDisqualifiedForBudget,
        isNursingFacilityNeeded,
      });
    }
  }, [isDisqualifiedFromSeniorFacilityLeads, isDisqualifiedForBudget, isNursingFacilityNeeded]);

  return isDisqualifiedFromSeniorFacilityLeads;
}

export default determineDisqualifiedFromSeniorFacilityLeads;
