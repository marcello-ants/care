// @ts-nocheck
import dayjs from 'dayjs';
import Timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { v4 as uuidv4 } from 'uuid';
import buildDescription from '@/utilities/description/cc/descriptionBuilder';
import { buildTitle } from '@/utilities/description/cc/titleBuilder';
import getAnimalTypes from '@/utilities/description/pc/helpers';
import { convertDOBToAgeRange } from '@/utilities/dobHelper';
import {
  SeekerState,
  JobPostSeekerState,
  SeniorCareRecipientCondition,
  serviceDescriptionMapping,
} from '@/types/seeker';
import { SeekerPCState } from '@/types/seekerPC';
import {
  SeekerCCState,
  IdealCaregiver,
  Child,
  ChildDOB,
  DayCareFrequencyOptions,
} from '@/types/seekerCC';
import {
  DayOfWeek,
  Intent,
  PartsOfDay,
  WeeklySchedule,
  Recurring,
  JobTypes,
  JobSchedule,
  JobPostData,
  DateTimeBlock,
} from '@/types/common';
import { ProviderState } from '@/types/provider';
import { ProviderCCState } from '@/types/providerCC';
import {
  DayCareAttendingDays,
  SeniorCareProviderAvailabilityUpdateInput,
  SeniorCareRecipientRelationshipType,
  SeniorCommunityType,
} from '@/__generated__/globalTypes';
import { BringOptions, SeekerHKState } from '@/types/seekerHK';
import { SeekerTUState } from '@/types/seekerTU';
import { mapChildrenDoB } from './account-creation-utils';
import {
  isMemoryCareNeeded,
  recommendedSeniorCareCommunityType,
} from './senior-care-facility-utility';

dayjs.extend(Timezone);
dayjs.extend(utc);

export function getDateFromIntent(intent: Intent | undefined, todayLocalTZ: dayjs.Dayjs) {
  const todayEST = todayLocalTZ.tz('America/New_York');
  const processedIntent = intent ?? 'UNDECIDED';
  switch (processedIntent) {
    case 'WEEK':
      return todayLocalTZ.add(7, 'day').format('YYYY-MM-DD');
    case 'MONTH':
      return todayLocalTZ.add(1, 'month').format('YYYY-MM-DD');
    case 'NOW':
    case 'UNDECIDED':
    default:
      // If it is 9pm or later EST we want to push to the next day
      return todayEST.add(3, 'hour').format('YYYY-MM-DD');
  }
}

export function constructBlocksFromCareTimes(careTimes: PartsOfDay) {
  const blocks = [];

  if (careTimes.morning && careTimes.afternoon && careTimes.evening && careTimes.overnight) {
    blocks.push({ start: '00:00', end: '24:00' });
  } else {
    // flip order to get desired result
    if (careTimes.overnight) {
      blocks.push({ start: '00:00', end: '06:00' });
    }
    if (careTimes.morning) {
      blocks.push({ start: '06:00', end: '12:00' });
    }
    if (careTimes.afternoon) {
      blocks.push({ start: '12:00', end: '18:00' });
    }
    if (careTimes.evening) {
      blocks.push({ start: '18:00', end: '24:00' });
    }
  }

  return { blocks };
}

function prepareWeeklySchedule(weeklySchedule: WeeklySchedule, careTimes: PartsOfDay) {
  const scheduleBlocks = constructBlocksFromCareTimes(careTimes);
  if (scheduleBlocks.blocks.length > 0) {
    // if days are selected, pre-populate the blocks with times mapped to parts of day
    const selectedDays = Object.keys(weeklySchedule) as DayOfWeek[];
    const scheduleFromCareTimes: WeeklySchedule = {};
    selectedDays.forEach((day) => {
      scheduleFromCareTimes[day] = scheduleBlocks;
    });
    return scheduleFromCareTimes;
  }

  return weeklySchedule;
}

function prepareSafeOneTimeSchedule(schedule: DateTimeBlock): DateTimeBlock {
  return {
    ...schedule,
    end: { ...schedule.end, date: schedule.end.date || schedule.start.date },
  };
}

