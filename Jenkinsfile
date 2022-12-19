@Library('devops-jenkins-library') _

nodeAppPipeline(
    // available options are defined here:
    // https://github.com/care-dot-com/devops-jenkins-library/blob/main/vars/nodeAppPipeline.groovy
    script: this,
    service: 'enrollment-mfe',

    // customizing the pipeline's NODE_DEFAULT_PARAMS to scan TypeScript files as neccessary
    // https://github.com/care-dot-com/devops-jenkins-library/blob/main/src/com/care/jenkins/sonar/SonarUtils.groovy
    // NOTE: these globs should generally match the Jest coverage config we've defined in `jest.config.js`
    sonarInclusions: '**/*.ts,**/*.tsx',
    sonarTestInclusions: '**/*.test.ts,**/*.test.tsx',

    // TODO: remove the `src/server/index.ts` exclusion after Fastify tests have been added as part of SC-842
    // TODO: remove the `src/components/pages/seeker/cc/account-creation/daycare.tsx, src/components/pages/seeker/cc/daycare-recommendations/DaycareProfile.tsx, src/components/pages/seeker/cc/daycare-recommendations/recommendations.tsx` in GROW-456
    // TODO: remove the `src/pages/provider/cc/index.tsx` exclusion after https://jira.infra.carezen.net/browse/PRO-1856 is done
    sonarExclusions: '**/*.test.ts,**/*.test.tsx,src/__generated__/**,src/server/index.ts,src/components/pages/seeker/cc/account-creation/daycare.tsx,src/components/pages/seeker/cc/daycare-recommendations/DaycareProfile.tsx,src/components/pages/seeker/cc/daycare-recommendations/recommendations.tsx,src/utilities/utagHelper.ts,src/state/patch.ts,src/components/pages/seeker/pc/last-step/last-step.tsx,src/state/job/reducer.ts,src/components/SpecificCareTimesChildCare.tsx,src/pages/provider/cc/index.tsx,src/tests/mocks.ts,src/pages/external-login-form.tsx',
    sonarCodeDuplicationExclusions: 'src/pages/provider/cc/bio.tsx,src/pages/provider/sc/headline-bio.tsx,src/components/pages/seeker/hk/housekeeping-date/housekeeping-date.tsx,src/components/pages/seeker/sc/help-type/help-type.tsx,src/components/pages/seeker/sc/in-facility/payment-questionnaire/payment-questionnaire.tsx,src/components/pages/seeker/sc/in-facility/community-list/community-list.tsx'
)
