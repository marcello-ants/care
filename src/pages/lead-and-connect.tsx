import { Button } from '@material-ui/core';
import React from 'react';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import { useAppDispatch } from '@/components/AppState';
import { helpTypesToServices } from '@/types/seeker';
import { SENIOR_CARE_TYPE, SeniorCareRecipientRelationshipType } from '@/__generated__/globalTypes';
import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/client';
import {
  SEEKER_LEAD_CONNECT_ROUTES,
  NUMBER_OF_LEAD_CONNECT_RESULTS,
  CLIENT_FEATURE_FLAGS,
} from '@/constants';

/* istanbul ignore next */
const generateCaregiverData = (
  avgReviewRating: number,
  numberOfReviews: number,
  yearsOfExperience: number,
  hasCareCheck: boolean,
  responseTime: number,
  city: string,
  state: string,
  firstName: string,
  displayName: string,
  id: string,
  imageURL: string,
  legacyId: string,
  bio: string,
  services: string[],
  minPay: string,
  maxPay: string,
  qualities: string[],
  distanceFromZip: number,
  signUpDate: string | null
) => {
  const displayNameParts = displayName.split(' ');
  return {
    __typename: 'TopCaregiver',
    caregiver: {
      __typename: 'Caregiver',
      avgReviewRating,
      numberOfReviews,
      yearsOfExperience,
      hasCareCheck,
      responseTime,
      member: {
        __typename: 'Member',
        address: {
          __typename: 'Address',
          city,
          state,
        },
        displayName,
        firstName,
        id,
        imageURL,
        legacyId,
      },
      profiles: {
        __typename: 'CaregiverProfiles',
        commonCaregiverProfile: {
          __typename: 'CommonCaregiverProfile',
          id: 'id',
        },
        childCareCaregiverProfile: {
          __typename: 'ChildCareCaregiverProfile',
          bio: {
            __typename: 'Bio',
            experienceSummary: 'summary',
          },
          qualities: {
            __typename: 'ChildCareProviderQualities',
            certifiedNursingAssistant: true,
            certifiedRegisterNurse: true,
            certifiedTeacher: true,
            childDevelopmentAssociate: true,
            comfortableWithPets: true,
            cprTrained: true,
            crn: true,
            doesNotSmoke: true,
            doula: true,
            earlyChildDevelopmentCoursework: true,
            earlyChildhoodEducation: true,
            firstAidTraining: true,
            nafccCertified: true,
            ownTransportation: true,
            specialNeedsCare: true,
            trustlineCertifiedCalifornia: true,
          },
          supportedServices: {
            __typename: 'ChildCareCaregiverServices',
            carpooling: true,
            craftAssistance: true,
            errands: true,
            groceryShopping: true,
            laundryAssistance: true,
            lightHousekeeping: true,
            mealPreparation: true,
            swimmingSupervision: true,
            travel: true,
          },
          payRange: {
            __typename: 'PayRange',
            hourlyRateFrom: {
              __typename: 'Money',
              amount: '15',
              currencyCode: true,
            },
            hourlyRateTo: {
              __typename: 'Money',
              amount: '30',
              currencyCode: true,
            },
          },
        },
      },
      seniorCareProviderProfile: {
        __typename: 'SeniorCareProviderProfile',
        bio,
        services,
        payRange: {
          __typename: 'PayRange',
          hourlyRateFrom: {
            __typename: 'Money',
            amount: minPay,
            currencyCode: 'USD',
          },
          hourlyRateTo: {
            __typename: 'Money',
            amount: maxPay,
            currencyCode: 'USD',
          },
        },
        qualities,
      },
      profileURL: `/p/${displayNameParts[displayNameParts.length - 2]}${
        Math.floor(Math.random() * 300) + 1
      }/sc`,
      signUpDate,
    },
    distanceFromRequestZip: {
      __typename: 'PreciseDistance',
      unit: 'MILES',
      value: distanceFromZip,
    },
  };
};

