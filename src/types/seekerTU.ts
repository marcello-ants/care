import { CARE_DATES } from '@/constants';
import { JobPostData, OptionalReducerData } from './common';

export enum AgeLevel {
  ADULT = 'ADULT',
  COLLEGE = 'COLLEGE',
  HIGH_SCHOOL = 'HIGH_SCHOOL',
  MIDDLE_SCHOOL = 'MIDDLE_SCHOOL',
  ELEMENTARY = 'ELEMENTARY',
}

export enum AgeLevelLabels {
  ADULT = 'Adult',
  COLLEGE = 'College',
  HIGH_SCHOOL = 'High school',
  MIDDLE_SCHOOL = 'Middle school',
  ELEMENTARY = 'Elementary',
}

export enum Subjects {
  ART = 'ART',
  BUSINESS = 'BUSINESS',
  COMPUTERS = 'COMPUTERS',
  DANCE = 'DANCE',
  ENGLISH = 'ENGLISH',
  FOREIGN_LANGUAGE = 'FOREIGN_LANGUAGE',
  MATH = 'MATH',
  MUSIC_AND_DRAMA = 'MUSIC_AND_DRAMA',
  MUSICAL_INSTRUMENTS = 'MUSICAL_INSTRUMENTS',
  SCIENCE = 'SCIENCE',
  SPECIAL_EDUCATION = 'SPECIAL_EDUCATION',
  SPORTS_AND_FITNESS = 'SPORTS_AND_FITNESS',
  TEST_PREP = 'TEST_PREP',
  OTHER = 'OTHER',
}

export const SubjectsLabels: { [key in Subjects]: string } = {
  [Subjects.ART]: 'Art',
  [Subjects.BUSINESS]: 'Business',
  [Subjects.COMPUTERS]: 'Computers',
  [Subjects.DANCE]: 'Dance',
  [Subjects.ENGLISH]: 'English',
  [Subjects.FOREIGN_LANGUAGE]: 'Foreign Language',
  [Subjects.MATH]: 'Math',
  [Subjects.MUSIC_AND_DRAMA]: 'Music & Drama',
  [Subjects.MUSICAL_INSTRUMENTS]: 'Musical Instruments',
  [Subjects.SCIENCE]: 'Science',
  [Subjects.SPECIAL_EDUCATION]: 'Special Education',
  [Subjects.SPORTS_AND_FITNESS]: 'Sports & Fitness',
  [Subjects.TEST_PREP]: 'Test Prep',
  [Subjects.OTHER]: 'Other',
};

export enum Goals {
  BUILD_CONFIDENCE = 'BUILD_CONFIDENCE',
  SUPPORT_FOR_PROBLEM_AREAS = 'SUPPORT_FOR_PROBLEM_AREAS',
  IMPROVE_GRADES = 'IMPROVE_GRADES',
  BOOST_TEST_SCORES = 'BOOST_TEST_SCORES',
  HOMEWORK_HELP = 'HOMEWORK_HELP',
  OTHER = 'OTHER',
}

export const GoalsLabels: { [key in Goals]: string } = {
  [Goals.BUILD_CONFIDENCE]: 'Build confidence',
  [Goals.SUPPORT_FOR_PROBLEM_AREAS]: 'Support for problem areas',
  [Goals.IMPROVE_GRADES]: 'Improve grades',
  [Goals.BOOST_TEST_SCORES]: 'Boost test scores',
  [Goals.HOMEWORK_HELP]: 'Homework help',
  [Goals.OTHER]: 'Other',
};

export const GOALS_OPTIONS = Object.freeze([
  {
    value: Goals.BUILD_CONFIDENCE as string,
    label: GoalsLabels[Goals.BUILD_CONFIDENCE],
  },
  {
    value: Goals.SUPPORT_FOR_PROBLEM_AREAS as string,
    label: GoalsLabels[Goals.SUPPORT_FOR_PROBLEM_AREAS],
  },
  {
    value: Goals.IMPROVE_GRADES as string,
    label: GoalsLabels[Goals.IMPROVE_GRADES],
  },
  {
    value: Goals.BOOST_TEST_SCORES as string,
    label: GoalsLabels[Goals.BOOST_TEST_SCORES],
  },
  {
    value: Goals.HOMEWORK_HELP as string,
    label: GoalsLabels[Goals.HOMEWORK_HELP],
  },
  {
    value: Goals.OTHER as string,
    label: GoalsLabels[Goals.OTHER],
  },
]);

export enum TutoringTypeOptions {
  ONLINE = 'ONLINE',
  IN_PERSON = 'IN_PERSON',
  EITHER = 'EITHER',
}

export enum TutoringTypeOptionsLabels {
  ONLINE = 'Online',
  IN_PERSON = 'In Person',
  EITHER = 'Either',
}

export interface JobPostDataTU extends JobPostData {
  goals: Array<Goals>;
}

export type SeekerTUState = {
  careDate: CARE_DATES;
  ageLevel: AgeLevel;
  selectedSubjects: Array<string>;
  tutoringType: TutoringTypeOptions;
  firstName: string;
  lastName: string;
  jobPost: JobPostDataTU;
  enrollmentSource: string;
};

export type SeekerTUAction =
  | { type: 'setAgeLevel'; ageLevel: AgeLevel; reducer?: OptionalReducerData }
  | { type: 'setTutoringDate'; careDate: CARE_DATES; reducer?: OptionalReducerData }
  | { type: 'setSelectedSubjects'; value: Array<string>; reducer?: OptionalReducerData }
  | { type: 'setTutoringType'; tutoringType: TutoringTypeOptions; reducer?: OptionalReducerData }
  | { type: 'tu_setSeekerName'; firstName: string; lastName: string; reducer?: OptionalReducerData }
  | { type: 'setGoals'; goals: Array<Goals>; reducer?: OptionalReducerData }
  | { type: 'tu_setEnrollmentSource'; value: string; reducer?: OptionalReducerData };
