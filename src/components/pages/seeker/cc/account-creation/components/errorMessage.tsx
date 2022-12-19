import React from 'react';
import { Box, Grid } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

type ErrorMessageData = {
  errorMessageText: string;
};

const ErrorMessageNotification = (props: ErrorMessageData) => {
  const { errorMessageText } = props;

  return (
    <Grid item xs={12}>
      <Box mb={3}>
        <Alert severity="error">{errorMessageText}</Alert>
      </Box>
    </Grid>
  );
};

export default ErrorMessageNotification;