/* istanbul ignore next */
const TOP_CAREGIVER_MOCK = [
  /* istanbul ignore next */
  generateCaregiverData(
    5,
    7,
    10,
    true,
    7,
    'Round Rock',
    'TX',
    'JOSEPH',
    'JOSEPH D.',
    '5ab5369f-210c-434f-9499-7c5735b304e8',
    'http://www.gravatar.com/avatar/205e460b479e2e5b48af710c08d501?f=y&d=robohash',
    '38003002',
    "My passion for the elderly stems from caring for my parents during their time with Parkinson's and Alzheimer's.",
    ['ERRANDS', 'PERSONAL_CARE', 'BATHING'],
    '25',
    '40',
    [
      'OWN_TRANSPORTATION',
      'DOES_NOT_SMOKE',
      'COMFORTABLE_WITH_PETS',
      'ALZHEIMERS_OR_DEMENTIA_EXPERIENCE',
    ],
    5.18,
    '2021-03-17T11:48:00.000Z'
  ),
  /* istanbul ignore next */
  generateCaregiverData(
    0,
    0,
    3,
    true,
    23,
    'Pflugerville',
    'TX',
    'Sabrina',
    'Sabrina R.',
    'bdde7835-476f-4a42-a1f5-ae72a520089f',
    'http://www.gravatar.com/avatar/205e460b479e2e5b48aec4f710c08d501?f=y&d=robohash',
    '45954487',
    "Hi, I'm Sabrina I'm mother of two lovely young boys. I'm actually working as caregiver and babysitter as well. I love to help families and be able to improve the quality life for your love ones. Your family and you will be good care with me.",
    ['LIGHT_HOUSECLEANING', 'MEAL_PREPARATION', 'BATHING'],
    '12',
    '15',
    [
      'OWN_TRANSPORTATION',
      'DOES_NOT_SMOKE',
      'COMFORTABLE_WITH_PETS',
      'CERTIFIED_NURSING_ASSISTANT',
      'ALZHEIMERS_OR_DEMENTIA_EXPERIENCE',
    ],
    7.59,
    '2020-05-17T11:48:00.000Z'
  ),
  /* istanbul ignore next */
  generateCaregiverData(
    0,
    0,
    10,
    true,
    31,
    'Round Rock',
    'TX',
    'Kelley',
    'Kelley B.',
    '2fbdd71c-dbdb-477e-968c-a15999d347a3',
    'http://www.gravatar.com/avatar/205e460b479e2e5b48ac4f710c08d501?f=y&d=robohash',
    '18499048',
    "I am a highly skilled, responsible, professional caregiver with 20 years experience as a Certified Nursing Assistant and Certified Home Health Aide. I have cared for patients suffering from Alzheimer's/dementia, Stroke, COPD, Heart Disease, Parkinson's disease, and diabetes. I am skilled at bedside care including palliative, end-of-life and hospice care. I greatly enjoy working with the elderly and believe my passion and caring coupled with my vast experience will prove to be an asset to your family in the care of your loved one. I am available days, nights and weekends and can customize my schedule to meet your needs.",
    [
      'LIVE_IN_HOME_CARE',
      'TRANSPORTATION',
      'ERRANDS',
      'PERSONAL_CARE',
      'LIGHT_HOUSECLEANING',
      'MEAL_PREPARATION',
      'BATHING',
    ],
    '15',
    '20',
    [
      'OWN_TRANSPORTATION',
      'DOES_NOT_SMOKE',
      'COMFORTABLE_WITH_PETS',
      'CERTIFIED_NURSING_ASSISTANT',
      'HOME_HEALTH_AIDE_EXPERIENCE',
      'HOSPICE_EXPERIENCE',
      'ALZHEIMERS_OR_DEMENTIA_EXPERIENCE',
    ],
    3.42,
    null
  ),
  /* istanbul ignore next */
  generateCaregiverData(
    4,
    5,
    10,
    true,
    18,
    'Pflugerville',
    'TX',
    'Lorinda',
    'Lorinda A.',
    'fbddcd56-4932-4415-857c-48e5e85ffa4d',
    'http://www.gravatar.com/avatar/205e460b479e2e5b48a4f710c08d501?f=y&d=robohash',
    '1128815',
    "Hello, I offer 20+ years as a dependable and honest professional caregiver, with multiple client experience's with woman, men and children of all ages.\nAdapting easily to my client and their every day living environment. A self motivator, a thinker and a hard worker. My personality is compassionate, selfless, warm, loving, fun and understanding. Long term with my client is preferred . Short term is fine as well. CNA certified. First Aid and CPR. Safety and infection control are a top priority for me. \nMy passion as a caregiver started with my grandmother in 1985. \nShe was diagnosed with Alzheimer's. \nExperience with terminally ill, Alzheimer's, dementia, COPD, congested heart failure, diabetics, paraplegic, quadriplegic are just a few of my past clients. A wide range of skills, bathing, hoyer lift, slide boards, meal preparation, feeding, medication reminder, light housekeeping, feed tube experience bathroom assistance are among the many skills I offer.",
    ['PERSONAL_CARE', 'BATHING'],
    '15',
    '25',
    [
      'OWN_TRANSPORTATION',
      'DOES_NOT_SMOKE',
      'COMFORTABLE_WITH_PETS',
      'CERTIFIED_NURSING_ASSISTANT',
      'HOME_HEALTH_AIDE_EXPERIENCE',
      'ALZHEIMERS_OR_DEMENTIA_EXPERIENCE',
    ],
    7.59,
    '2020-12-17T11:48:00.000Z'
  ),
  /* istanbul ignore next */
  generateCaregiverData(
    0,
    0,
    5,
    true,
    5,
    'Round Rock',
    'TX',
    'Cindy',
    'Cindy V.',
    '1b35a956-1310-4183-8329-808d123f37c1',
    'http://www.gravatar.com/avatar/205e460b479e2e5b48af10c8d501?f=y&d=robohash',
    '32721806',
    "I enjoy working with seniors as they have so much to share and you can learn so much for them. I spent a lot of time with my grandparents and loved and cherished every moment. I also worked with a man in North Chicago with dementia. I worked 3 years here in Round Rock with an older lady helping with medication, some cleaning, going for walks, taking her on errands and spending time with her and help with what is needed. I know with out our elders we would not be around today. I have both my parents in nursing homes and my mom struggles with alzheimer's. I would take care of your loved one like she is my parent and communicate and be as helpful as I can be for them.",
    ['PERSONAL_CARE'],
    '15',
    '25',
    [
      'OWN_TRANSPORTATION',
      'DOES_NOT_SMOKE',
      'COMFORTABLE_WITH_PETS',
      'ALZHEIMERS_OR_DEMENTIA_EXPERIENCE',
    ],
    0,
    '2021-06-17T11:48:00.000Z'
  ),
  /* istanbul ignore next */
  generateCaregiverData(
    0,
    0,
    10,
    true,
    14,
    'Austin',
    'TX',
    'Sharon',
    'Sharon E.',
    'bd3b7996-2984-494d-8203-5b63fb941048',
    'http://www.gravatar.com/avatar/205e460b479e2e5b4af10c8d501?f=y&d=robohash',
    '403772',
    "I have been a care provider for seniors for approximately 1 year on a part-time basis, receiving many referrals from an office of the aging. I have current background clearances as well as local references. My experiences range from companionship, grocery shopping and meal preparation for the coming week, appointments and errands to g-tubes, trachs., medicine administration, dementia and Alzheimer's patients. I am strong, healthy and gentle. Please be aware that I am not a medically trained professional. However, I am kind, caring, patient, compassionate and willing to adapt to and learn new skills.",
    [
      'TRANSPORTATION',
      'ERRANDS',
      'PERSONAL_CARE',
      'LIGHT_HOUSECLEANING',
      'MEAL_PREPARATION',
      'BATHING',
    ],
    '10',
    '15',
    [
      'OWN_TRANSPORTATION',
      'DOES_NOT_SMOKE',
      'COMFORTABLE_WITH_PETS',
      'ALZHEIMERS_OR_DEMENTIA_EXPERIENCE',
    ],
    9.07,
    null
  ),
  /* istanbul ignore next */
  generateCaregiverData(
    4,
    10,
    9,
    true,
    5,
    'Round Rock',
    'TX',
    'Melissa',
    'Melissa A.',
    'ebc98927-bdb3-4e4f-b97a-32be666e7871',
    'http://www.gravatar.com/avatar/205e460b49e2e5b4a10c7d501?f=y&d=robohash',
    '27268817',
    "My name is Melissa, I'm 54, married and live in Round Rock and a member at a church. I have experience working with Dementia, Parkinson's, Alzheimer and MS. \n\nI'm caring, dependable and have a heart for the elderly. I treat them with the utmost love and respect I give my own parents. I'm available 24/7 if an emergency arises. I have a clean background check. I'm, bilingual in English and Spanish, CPR certified and have great references and COVID FREE. Looking for a position, North: Austin Leander, Cedar Park, Jarrell, Georgetown. I'm Highly skilled in:\nInjections - Diabetes \nCompanionship\nHygiene \nToileting\nDispense medication\nMeal preparation\nLeisure outings\nIncontinence care\nPet Care\nFeeding\nBathing\nlaundry \nLight housekeeping \nPlay games\nMedication management \nGrocery shopping/Errands \nWalks/Exercise\n\n\nMy rate is negotiable starting at $15-20 hour. I look forward to meeting with you and your family and hope we are a great fit! \nThank you, \nMelissa",
    ['PERSONAL_CARE', 'BATHING'],
    '15',
    '20',
    [
      'OWN_TRANSPORTATION',
      'DOES_NOT_SMOKE',
      'COMFORTABLE_WITH_PETS',
      'CERTIFIED_NURSING_ASSISTANT',
      'HOME_HEALTH_AIDE_EXPERIENCE',
      'ALZHEIMERS_OR_DEMENTIA_EXPERIENCE',
    ],
    5.18,
    null
  ),
  /* istanbul ignore next */
  generateCaregiverData(
    0,
    0,
    10,
    true,
    3,
    'Pflugerville',
    'TX',
    'Lola',
    'Lola B.',
    '05d676f6-f91d-4916-b905-35f4e095f4fd',
    'http://www.gravatar.com/avatar/205e46049e2e5b4a10c7d501?f=y&d=robohash',
    '47437252',
    "Learn how to make paintings in 2 hours! I'm a Greater Austin, TX artist with featured designs displayed at Texas State University Art Exhibits, as well as County buildings art shows. What else I do? Spanish tutoring available as well! I make your Life easier! Anything on your To Do List I will assist you with which may include: gardening, going for a walk, medication administration, going to community settings and assisting you with additional items as needed. I have 15 yrs of medical related experience. Am completing a Pharmacy Technician externship and will graduate around Spring/Summer 2021. Please consider me for helping to make your Life a Happier one. I always deliver Smiles!",
    ['PERSONAL_CARE', 'BATHING'],
    '15',
    '30',
    ['OWN_TRANSPORTATION', 'DOES_NOT_SMOKE', 'COMFORTABLE_WITH_PETS'],
    7.59,
    null
  ),
  /* istanbul ignore next */
  generateCaregiverData(
    0,
    0,
    10,
    true,
    18,
    'Round Rock',
    'TX',
    'Yolanda',
    'Yolanda N.',
    'd90231ee-9665-4105-8b1c-2d2350f7c4a1',
    'http://www.gravatar.com/avatar/2054649e2e5b4a0c7d501?f=y&d=robohash',
    '32673955',
    "I have worked part-time as a senior caregiver throughout the years since 1997 for individual private care. I also cared for my grandfather who had a history of strokes and heart attacks, early stages of Alzheimer's and diabetes. I have helped fill in for family and friends who had clients that needed additional assistance when they were not available to work. I can administer medications, help with personal hygiene, daily exercising, meal preps, light housekeeping, and most importantly provide companionship.",
    ['PERSONAL_CARE', 'BATHING'],
    '20',
    '45',
    [
      'OWN_TRANSPORTATION',
      'DOES_NOT_SMOKE',
      'COMFORTABLE_WITH_PETS',
      'ALZHEIMERS_OR_DEMENTIA_EXPERIENCE',
    ],
    3.42,
    null
  ),
  /* istanbul ignore next */
  generateCaregiverData(
    0,
    0,
    7,
    true,
    0,
    'Austin',
    'TX',
    'Emily',
    'Emily O.',
    '07b68b03-d199-4eb5-b2df-12c378f65f4b',
    'http://www.gravatar.com/avatar/054649e2e5b4a0c7d501?f=y&d=robohash',
    '22713789',
    "My name is Emily I'm 23, Born and Raised in Austin, Texas! \r\nI was raised by my very loving and amazing grandparents, which I helped take care of every single day and enjoyed every moment of it! Most of my early hands on experience came from taking care of my grandfather who had Dementia, Alzheimer's, and was eventually so sick after suffering from 2 strokes he was placed on hospice. My passion for caring for others sprouted in me at such a young age. I have since taken on positions as a caregiver for elderly! I have experience with Dementia, Alzheimer's, Restricted diets, Medication reminders, Transferring, Toileting, Bathing, Dressing and Grooming.",
    ['PERSONAL_CARE', 'BATHING'],
    '15',
    '25',
    [
      'OWN_TRANSPORTATION',
      'DOES_NOT_SMOKE',
      'COMFORTABLE_WITH_PETS',
      'HOSPICE_EXPERIENCE',
      'ALZHEIMERS_OR_DEMENTIA_EXPERIENCE',
    ],
    6.8,
    null
  ),
  /* istanbul ignore next */
  generateCaregiverData(
    0,
    0,
    7,
    true,
    0,
    'Austin',
    'TX',
    'Michael',
    'Michael O.',
    'e9d9bb38-d07b-49e5-ae06-5c230174adef',
    'http://www.gravatar.com/avatar/054649e2e5b4a0c7d501?f=y&d=robohash',
    '22713790',
    "My name is Michael I'm 23, Born and Raised in Austin, Texas! \r\nI was raised by my very loving and amazing grandparents, which I helped take care of every single day and enjoyed every moment of it! Most of my early hands on experience came from taking care of my grandfather who had Dementia, Alzheimer's, and was eventually so sick after suffering from 2 strokes he was placed on hospice. My passion for caring for others sprouted in me at such a young age. I have since taken on positions as a caregiver for elderly! I have experience with Dementia, Alzheimer's, Restricted diets, Medication reminders, Transferring, Toileting, Bathing, Dressing and Grooming.",
    ['PERSONAL_CARE', 'BATHING'],
    '15',
    '25',
    [
      'OWN_TRANSPORTATION',
      'DOES_NOT_SMOKE',
      'COMFORTABLE_WITH_PETS',
      'HOSPICE_EXPERIENCE',
      'ALZHEIMERS_OR_DEMENTIA_EXPERIENCE',
    ],
    6.9,
    null
  ),
  /* istanbul ignore next */
  generateCaregiverData(
    0,
    0,
    7,
    true,
    0,
    'Austin',
    'TX',
    'Dwight',
    'Dwight O.',
    'd1821b7a-7501-4e1b-a52f-990a3b7899a9',
    'http://www.gravatar.com/avatar/054649e2e5b4a0c7d501?f=y&d=robohash',
    '22713791',
    "My name is Dwight I'm 23, Born and Raised in Austin, Texas! \r\nI was raised by my very loving and amazing grandparents, which I helped take care of every single day and enjoyed every moment of it! Most of my early hands on experience came from taking care of my grandfather who had Dementia, Alzheimer's, and was eventually so sick after suffering from 2 strokes he was placed on hospice. My passion for caring for others sprouted in me at such a young age. I have since taken on positions as a caregiver for elderly! I have experience with Dementia, Alzheimer's, Restricted diets, Medication reminders, Transferring, Toileting, Bathing, Dressing and Grooming.",
    ['PERSONAL_CARE', 'BATHING'],
    '15',
    '25',
    [
      'OWN_TRANSPORTATION',
      'DOES_NOT_SMOKE',
      'COMFORTABLE_WITH_PETS',
      'HOSPICE_EXPERIENCE',
      'ALZHEIMERS_OR_DEMENTIA_EXPERIENCE',
    ],
    6.8,
    null
  ),
  /* istanbul ignore next */
  generateCaregiverData(
    0,
    0,
    7,
    true,
    0,
    'Austin',
    'TX',
    'Jim',
    'Jim O.',
    '1cacc318-444a-4e36-83a7-147398b8a99e',
    'http://www.gravatar.com/avatar/054649e2e5b4a0c7d501?f=y&d=robohash',
    '22713792',
    "My name is Jim I'm 23, Born and Raised in Austin, Texas! \r\nI was raised by my very loving and amazing grandparents, which I helped take care of every single day and enjoyed every moment of it! Most of my early hands on experience came from taking care of my grandfather who had Dementia, Alzheimer's, and was eventually so sick after suffering from 2 strokes he was placed on hospice. My passion for caring for others sprouted in me at such a young age. I have since taken on positions as a caregiver for elderly! I have experience with Dementia, Alzheimer's, Restricted diets, Medication reminders, Transferring, Toileting, Bathing, Dressing and Grooming.",
    ['PERSONAL_CARE', 'BATHING'],
    '15',
    '25',
    [
      'OWN_TRANSPORTATION',
      'DOES_NOT_SMOKE',
      'COMFORTABLE_WITH_PETS',
      'HOSPICE_EXPERIENCE',
      'ALZHEIMERS_OR_DEMENTIA_EXPERIENCE',
    ],
    6.8,
    null
  ),
  /* istanbul ignore next */
  generateCaregiverData(
    0,
    0,
    7,
    true,
    0,
    'Austin',
    'TX',
    'Pam',
    'Pam O.',
    '86efef38-cc11-4e5c-af1e-0665a224ea59',
    'http://www.gravatar.com/avatar/054649e2e5b4a0c7d501?f=y&d=robohash',
    '22713793',
    "My name is Pam I'm 23, Born and Raised in Austin, Texas! \r\nI was raised by my very loving and amazing grandparents, which I helped take care of every single day and enjoyed every moment of it! Most of my early hands on experience came from taking care of my grandfather who had Dementia, Alzheimer's, and was eventually so sick after suffering from 2 strokes he was placed on hospice. My passion for caring for others sprouted in me at such a young age. I have since taken on positions as a caregiver for elderly! I have experience with Dementia, Alzheimer's, Restricted diets, Medication reminders, Transferring, Toileting, Bathing, Dressing and Grooming.",
    ['PERSONAL_CARE', 'BATHING'],
    '15',
    '25',
    [
      'OWN_TRANSPORTATION',
      'DOES_NOT_SMOKE',
      'COMFORTABLE_WITH_PETS',
      'HOSPICE_EXPERIENCE',
      'ALZHEIMERS_OR_DEMENTIA_EXPERIENCE',
    ],
    6.8,
    null
  ),
  /* istanbul ignore next */
  generateCaregiverData(
    0,
    0,
    7,
    true,
    0,
    'Austin',
    'TX',
    'Kevin',
    'Kevin O.',
    '1cacc318-cc11-444a-af1e-14739824ea59',
    'http://www.gravatar.com/avatar/054649e2e5b4a0c7d501?f=y&d=robohash',
    '22713794',
    "My name is Kevin I'm 23, Born and Raised in Austin, Texas! \r\nI was raised by my very loving and amazing grandparents, which I helped take care of every single day and enjoyed every moment of it! Most of my early hands on experience came from taking care of my grandfather who had Dementia, Alzheimer's, and was eventually so sick after suffering from 2 strokes he was placed on hospice. My passion for caring for others sprouted in me at such a young age. I have since taken on positions as a caregiver for elderly! I have experience with Dementia, Alzheimer's, Restricted diets, Medication reminders, Transferring, Toileting, Bathing, Dressing and Grooming.",
    ['PERSONAL_CARE', 'BATHING'],
    '15',
    '25',
    [
      'OWN_TRANSPORTATION',
      'DOES_NOT_SMOKE',
      'COMFORTABLE_WITH_PETS',
      'HOSPICE_EXPERIENCE',
      'ALZHEIMERS_OR_DEMENTIA_EXPERIENCE',
    ],
    6.8,
    null
  ),
];

