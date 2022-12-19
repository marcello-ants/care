import { cloneDeep } from 'lodash-es';
import dayjs from 'dayjs';
import { initialState } from '@/state/seeker';
import { initialState as initialProviderState, ProviderState } from '@/state/provider';
import { HelpType, SeniorCareRecipientCondition } from '@/types/seeker';
import { Child } from '@/types/seekerCC';
import { AGE_RANGES } from '@/constants';
import {
  SeniorCareAgeRangeType,
  SeniorCareRecipientRelationshipType,
  SeniorCommunityType,
} from '@/__generated__/globalTypes';
import {
  constructBlocksFromCareTimes,
  generateDescription,
  generateJobCreateInput,
  getDateFromIntent,
  generateProviderAvailabilityUpdateInput,
  constructChildren,
  formatCareRecipientInfo,
} from '../gqlPayloadHelper';

jest.mock('uuid', () => {
  return {
    v4: jest.fn(() => 'id'),
  };
});

let initialStateOverride: any;

function getDateWithTZ(date: string, tz: string) {
  return dayjs(date).tz(tz);
}

describe('Construct children', () => {
  const state = {
    careChildren: [
      { ageRange: AGE_RANGES.toddler, gender: 'FEMALE' },
      { ageRange: AGE_RANGES.earlySchool, gender: 'MALE' },
    ],
    careChildrenDOB: ['2021-03-01', '2016-07-01', null],
  };
  const expectedChildren: Child[] = [
    {
      id: 'id',
      ageRange: AGE_RANGES.toddler,
      gender: 'FEMALE',
      approximateDoB: '2021-03-01',
    },
    {
      id: 'id',
      ageRange: AGE_RANGES.earlySchool,
      gender: 'MALE',
      approximateDoB: '2016-07-01',
    },
    {
      id: 'id',
      ageRange: AGE_RANGES.newborn,
      approximateDoB: null,
    },
  ];

  it('constructs children array correctly', () => {
    Date.now = jest.fn(() => 1633069091891);

    expect(expectedChildren).toEqual(constructChildren(state.careChildren, state.careChildrenDOB));
  });
});