function replaceSmartPunctuation(text: string) {
  return (
    text
      // replace left & right single quotes with '
      .replace(/[\u2018\u2019]/g, "'")
      // replace left & right double quotes with "
      .replace(/[\u201C\u201D]/g, '"')
      // replace en dashes with "-"
      .replace(/\u2013/g, '-')
      // replace em dashes with "--"
      .replace(/\u2014/g, '--')
      // replace … with "..."
      .replace(/\u2026/g, '...')
  );
}

export function generateDescription(
  lovedOneDetails: string | undefined,
  caregiverDetails: string | undefined,
  servicesNeeded: string[] | undefined,
  caregiverGender: string | null
) {
  let freeFormTextSupplied = false;

  let description = '';
  if (lovedOneDetails && lovedOneDetails.length > 15) {
    freeFormTextSupplied = true;
    description += `About who needs care: ${replaceSmartPunctuation(lovedOneDetails)}\n\n`;
  }

  if (caregiverDetails && caregiverDetails.length > 15) {
    freeFormTextSupplied = true;
    description += `About the care needs: ${replaceSmartPunctuation(caregiverDetails)}\n\n`;
  }

  if (servicesNeeded && servicesNeeded.length > 0) {
    const descriptions = servicesNeeded
      .map((service) => serviceDescriptionMapping[service])
      .filter(Boolean);
    const serviceDescription = [
      descriptions.slice(0, -1).join(', '),
      descriptions.slice(-1)[0],
    ].join(descriptions.length < 2 ? '' : ', and ');
    description += `Services needed include: ${serviceDescription}.\n\n`;
  }

  if (caregiverGender) {
    const gender = caregiverGender === 'FEMALE' ? 'female' : 'male';
    description += `Preference for a caregiver who is ${gender}.\n`;
  }
  return [description, freeFormTextSupplied];
}

export function generateJobCreateInput(state: JobPostSeekerState) {
  const [description, freeFormTextSupplied] = generateDescription(
    state.lovedOne.details,
    state.idealCaregiver.details,
    state.servicesNeeded,
    state.idealCaregiver.gender
  );

  const jobCreateInput = {
    caregiverType: state.typeOfCare,
    zipcode: state.zip,
    careRecipients: [
      {
        relationship: state.lovedOne.whoNeedsCare,
        gender: state.lovedOne.gender,
        ageRange: state.lovedOne.age,
      },
    ],
    servicesNeeded: state.servicesNeeded,
    rate: {
      minimum: {
        amount: state.rate.minimum,
        currencyCode: 'USD',
      },
      maximum: {
        amount: state.rate.maximum,
        currencyCode: 'USD',
      },
    },
    source: 'ENROLLMENT',
    description: freeFormTextSupplied ? description : undefined,
  };

  if (state.careFrequency === 'onetime') {
    return { ...jobCreateInput, schedule: prepareSafeOneTimeSchedule(state.oneTime.schedule) };
  }
  if (state.recurring) {
    return {
      ...jobCreateInput,
      scheduleMayVary: state.recurring.scheduleMayVary,
      schedule: prepareWeeklySchedule(state.recurring.schedule, state.recurring.careTimes),
      startDate: getDateFromIntent(state.intent, dayjs()),
    };
  }
  return null;
}

function formatCaregiverQualities(idealCaregiverQualities: Array<string>): Array<string> {
  const formatedData: Array<string> = [];
  if (idealCaregiverQualities.includes(IdealCaregiver.PATIENT)) {
    formatedData.push(IdealCaregiver.PATIENT);
  }
  if (idealCaregiverQualities.includes(IdealCaregiver.ENERGETIC)) {
    formatedData.push(IdealCaregiver.ENERGETIC);
  }

  return formatedData;
}

export function constructChildren(careChildren: Child[], careChildrenDOB: ChildDOB[]) {
  const children: Child[] = [];
  careChildren.forEach((c: Child) => {
    children.push({
      gender: c.gender,
      ageRange: c.ageRange,
    });
  });
  for (let i = 0; i < careChildrenDOB.length; i += 1) {
    const dob = careChildrenDOB[i];

    const child = {
      id: uuidv4(),
      ageRange: convertDOBToAgeRange(dob ?? null),
      approximateDoB: dob,
    };

    if (i < children.length) {
      children[i] = {
        ...children[i],
        ...child,
      };
    } else {
      children.push({
        ...children[i],
        ...child,
      });
    }
  }

  return children;
}

