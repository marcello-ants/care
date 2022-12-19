import React, { useEffect } from 'react';
import { Grid, Typography, makeStyles, Link } from '@material-ui/core';
import { captureException } from '@sentry/nextjs';
import { useRouter } from 'next/router';
import { CLIENT_SIDE_ERROR_TAG } from '../constants';
import logger from '../lib/clientLogger';

type ErrorProps = {
  err?: Error;
};

const useStyles = makeStyles({
  root: {
    textAlign: 'center',
  },
});

function ErrorPage({ err }: ErrorProps) {
  const classes = useStyles();
  const router = useRouter();

  useEffect(() => {
    if (err) {
      logger.error({ error: err, tags: [CLIENT_SIDE_ERROR_TAG, 'FatalErrorUserBlocked'] });
      captureException(err);
    } else {
      logger.error({ tags: [CLIENT_SIDE_ERROR_TAG, 'FatalErrorUserBlocked'] });
      captureException(new Error(`Error page rendered with no 'err' object`));
    }
  }, [err]);

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <Typography variant="h2">An unexpected error has occurred</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">
          <span>Please</span>{' '}
          <Link component="button" variant="subtitle1" onClick={() => router.back()}>
            try again
          </Link>
        </Typography>
      </Grid>
    </Grid>
  );
}

ErrorPage.defaultProps = {
  err: undefined,
};

export default ErrorPage;
