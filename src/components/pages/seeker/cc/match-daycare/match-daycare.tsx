// External Dependencies
import { useEffect, useState } from 'react';
import Head from 'next/head';
import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';

// Custom Dependencies
import { Icon24InfoSuccess } from '@care/react-icons';

// Internal Dependencies
import Header from '@/components/Header';
import { useSeekerCCState, useSeekerState } from '@/components/AppState';
import useFlowNavigation from '@/components/features/flowNavigation/useFlowNavigation';
import useDayCareProviders from '@/components/features/dayCareProviders/useDayCareProviders';
import useFeatureFlag from '@/components/hooks/useFeatureFlag';
import { CLIENT_FEATURE_FLAGS } from '@/constants';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
// import { logChildCareEvent } from '@/utilities/childCareAnalyticsHelper';

// Styles
const useStyles = makeStyles((theme) => ({
  list: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  listItem: {
    alignItems: 'unset',
    paddingTop: `${theme.spacing(0)} !important`, // Necessary to override Material UI classes.
    paddingBottom: `${theme.spacing(0)} !important`, // Necessary to override Material UI classes.
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    minHeight: '0',
    [theme.breakpoints.up('sm')]: {
      whiteSpace: 'nowrap',
    },
  },
  itemIcon: {
    marginTop: '2px',
  },
  nextButtonContainer: {
    padding: theme.spacing(2, 0, 3, 0),
    marginBottom: theme.spacing(36.6),
  },
  mainContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      width: '290px',
      margin: 'auto',
    },
  },
  itemTransitionBegin: {
    transition: 'opacity 1s linear',
    transform: 'scale(1.0)',
    opacity: 1,
  },
  itemTransitionEnd: {
    transform: 'scale(0.7)',
    opacity: 0,
  },
}));

const DAYCARE_OPTIONS_LIST: string[] = [
  `Locations nearest to you`,
  `Matching your family's needs`,
  `Available when you need care`,
];

export default function MatchDayCare() {
  const classes = useStyles();
  const { zipcode, city, state, maxDistanceFromSeekerDayCare } = useSeekerState();
  const {
    dayCare: { childrenDateOfBirth, startMonth },
  } = useSeekerCCState();
  const { goNext } = useFlowNavigation();
  // Get Daycare Providers info, map it, and store it in local storage
  useDayCareProviders(zipcode, childrenDateOfBirth, startMonth, maxDistanceFromSeekerDayCare);
  // const { enrollmentSource } = useSeekerCCState();

  const splitAccCreationDC = useFeatureFlag(CLIENT_FEATURE_FLAGS.SPLIT_ACCOUNT_CREATION_DAYCARE);

  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    AnalyticsHelper.logTestExposure(
      CLIENT_FEATURE_FLAGS.SPLIT_ACCOUNT_CREATION_DAYCARE,
      splitAccCreationDC
    );
  }, []);

  const handleRedirection = () => {
    // @TODO Amplitude tracking
    // logChildCareEvent('Member Enrolled', 'Additional Support', enrollmentSource);
    goNext();
  };

  const title = `Looking for daycares${zipcode ? ` in ${city}, ${state}` : ''}...`;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (counter > DAYCARE_OPTIONS_LIST.length - 1) {
        handleRedirection();
      } else {
        setCounter(counter + 1);
      }
    }, 600);

    return () => {
      clearTimeout(timer);
    };
  }, [counter]);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Grid container className={classes.mainContainer}>
        <Grid item xs={12}>
          <Header>{title}</Header>
          <List className={classes.list}>
            {DAYCARE_OPTIONS_LIST.map((item, id) => {
              return (
                <ListItem
                  key={item}
                  className={clsx(
                    classes.listItem,
                    classes.itemTransitionBegin,
                    id >= counter && classes.itemTransitionEnd
                  )}>
                  <ListItemIcon className={classes.itemIcon}>
                    <Icon24InfoSuccess size="28px" />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="body2">{item}</Typography>
                  </ListItemText>
                </ListItem>
              );
            })}
          </List>
        </Grid>
      </Grid>
    </>
  );
}
