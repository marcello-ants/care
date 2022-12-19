import { cloneDeep } from 'lodash-es';
import { CARE_DATES } from '@/constants';
import buildDescription from '../../../description/cc/descriptionBuilder';
import { DefaultCareKind } from '../../../../types/seekerCC';
import { AppState } from '../../../../types/app';
import { initialAppState } from '../../../../state';

describe('Job description builder', () => {
  const appState = cloneDeep(initialAppState);
  const minState: AppState = {
    ...appState,
    seeker: {
      ...appState.seeker,
      zipcode: '78691',
      city: 'Round Rock',
      state: 'TX',
    },
    seekerCC: {
      ...appState.seekerCC,
      careDate: CARE_DATES.WITHIN_A_WEEK,
      careKind: DefaultCareKind.ONE_TIME_BABYSITTERS,
      jobPost: {
        recurring: {
          schedule: {},
        },
        date: {
          startDate: '2021/01/01',
          endDate: '2021/02/02',
        },
        oneTime: {
          dates: {
            startDate: '2021/01/01',
            endDate: '2021/02/02',
          },
          time: {
            startTime: '2021/01/01',
            endTime: '2021/02/02',
          },
        },
      },
      careChildren: [
        {
          ageRange: 'NEWBORN',
          gender: 'MALE',
        },
        {
          ageRange: 'NEWBORN',
          gender: 'MALE',
        },
      ],
    },
  } as unknown as AppState;
  const ccStateWithOutServices: AppState = {
    ...appState,
    seeker: {
      ...appState.seeker,
      zipcode: '78691',
      city: 'Round Rock',
      state: 'TX',
    },
    seekerCC: {
      careDate: CARE_DATES.WITHIN_A_WEEK,
      careKind: DefaultCareKind.ONE_TIME_BABYSITTERS,
      idealCaregivers: {},
      personalityCustomContentTwo: '',
      needHelpWith: [],
      cargiverAttributes: [],
      careExpecting: true,
      careChildren: [
        {
          ageRange: 'NEWBORN',
          gender: 'MALE',
        },
        {
          ageRange: 'ELEMENTARY_SCHOOL',
          gender: 'MALE',
        },
      ],
      jobPost: {
        recurring: {
          flexibleStartDate: true,
          careTimes: {},
          schedule: {
            monday: {
              blocks: [
                {
                  end: '18:00',
                  start: '08:00',
                },
              ],
            },
            friday: {
              blocks: [
                {
                  end: '18:00',
                  start: '08:00',
                },
                {
                  end: '20:30',
                  start: '19:30',
                },
              ],
            },
          },
          specificTimes: true,
          timesAppliedToAllDays: false,
        },
        oneTime: {
          dates: {
            startDate: '2021-01-13',
            endDate: '2021-01-29',
          },
          time: {
            startTime: '09:00',
            endTime: '17:00',
          },
        },
        scheduleMayVary: true,
        rate: {
          minimum: 14,
          maximum: 22,
          legalMinimum: 8,
        },
      },
      jobDescription: '',
      distanceLearning: true,
    },
  } as unknown as AppState;

  it('Minimal job description successfully created', () => {
    expect(buildDescription(minState.seekerCC, minState.seeker)).toEqual(
      'We need a babysitter for our 2 children in Round Rock.'
    );
  });

  it('Job description auto generated successfully for 2 kids, no services', () => {
    expect(
      buildDescription(ccStateWithOutServices.seekerCC, ccStateWithOutServices.seeker)
    ).toEqual(
      "We need a babysitter for our 2 children in Round Rock. I'm expecting! Looking for care Mondays (8am-6pm), Fridays (8am-6pm, 7:30pm-8:30pm). Flexible start date. My schedule may vary."
    );
  });

  it('Job description auto generated without dates for recurrent job without specific time', () => {
    const ccState = cloneDeep(ccStateWithOutServices);
    ccState.seekerCC.jobPost.recurring.careTimes = { evening: true };
    ccState.seekerCC.jobPost.recurring.schedule.monday = { blocks: [] };
    ccState.seekerCC.jobPost.recurring.schedule.friday = { blocks: [] };
    ccState.seekerCC.jobPost.recurring.flexibleStartDate = false;
    ccState.seekerCC.jobPost.scheduleMayVary = false;
    expect(buildDescription(ccState.seekerCC, ccState.seeker)).toEqual(
      "We need a babysitter for our 2 children in Round Rock. I'm expecting!"
    );
  });

  it('Job description auto generated without dates for recurrent job with vary schedule time without specific time', () => {
    const ccState = cloneDeep(ccStateWithOutServices);
    ccState.seekerCC.jobPost.recurring.careTimes = { evening: true };
    ccState.seekerCC.jobPost.recurring.schedule.monday = { blocks: [] };
    ccState.seekerCC.jobPost.recurring.schedule.friday = { blocks: [] };
    ccState.seekerCC.jobPost.recurring.flexibleStartDate = false;
    expect(buildDescription(ccState.seekerCC, ccState.seeker)).toEqual(
      "We need a babysitter for our 2 children in Round Rock. I'm expecting! My schedule may vary."
    );
  });

  it('Job description auto generated without dates for recurrent job with flexible time without specific time', () => {
    const ccState = cloneDeep(ccStateWithOutServices);
    ccState.seekerCC.jobPost.recurring.careTimes = { evening: true };
    ccState.seekerCC.jobPost.recurring.schedule.monday = { blocks: [] };
    ccState.seekerCC.jobPost.recurring.schedule.friday = { blocks: [] };
    ccState.seekerCC.jobPost.scheduleMayVary = false;
    expect(buildDescription(ccState.seekerCC, ccState.seeker)).toEqual(
      "We need a babysitter for our 2 children in Round Rock. I'm expecting! Flexible start date."
    );
  });

  it('Job description auto generated successfully for 2 kids, all services', () => {
    const ccState = cloneDeep(ccStateWithOutServices);
    ccState.seekerCC.jobPost.needHelpWith = [
      'LIGHT_HOUSEKEEPING',
      'HOMEWORK_HELP',
      'STRUCTURED_ACTIVITIES',
    ];
    ccState.seekerCC.jobPost.cargiverAttributes = [
      'COMFORTABLE_WITH_PETS',
      'OWN_TRANSPORTATION',
      'DOES_NOT_SMOKE',
      'COLLEGE_DEGREE',
      'CPR_TRAINED',
    ];
    expect(buildDescription(ccState.seekerCC, ccState.seeker)).toEqual(
      "We need a babysitter for our 2 children in Round Rock. We would prefer someone who could help out with light housekeeping. Please be comfortable with pets. It is important to us that you have your own car. We could use help with structuring activities and homework or curriculum assistance. I'm expecting! Looking for care Mondays (8am-6pm), Fridays (8am-6pm, 7:30pm-8:30pm). Flexible start date. My schedule may vary."
    );
  });

  it('Job description auto generated successfully for 2 kids, all services, custom message', () => {
    const ccState = cloneDeep(ccStateWithOutServices);
    ccState.seekerCC.jobPost.needHelpWith = [
      'LIGHT_HOUSEKEEPING',
      'HOMEWORK_HELP',
      'STRUCTURED_ACTIVITIES',
    ];
    ccState.seekerCC.jobPost.cargiverAttributes = [
      'COMFORTABLE_WITH_PETS',
      'OWN_TRANSPORTATION',
      'DOES_NOT_SMOKE',
      'COLLEGE_DEGREE',
      'CPR_TRAINED',
    ];

    ccState.seekerCC.jobPost.jobDescription = 'MY_FAMILY';
    ccState.seekerCC.jobPost.personalityCustomContentTwo = 'IDEAL_CAREGIVER';

    expect(buildDescription(ccState.seekerCC, ccState.seeker)).toEqual(
      "MY_FAMILY. Our ideal caregiver: IDEAL_CAREGIVER. Additional needs include light housekeeping, being comfortable with pets, having a reliable car, a non-smoker. We could use help with structuring activities and homework or curriculum assistance. I'm expecting! Looking for care Mondays (8am-6pm), Fridays (8am-6pm, 7:30pm-8:30pm). Flexible start date. My schedule may vary."
    );
  });
});