describe('GQL Payload Helper', () => {
  beforeEach(() => {
    initialStateOverride = {
      ...cloneDeep(initialState.jobPost),
      careFrequency: 'recurring',
      recurring: {
        careTimes: { morning: true },
        schedule: { monday: { blocks: [] } },
        scheduleMayVary: false,
        specificTimes: false,
        timesAppliedToAllDays: false,
      },
      selfNeedsCare: false,
      typeOfCare: 'COMPANION',
      zip: '10004',
      intent: 'NOW',
      lovedOne: {
        details: 'loved one details',
        whoNeedsCare: 'GRANDPARENT',
        gender: 'FEMALE',
        age: 'EIGHTIES',
      },
      idealCaregiver: {
        details: 'caregiver details',
        gender: 'FEMALE',
      },
      servicesNeeded: ['MEDICATION', 'MOBILITY_ASSISTANCE', 'COMPANIONSHIP'],
    };
  });
  it('generates a description with all details', () => {
    const description = generateDescription(
      initialStateOverride.lovedOne.details,
      initialStateOverride.idealCaregiver.details,
      initialStateOverride.servicesNeeded,
      initialStateOverride.idealCaregiver.gender
    );
    expect(description).toEqual([
      'About who needs care: loved one details\n\n' +
        'About the care needs: caregiver details\n\n' +
        'Services needed include: medication prompting, mobility assistance, and companionship.\n\n' +
        'Preference for a caregiver who is female.\n',
      true,
    ]);
  });
  it('generates a description skipping empty services', () => {
    initialStateOverride.servicesNeeded = [];
    const description = generateDescription(
      initialStateOverride.lovedOne.details,
      initialStateOverride.idealCaregiver.details,
      initialStateOverride.servicesNeeded,
      initialStateOverride.idealCaregiver.gender
    );
    expect(description).toEqual([
      'About who needs care: loved one details\n\n' +
        'About the care needs: caregiver details\n\n' +
        'Preference for a caregiver who is female.\n',
      true,
    ]);
  });
  it('generates a description skipping poor quality input (length of input)', () => {
    initialStateOverride.lovedOne.details = 'idk';
    const description = generateDescription(
      initialStateOverride.lovedOne.details,
      initialStateOverride.idealCaregiver.details,
      initialStateOverride.servicesNeeded,
      initialStateOverride.idealCaregiver.gender
    );
    expect(description).toEqual([
      'About the care needs: caregiver details\n\n' +
        'Services needed include: medication prompting, mobility assistance, and companionship.\n\n' +
        'Preference for a caregiver who is female.\n',
      true,
    ]);
  });
  it('replaces smart quotes with flat quotes', () => {
    initialStateOverride.lovedOne.details += ' ‘yuuuge’ “hamberder”';
    initialStateOverride.idealCaregiver.details += ' \u2018bigly\u2019 \u201ccovfefe\u201d';

    const description = generateDescription(
      initialStateOverride.lovedOne.details,
      initialStateOverride.idealCaregiver.details,
      initialStateOverride.servicesNeeded,
      initialStateOverride.idealCaregiver.gender
    );
    expect(description[0]).toEqual(expect.stringMatching(`'yuuuge' "hamberder"`));
    expect(description[0]).toEqual(expect.stringMatching(`'bigly' "covfefe"`));
  });

  it('replaces en & em dashes with hyphens', () => {
    initialStateOverride.lovedOne.details +=
      ' check me out, vertically centering without \u2013css: –';
    initialStateOverride.idealCaregiver.details += ' smart \u2014punctuation—';

    const description = generateDescription(
      initialStateOverride.lovedOne.details,
      initialStateOverride.idealCaregiver.details,
      initialStateOverride.servicesNeeded,
      initialStateOverride.idealCaregiver.gender
    );
    expect(description[0]).toEqual(expect.stringMatching('-css: -'));
    expect(description[0]).toEqual(expect.stringMatching('smart --punctuation--'));
  });

  it('replaces ellipsis with ...', () => {
    initialStateOverride.lovedOne.details += ' suddenly… potatoes\u2026';

    const description = generateDescription(
      initialStateOverride.lovedOne.details,
      initialStateOverride.idealCaregiver.details,
      initialStateOverride.servicesNeeded,
      initialStateOverride.idealCaregiver.gender
    );
    expect(description[0]).toEqual(expect.stringMatching('suddenly... potatoes...'));
  });

  it('produces the correct time blocks', () => {
    const careTimes = { morning: true, afternoon: true };
    const blocks = constructBlocksFromCareTimes(careTimes);
    expect(blocks).toEqual({
      blocks: [
        { start: '06:00', end: '12:00' },
        { start: '12:00', end: '18:00' },
      ],
    });
  });

  it('collapses all time blocks into one', () => {
    const careTimes = { morning: true, afternoon: true, evening: true, overnight: true };
    const blocks = constructBlocksFromCareTimes(careTimes);
    expect(blocks).toEqual({
      blocks: [{ start: '00:00', end: '24:00' }],
    });
  });

  it('generates the correct job create input', () => {
    const jobCreateInput = generateJobCreateInput(initialStateOverride);
    const expectedStartDate = dayjs().tz('America/New_York').add(3, 'hour').format('YYYY-MM-DD');
    expect(jobCreateInput).toEqual({
      caregiverType: 'COMPANION',
      zipcode: '10004',
      careRecipients: [
        {
          ageRange: 'EIGHTIES',
          gender: 'FEMALE',
          relationship: 'GRANDPARENT',
        },
      ],
      servicesNeeded: ['MEDICATION', 'MOBILITY_ASSISTANCE', 'COMPANIONSHIP'],
      rate: {
        minimum: {
          amount: 14,
          currencyCode: 'USD',
        },
        maximum: {
          amount: 22,
          currencyCode: 'USD',
        },
      },
      source: 'ENROLLMENT',
      description:
        'About who needs care: loved one details\n\nAbout the care needs: caregiver details\n\nServices needed include: medication prompting, mobility assistance, and companionship.\n\nPreference for a caregiver who is female.\n',
      scheduleMayVary: false,
      schedule: {
        monday: {
          blocks: [
            {
              start: '06:00',
              end: '12:00',
            },
          ],
        },
      },
      startDate: expectedStartDate,
    });
  });

  it('generates correct next day from intent', () => {
    // 11:59PM Central === 12:59AM ET next day
    const currentDateTime = getDateWithTZ('2020-11-23T23:59:00-06:00', 'America/Chicago');
    const result = getDateFromIntent('NOW', currentDateTime);
    expect(result).toEqual('2020-11-24');
  });

  it('generates correct next day from intent due to 9pm cutoff', () => {
    // 10:30PM Central === 11:30PM ET same day
    const currentDateTime = getDateWithTZ('2020-11-23T22:30:00-06:00', 'America/Chicago');
    const result = getDateFromIntent('NOW', currentDateTime);
    // We expect this to get pushed to the next day
    expect(result).toEqual('2020-11-24');
  });

  it('generates correct same day from intent', () => {
    // 1:30PM Pacific === 4:30PM ET same day
    const currentDateTime = getDateWithTZ('2020-11-23T13:30:00-08:00', 'America/Los_Angeles');
    const result = getDateFromIntent('NOW', currentDateTime);
    expect(result).toEqual('2020-11-23');
  });

  describe('generateProviderAvailabilityUpdateInput', () => {
    let providerState: ProviderState;

    beforeEach(() => {
      providerState = cloneDeep(initialProviderState);
    });

    it('should transform providerState into an availabilityInput object', () => {
      providerState.recurring = {
        ...providerState.recurring,
        start: '2021-01-01',
        end: '2021-02-01',
        careTimes: {
          morning: true,
        },
        schedule: {
          monday: { blocks: [] },
          wednesday: { blocks: [] },
          friday: { blocks: [] },
        },
      };
      providerState.jobTypes = ['recurring'];
      providerState.jobTypesSchedules = {
        recurring: {
          min: '1',
          max: '48',
        },
      };

      const availabilityInput = generateProviderAvailabilityUpdateInput(providerState);
      expect(availabilityInput.startDate).toBe('2021-01-01');
      expect(availabilityInput.endDate).toBe('2021-02-01');
      expect(availabilityInput.recurringLimits).toEqual({
        minimumHours: 1,
        maximumHours: 48,
      });
      expect(availabilityInput.liveInLimits).toBeUndefined();
      expect(availabilityInput.oneTimeLimits).toBeUndefined();
      expect(availabilityInput.schedule.monday?.blocks).toContainEqual({
        start: '06:00',
        end: '12:00',
      });
      expect(availabilityInput.schedule.tuesday).toBeUndefined();
      expect(availabilityInput.schedule.wednesday?.blocks).toContainEqual({
        start: '06:00',
        end: '12:00',
      });
      expect(availabilityInput.schedule.thursday).toBeUndefined();
      expect(availabilityInput.schedule.friday?.blocks).toContainEqual({
        start: '06:00',
        end: '12:00',
      });
    });

    it('should default the minimum hours to 0 if not specified', () => {
      providerState.recurring = {
        ...providerState.recurring,
        start: '2021-01-01',
        end: '2021-02-01',
        careTimes: {
          morning: true,
        },
        schedule: {
          monday: { blocks: [] },
        },
      };
      providerState.jobTypes = ['recurring'];

      const availabilityInput = generateProviderAvailabilityUpdateInput(providerState);
      expect(availabilityInput.recurringLimits).toEqual({
        minimumHours: 0,
      });
    });
  });

  describe('formatCareRecipientInfo', () => {
    it('returns empty object when no args are passed(WhoNeedsCare, WhoNeedsCareAge, condition))', () => {
      const careRecipientInfo = {};

      const args = {
        whoNeedsCare: null,
        whoNeedsCareAge: null,
        condition: null,
        helpTypes: [],
      };

      const updatedInput = formatCareRecipientInfo(args);

      expect(updatedInput).toEqual(careRecipientInfo);
    });

    it('returns careRecipientInfo and as many properties as it recieves', () => {
      const careRecipientInfo = {
        relationship: SeniorCareRecipientRelationshipType.PARENT,
        facilityType: SeniorCommunityType.MEMORY_CARE,
        ageRange: SeniorCareAgeRangeType.EIGHTIES,
      };

      const args = {
        whoNeedsCare: SeniorCareRecipientRelationshipType.PARENT,
        whoNeedsCareAge: SeniorCareAgeRangeType.EIGHTIES,
        condition: SeniorCareRecipientCondition.INDEPENDENT,
        helpTypes: [HelpType.MEMORY_CARE],
      };

      const updatedInput = formatCareRecipientInfo(args);

      expect(updatedInput).toEqual(careRecipientInfo);
    });
    it('returns careRecipientInfo when there is no Memory care selected and a condition exists', () => {
      const careRecipientInfo = {
        relationship: SeniorCareRecipientRelationshipType.PARENT,
        facilityType: SeniorCommunityType.ASSISTED_LIVING,
        ageRange: SeniorCareAgeRangeType.EIGHTIES,
      };

      const args = {
        whoNeedsCare: SeniorCareRecipientRelationshipType.PARENT,
        whoNeedsCareAge: SeniorCareAgeRangeType.EIGHTIES,
        condition: SeniorCareRecipientCondition.MONITORING_OR_EXTRA_HELP_NEEDED,
        helpTypes: [],
      };

      const updatedInput = formatCareRecipientInfo(args);

      expect(updatedInput).toEqual(careRecipientInfo);
    });
    it('returns default field value for facilityType and relationship', () => {
      const careRecipientInfo = {
        relationship: SeniorCareRecipientRelationshipType.OTHER,
        facilityType: SeniorCommunityType.ASSISTED_LIVING,
        ageRange: SeniorCareAgeRangeType.EIGHTIES,
      };

      const args = {
        whoNeedsCare: null,
        whoNeedsCareAge: SeniorCareAgeRangeType.EIGHTIES,
        condition: SeniorCareRecipientCondition.NOT_SURE,
        helpTypes: [],
      };

      const updatedInput = formatCareRecipientInfo(args);

      expect(updatedInput).toEqual(careRecipientInfo);
    });
  });
});
