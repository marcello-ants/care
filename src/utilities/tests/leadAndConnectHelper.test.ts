import { getTopCaregiversVariables } from '@/__generated__/getTopCaregivers';
import {
  DistanceUnit,
  SeniorCareRecipientRelationshipType,
  ServiceType,
} from '@/__generated__/globalTypes';
import { Rate } from '@/types/common';
import { HelpType, TypeOfCare } from '@/types/seeker';
import { generateLeadConnectMfeSessionState } from '@/utilities/leadAndConnectHelper';

const windowLocationAssignMock = jest.fn();
describe('Lead and Connect MFE Helper', () => {
  const originalLocation = window.location;

  beforeAll(() => {
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = {
      assign: windowLocationAssignMock,
    };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('saves to session state and redirects to the MFE', () => {
    const getTopCaregiversInput: getTopCaregiversVariables = {
      zipcode: '78665',
      serviceID: ServiceType.SENIOR_CARE,
      numResults: 10,
      maxDistanceFromSeeker: { unit: DistanceUnit.MILES, value: 10 },
    };

    const rate: Rate = { minimum: 10, maximum: 15, legalMinimum: 8 };

    const requestedServices: HelpType[] = [HelpType.TRANSPORTATION];
    const desiredTypeOfCare: TypeOfCare = 'LIVE_IN';

    generateLeadConnectMfeSessionState(
      getTopCaregiversInput,
      rate,
      requestedServices,
      desiredTypeOfCare,
      SeniorCareRecipientRelationshipType.GRANDPARENT
    );
    const savedSessionState = sessionStorage.getItem('lead-connect-input');
    expect(savedSessionState).toEqual(
      '{"entryLocation":"ENROLLMENT","serviceID":"SENIOR_CARE","zipcode":"78665","maxDistanceFromSeeker":{"unit":"MILES","value":10},"rate":{"minimum":10,"maximum":15},"requestedServices":["transportation"],"desiredTypeOfCare":"LIVE_IN","whoNeedsCare":"GRANDPARENT","isPremium":false}'
    );
  });
});
