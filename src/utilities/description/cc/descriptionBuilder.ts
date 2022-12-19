import { DailySchedule, RecurringSchedule, CCCaregiverAttributes } from '@/types/common';
import * as LITERAL from '../constants';

import { CareKind, DefaultCareKind, NeedHelpWith, SeekerCCState } from '../../../types/seekerCC';
import { childrenNumberAsString } from './titleBuilder';
import { SeekerState } from '../../../types/seeker';

function convertFrom24To12Format(time24: string) {
  // @ts-ignore
  const [sHours, minutes] = time24.match(/([0-9]{1,2}):([0-9]{2})/).slice(1);
  const period = Number(sHours) < 12 ? 'am' : 'pm';
  const hours = Number(sHours) % 12 || 12;
  return minutes === '00' ? `${hours}${period}` : `${hours}:${minutes}${period}`;
}

function camelCase(text: string) {
  return ` ${text}`.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, function replacer(match, chr) {
    return chr.toUpperCase();
  });
}

function buildDaySchedule(day: string, dailySchedule: DailySchedule) {
  // no specific time frames selected for day, and in such case it's not part of description
  if (dailySchedule && dailySchedule.blocks?.length < 1) {
    return null;
  }
  const timeSlots = dailySchedule.blocks.map((timeBlock) => {
    return `${convertFrom24To12Format(timeBlock.start)}-${convertFrom24To12Format(timeBlock.end)}`;
  });
  return `${camelCase(day)}s (${timeSlots.join(LITERAL.COMMA + LITERAL.SPACE)})`;
}

function buildJobScheduleInfo(recurring: RecurringSchedule) {
  if (recurring.schedule) {
    const weekDays = Object.entries(recurring.schedule).map(([day, v]) => ({
      day,
      daySchedule: v,
    }));
    const sortedWeekDays = weekDays.sort(function sortByDay(dayOne, dayTwo) {
      // @ts-ignore
      return LITERAL.DAY_OF_WEEK_SORTER[dayOne.day] - LITERAL.DAY_OF_WEEK_SORTER[dayTwo.day];
    });

    return sortedWeekDays
      .map((schedule) => {
        // @ts-ignore
        return buildDaySchedule(schedule.day, schedule.daySchedule);
      })
      .filter((scheduleDescription) => Boolean(scheduleDescription))
      .join(LITERAL.COMMA + LITERAL.SPACE);
  }
  return LITERAL.EMPTY;
}

function buildScheduleDescription(ccState: SeekerCCState) {
  let scheduleStr = '';

  const { jobPost } = ccState;
  const recurringSchedule = jobPost.recurring;

  if (recurringSchedule && recurringSchedule.schedule) {
    const recurringScheduleStr = buildJobScheduleInfo(recurringSchedule);
    if (recurringScheduleStr && recurringScheduleStr.length > 0) {
      scheduleStr = `${LITERAL.SCHEDULE_INTRO} ${recurringScheduleStr}.`;
    }
  }

  if (recurringSchedule && recurringSchedule.flexibleStartDate) {
    scheduleStr =
      scheduleStr?.length > 0
        ? `${scheduleStr} ${LITERAL.FLEXIBLE_START_DATE}`
        : LITERAL.FLEXIBLE_START_DATE;
  }
  if (jobPost.scheduleMayVary) {
    scheduleStr =
      scheduleStr?.length > 0
        ? `${scheduleStr} ${LITERAL.VARYING_SCHEDUE}`
        : LITERAL.VARYING_SCHEDUE;
  }
  return scheduleStr;
}

function resolveCaregiver(caregiverType: CareKind) {
  switch (caregiverType) {
    case DefaultCareKind.NANNIES_RECURRING_BABYSITTERS:
      return LITERAL.NANNY;
    case DefaultCareKind.ONE_TIME_BABYSITTERS:
      return LITERAL.BABYSITTER;
    default:
      return LITERAL.EMPTY;
  }
}

