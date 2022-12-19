import {
  PaymentDetailType,
  PaymentTypeOptions,
  SeniorCareRecipientCondition,
  WhenNeedsCareOptions,
} from '@/types/seeker';
import {
  SeniorCarePaymentSource,
  SeniorCareSeekerAttributesUpdateInput,
  YesOrNoAnswer,
  SeniorCareRecipientCondition as GQLSeniorCareRecipientCondition,
  HowSoonIsCareNeeded,
} from '@/__generated__/globalTypes';

const paymentTypeAndDetailMapping: {
  [key in any]: SeniorCarePaymentSource;
} = {
  [PaymentTypeOptions.PRIVATE]: SeniorCarePaymentSource.PRIVATE_PAY,
  [PaymentTypeOptions.GOVERNMENT]: SeniorCarePaymentSource.GOVERNMENT_HEALTH_PROGRAM,
  [PaymentDetailType.PRIVATE_PAY]: SeniorCarePaymentSource.PRIVATE_PAY,
  [PaymentDetailType.LONG_TERM_INSURANCE]: SeniorCarePaymentSource.LONG_TERM_CARE_INSURANCE,
  [PaymentDetailType.OWNED_HOME]: SeniorCarePaymentSource.HOME_EQUITY,
  [PaymentDetailType.VETERAN_BENEFIT]: SeniorCarePaymentSource.VETERANS_BENEFITS,
  [PaymentDetailType.OTHER]: SeniorCarePaymentSource.OTHER,
};

const conditionMapping: {
  [key in SeniorCareRecipientCondition]: GQLSeniorCareRecipientCondition;
} = {
  [SeniorCareRecipientCondition.INDEPENDENT]: GQLSeniorCareRecipientCondition.INDEPENDENT,
  [SeniorCareRecipientCondition.MONITORING_OR_EXTRA_HELP_NEEDED]:
    GQLSeniorCareRecipientCondition.MONITORING_OR_EXTRA_HELP_NEEDED,
  [SeniorCareRecipientCondition.CONSTANT_SUPERVISION_NEEDED]:
    GQLSeniorCareRecipientCondition.CONSTANT_SUPERVISION_NEEDED,
  [SeniorCareRecipientCondition.NOT_SURE]: GQLSeniorCareRecipientCondition.NOT_SURE,
};

const whenNeedsCareMapping: { [key in WhenNeedsCareOptions]: HowSoonIsCareNeeded } = {
  [WhenNeedsCareOptions.ASAP]: HowSoonIsCareNeeded.AS_SOON_AS_POSSIBLE,
  [WhenNeedsCareOptions.WITHIN_6_MONTHS]: HowSoonIsCareNeeded.WITHIN_SIX_MONTHS,
  [WhenNeedsCareOptions.FUTURE]: HowSoonIsCareNeeded.PLANNING_FOR_FUTURE,
};

// eslint-disable-next-line import/prefer-default-export
export function mapInFacilityStateToUpdateInput(
  whenNeedsCare: WhenNeedsCareOptions | undefined,
  memoryCareNeeded: YesOrNoAnswer | undefined,
  paymentType: PaymentTypeOptions | undefined,
  paymentDetailTypes: SeniorCarePaymentSource[] | undefined,
  condition: SeniorCareRecipientCondition | undefined
): SeniorCareSeekerAttributesUpdateInput {
  let input: SeniorCareSeekerAttributesUpdateInput = {};

  if (whenNeedsCare) {
    input = { ...input, howSoonIsCareNeeded: whenNeedsCareMapping[whenNeedsCare] };
  }

  if (memoryCareNeeded) {
    input = { ...input, memoryCareFacilityNeeded: memoryCareNeeded };
  }
  const mappedPaymentTypes = [];

  if (paymentType && paymentType !== PaymentTypeOptions.HELP) {
    mappedPaymentTypes.push(paymentTypeAndDetailMapping[paymentType]);
  }
  if (paymentDetailTypes && paymentType === PaymentTypeOptions.HELP) {
    paymentDetailTypes.forEach((paymentDetailType) => {
      if (paymentDetailType) {
        mappedPaymentTypes.push(paymentDetailType);
      }
    });
  }
  if (mappedPaymentTypes.length > 0) {
    input = { ...input, paymentSources: mappedPaymentTypes };
  }

  if (condition) {
    input = { ...input, careRecipientCondition: conditionMapping[condition] };
  }
  return input;
}
