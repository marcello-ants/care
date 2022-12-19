import { JobPostData, OptionalReducerData } from '@/types/common';
import { CARE_DATES } from '@/constants';

export enum BringOptions {
  SUPPLIES = 'SUPPLIES',
  EQUIPMENT = 'EQUIPMENT',
}
export enum Tasks {
  BATHROOM_CLEANING = 'BATHROOM_CLEANING',
  KITCHEN_CLEANING = 'KITCHEN_CLEANING',
  GENERAL_ROOM_CLEANING = 'GENERAL_ROOM_CLEANING',
  WINDOW_WASHING = 'WINDOW_WASHING',
  CARPET_CLEANING = 'CARPET_CLEANING',
  FURNITURE_TREATMENT = 'FURNITURE_TREATMENT',
  LAUNDRY = 'LAUNDRY',
}

export const BringOptionsLabels: { [key in BringOptions]: string } = {
  [BringOptions.SUPPLIES]: 'Supplies',
  [BringOptions.EQUIPMENT]: 'Equipment',
};

export const BRING_OPTIONS = Object.freeze([
  {
    value: BringOptions.SUPPLIES,
    label: BringOptionsLabels[BringOptions.SUPPLIES],
  },
  {
    value: BringOptions.EQUIPMENT,
    label: BringOptionsLabels[BringOptions.EQUIPMENT],
  },
]);

export const TasksLabels: { [key in Tasks]: string } = {
  [Tasks.BATHROOM_CLEANING]: 'Bathroom cleaning',
  [Tasks.KITCHEN_CLEANING]: 'Kitchen cleaning',
  [Tasks.GENERAL_ROOM_CLEANING]: 'General room cleaning',
  [Tasks.WINDOW_WASHING]: 'Window washing',
  [Tasks.CARPET_CLEANING]: 'Carpet shampooing',
  [Tasks.FURNITURE_TREATMENT]: 'Furniture treatment',
  [Tasks.LAUNDRY]: 'Laundry',
};

export const TASKS_OPTIONS = Object.freeze([
  {
    value: Tasks.BATHROOM_CLEANING as string,
    label: TasksLabels[Tasks.BATHROOM_CLEANING],
  },
  {
    value: Tasks.KITCHEN_CLEANING as string,
    label: TasksLabels[Tasks.KITCHEN_CLEANING],
  },
  {
    value: Tasks.GENERAL_ROOM_CLEANING as string,
    label: TasksLabels[Tasks.GENERAL_ROOM_CLEANING],
  },
  {
    value: Tasks.WINDOW_WASHING as string,
    label: TasksLabels[Tasks.WINDOW_WASHING],
  },
  {
    value: Tasks.CARPET_CLEANING as string,
    label: TasksLabels[Tasks.CARPET_CLEANING],
  },
  {
    value: Tasks.FURNITURE_TREATMENT as string,
    label: TasksLabels[Tasks.FURNITURE_TREATMENT],
  },
  {
    value: Tasks.LAUNDRY as string,
    label: TasksLabels[Tasks.LAUNDRY],
  },
]);

export type SeekerHKAction =
  | {
      type: 'setHousekeepingDate';
      careDate: CARE_DATES;
      reducer?: OptionalReducerData;
    }
  | { type: 'setBathrooms'; bathroomsNum: number; reducer?: OptionalReducerData }
  | { type: 'setBedrooms'; bedroomsNum: number; reducer?: OptionalReducerData }
  | { type: 'setBringOptions'; bringOptions: BringOptions[]; reducer?: OptionalReducerData }
  | { type: 'setTasks'; tasks: Tasks[]; reducer?: OptionalReducerData }
  | {
      type: 'hk_setSeekerName';
      firstName: string;
      lastName: string;
      reducer?: OptionalReducerData;
    }
  | { type: 'hk_setEnrollmentSource'; value: string; reducer?: OptionalReducerData };

export type SeekerHKState = {
  careDate: CARE_DATES;
  jobPost: JobPostData;
  enrollmentSource: string;
  tasks: Tasks[];
  firstName: string;
  lastName: string;
  bathrooms: number;
  bedrooms: number;
  bringOptions: BringOptions[];
};