// Check if Seeker put dot at the end of sentence and if not - add it.
function applyOptionalDot(text: string) {
  return text.slice(-1) === LITERAL.DOT ? text : `${text}.`;
}

function buildHomeworkAndStructuringServices(activities: Array<string> = []) {
  const services = activities
    .map((activity) => {
      switch (activity) {
        case NeedHelpWith.STRUCTURED_ACTIVITIES:
          return LITERAL.HOMEWORK_HELP;
        case NeedHelpWith.HOMEWORK_HELP:
          return LITERAL.STRUCTURING_ACTIVITIES;
        default:
          return null;
      }
    })
    .flatMap((f) => (typeof f === 'string' ? [f] : []));

  if (services.length > 0) {
    return `${LITERAL.WE_COULD_USE_HELP_WITH} ${services.join(' and ')}.`;
  }
  return null;
}

function buildServicesDescription(
  services: Array<string> = [],
  activities: Array<string> = [],
  longVersion: boolean
) {
  const serviceDescriptions = activities
    .concat(services)
    .map((attribute) => {
      switch (attribute) {
        case CCCaregiverAttributes.COMFORTABLE_WITH_PETS:
          return longVersion ? LITERAL.COMFORTABLE_WITH_PETS_LONG : LITERAL.COMFORTABLE_WITH_PETS;
        case NeedHelpWith.LIGHT_HOUSEKEEPING:
          return longVersion ? LITERAL.LIGHT_HOUSEKEEPING_LONG : LITERAL.LIGHT_HOUSEKEEPING;
        case CCCaregiverAttributes.OWN_TRANSPORTATION:
          return longVersion ? LITERAL.OWN_CAR_LONG : LITERAL.OWN_CAR;
        case CCCaregiverAttributes.DOES_NOT_SMOKE:
          if (!longVersion) {
            return LITERAL.NON_SMOKER;
          }
          return null;
        default:
          return null;
      }
    })
    .flatMap((f) => (typeof f === 'string' ? [f] : []));

  if (serviceDescriptions.length > 0) {
    return longVersion
      ? serviceDescriptions.join(LITERAL.SPACE)
      : `${LITERAL.SERVICES_INTRO} ${serviceDescriptions.join(LITERAL.COMMA + LITERAL.SPACE)}.`;
  }
  return null;
}

function buildPersonalityContent(personalityCustomContent: string) {
  if (!personalityCustomContent || personalityCustomContent.length < 1) {
    return null;
  }
  return `${LITERAL.IDEA_CAREGIVER} ${applyOptionalDot(personalityCustomContent)}`;
}

function buildDescription(ccState: SeekerCCState, seekerState: SeekerState) {
  const job = ccState.jobPost;

  // intro
  let description = `We need a ${resolveCaregiver(
    ccState.careKind
  )} for our ${childrenNumberAsString(ccState.careChildren.length)} in ${seekerState.city}.`;

  // replace auto intro with custom family description
  const hasCustomDescription: boolean =
    job.jobDescription !== undefined && job.jobDescription.length > 0;
  if (hasCustomDescription) {
    description = applyOptionalDot(job.jobDescription);
  }

  // ideal caregiver
  const personality = buildPersonalityContent(job.personalityCustomContentTwo);
  if (personality) {
    description = `${description} ${personality}`;
  }

  // services description
  const servicesDescription = buildServicesDescription(
    job.cargiverAttributes,
    job.needHelpWith,
    !hasCustomDescription
  );
  if (servicesDescription) {
    description = `${description} ${servicesDescription}`;
  }

  // structuring services
  const structuring = buildHomeworkAndStructuringServices(job.needHelpWith);
  if (structuring) {
    description = `${description} ${structuring}`;
  }

  // add info that seeker is expecting child
  if (ccState.careExpecting) {
    description = `${description} ${LITERAL.EXPECTING}`;
  }

  // schedule info
  const scheduleDescription = buildScheduleDescription(ccState);
  if (scheduleDescription?.length > 0) {
    description = `${description} ${scheduleDescription}`;
  }

  return description;
}

export default buildDescription;
