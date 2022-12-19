import { cloneDeep } from 'lodash-es';

import {
  POST_A_JOB_ROUTES,
  SEEKER_IN_FACILITY_ROUTES,
  SEEKER_LEAD_CONNECT_ROUTES,
  SEEKER_ROUTES,
} from '@/constants';
import { DEFAULT_JOB_START_TIME, DEFAULT_JOB_END_TIME } from '@/types/common';
import { SeekerState, HelpType, JobPostSeekerState, SeekerPages } from '@/types/seeker';
import { AppState } from '@/types/app';
import { initialAppState } from '@/state';
import { SENIOR_CARE_TYPE, SeniorCareRecipientRelationshipType } from '@/__generated__/globalTypes';
import { validate, validateJobPost, validateSeekerPreAccount } from '../validation';
import { initialState as initialSeekerState, jobPostInitialState } from '../reducer';

const completelyPopulatedPostJobState: JobPostSeekerState = {
  ...jobPostInitialState,
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
    whoNeedsCare: 'GRANDPARENT' as SeniorCareRecipientRelationshipType,
    gender: 'FEMALE',
    age: 'EIGHTIES',
  },
  idealCaregiver: {
    details: 'caregiver details',
    gender: 'FEMALE',
    submissionAttempted: false,
    attempts: 0,
  },
  servicesNeeded: ['MEDICATION', 'MOBILITY_ASSISTANCE', 'COMPANIONSHIP'],
};

const completelyPopulatedSeekerState: SeekerState = {
  ...initialSeekerState,
  city: 'Los Angeles',
  state: 'CA',
  zipcode: '90001',
  helpTypes: [HelpType.HOUSEHOLD],
  typeOfCare: SENIOR_CARE_TYPE.IN_HOME,
  jobPost: completelyPopulatedPostJobState,
};

