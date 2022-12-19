import { Stopwatch } from '@/components/features/Stopwatch/Stopwatch';

describe('Stopwatch', () => {
  let realPerformanceNow: { (): number; (): number };
  beforeAll(() => {
    realPerformanceNow = performance.now;
  });

  afterAll(() => {
    performance.now = realPerformanceNow;
  });

  it('should measure 2000 milliseconds', async () => {
    const performanceNowMock = jest.fn();
    performanceNowMock.mockReturnValue(5);
    performance.now = performanceNowMock;

    const stopwatch = new Stopwatch();

    stopwatch.start();

    performanceNowMock.mockReturnValue(2005);
    const duration = stopwatch.stop();
    expect(duration).toBe(2000);
  });

  it('should return undefined when stop called before start', async () => {
    const stopwatch = new Stopwatch();
    const duration = stopwatch.stop();
    expect(duration).toBe(undefined);
  });
});
