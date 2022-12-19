import React from 'react';
import Head from 'next/head';
import getConfig from 'next/config';
import { Button, Grid, makeStyles, Typography, useTheme, useMediaQuery } from '@material-ui/core';
import { IconIllustrationSmallHousekeeping } from '@care/react-icons';
import { CZEN_MW_UPGRADE_PATH, CZEN_DESKTOP_UPGRADE_PATH } from '@/constants';

const useStyles = makeStyles((theme) => ({
  heading: {
    margin: theme.spacing(2, 0),
    fontWeight: 'bold',
    fontSize: '28px',
  },
  subHeading: {
    margin: theme.spacing(3, 0),
    fontWeight: 'bold',
    fontSize: '21px',
  },
  body: {
    marginBottom: theme.spacing(4),
    fontSize: '16px',
  },
  list: {
    padding: theme.spacing(0, 2),
  },
  listItem: {
    margin: theme.spacing(1, 0),
  },
  button: {
    marginTop: theme.spacing(3),
    width: '100%',
    height: '56px',
    borderRadius: '28px',
  },
}));

export default function WhatsNext() {
  const classes = useStyles();
  const theme = useTheme();
  const {
    publicRuntimeConfig: { CZEN_GENERAL },
  } = getConfig();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const nextLink = isDesktop
    ? `${CZEN_GENERAL}${CZEN_DESKTOP_UPGRADE_PATH}`
    : `${CZEN_GENERAL}${CZEN_MW_UPGRADE_PATH}`;

  const onLetsGoClick = () => {
    window.location.assign(nextLink);
  };

  return (
    <>
      <Head>
        <title>Thanks for sharing!</title>
      </Head>
      <Grid container>
        <Grid item xs={12}>
          <IconIllustrationSmallHousekeeping size="104px" />
        </Grid>
        <Grid item>
          <Typography variant="h1">Thanks for sharing!</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" className={classes.subHeading}>
            What&apos;s next
          </Typography>
          <ul className={classes.list}>
            <li className={classes.listItem}>
              <Typography variant="body1">Continue with a basic plan or go Premium</Typography>
            </li>
            <li className={classes.listItem}>
              <Typography variant="body1">
                We&apos;ll alert you with interested caregivers
              </Typography>
            </li>
            <li className={classes.listItem}>
              <Typography variant="body1">
                Choose the housekeeper that&apos;s the best fit
              </Typography>
            </li>
          </ul>
          <Button
            color="primary"
            variant="contained"
            className={classes.button}
            onClick={onLetsGoClick}>
            Let&apos;s go
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
