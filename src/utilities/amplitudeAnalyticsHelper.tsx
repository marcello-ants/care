import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import getVertical from './verticalUtils';

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
 *     vertical: getVertical() // gets vertical from URL
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

export type MemberEnrolledEvent = 'Member Enrolled';
export type JobPostedEvent = 'Job Posted';
export type EnrollmentStep =
  | 'Grade'
  | 'Modes'
  | 'Dates'
  | 'Intent'
  | 'Details'
  | 'Tasks'
  | 'Service type'
  | 'Location'
  | 'Caregiver tasks'
  | 'Age level'
  | 'Email'
  | 'First and Last Name'
  | 'Password'
  | 'day care account creation - name'
  | 'day care account creation - contact'
  | 'SingleEnrollment';

export type JobStep =
  | 'PAJ - Start'
  | 'PAJ - Schedule'
  | 'PAJ - Additional Needs'
  | 'PAJ - Ideal caregiver'
  | 'PAJ - Extra info'
  | 'PAJ - Goals'
  | 'PAJ - Finish';

export type EventType = MemberEnrolledEvent | JobPostedEvent;
export type EventStep = EnrollmentStep | JobStep;

export function logCareEvent(
  type: JobPostedEvent,
  step: JobStep,
  extraData?: Record<string, any>,
  cta?: string,
  isFinal?: boolean,
  flow?: string
): void;
export function logCareEvent(
  type: MemberEnrolledEvent,
  step: EnrollmentStep,
  extraData?: Record<string, any>,
  cta?: string,
  isFinal?: boolean,
  flow?: string
): void;
export function logCareEvent(
  type: EventType,
  step: EventStep,
  extraData: Record<string, any> = {},
  cta: string = 'next',
  isFinal: boolean = false,
  flow: string = 'MW VHP'
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
    default:
      throw new Error(`Invalid event type ${type}`);
  }
  AnalyticsHelper.logEvent({
    name: type,
    data: {
      cta_clicked: cta,
      final_step: isFinal,
      vertical: getVertical(),
      [stepKey]: step,
      [flowKey]: flow,
      ...extraData,
    },
  });
}
