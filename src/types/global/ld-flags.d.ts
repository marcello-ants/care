import { LDEvaluationDetail } from 'launchdarkly-node-server-sdk';

declare global {
  interface TPreRateCardFlag extends LDEvaluationDetail {
    value: {
      contentUrl: string;
      variantId: string;
    };
  }
}