const generateRequestData = (
  jobPost: JobPostData,
  jobDateTime: JobSchedule,
  requestInput: any,
  seekerState: SeekerState
) => {
  const { zipcode } = seekerState;
  const generalPart = {
    description: jobPost.jobDescription || '',
    title: '',
    rate: {
      minimum: {
        amount: jobPost.rate.minimum,
        currencyCode: 'USD',
      },
      maximum: {
        amount: jobPost.rate.maximum,
        currencyCode: 'USD',
      },
    },
    scheduleMayVary: jobPost.scheduleMayVary,
    zipcode,
    source: 'ENROLLMENT',
  };

  const requestData = { ...generalPart, ...requestInput };

  if (jobPost.jobType === 'onetime') {
    return {
      ...requestData,
      schedule: {
        start: {
          date: jobDateTime.dates.startDate,
          time: jobDateTime.time.startTime,
        },
        end: {
          date: jobDateTime.dates.endDate || jobDateTime.dates.startDate,
          time: jobDateTime.time.endTime,
        },
      },
    };
  }
  if (jobPost.jobType === 'recurring') {
    return {
      ...requestData,
      schedule: prepareWeeklySchedule(jobPost.recurring.schedule, jobPost.recurring.careTimes),
      startDate: jobDateTime.dates.startDate,
      endDate: jobDateTime.dates.endDate,
    };
  }
  return null;
};

export function generateChildCareJobCreateInput(
  seekerCCState: SeekerCCState,
  seekerState: SeekerState
) {
  const { jobPost } = seekerCCState;
  const { jobDateTime } = jobPost;

  const jobCreateInput = {
    description: buildDescription(seekerCCState, seekerState),
    title: buildTitle(seekerCCState.careKind, seekerCCState.careChildren.length, seekerState.city),
    careRecipients: constructChildren(seekerCCState.careChildren, seekerCCState.careChildrenDOB),
    characteristics: formatCaregiverQualities(jobPost.idealCaregiverQualities),
    qualities: jobPost.cargiverAttributes,
    servicesNeeded: jobPost.needHelpWith,
  };

  return generateRequestData(jobPost, jobDateTime, jobCreateInput, seekerState);
}

export function generateHousekeepingJobCreateInput(
  seekerHKState: SeekerHKState,
  seekerState: SeekerState
) {
  const { jobPost, bedrooms, bathrooms, bringOptions, tasks } = seekerHKState;
  const { jobDateTime } = jobPost;

  const jobCreateInput = {
    flexibleStart: jobPost.recurring.flexibleStartDate,
    houseDetails: {
      numberOfBedrooms: bedrooms,
      numberOfBathrooms: bathrooms,
    },
    provideOwnSupplies: bringOptions.includes(BringOptions.SUPPLIES),
    provideOwnEquipments: bringOptions.includes(BringOptions.EQUIPMENT),
    services: tasks,
  };

  return generateRequestData(jobPost, jobDateTime, jobCreateInput, seekerState);
}

export function generatePetCareJobCreateInput(
  seekerPCState: SeekerPCState,
  seekerState: SeekerState
) {
  const { jobPost } = seekerPCState;
  const { jobDateTime } = jobPost;
  const jobCreateInput = {
    flexibleStart: jobPost.recurring.flexibleStartDate,
    animalTypes: getAnimalTypes(seekerPCState.pets),
    additionalServices: seekerPCState.additionalServices,
    qualities: jobPost.cargiverAttributes,
    serviceType: seekerPCState.serviceType,
  };

  return generateRequestData(jobPost, jobDateTime, jobCreateInput, seekerState);
}