describe('Seeker validation', () => {
  describe('doesSeekerStateHaveDefaultKeys', () => {
    it('should return true if default keys are ok', () => {
      expect(validateSeekerPreAccount(completelyPopulatedSeekerState, SeekerPages.RECAP)).toBe(
        true
      );
    });
    it('should return false if default keys are not ok', () => {
      const incompleteSeekerState: SeekerState = cloneDeep(initialSeekerState);
      // @ts-ignore
      delete incompleteSeekerState.zipcode;
      expect(validateSeekerPreAccount(incompleteSeekerState, SeekerPages.RECAP)).toBe(false);
    });
  });

  describe('validate seeker state', () => {
    it('should return true if the page is not in the map', () => {
      const populatedState: AppState = {
        ...initialAppState,
        seeker: completelyPopulatedSeekerState,
      };
      expect(validate(populatedState, SEEKER_ROUTES.INDEX)).toBe(true);
    });

    it('should return true if passing a completely populated state on every page', () => {
      const populatedState: AppState = {
        ...initialAppState,
        seeker: completelyPopulatedSeekerState,
      };
      expect(validate(populatedState, SEEKER_ROUTES.LOCATION)).toBe(true);
      expect(validate(populatedState, SEEKER_ROUTES.CARE_TYPE)).toBe(true);
      expect(validate(populatedState, SEEKER_ROUTES.HELP_TYPE)).toBe(true);
      expect(validate(populatedState, SEEKER_ROUTES.RECAP)).toBe(true);
      expect(validate(populatedState, SEEKER_ROUTES.ACCOUNT_CREATION)).toBe(true);
      expect(validate(populatedState, SEEKER_ROUTES.ACCOUNT_CREATION_NAME)).toBe(true);
    });

    it('should return false if missing zipcode on some pages', () => {
      const incompleteState = {
        ...initialAppState,
        seeker: {
          ...completelyPopulatedSeekerState,
          zipcode: '',
        },
      };

      expect(validate(incompleteState, SEEKER_ROUTES.RECAP)).toBe(false);
      expect(validate(incompleteState, SEEKER_ROUTES.ACCOUNT_CREATION)).toBe(false);
      expect(validate(incompleteState, SEEKER_ROUTES.ACCOUNT_CREATION_NAME)).toBe(false);
    });

    it('should return false if missing typeOfCare on some pages', () => {
      const incompleteState: AppState = {
        ...initialAppState,
        seeker: {
          ...completelyPopulatedSeekerState,
          // @ts-ignore
          typeOfCare: '',
        },
      };

      expect(validate(incompleteState, SEEKER_ROUTES.HELP_TYPE)).toBe(false);
      expect(validate(incompleteState, SEEKER_ROUTES.RECAP)).toBe(false);
      expect(validate(incompleteState, SEEKER_ROUTES.ACCOUNT_CREATION)).toBe(false);
      expect(validate(incompleteState, SEEKER_ROUTES.ACCOUNT_CREATION_NAME)).toBe(false);
    });

    it('should return false if missing helpTypes on some pages', () => {
      const incompleteState: AppState = {
        ...initialAppState,
        seeker: {
          ...completelyPopulatedSeekerState,
          // @ts-ignore
          helpTypes: '',
        },
      };

      expect(validate(incompleteState, SEEKER_ROUTES.RECAP)).toBe(false);
      expect(validate(incompleteState, SEEKER_ROUTES.ACCOUNT_CREATION)).toBe(false);
      expect(validate(incompleteState, SEEKER_ROUTES.ACCOUNT_CREATION_NAME)).toBe(false);
    });
  });

  describe('validate jobPost state', () => {
    it('should return true if default keys are ok', () => {
      expect(validateJobPost(completelyPopulatedSeekerState, POST_A_JOB_ROUTES.POST_A_JOB)).toBe(
        true
      );
    });
    it('should return false if default keys are not ok', () => {
      const incompleteSeekerState: SeekerState = cloneDeep(initialSeekerState);
      // @ts-ignore
      delete incompleteSeekerState.zipcode;
      expect(validateJobPost(incompleteSeekerState, POST_A_JOB_ROUTES.POST_A_JOB)).toBe(false);
    });
    it('should return true if the page is not in the map', () => {
      const incompleteSeekerState = cloneDeep(initialAppState);
      // @ts-ignore
      delete incompleteSeekerState.seeker.jobPost.zip;
      expect(validate(incompleteSeekerState, POST_A_JOB_ROUTES.POST_A_JOB)).toBe(true);
    });

    it('should return true if passing a completely populated state on every page', () => {
      const populatedState: AppState = {
        ...initialAppState,
        seeker: completelyPopulatedSeekerState,
      };
      expect(validate(populatedState, POST_A_JOB_ROUTES.RECURRING)).toBe(true);
      expect(validate(populatedState, POST_A_JOB_ROUTES.ONE_TIME)).toBe(true);
      expect(validate(populatedState, POST_A_JOB_ROUTES.PAY_FOR_CARE)).toBe(true);
      expect(validate(populatedState, POST_A_JOB_ROUTES.ABOUT_LOVED_ONE)).toBe(true);
      expect(validate(populatedState, POST_A_JOB_ROUTES.IDEAL_CAREGIVER)).toBe(true);
      expect(validate(populatedState, POST_A_JOB_ROUTES.CAREGIVERS_NEAR_YOU)).toBe(true);
    });

    it('should return false if missing key', () => {
      const incompleteSeekerState = cloneDeep(initialAppState);
      // @ts-ignore
      delete incompleteSeekerState.seeker.jobPost.zip;

      expect(validate(incompleteSeekerState, POST_A_JOB_ROUTES.RECURRING)).toBe(false);
    });

    it('should return false if missing care frequency state on some pages', () => {
      const incompleteState: AppState = {
        ...initialAppState,
        seeker: {
          ...completelyPopulatedSeekerState,
          jobPost: {
            ...completelyPopulatedPostJobState,
            careFrequency: undefined,
          },
        },
      };

      expect(validate(incompleteState, POST_A_JOB_ROUTES.RECURRING)).toBe(false);
      expect(validate(incompleteState, POST_A_JOB_ROUTES.ONE_TIME)).toBe(false);
      expect(validate(incompleteState, POST_A_JOB_ROUTES.PAY_FOR_CARE)).toBe(false);
      expect(validate(incompleteState, POST_A_JOB_ROUTES.ABOUT_LOVED_ONE)).toBe(false);
      expect(validate(incompleteState, POST_A_JOB_ROUTES.IDEAL_CAREGIVER)).toBe(false);
    });

    it('should return false if missing recurring schedule state on some pages', () => {
      const incompleteState: AppState = {
        ...initialAppState,
        seeker: {
          ...completelyPopulatedSeekerState,
          jobPost: {
            ...completelyPopulatedPostJobState,
            careFrequency: 'recurring',
            recurring: {
              careTimes: {},
              schedule: {},
              scheduleMayVary: false,
              specificTimes: false,
              timesAppliedToAllDays: false,
            },
          },
        },
      };

      expect(validate(incompleteState, POST_A_JOB_ROUTES.RECURRING)).toBe(true);
      expect(validate(incompleteState, POST_A_JOB_ROUTES.ONE_TIME)).toBe(true);

      expect(validate(incompleteState, POST_A_JOB_ROUTES.PAY_FOR_CARE)).toBe(false);
      expect(validate(incompleteState, POST_A_JOB_ROUTES.ABOUT_LOVED_ONE)).toBe(false);
      expect(validate(incompleteState, POST_A_JOB_ROUTES.IDEAL_CAREGIVER)).toBe(false);
    });

    it('should return false if missing onetime schedule state on some pages', () => {
      const incompleteState: AppState = {
        ...initialAppState,
        seeker: {
          ...completelyPopulatedSeekerState,
          jobPost: {
            ...completelyPopulatedPostJobState,
            careFrequency: 'onetime',
            oneTime: {
              schedule: {
                start: {
                  date: null,
                  time: DEFAULT_JOB_START_TIME,
                },
                end: {
                  date: null,
                  time: DEFAULT_JOB_END_TIME,
                },
              },
            },
          },
        },
      };

      expect(validate(incompleteState, POST_A_JOB_ROUTES.RECURRING)).toBe(true);
      expect(validate(incompleteState, POST_A_JOB_ROUTES.ONE_TIME)).toBe(true);

      expect(validate(incompleteState, POST_A_JOB_ROUTES.PAY_FOR_CARE)).toBe(false);
      expect(validate(incompleteState, POST_A_JOB_ROUTES.ABOUT_LOVED_ONE)).toBe(false);
      expect(validate(incompleteState, POST_A_JOB_ROUTES.IDEAL_CAREGIVER)).toBe(false);
    });

    it('should return true if missing onetime schedule end date but passing start date', () => {
      const incompleteState: AppState = {
        ...initialAppState,
        seeker: {
          ...completelyPopulatedSeekerState,
          jobPost: {
            ...completelyPopulatedPostJobState,
            careFrequency: 'onetime',
            oneTime: {
              schedule: {
                start: {
                  date: '2021-11-09',
                  time: DEFAULT_JOB_START_TIME,
                },
                end: {
                  date: null,
                  time: DEFAULT_JOB_END_TIME,
                },
              },
            },
          },
        },
      };

      expect(validate(incompleteState, POST_A_JOB_ROUTES.RECURRING)).toBe(true);
      expect(validate(incompleteState, POST_A_JOB_ROUTES.ONE_TIME)).toBe(true);
      expect(validate(incompleteState, POST_A_JOB_ROUTES.PAY_FOR_CARE)).toBe(true);
      expect(validate(incompleteState, POST_A_JOB_ROUTES.ABOUT_LOVED_ONE)).toBe(true);
      expect(validate(incompleteState, POST_A_JOB_ROUTES.IDEAL_CAREGIVER)).toBe(true);
    });

    it('should return false if missing rate state on some pages', () => {
      const incompleteState: AppState = {
        ...initialAppState,
        seeker: {
          ...completelyPopulatedSeekerState,
          jobPost: {
            ...completelyPopulatedPostJobState,
            // @ts-ignore
            rate: undefined,
          },
        },
      };

      expect(validate(incompleteState, POST_A_JOB_ROUTES.RECURRING)).toBe(true);
      expect(validate(incompleteState, POST_A_JOB_ROUTES.ONE_TIME)).toBe(true);

      expect(validate(incompleteState, POST_A_JOB_ROUTES.PAY_FOR_CARE)).toBe(false);
      expect(validate(incompleteState, POST_A_JOB_ROUTES.ABOUT_LOVED_ONE)).toBe(false);
      expect(validate(incompleteState, POST_A_JOB_ROUTES.IDEAL_CAREGIVER)).toBe(false);
    });

    it('should return false if missing loved one state on ideal caregiver page', () => {
      const incompleteState: AppState = {
        ...initialAppState,
        seeker: {
          ...completelyPopulatedSeekerState,
          jobPost: {
            ...completelyPopulatedPostJobState,
            // @ts-ignore
            lovedOne: undefined,
          },
        },
      };

      expect(validate(incompleteState, POST_A_JOB_ROUTES.RECURRING)).toBe(true);
      expect(validate(incompleteState, POST_A_JOB_ROUTES.ONE_TIME)).toBe(true);
      expect(validate(incompleteState, POST_A_JOB_ROUTES.PAY_FOR_CARE)).toBe(true);
      expect(validate(incompleteState, POST_A_JOB_ROUTES.ABOUT_LOVED_ONE)).toBe(true);

      expect(validate(incompleteState, POST_A_JOB_ROUTES.IDEAL_CAREGIVER)).toBe(false);
    });
  });

  describe('validate lead and connect state', () => {
    it('should return true if on caregiver profile', () => {
      const populatedState: AppState = {
        ...initialAppState,
        seeker: completelyPopulatedSeekerState,
      };
      expect(validate(populatedState, SEEKER_LEAD_CONNECT_ROUTES.CAREGIVER_PROFILE)).toBe(true);
    });
  });

  describe('validate nth-day state', () => {
    it('should return true if memberId and userHasAccount exists', () => {
      const populatedState: AppState = {
        ...initialAppState,
        seeker: { ...completelyPopulatedSeekerState },
        flow: { ...initialAppState.flow, memberId: '123', userHasAccount: true },
      };
      expect(validate(populatedState, SEEKER_IN_FACILITY_ROUTES.COMMUNITY_LIST)).toBe(true);
      expect(validate(populatedState, SEEKER_IN_FACILITY_ROUTES.CARING_LEADS)).toBe(true);
    });

    it("should return false if memberId and userHasAccount doesn't exists", () => {
      const populatedState: AppState = {
        ...initialAppState,
        seeker: { ...completelyPopulatedSeekerState },
        flow: { ...initialAppState.flow, memberId: '', userHasAccount: false },
      };
      expect(validate(populatedState, SEEKER_IN_FACILITY_ROUTES.COMMUNITY_LIST)).toBe(false);
      expect(validate(populatedState, SEEKER_IN_FACILITY_ROUTES.CARING_LEADS)).toBe(false);
    });
  });
});
