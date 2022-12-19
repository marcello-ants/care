import { DEFAULT_AVG_MAX, DEFAULT_AVG_MIN, DEFAULT_LEGAL_MIN } from '@/types/common';

/**
 * fixInitialRateRange function fix values for min and max
 * if both of them got same values from gql call
 * @param {minimum, maximum} - An object with both values
 * @returns An array with different values for minimum and maximum.
 */
interface fixInitialRateRangeProps {
  avgMin: number;
  avgMax: number;
}
type fixInitialRateRangeReturnValue = [number, number];

function fixInitialRateRange({
  avgMin,
  avgMax,
}: fixInitialRateRangeProps): fixInitialRateRangeReturnValue {
  let minPayRate = avgMin;
  let maxPayRate = avgMax;

  if (avgMin === 50) {
    minPayRate = avgMin - 1;
  } else if (avgMin === avgMax) {
    maxPayRate = avgMax + 1;
  }
  return [minPayRate, maxPayRate];
}

export interface ReducedWages {
  avgMin: number;
  avgMax: number;
  legalMin: number;
  avg: number;
}
export function reduceWages(
  existingState: {
    rate?: { minimum?: number; maximum?: number; average?: number; legalMinimum?: number };
  },
  data?: {
    getJobWages?: {
      averages?: {
        minimum?: { amount?: any };
        maximum?: { amount?: any };
        average?: { amount?: any };
      };
      legalMinimum?: { amount?: any };
    };
  }
): ReducedWages {
  let avgMin = Number(
    data?.getJobWages?.averages?.minimum?.amount ?? existingState.rate?.minimum ?? DEFAULT_AVG_MIN
  );
  let avgMax = Number(
    data?.getJobWages?.averages?.maximum?.amount ?? existingState.rate?.maximum ?? DEFAULT_AVG_MAX
  );
  const avg = Number(
    data?.getJobWages?.averages?.average?.amount ??
      existingState.rate?.average ??
      (DEFAULT_AVG_MAX + DEFAULT_AVG_MIN) / 2
  );
  const legalMin = Number(
    data?.getJobWages?.legalMinimum?.amount ?? existingState.rate?.legalMinimum ?? DEFAULT_LEGAL_MIN
  );
  if (avgMin === avgMax) {
    const [minPayRate, maxPayRate] = fixInitialRateRange({ avgMin, avgMax });
    avgMin = minPayRate;
    avgMax = maxPayRate;
  }
  return { avgMin, avgMax, avg, legalMin };
}
