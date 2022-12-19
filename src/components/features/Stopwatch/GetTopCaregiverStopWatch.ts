import { Stopwatch } from '@/components/features/Stopwatch/Stopwatch';
import { getTopCaregivers } from '@/__generated__/getTopCaregivers';
import { ApolloError } from '@apollo/client';
import logger from '@/lib/clientLogger';
import {
  generateSCTestAwareGetTopCaregiversInput,
  GetTopCaregiversPartialParams,
} from '@/components/pages/seeker/sc/getTopCaregiversHelper';

interface GetTopCaregiverStopwatchOperations {
  start: () => void;
  stop: (params: StopParameters) => void;
}

interface StopParameters {
  getTopCaregiverSuccess: getTopCaregivers | undefined;
  getTopCaregiverError: ApolloError | undefined;
  desiredNumResults: number;
  getTopCaregiversPartialParams: GetTopCaregiversPartialParams;
  leadConnectBucket: number | undefined;
  maxDistanceFromSeeker: number;
  leadConnectFifteenCaregiversBucket: number | undefined;
}

// eslint-disable-next-line import/prefer-default-export
export class GetTopCaregiverStopwatch implements GetTopCaregiverStopwatchOperations {
  startTime: number | undefined;

  stopwatch: Stopwatch;

  page: string;

  constructor(page: string) {
    this.stopwatch = new Stopwatch();
    this.page = page;
  }

  start = () => {
    this.stopwatch.start();
    logger.info({ event: 'getTopCaregiverStart', page: this.page });
  };

  stop = (params: StopParameters) => {
    if (params.getTopCaregiverSuccess || params.getTopCaregiverError) {
      const durationMs = this.stopwatch.stop();
      if (typeof durationMs !== 'undefined') {
        const durationSeconds = Math.floor(durationMs / 1000);
        const getTopCaregiversInput = generateSCTestAwareGetTopCaregiversInput(
          params.leadConnectBucket,
          params.getTopCaregiversPartialParams,
          params.maxDistanceFromSeeker,
          params.leadConnectFifteenCaregiversBucket
        );
        if (params.getTopCaregiverSuccess) {
          const { desiredNumResults } = params;
          const actualNumResults = params.getTopCaregiverSuccess.topCaregivers.length;
          const resultFulfillment = Math.round((actualNumResults / desiredNumResults) * 100) / 100;

          logger.info({
            event: 'getTopCaregiverResponse',
            duration: durationSeconds,
            desiredNumResults,
            actualNumResults,
            page: this.page,
            zipcode: getTopCaregiversInput.zipcode,
            qualities: getTopCaregiversInput.qualities,
            services: getTopCaregiversInput.services,
            minRate: getTopCaregiversInput.hourlyRate?.minimum,
            maxRate: getTopCaregiversInput.hourlyRate?.maximum,
            maxDistanceFromSeeker: getTopCaregiversInput.maxDistanceFromSeeker,
            resultFulfillment,
            leadConnectBucket: params.leadConnectBucket,
            leadConnectFifteenCaregiversBucket: params.leadConnectFifteenCaregiversBucket,
          });
        } else {
          logger.error({
            event: 'getTopCaregiverError',
            duration: durationSeconds,
            page: this.page,
            zipcode: getTopCaregiversInput.zipcode,
            qualities: getTopCaregiversInput.qualities,
            services: getTopCaregiversInput.services,
            minRate: getTopCaregiversInput.hourlyRate?.minimum,
            maxRate: getTopCaregiversInput.hourlyRate?.maximum,
            maxDistanceFromSeeker: getTopCaregiversInput.maxDistanceFromSeeker,
            leadConnectBucket: params.leadConnectBucket,
            leadConnectFifteenCaregiversBucket: params.leadConnectFifteenCaregiversBucket,
            errorMsg: params.getTopCaregiverError?.message,
          });
        }
      }
    }
  };
}
