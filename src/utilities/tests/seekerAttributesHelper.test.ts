import { mapInFacilityStateToUpdateInput } from '@/utilities/seekerAttributesHelper';
import {
  PaymentTypeOptions,
  SeniorCareRecipientCondition,
  WhenNeedsCareOptions,
} from '@/types/seeker';
import { SeniorCarePaymentSource, YesOrNoAnswer } from '@/__generated__/globalTypes';

describe('Seeker Attrbiutes Helper', () => {
  it('Maps Seeker in facility state to correct mutation input', () => {
    const { whenNeedsCare, memoryCareNeeded, paymentType, paymentDetailTypes, condition } = {
      whenNeedsCare: WhenNeedsCareOptions.ASAP,
      memoryCareNeeded: YesOrNoAnswer.YES,
      paymentDetailTypes: [
        SeniorCarePaymentSource.PRIVATE_PAY,
        SeniorCarePaymentSource.VETERANS_BENEFITS,
      ],
      paymentType: PaymentTypeOptions.HELP,
      condition: SeniorCareRecipientCondition.INDEPENDENT,
    };

    const input = mapInFacilityStateToUpdateInput(
      whenNeedsCare,
      memoryCareNeeded,
      paymentType,
      paymentDetailTypes,
      condition
    );

    expect(input).toEqual({
      careRecipientCondition: 'INDEPENDENT',
      howSoonIsCareNeeded: 'AS_SOON_AS_POSSIBLE',
      memoryCareFacilityNeeded: 'YES',
      paymentSources: ['PRIVATE_PAY', 'VETERANS_BENEFITS'],
    });
  });

  it('Maps Seeker in facility state to correct mutation input with general payment type', () => {
    const { whenNeedsCare, memoryCareNeeded, paymentType, paymentDetailTypes, condition } = {
      whenNeedsCare: WhenNeedsCareOptions.FUTURE,
      memoryCareNeeded: YesOrNoAnswer.NOT_SURE,
      paymentDetailTypes: undefined,
      paymentType: PaymentTypeOptions.GOVERNMENT,
      condition: SeniorCareRecipientCondition.MONITORING_OR_EXTRA_HELP_NEEDED,
    };

    const input = mapInFacilityStateToUpdateInput(
      whenNeedsCare,
      memoryCareNeeded,
      paymentType,
      paymentDetailTypes,
      condition
    );

    expect(input).toEqual({
      careRecipientCondition: 'MONITORING_OR_EXTRA_HELP_NEEDED',
      howSoonIsCareNeeded: 'PLANNING_FOR_FUTURE',
      memoryCareFacilityNeeded: 'NOT_SURE',
      paymentSources: ['GOVERNMENT_HEALTH_PROGRAM'],
    });
  });
});
