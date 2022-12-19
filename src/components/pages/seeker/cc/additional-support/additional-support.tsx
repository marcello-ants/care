// External Dependencies
import React from 'react';
import Head from 'next/head';
import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';

// Custom Dependencies
import { Icon24InfoSuccess } from '@care/react-icons';

// Internal Dependencies
import Header from '@/components/Header';
import useFlowNavigation from '@/components/features/flowNavigation/useFlowNavigation';
import { useSeekerCCState } from '@/components/AppState';
import { logChildCareEvent } from '@/utilities/childCareAnalyticsHelper';

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
}));

// Constants
const ADDITIONAL_SUPPORT_LIST: string[] = [
  'Caregivers can choose to provide their fever status',
  'Daily content to help you navigate these trying times',
  'Ability to search caregivers focused on tutoring',
  'Access to online classes for kids',
];

export default function AdditionalSupport() {
  const classes = useStyles();
  const { goNext } = useFlowNavigation();
  const { enrollmentSource } = useSeekerCCState();

  const handleNextClick = () => {
    logChildCareEvent('Member Enrolled', 'Additional Support', enrollmentSource);
    goNext();
  };

  return (
    <>
      <Head>
        <title>Additional support</title>
      </Head>
      <Grid container className={classes.mainContainer}>
        <Grid item xs={12}>
          <Header>Additional support we provide:</Header>
          <List className={classes.list}>
            {ADDITIONAL_SUPPORT_LIST.map((item) => {
              return (
                <ListItem key={item} className={classes.listItem}>
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
        <Grid item xs={12} className={classes.nextButtonContainer}>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            size="large"
            onClick={handleNextClick}>
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
