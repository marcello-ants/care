import { getTopCaregiversVariables } from '@/__generated__/getTopCaregivers';
import { Rate } from '@/types/common';
import { HelpType, TypeOfCare } from '@/types/seeker';
import { SeniorCareRecipientRelationshipType } from '@/__generated__/globalTypes';

export const generateLeadConnectMfeSessionState = (
  getTopCaregiversInput: getTopCaregiversVariables,
  rate: Rate,
  requestedServices: HelpType[],
  desiredTypeOfCare: TypeOfCare,
  whoNeedsCare: SeniorCareRecipientRelationshipType | null
) => {
  const transitionSessionState = {
    entryLocation: 'ENROLLMENT',
    serviceID: getTopCaregiversInput.serviceID,
    zipcode: getTopCaregiversInput.zipcode,
    ...(getTopCaregiversInput.maxDistanceFromSeeker
      ? { maxDistanceFromSeeker: getTopCaregiversInput.maxDistanceFromSeeker }
      : {}),
    ...(rate && rate.maximum && rate.minimum
      ? { rate: { minimum: rate.minimum, maximum: rate.maximum } }
      : {}),
    ...(requestedServices && requestedServices.length > 0 ? { requestedServices } : {}),
    ...(desiredTypeOfCare && desiredTypeOfCare.length > 0 ? { desiredTypeOfCare } : {}),
    ...(whoNeedsCare ? { whoNeedsCare } : {}),
    isPremium: false,
  };

  sessionStorage.setItem('lead-connect-input', JSON.stringify(transitionSessionState));
};
