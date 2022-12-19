import React from 'react';
import Head from 'next/head';
import {
  Box,
  Button,
  Grid,
  Link,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { IconIllustrationSmallHousekeeping } from '@care/react-icons';
import {
  CZEN_MW_UPGRADE_PATH,
  CZEN_DESKTOP_UPGRADE_PATH,
  SEEKER_HOUSEKEEPING_ROUTES,
} from '@/constants';
import getConfig from 'next/config';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(0, 1),
  },
  body: {
    margin: theme.spacing(2, 0, 4),
  },
  skipForNowLink: {
    '& > a': {
      textDecoration: 'none',
      color: theme.palette.care?.grey[600],
      cursor: 'pointer',
    },
  },
}));

export default function DoubleChances() {
  const classes = useStyles();
  const theme = useTheme();
  const {
    publicRuntimeConfig: { CZEN_GENERAL },
  } = getConfig();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const router = useRouter();
  const skipLink = isDesktop
    ? `${CZEN_GENERAL}${CZEN_DESKTOP_UPGRADE_PATH}`
    : `${CZEN_GENERAL}${CZEN_MW_UPGRADE_PATH}`;

  const handleSkipForNow = () => {
    window.location.assign(skipLink);
  };

  const pushNextRoute = () => {
    router.push(SEEKER_HOUSEKEEPING_ROUTES.JOB_SCHEDULE);
  };

  return (
    <>
      <Head>
        <title>Want to double your chances of finding a great housekeeper?</title>
      </Head>
      <Grid container>
        <Grid item>
          <IconIllustrationSmallHousekeeping size="104px" />
        </Grid>
        <Grid item xs={12} className={classes.container}>
          <Typography variant="h2">
            Want to double your chances of finding a great housekeeper?
          </Typography>
          <Typography variant="body2" className={classes.body}>
            Share a few more details to make the best care connections!
          </Typography>
          <Grid item xs={12}>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              size="large"
              onClick={pushNextRoute}>
              Let&apos;s go
            </Button>
          </Grid>
          <Box mt={3} justifyContent="center" display="flex">
            <Typography variant="body2" className={classes.skipForNowLink}>
              <Link underline="none" onClick={handleSkipForNow}>
                Skip for now
              </Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
