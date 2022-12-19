import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Grid, makeStyles, Button, useMediaQuery, useTheme } from '@material-ui/core';
import {
  Checkbox,
  FormControlLabel,
  Typography,
  Divider,
  Slider,
  AddItemButton,
  Modal,
} from '@care/react-component-lib';
import { FormikProvider, useFormik } from 'formik';
import Header from '@/components/Header';
import { PROVIDER_CHILD_CARE_ROUTES } from '@/constants';
import useEnterKey from '@/components/hooks/useEnterKey';
import OverlaySpinner from '@/components/OverlaySpinner';
import TextFieldWithFormik from '@/components/blocks/TextFieldWithFormik';
import RateForAChild from '@/components/features/jobTypes/RateForAChild';
import {
  validateHoursPerJob,
  validateMax,
  validateMin,
  validateForm,
  FormValues,
} from '@/components/features/jobTypes/Validations';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { PROVIDER_JOB_INTEREST_UPDATE, GET_DEFAULT_JOB_WAGES } from '@/components/request/GQL';
import {
  providerJobInterestUpdate,
  providerJobInterestUpdateVariables,
} from '@/__generated__/providerJobInterestUpdate';
import {
  getDefaultJobWages,
  getDefaultJobWagesVariables,
} from '@/__generated__/getDefaultJobWages';
import { ServiceType, JobInterestUpdateSource, JobHoursUnit } from '@/__generated__/globalTypes';
import { useProviderCCState, useAppDispatch } from '@/components/AppState';
import logger from '@/lib/clientLogger';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    margin: '0 auto',
  },
  header: {
    marginBottom: theme.spacing(4),
  },
  dash: {
    textAlign: 'center',
  },
  jobSettings: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(4),
  },
  settingLine: {
    marginTop: theme.spacing(3),
  },
  nextButtonContainer: {
    marginTop: theme.spacing(4),
  },
  errorLine: {
    marginTop: theme.spacing(2),
    color: theme.palette.care.red[500],
  },
  hoursPerJobInput: {
    minWidth: 84,
  },
  hoursPerWeekInput: {
    minWidth: 67,
  },
}));

