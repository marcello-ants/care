import { useRouter } from 'next/router';
import clsx from 'clsx';
import { Grid, useMediaQuery } from '@material-ui/core';
import { Typography } from '@care/react-component-lib';
import { makeStyles } from '@material-ui/core/styles';
import { Icon24InfoSuccessFilled, Icon24InfoTips } from '@care/react-icons';

import { SeniorCareAgeRangeType } from '@/__generated__/globalTypes';

import Header from '@/components/Header';
import { useSeekerState } from '@/components/AppState';
import { SEEKER_ROUTES } from '@/constants';
import { Caregiver } from '@/components/features/caregiversPreview/CaregiverCard';
import CaregiversPreview from '@/components/features/caregiversPreview/CaregiversPreview';
import { CareType } from '@/components/features/caregiversPreview/CareTypeCard';
import { HelpType } from '@/types/seeker';

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    margin: '0 auto',
    maxWidth: '575px',
    paddingBottom: theme.spacing(3),
  },
  header: {
    paddingTop: theme.spacing(1),
    marginBottom: theme.spacing(4),
  },
  info: {
    marginBottom: theme.spacing(4),
  },
  bold: {
    fontWeight: 'bold',
  },
  bulb: {
    marginRight: theme.spacing(0.5),
  },
}));

export const caregivers: Caregiver[] = [
  {
    yearsOfExperience: 1, // default value, to align to mandatory type
    avgReviewRating: 5,
    displayName: 'Joanna R.',
    imageURL: '/app/enrollment/joanna.jpg',
    numberOfReviews: 2,
    signUpDate: new Date('2020-06-17T11:48:00.000Z'),
  },
  {
    yearsOfExperience: 1,
    avgReviewRating: 4.5,
    displayName: 'Lauren N.',
    imageURL: '/app/enrollment/lauren.jpg',
    numberOfReviews: 1,
    signUpDate: new Date('2020-06-17T11:48:00.000Z'),
  },
  {
    yearsOfExperience: 1,
    avgReviewRating: 4.6,
    displayName: 'Tasha A.',
    imageURL: '/app/enrollment/tasha.jpg',
    numberOfReviews: 3,
    signUpDate: new Date('2020-06-17T11:48:00.000Z'),
  },
];

export const whoNeedsCareAgeMap: { [key in SeniorCareAgeRangeType]: string } = {
  [SeniorCareAgeRangeType.THIRTIES]: "30's",
  [SeniorCareAgeRangeType.FORTIES]: "40's",
  [SeniorCareAgeRangeType.FIFTIES]: "50's",
  [SeniorCareAgeRangeType.SIXTIES]: "60's",
  [SeniorCareAgeRangeType.SEVENTIES]: "70's",
  [SeniorCareAgeRangeType.EIGHTIES]: "80's",
  [SeniorCareAgeRangeType.NINETIES]: "90's",
  [SeniorCareAgeRangeType.HUNDREDS]: "100's",
};

export const helpTypesMap: { [key in HelpType]: string } = {
  [HelpType.HOUSEHOLD]: 'everyday tasks',
  [HelpType.PERSONAL]: 'personal care',
  [HelpType.COMPANIONSHIP]: 'companionship',
  [HelpType.TRANSPORTATION]: 'transportation',
  [HelpType.SPECIALIZED]: 'specialized care',
  [HelpType.MOBILITY]: 'mobility assistance',
  [HelpType.MEMORY_CARE]: 'memory care',
};

const formatHelpType = (ht: HelpType) => helpTypesMap[ht];

function Recap() {
  const classes = useStyles();
  const router = useRouter();
  const isReallySmallDevice = useMediaQuery('(max-width:345px)');
  const { city, state, whoNeedsCareAge, helpTypes } = useSeekerState();
  const hasCityAndState = city && state;
  const cityAndStateHeader = `${city}, ${state}`;

  const HELP_TYPES = helpTypes.map((ht) => ht && formatHelpType(ht));

  const seniorLivingTypes: CareType[] = [
    {
      description: `Senior in their ${whoNeedsCareAgeMap[whoNeedsCareAge!]}`,
      icon: <Icon24InfoSuccessFilled />,
    },
    {
      description: `In ${cityAndStateHeader}`,
      icon: <Icon24InfoSuccessFilled />,
    },
  ];

  if (HELP_TYPES.length) {
    seniorLivingTypes.push({
      description: `Looking for help with ${HELP_TYPES.join(', ')}`,
      icon: <Icon24InfoSuccessFilled />,
    });
  }

  const DidYouKnow = () => {
    const copy = (
      <>
        <span>Did you know?&nbsp;</span>
        <span className={classes.bold}>100%</span>
        <span>&nbsp;of caregivers on Care.com are background checked</span>
      </>
    );
    return (
      <>
        <Grid item xs={1} className={clsx(classes.info, isReallySmallDevice && classes.bulb)}>
          <Icon24InfoTips />
        </Grid>
        {/* istanbul ignore next */}
        <Grid
          item
          xs={/* istanbul ignore next */ isReallySmallDevice ? 10 : 11}
          className={classes.info}>
          <Typography variant="body2">{copy}</Typography>
        </Grid>
      </>
    );
  };

  const headerText = 'Looking for senior caregivers';

  return (
    <Grid container className={classes.gridContainer}>
      <Grid item xs={12} className={classes.header}>
        <Header>
          {headerText}
          <span>{hasCityAndState ? ` in ${cityAndStateHeader}` : ''}</span>{' '}
          <span>{city || state ? ' ' : '...'}</span>
        </Header>
      </Grid>
      <DidYouKnow />
      <CaregiversPreview
        caregivers={caregivers}
        onComplete={() => router.push(SEEKER_ROUTES.ACCOUNT_CREATION)}
      />
    </Grid>
  );
}

export default Recap;
