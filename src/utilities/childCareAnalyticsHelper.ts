import { VERTICALS_NAMES } from '@/constants';
import { AnalyticsHelper } from './analyticsHelper';

export type MemberEnrolledEvent = 'Member Enrolled';
export type JobPostedEvent = 'Job Posted';
export type CTAInteractedEvent = 'CTA Interacted';
export type EnrollmentStep =
  | 'Care Location'
  | 'Care Dates'
  | 'Care Kind'
  | 'Care Details'
  | 'Additional Support'
  | 'Account Creation - Email and Password'
  | 'Account Creation - First and Last name';

export type JobStep =
  | 'PAJ - Start'
  | 'PAJ - Schedule'
  | 'PAJ - Additional Needs'
  | 'PAJ - Ideal caregiver'
  | 'PAJ - Family info'
  | 'PAJ - Finish';

export type ChildCareEventType = MemberEnrolledEvent | JobPostedEvent | CTAInteractedEvent;
export type ChildCareEventStep = EnrollmentStep | JobStep;
/**
 * Posts an Amplitude event with the specified data.
 * Additional fields can be sent using the `extraData` parameter. The fields in that object will be
 * added to the `data` object that will be posted to Amplitude.
 * The minimal data sent is the following:
 * {
 *   name: [type],
 *   data: {
 *     cta_clicked: cta,
 *     final_step: isFinalStep, // default false
 *     vertical: VERTICALS_NAMES.CHILD_CARE, // Constant
 *     [(job|enrollment)_flow]: flow,
 *     [(job|enrollment)_step]: step,
 *   }
 * }
 * @see AnalyticsHelper.logEvent
 * @param type Event type. Currently 'Member Enrolled' or 'Job Posted'
 * @param step Flow step the event was generated in.
 * @param flow Flow name the event was generated in.
 * @param extraData Any additional key-value pairs that should be sent besides the default data
 * @param cta CTA clicked. Defaults to 'next'
 * @param isFinal boolean indicating if this is the flow's last step. Defaults to 'false'
 */
export function logChildCareEvent(
  type: JobPostedEvent | CTAInteractedEvent,
  step: JobStep,
  flow?: string,
  extraData?: Record<string, any>,
  cta?: string,
  isFinal?: boolean
): void;
export function logChildCareEvent(
  type: MemberEnrolledEvent,
  step: EnrollmentStep,
  flow?: string,
  extraData?: Record<string, any>,
  cta?: string,
  isFinal?: boolean
): void;
export function logChildCareEvent(
  type: ChildCareEventType,
  step: ChildCareEventStep,
  flow: string = 'MW VHP',
  extraData: Record<string, any> = {},
  cta: string = 'next',
  isFinal: boolean = false
): void {
  let stepKey;
  let flowKey;
  switch (type) {
    case 'Member Enrolled':
      stepKey = 'enrollment_step';
      flowKey = 'enrollment_flow';
      break;
    case 'Job Posted':
      stepKey = 'job_step';
      flowKey = 'job_flow';
      break;
    case 'CTA Interacted':
      stepKey = 'job_step';
      flowKey = 'job_flow';
      break;
    default:
      throw new Error(`Invalid child care event type ${type}`);
  }
  AnalyticsHelper.logEvent({
    name: type,
    data: {
      cta_clicked: cta,
      final_step: isFinal,
      vertical: VERTICALS_NAMES.CHILD_CARE,
      [stepKey]: step,
      [flowKey]: flow,
      ...extraData,
    },
  });
}
