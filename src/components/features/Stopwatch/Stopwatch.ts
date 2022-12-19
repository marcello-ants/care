interface StopwatchOperations {
  start: () => void;
  stop: () => number | undefined;
}

// eslint-disable-next-line import/prefer-default-export
export class Stopwatch implements StopwatchOperations {
  startTime: number | undefined;

  start = () => {
    this.startTime = performance.now();
  };

  stop = (): number | undefined => {
    if (typeof this.startTime !== 'undefined') {
      const endTime = performance.now();
      const durationMs = endTime - this.startTime;
      this.startTime = undefined;
      return durationMs;
    }
    return undefined;
  };
}
