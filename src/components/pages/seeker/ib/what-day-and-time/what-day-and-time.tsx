import { Box, Button, Grid, makeStyles } from '@material-ui/core';
import { Typography } from '@care/react-component-lib';
import { theme } from '@care/material-ui-theme';
import dayjs from 'dayjs';
import {
  DateTime,
  validateTimeBlock,
  getTimeBlock,
  DateTimeValues,
} from '@care/seeker-react-components';
import { Form, Formik } from 'formik';
import Head from 'next/head';
import { useAppDispatch, useSeekerCCState } from '@/components/AppState';
import useFlowNavigation from '@/components/features/flowNavigation/useFlowNavigation';
import { logIbDayTimeErrorEvent, logIbDayTimeEvent } from '@/utilities/analyticsPagesUtils';

const useStyles = makeStyles(() => ({
  title: {
    marginBottom: theme.spacing(2),
  },
  form: {
    width: '100%',
    '& .MuiInput-root.Mui-error': {
      borderColor: `${theme.palette.care?.red[800]} !important`,
    },
    '& .MuiTypography-colorError': {
      lineHeight: `${theme.spacing(2)}px`,
      marginTop: `${theme.spacing(0.5)}px`,
      display: 'block',
    },
  },
}));

const WhatDayTimePage = () => {
  const { goNext } = useFlowNavigation();
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const inThreeDays = dayjs().add(3, 'days').format();
  const { start, end } = useSeekerCCState().instantBook.timeBlock;

  const startTime = start ? dayjs(start).format('h:mm A') : '1:00 PM';
  const endTime = end ? dayjs(end).format('h:mm A') : '7:00 PM';

  const startDate = start ? dayjs(start).format() : inThreeDays;

  const setSelectedTime = ({ start: startT, end: endT }: { start: string; end: string }) => {
    const sTime = dayjs(startT).format();
    const eTime = dayjs(endT).format();

    dispatch({ type: 'cc_setInstantBookStartTime', start: sTime });
    dispatch({ type: 'cc_setInstantBookEndTime', end: eTime });
  };

  const handleOnSubmit = (values: DateTimeValues) => {
    const timeBlock = getTimeBlock(values);
    setSelectedTime(timeBlock);
    logIbDayTimeEvent(start, end);
    goNext();
  };

  const handleValidate = (values: DateTimeValues) => {
    const timeBlock = getTimeBlock(values);
    const isValid = validateTimeBlock(values, { isSeekerVetted: false });
    const errors = Object.values(isValid);
    if (errors.length === 0) {
      setSelectedTime(timeBlock);
    } else {
      errors.forEach((error) => logIbDayTimeErrorEvent(String(error)));
    }
    return isValid;
  };

  return (
    <>
      <Head>
        <title>What day and time?</title>
      </Head>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h2">What day and time?</Typography>
        </Grid>

        <Formik
          initialValues={{
            date: new Date(startDate),
            endTime,
            startTime,
          }}
          onSubmit={handleOnSubmit}
          validate={handleValidate}>
          {({ isValid }) => (
            <Form className={classes.form}>
              <DateTime />
              <Box mt={4}>
                <Button
                  disabled={!isValid}
                  color="primary"
                  variant="contained"
                  size="large"
                  fullWidth
                  type="submit">
                  Next
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Grid>
    </>
  );
};

export default WhatDayTimePage;