export function generateTutoringJobCreateInput(
  seekerTUState: SeekerTUState,
  seekerState: SeekerState
) {
  const { jobPost } = seekerTUState;
  const { jobDateTime } = jobPost;

  const jobCreateInput = {
    flexibleStart: jobPost.recurring.flexibleStartDate,
    subjects: seekerTUState.selectedSubjects,
    serviceType: 'TUTORING',
    educationLevel: seekerTUState.ageLevel,
    mode: seekerTUState.tutoringType,
    goals: jobPost.goals,
  };

  return generateRequestData(jobPost, jobDateTime, jobCreateInput, seekerState);
}

type SchedulingLimitKey = 'recurringLimits' | 'oneTimeLimits' | 'liveInLimits';
type JobTypeMapping = {
  [key in JobTypes]: SchedulingLimitKey;
};

const jobTypeMapping: JobTypeMapping = {
  recurring: 'recurringLimits',
  onetime: 'oneTimeLimits',
  livein: 'liveInLimits',
};

export function generateProviderAvailabilityUpdateInput(
  providerState: ProviderState | ProviderCCState,
  recurring?: Recurring
) {
  const recurringInfo = recurring || providerState.recurring;
  const input: SeniorCareProviderAvailabilityUpdateInput = {
    startDate: recurringInfo.start,
    endDate: recurringInfo.end,
    schedule: prepareWeeklySchedule(recurringInfo.schedule, recurringInfo.careTimes),
  };

  providerState.jobTypes.forEach((jobType) => {
    const hours = providerState.jobTypesSchedules[jobType as JobTypes];
    input[jobTypeMapping[jobType as JobTypes]] = {
      minimumHours: hours?.min ? Number(hours.min) : 0,
      maximumHours: hours?.max ? Number(hours.max) : undefined,
    };
  });

  return input;
}

export function formatCareRecipientInfo({ whoNeedsCare, whoNeedsCareAge, condition, helpTypes }) {
  const careRecipientInfo = {};
  const memoryCareNeeded = isMemoryCareNeeded(helpTypes);
  const hasCareRecipientInfo = whoNeedsCareAge || whoNeedsCare || (memoryCareNeeded && condition);
  if (hasCareRecipientInfo) {
    if (whoNeedsCareAge) careRecipientInfo.ageRange = whoNeedsCareAge;

    if (whoNeedsCare) {
      careRecipientInfo.relationship = whoNeedsCare;
    } else {
      careRecipientInfo.relationship = SeniorCareRecipientRelationshipType.OTHER;
    }

    if (memoryCareNeeded || !(condition === SeniorCareRecipientCondition.NOT_SURE)) {
      careRecipientInfo.facilityType = recommendedSeniorCareCommunityType(condition, helpTypes);
    } else {
      careRecipientInfo.facilityType = SeniorCommunityType.ASSISTED_LIVING;
    }
  }

  return careRecipientInfo;
}

export function generateCCDayCareLead(seekerState, seekerCCstate) {
  const { dayCare, phoneNumber } = seekerCCstate;
  const { zipcode, city, state, maxDistanceFromSeekerDayCare } = seekerState;
  const childrenDoB = mapChildrenDoB(dayCare.childrenDateOfBirth);
  const attendingDays: DayCareAttendingDays = {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
  };

  if (dayCare.careFrequency.careType === DayCareFrequencyOptions.PART_TIME) {
    Object.keys(attendingDays).forEach((day) => {
      if (!dayCare.careFrequency.specifcDays.includes(day as keyof DayCareAttendingDays)) {
        attendingDays[day as keyof DayCareAttendingDays] = false;
      }
    });
  }

  return {
    zipcode,
    city,
    stateCode: state,
    distance: {
      value: maxDistanceFromSeekerDayCare.distance,
      unit: maxDistanceFromSeekerDayCare.unit,
    },
    attendingDays,
    primaryPhone: phoneNumber,
    childCareExpectations: dayCare.additionalInformation,
    startMonth: dayCare.startMonth,
    timeOfDay: dayCare.dayTime,
    childrenDoB,
    // maxDayCareCenters should be 7 as default for CZEN
    maxDayCareCenters: 7,
    source: 'ENROLLMENT',
  };
}

export function generateIbChildrenDOB(children) {
  return children.map((DOB) => {
    return {
      dateOfBirth: dayjs(DOB).format('YYYY-MM-DD'),
      childURI: uuidv4(),
    };
  });
}
