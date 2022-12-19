import { HelpType, SeniorCareRecipientCondition, SeniorLivingOptions } from '@/types/seeker';
import { SeniorCommunityType } from '@/__generated__/globalTypes';
import {
  recommendedSeniorCareLivingOption,
  recommendedSeniorCareCommunityType,
  recommendedCaringFacilityFlags,
} from '../senior-care-facility-utility';

describe('senior-care-facility-utility.ts', () => {
  describe('recommendedSeniorCareLivingOption', () => {
    describe('memory care is selected', () => {
      it('returns memory care living option', () => {
        const result = recommendedSeniorCareLivingOption(undefined, [HelpType.MEMORY_CARE]);
        expect(result).toEqual(SeniorLivingOptions.MEMORY_CARE);
      });
    });

    describe('constant supervision is selected', () => {
      const withConstantSupervision = (helpTypes: HelpType[]) =>
        recommendedSeniorCareLivingOption(
          SeniorCareRecipientCondition.CONSTANT_SUPERVISION_NEEDED,
          helpTypes
        );

      it('returns nursing options when no helpType, personal, or mobility help selected', () => {
        const noHelpResult = withConstantSupervision([]);
        const personalResult = withConstantSupervision([HelpType.PERSONAL]);
        const mobilityResult = withConstantSupervision([HelpType.MOBILITY]);
        expect(noHelpResult).toEqual(SeniorLivingOptions.NURSING_OPTIONS);
        expect(personalResult).toEqual(SeniorLivingOptions.NURSING_OPTIONS);
        expect(mobilityResult).toEqual(SeniorLivingOptions.NURSING_OPTIONS);
      });

      it("returns assisted when a helpType that's not personal or mobility selected", () => {
        const result = withConstantSupervision([HelpType.COMPANIONSHIP]);
        expect(result).toEqual(SeniorLivingOptions.ASSISTED);
      });
    });

    describe('independent is selected', () => {
      const withIndependent = (helpTypes: HelpType[]) =>
        recommendedSeniorCareLivingOption(SeniorCareRecipientCondition.INDEPENDENT, helpTypes);

      it('returns assisted when personal or mobility help selected', () => {
        const personalResult = withIndependent([HelpType.PERSONAL]);
        const mobilityResult = withIndependent([HelpType.MOBILITY]);
        expect(personalResult).toEqual(SeniorLivingOptions.ASSISTED);
        expect(mobilityResult).toEqual(SeniorLivingOptions.ASSISTED);
      });

      it('returns independent when personal or mobility help is not selected', () => {
        const result = withIndependent([HelpType.COMPANIONSHIP]);
        expect(result).toEqual(SeniorLivingOptions.INDEPENDENT);
      });
    });

    describe('monitoring or extra help is selected', () => {
      const withMonitoring = (helpTypes: HelpType[]) =>
        recommendedSeniorCareLivingOption(
          SeniorCareRecipientCondition.MONITORING_OR_EXTRA_HELP_NEEDED,
          helpTypes
        );

      it('returns assisted when no helpType, personal, or mobility help selected', () => {
        const noHelpResult = withMonitoring([]);
        const personalResult = withMonitoring([HelpType.PERSONAL]);
        const mobilityResult = withMonitoring([HelpType.MOBILITY]);
        expect(noHelpResult).toEqual(SeniorLivingOptions.ASSISTED);
        expect(personalResult).toEqual(SeniorLivingOptions.ASSISTED);
        expect(mobilityResult).toEqual(SeniorLivingOptions.ASSISTED);
      });

      it("returns independent when a helpType that's not personal or mobility selected", () => {
        const result = withMonitoring([HelpType.COMPANIONSHIP]);
        expect(result).toEqual(SeniorLivingOptions.INDEPENDENT);
      });
    });

    describe('not sure is selected', () => {
      const withNotSure = (helpTypes: HelpType[]) =>
        recommendedSeniorCareLivingOption(SeniorCareRecipientCondition.NOT_SURE, helpTypes);

      it('returns assisted when no helpType, personal, or mobility help selected', () => {
        const noHelpResult = withNotSure([]);
        const personalResult = withNotSure([HelpType.PERSONAL]);
        const mobilityResult = withNotSure([HelpType.MOBILITY]);
        expect(noHelpResult).toEqual(SeniorLivingOptions.ASSISTED);
        expect(personalResult).toEqual(SeniorLivingOptions.ASSISTED);
        expect(mobilityResult).toEqual(SeniorLivingOptions.ASSISTED);
      });

      it("returns independent when a helpType that's not personal or mobility selected", () => {
        const result = withNotSure([HelpType.COMPANIONSHIP]);
        expect(result).toEqual(SeniorLivingOptions.INDEPENDENT);
      });
    });

    it("returns assisted when memory care isn't required and no condition is given", () => {
      const result = recommendedSeniorCareLivingOption(undefined, []);
      expect(result).toEqual(SeniorLivingOptions.ASSISTED);
    });
  });

  describe('recommendedCaringFacilityFlags', () => {
    it('returns the expected flags for memory care facilities', () => {
      const flags = recommendedCaringFacilityFlags(SeniorCareRecipientCondition.INDEPENDENT, [
        HelpType.MEMORY_CARE,
      ]);

      expect(flags).toEqual({
        notSure: false,
        independentLivingFacilities: false,
        assistedLivingFacilities: false,
        memoryCareFacilities: true,
      });
    });

    it('returns the expected flags for independent living facilities', () => {
      const flags = recommendedCaringFacilityFlags(SeniorCareRecipientCondition.INDEPENDENT, []);

      expect(flags).toEqual({
        notSure: false,
        independentLivingFacilities: true,
        assistedLivingFacilities: false,
        memoryCareFacilities: false,
      });
    });

    it('returns the expected flags for assisted livings facilities', () => {
      const flags = recommendedCaringFacilityFlags(
        SeniorCareRecipientCondition.MONITORING_OR_EXTRA_HELP_NEEDED,
        []
      );

      expect(flags).toEqual({
        notSure: false,
        independentLivingFacilities: false,
        assistedLivingFacilities: true,
        memoryCareFacilities: false,
      });
    });
  });

  describe('recommendedSeniorCareCommunityType', () => {
    describe('memory care is selected', () => {
      it('returns memory care living option', () => {
        const result = recommendedSeniorCareCommunityType(undefined, [HelpType.MEMORY_CARE]);
        expect(result).toEqual(SeniorCommunityType.MEMORY_CARE);
      });
    });

    describe('constant supervision is selected', () => {
      const withConstantSupervision = (helpTypes: HelpType[]) =>
        recommendedSeniorCareCommunityType(
          SeniorCareRecipientCondition.CONSTANT_SUPERVISION_NEEDED,
          helpTypes
        );

      it('returns nursing options when no helpType, personal, or mobility help selected', () => {
        const noHelpResult = withConstantSupervision([]);
        const personalResult = withConstantSupervision([HelpType.PERSONAL]);
        const mobilityResult = withConstantSupervision([HelpType.MOBILITY]);
        expect(noHelpResult).toBeUndefined();
        expect(personalResult).toBeUndefined();
        expect(mobilityResult).toBeUndefined();
      });

      it("returns assisted when a helpType that's not personal or mobility selected", () => {
        const result = withConstantSupervision([HelpType.COMPANIONSHIP]);
        expect(result).toEqual(SeniorCommunityType.ASSISTED_LIVING);
      });
    });

    describe('independent is selected', () => {
      const withIndependent = (helpTypes: HelpType[]) =>
        recommendedSeniorCareCommunityType(SeniorCareRecipientCondition.INDEPENDENT, helpTypes);

      it('returns assisted when personal or mobility help selected', () => {
        const personalResult = withIndependent([HelpType.PERSONAL]);
        const mobilityResult = withIndependent([HelpType.MOBILITY]);
        expect(personalResult).toEqual(SeniorCommunityType.ASSISTED_LIVING);
        expect(mobilityResult).toEqual(SeniorCommunityType.ASSISTED_LIVING);
      });

      it('returns independent when personal or mobility help is not selected', () => {
        const result = withIndependent([HelpType.COMPANIONSHIP]);
        expect(result).toEqual(SeniorCommunityType.INDEPENDENT_LIVING);
      });
    });

    describe('monitoring or extra help is selected', () => {
      const withMonitoring = (helpTypes: HelpType[]) =>
        recommendedSeniorCareCommunityType(
          SeniorCareRecipientCondition.MONITORING_OR_EXTRA_HELP_NEEDED,
          helpTypes
        );

      it('returns assisted when no helpType, personal, or mobility help selected', () => {
        const noHelpResult = withMonitoring([]);
        const personalResult = withMonitoring([HelpType.PERSONAL]);
        const mobilityResult = withMonitoring([HelpType.MOBILITY]);
        expect(noHelpResult).toEqual(SeniorCommunityType.ASSISTED_LIVING);
        expect(personalResult).toEqual(SeniorCommunityType.ASSISTED_LIVING);
        expect(mobilityResult).toEqual(SeniorCommunityType.ASSISTED_LIVING);
      });

      it("returns independent when a helpType that's not personal or mobility selected", () => {
        const result = withMonitoring([HelpType.COMPANIONSHIP]);
        expect(result).toEqual(SeniorCommunityType.INDEPENDENT_LIVING);
      });
    });

    describe('not sure is selected', () => {
      const withNotSure = (helpTypes: HelpType[]) =>
        recommendedSeniorCareCommunityType(SeniorCareRecipientCondition.NOT_SURE, helpTypes);

      it('returns assisted when no helpType, personal, or mobility help selected', () => {
        const noHelpResult = withNotSure([]);
        const personalResult = withNotSure([HelpType.PERSONAL]);
        const mobilityResult = withNotSure([HelpType.MOBILITY]);
        expect(noHelpResult).toEqual(SeniorCommunityType.ASSISTED_LIVING);
        expect(personalResult).toEqual(SeniorCommunityType.ASSISTED_LIVING);
        expect(mobilityResult).toEqual(SeniorCommunityType.ASSISTED_LIVING);
      });

      it("returns independent when a helpType that's not personal or mobility selected", () => {
        const result = withNotSure([HelpType.COMPANIONSHIP]);
        expect(result).toEqual(SeniorCommunityType.INDEPENDENT_LIVING);
      });
    });

    it("returns assisted when memory care isn't required and no condition is given", () => {
      const result = recommendedSeniorCareCommunityType(undefined, []);
      expect(result).toEqual(SeniorCommunityType.ASSISTED_LIVING);
    });
  });
});
