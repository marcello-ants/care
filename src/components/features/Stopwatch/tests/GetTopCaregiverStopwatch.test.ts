import logger from '@/lib/clientLogger';
import { GetTopCaregiverStopwatch } from '@/components/features/Stopwatch/GetTopCaregiverStopWatch';

describe('GetTopCaregiverStopwatch', () => {
  let realPerformanceNow: { (): number; (): number };
  const realLoggerInfo = logger.info;
  const realLoggerError = logger.error;

  const performanceNowMock = jest.fn();
  const loggerInfoMock = jest.fn();
  const loggerErrorMock = jest.fn();

  beforeAll(() => {
    performance.now = performanceNowMock;
    logger.info = loggerInfoMock;
    logger.error = loggerErrorMock;
  });

  beforeEach(() => {
    performanceNowMock.mockReturnValue(5);
  });

  afterEach(() => {
    performanceNowMock.mockReset();
    loggerInfoMock.mockReset();
  });

  afterAll(() => {
    performance.now = realPerformanceNow;
    logger.info = realLoggerInfo;
    logger.error = realLoggerError;
  });

  it('should measure 2 seconds in success', async () => {
    const getTopCaregiverStopwatch = new GetTopCaregiverStopwatch('any');
    getTopCaregiverStopwatch.start();
    performanceNowMock.mockReturnValue(2005);
    const getTopCaregiversPartialParams = {
      zipcode: '78665',
      rate: undefined,
      helpTypes: undefined,
    };
    const params = {
      getTopCaregiverSuccess: { topCaregivers: [] },
      getTopCaregiverError: undefined,
      desiredNumResults: 5,
      leadConnectBucket: 0,
      getTopCaregiversPartialParams,
      maxDistanceFromSeeker: 10,
      leadConnectFifteenCaregiversBucket: 0,
    };
    getTopCaregiverStopwatch.stop(params);

    expect(loggerInfoMock).toHaveBeenCalledTimes(2);
    expect(loggerInfoMock).toHaveBeenNthCalledWith(1, {
      event: 'getTopCaregiverStart',
      page: 'any',
    });
    expect(loggerInfoMock).toHaveBeenNthCalledWith(2, {
      actualNumResults: 0,
      desiredNumResults: 5,
      duration: 2,
      event: 'getTopCaregiverResponse',
      leadConnectBucket: 0,
      leadConnectFifteenCaregiversBucket: 0,
      maxDistanceFromSeeker: {
        unit: 'MILES',
        value: 10,
      },
      maxRate: undefined,
      minRate: undefined,
      page: 'any',
      qualities: null,
      resultFulfillment: 0,
      services: null,
      zipcode: '78665',
    });

    expect(loggerErrorMock).not.toHaveBeenCalled();
  });

  it('should measure 0 seconds in quickly responding error', async () => {
    const getTopCaregiverStopwatch = new GetTopCaregiverStopwatch('any');
    getTopCaregiverStopwatch.start();
    performanceNowMock.mockReturnValue(500);
    const getTopCaregiversPartialParams = {
      zipcode: '78665',
      rate: undefined,
      helpTypes: undefined,
    };
    const params = {
      getTopCaregiverSuccess: undefined,
      getTopCaregiverError: {
        name: '',
        message: '',
        graphQLErrors: [],
        networkError: null,
        extraInfo: null,
      },
      desiredNumResults: 5,
      leadConnectBucket: 0,
      getTopCaregiversPartialParams,
      maxDistanceFromSeeker: 10,
      leadConnectFifteenCaregiversBucket: 0,
    };
    getTopCaregiverStopwatch.stop(params);

    expect(loggerInfoMock).toHaveBeenCalledTimes(1);
    expect(loggerInfoMock).toHaveBeenCalledWith({
      event: 'getTopCaregiverStart',
      page: 'any',
    });

    expect(loggerErrorMock).toHaveBeenCalledTimes(1);
    expect(loggerErrorMock).toHaveBeenCalledWith({
      duration: 0,
      errorMsg: '',
      event: 'getTopCaregiverError',
      leadConnectBucket: 0,
      leadConnectFifteenCaregiversBucket: 0,
      maxDistanceFromSeeker: {
        unit: 'MILES',
        value: 10,
      },
      maxRate: undefined,
      minRate: undefined,
      page: 'any',
      qualities: null,
      services: null,
      zipcode: '78665',
    });
  });
});