const zipcode = '78665';

export default function Page() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { flags } = useFeatureFlags();
  const leadConnectFifteenCaregiversBucket =
    flags[CLIENT_FEATURE_FLAGS.LEAD_CONNECT_FIFTEEN_CAREGIVERS]?.variationIndex;
  const apolloClient = useApolloClient();
  const maxNumberOfCaregivers = NUMBER_OF_LEAD_CONNECT_RESULTS(
    leadConnectFifteenCaregiversBucket === 1
  );

  /* istanbul ignore next */
  async function launchLeadConnect() {
    dispatch({
      type: 'setSeekerParams',
      servicesNeeded: helpTypesToServices([]),
      typeOfCare: SENIOR_CARE_TYPE.IN_HOME,
      zip: zipcode,
    });
    dispatch({ type: 'setHelpTypes', helpTypes: [] });

    dispatch({
      type: 'setWhoNeedsCare',
      whoNeedsCare: 'GRANDPARENT' as SeniorCareRecipientRelationshipType,
    });

    // reset the L+C state
    dispatch({
      type: 'setAcceptedProviders',
      acceptedProviders: [],
    });
    dispatch({ type: 'setSkippedCount', skippedCount: 0 });
    dispatch({ type: 'setInitialProviderSeen', initialProviderSeen: false });

    // For help in generating queryKey, note that the order of params is alphabetical
    // The best way to determine this value is experimentally by pulling in apollographql/apollo-cache-persist
    // Contact Joseph Distler for help, this process is not straightforward
    const queryKey = `getTopCaregivers({"hasApprovedActivePhoto":true,"hasCareCheck":true,"hourlyRate":null,"maxDistanceFromSeeker":{"unit":"MILES","value":10},"numResults":${maxNumberOfCaregivers},"qualities":null,"serviceType":"SENIOR_CARE","services":null,"zipcode":"${zipcode}"})`;

    await apolloClient.cache.restore({
      ROOT_QUERY: {
        __typename: 'Query',
        [queryKey]: TOP_CAREGIVER_MOCK.slice(0, maxNumberOfCaregivers),
      },
    });

    const leadConnectPath = SEEKER_LEAD_CONNECT_ROUTES.CAREGIVER_PROFILE;
    await router.push(leadConnectPath);
  }

  return (
    <>
      <Button color="primary" variant="contained" onClick={launchLeadConnect} fullWidth>
        Launch L+C
      </Button>
    </>
  );
}
