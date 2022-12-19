import { useEffect } from 'react';
import { TealiumData, TealiumUtagService } from '@/utilities/utagHelper';
import { useAppState } from '../AppState';

/**
 * Hook to send Tealium `view` events using `TealiumUtagService`.
 * It automatically populates the following fields from AppState:
 * * `memberId`
 * * `sessionId`
 *
 * Note: the `TealiumUtagService` call is already executed within a `useEffect` block. Using this
 * hook within another `useEffect` call will fail
 *
 * @param {string[]} slots  The slot(s) to use in Tealium
 * @param {object} data  Any additional data that the Tealium event should send
 * @example
 * // Sends a simple Tealium `view` event with the slots `'/us-subscription/conversion/seeker/basic/signup/'` and
 * // `'/us-subscription/conversion/seeker/basic/signup/cj/'`
 * useTealiumTracking([
 *   '/us-subscription/conversion/seeker/basic/signup/',
 *   '/us-subscription/conversion/seeker/basic/signup/cj/',
 * ]);
 * @example
 * // Sends a `SAMPLE_TEALIUM_EVENT` with the slot `'/us-subscription/action/seeker/paj/cc'` and a
 * // `sample_data` field with a value of 10
 * useTealiumTracking([
 *   '/us-subscription/action/seeker/paj/cc'
 * ], {
 *   tealium_event: 'SAMPLE_TEALIUM_EVENT',
 *   sample_data: 10
 * });
 */
export default function useTealiumTracking(slots: string[], data: Record<string, any> = {}) {
  const {
    flow: { memberId, czenJSessionId },
  } = useAppState();
  useEffect(() => {
    const tealiumData: TealiumData = {
      ...(memberId && { memberId }),
      ...data,
      sessionId: czenJSessionId,
      slots,
    };
    TealiumUtagService.view(tealiumData);
  }, []);
}