function JobTypesPage() {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isWaiting, setIsWaiting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const {
    zipcode,
    recurringJob,
    oneTime,
    defaultRatePerChild,
    defaultRecurringHourlyRate,
    min,
    max,
    hours,
  } = useProviderCCState();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const { loading: rateLoading, data: rateData } = useQuery<
    getDefaultJobWages,
    getDefaultJobWagesVariables
  >(GET_DEFAULT_JOB_WAGES, {
    variables: {
      zipcode,
      serviceType: ServiceType.CHILD_CARE,
    },
  });
  const [ratePerChild, setRatePerChild] = useState(defaultRatePerChild);
  const [recurringHourlyRate, setRecurringHourlyRate] = useState(defaultRecurringHourlyRate);
  useEffect(() => {
    if (rateData && !(defaultRatePerChild[0] || defaultRecurringHourlyRate[0])) {
      const minWage = Number(rateData.getJobWages.defaultMinWage.amount);
      const maxWage = Number(rateData.getJobWages.defaultMaxWage.amount);
      setRatePerChild([minWage]);
      setRecurringHourlyRate([minWage, maxWage]);
      dispatch({ type: 'setDefaultRatePerChild', defaultRatePerChild: [minWage] });
      dispatch({
        type: 'setDefaultRecurringHourlyRate',
        defaultRecurringHourlyRate: [minWage, maxWage],
      });
    }
  }, [rateData]);

  const onHourlyRateChange = (value: number | number[]) => {
    setRecurringHourlyRate(value as number[]);
  };

  const onAddAnotherChild = () => {
    setRatePerChild([
      ...ratePerChild,
      Number(rateData && rateData.getJobWages.defaultMinWage.amount),
    ]);
    dispatch({
      type: 'setDefaultRatePerChild',
      defaultRatePerChild: [
        ...defaultRatePerChild,
        Number(rateData && rateData.getJobWages.defaultMinWage.amount),
      ],
    });
  };

  const onRateChange = (value: number | number[], index: number) => {
    setRatePerChild(
      ratePerChild.map((currentRate, i) => (index === i ? (value as number) : currentRate))
    );
  };

  const onRateRemove = () => {
    setRatePerChild(ratePerChild.slice(0, ratePerChild.length - 1));
  };

  const [jobInterestMutation] = useMutation<
    providerJobInterestUpdate,
    providerJobInterestUpdateVariables
  >(PROVIDER_JOB_INTEREST_UPDATE, {
    onCompleted: () => {
      logger.info({
        event: 'providerCCJobTypesMutationSuccessful',
      });
      router.push(
        recurringJob ? PROVIDER_CHILD_CARE_ROUTES.AVAILABILITY : PROVIDER_CHILD_CARE_ROUTES.PROFILE
      );
    },
    onError: (graphQLError: ApolloError) => {
      setIsWaiting(false);
      setShowErrorModal(true);
      logger.error({
        event: 'providerCCJobTypesMutationFailed',
        graphQLError: graphQLError.message,
      });
    },
  });

  const sendAnalytics = (values: FormValues) => {
    const data = {
      enrollment_flow: 'MW VHP Provider Enrollment',
      enrollment_step: 'provider_job_types',
      cta_clicked: 'Next',
      min: values.min,
      max: values.max,
      hours: values.hours,
      recurringHourlyRate,
      ratePerChild,
      oneTimeSelected: oneTime,
      recurringJobSelected: recurringJob,
    };
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data,
    });
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      min: '',
      max: '',
      hours: '',
    },
    validateOnMount: true,
    validateOnBlur: false,
    validateOnChange: true,
    validate: (values: FormValues) => validateForm(values, recurringJob, oneTime),
    onSubmit: (values) => {
      logger.info({
        event: 'providerCCJobTypesMutationAttempt',
      });
      setIsWaiting(true);
      setShowErrorModal(false);
      dispatch({
        type: 'setInputValuesForJobTypes',
        min: values.min,
        max: values.max,
        hours: values.hours,
      });
      dispatch({ type: 'setDefaultRatePerChild', defaultRatePerChild: ratePerChild });
      dispatch({
        type: 'setDefaultRecurringHourlyRate',
        defaultRecurringHourlyRate: recurringHourlyRate,
      });
      sendAnalytics(values);
      jobInterestMutation({
        variables: {
          input: {
            source: JobInterestUpdateSource.ENROLLMENT,
            oneTimeJobInterest: oneTime
              ? {
                  jobHours: {
                    minimum: Number(values.hours),
                    unit: JobHoursUnit.PER_JOB,
                  },
                  childCareJobRates: ratePerChild.map((rate, index) => ({
                    numberOfChildren: index + 1,
                    hourlyRate: {
                      currencyCode: 'USD',
                      amount: rate.toString(),
                    },
                  })),
                }
              : null,
            recurringJobInterest: recurringJob
              ? {
                  jobHours: {
                    minimum: Number(values.min),
                    maximum: values.max ? Number(values.max) : undefined,
                    unit: JobHoursUnit.PER_WEEK,
                  },
                  jobRate: {
                    maximum: {
                      amount: recurringHourlyRate[1].toString(),
                      currencyCode: 'USD',
                    },
                    minimum: {
                      amount: recurringHourlyRate[0].toString(),
                      currencyCode: 'USD',
                    },
                  },
                }
              : null,
            serviceType: ServiceType.CHILD_CARE,
          },
        },
      });
    },
  });

  useEffect(() => {
    formik.setValues({
      min,
      max,
      hours,
    });
    setTimeout(() => {
      formik.validateForm();
    }, 0);
  }, []);

  const onRecurringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'setRecurringJob', recurringJob: event.target.checked });
    if (!event.target.checked) {
      setTimeout(() => {
        formik.setFieldValue('min', '');
        formik.setFieldValue('max', '');
        if (rateData) {
          const minWage = Number(rateData.getJobWages.defaultMinWage.amount);
          const maxWage = Number(rateData.getJobWages.defaultMaxWage.amount);
          setRecurringHourlyRate([minWage, maxWage]);
        }
      }, 0);
    } else {
      setTimeout(() => {
        formik.validateForm();
      }, 0);
    }
  };

  const onOneTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'setOneTime', oneTime: event.target.checked });
    if (!event.target.checked) {
      setTimeout(() => {
        formik.setFieldValue('hours', '');
        if (rateData) {
          const minWage = Number(rateData.getJobWages.defaultMinWage.amount);
          setRatePerChild([minWage]);
        }
      }, 0);
    } else {
      setTimeout(() => {
        formik.validateForm();
      }, 0);
    }
  };

  useEnterKey(formik.isValid, formik.submitForm);

  if (isWaiting || rateLoading) {
    return <OverlaySpinner isOpen={isWaiting || rateLoading} wrapped />;
  }

  return (
    <FormikProvider value={formik}>
      <Grid container className={classes.gridContainer}>
        <Grid item xs={12}>
          <Header>My schedule works best with:</Header>
        </Grid>
        <Grid item xs={12} className={classes.header}>
          <Typography careVariant="disclaimer1" color="textSecondary">
            Select all that apply
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox name="recurring" checked={recurringJob} onChange={onRecurringChange} />
            }
            labelPlacement={isDesktop ? 'end' : 'start'}
            label={[
              <Typography key="primary" variant="h4" color="primary">
                Recurring jobs
              </Typography>,
              <Typography key="secondary" careVariant="body3" color="secondary">
                Nanny, after-school and summer jobs. Work a regular, full, or part-time schedule.
              </Typography>,
            ]}
          />
        </Grid>
        {recurringJob && (
          <Grid container item xs={12} className={classes.jobSettings}>
            <Grid container item xs={12} alignItems="center">
              <Grid item xs={4}>
                <Typography variant="h4" color="primary">
                  Hours per week
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <TextFieldWithFormik
                  id="min"
                  name="min"
                  placeholder="Min"
                  validate={validateMin}
                  hideErrorMessage
                  inputProps={{ maxLength: 2 }}
                  className={classes.hoursPerWeekInput}
                />
              </Grid>
              <Grid item xs={1}>
                <Typography variant="h4" color="primary" className={classes.dash}>
                  -
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <TextFieldWithFormik
                  id="max"
                  name="max"
                  placeholder="Max"
                  validate={(value) => validateMax(value, formik.values.min)}
                  hideErrorMessage
                  inputProps={{ maxLength: 2 }}
                  className={classes.hoursPerWeekInput}
                />
              </Grid>
            </Grid>
            {(formik.errors.min || formik.errors.max) && (
              <Grid item xs={12} className={classes.errorLine}>
                <Typography careVariant="body3">{formik.errors.min}</Typography>
                <Typography careVariant="body3">{formik.errors.max}</Typography>
              </Grid>
            )}
            <Grid item xs={12} className={classes.settingLine}>
              <Typography variant="h4" color="primary">
                My preferred hourly rate
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.settingLine}>
              <Slider
                unit="/ hr"
                prefix="$"
                onChange={onHourlyRateChange}
                min={(rateData && Number(rateData.getJobWages.legalMinimum.amount)) || 0}
                max={(rateData && Number(rateData.getJobWages.maxAllowed.amount)) || 0}
                value={recurringHourlyRate}
              />
            </Grid>
          </Grid>
        )}
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox name="oneTime" checked={oneTime} onChange={onOneTimeChange} />}
            labelPlacement={isDesktop ? 'end' : 'start'}
            label={[
              <Typography key="primary" variant="h4" color="primary">
                One-time jobs
              </Typography>,
              <Typography key="secondary" careVariant="body3" color="secondary">
                Date nights, backup sitter, and special occasions. Pick up occasional jobs based on
                your preferred schedule.
              </Typography>,
            ]}
          />
        </Grid>
        {oneTime && (
          <Grid item container xs={12} className={classes.jobSettings}>
            <Grid container item xs={12} alignItems="center">
              <Grid item xs={6}>
                <Typography variant="h4" color="primary">
                  Minimum hours per job
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <TextFieldWithFormik
                  className={classes.hoursPerJobInput}
                  id="hours"
                  name="hours"
                  placeholder="Hours"
                  validate={validateHoursPerJob}
                  hideErrorMessage
                  inputProps={{ maxLength: 1 }}
                />
              </Grid>
            </Grid>
            {formik.errors.hours && (
              <Grid item xs={12} className={classes.errorLine}>
                <Typography careVariant="body3">{formik.errors.hours}</Typography>
              </Grid>
            )}
            <Grid item xs={12} className={classes.settingLine}>
              <Typography variant="h4" color="primary">
                My hourly rates
              </Typography>
            </Grid>
            {ratePerChild.map((rate: number, index: number) => (
              <RateForAChild
                key={index} // eslint-disable-line
                min={rateData ? Number(rateData.getJobWages.legalMinimum.amount) : 0}
                value={ratePerChild[index]}
                max={40}
                index={index}
                className={classes.settingLine}
                onChange={(value: number | number[]) => onRateChange(value, index)}
                onRemove={
                  index === ratePerChild.length - 1 && index !== 0 ? onRateRemove : undefined
                }
              />
            ))}
            {ratePerChild.length < 4 && (
              <Grid item xs={12} className={classes.settingLine}>
                <AddItemButton label="Add another child" onClick={onAddAnotherChild} />
              </Grid>
            )}
          </Grid>
        )}
        <Grid item xs={12} className={classes.nextButtonContainer}>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            disabled={!formik.isValid || (!oneTime && !recurringJob)}
            onClick={formik.submitForm}
            tabIndex={0}>
            Next
          </Button>
        </Grid>
      </Grid>
      <Modal
        open={showErrorModal}
        title="Oops, something went wrong"
        ButtonPrimary={
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              setShowErrorModal(false);
              router.push(
                recurringJob
                  ? PROVIDER_CHILD_CARE_ROUTES.AVAILABILITY
                  : PROVIDER_CHILD_CARE_ROUTES.PROFILE
              );
            }}>
            Got it
          </Button>
        }
        onClose={() => {}}>
        We weren&apos;t able to save your schedule. Don&apos;t worry though, you can update this
        from your profile later.
      </Modal>
    </FormikProvider>
  );
}

export default JobTypesPage;
