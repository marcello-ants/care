// External Dependencies
import React, { useCallback, useEffect } from 'react';
import Head from 'next/head';
import { Grid, makeStyles, Button } from '@material-ui/core';
import { useFormik, yupToFormErrors } from 'formik';
import * as yup from 'yup';

// Internal Dependencies
import { useAppDispatch, useSeekerCCState } from '@/components/AppState';
import useFlowNavigation from '@/components/features/flowNavigation/useFlowNavigation';
import Header from '@/components/Header';
import { ChildDateOfBirth } from '@/types/seekerCC';
import { getBirthAvailableMonthsAndYears } from '@/components/pages/seeker/cc/day-center-who-needs-care/utils';
import ChildBirthdayFields, {
  TErrorProps,
} from '@/components/pages/seeker/cc/day-center-who-needs-care/components/ChildBirthdayFields';
import useFeatureFlag from '@/components/hooks/useFeatureFlag';
import { CLIENT_FEATURE_FLAGS } from '@/constants';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

// Interfaces + Types
interface ChildrenInfo {
  children: ChildDateOfBirth[];
}

// Constants
const MAX_NUMBER_OF_CHILDREN = 7;

// Form Schema
const formSchema = yup.object({
  children: yup.array(
    yup.object({
      month: yup
        .string()
        .required()
        .oneOf(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']),
      year: yup
        .string()
        .required()
        .matches(/^[0-9]{4,}$/),
    })
  ),
});

function useChildrenDateOfBirthForm(allow9MonthsOutFromNow?: boolean) {
  const state = useSeekerCCState();
  const { goNext } = useFlowNavigation();
  const dispatch = useAppDispatch();
  const { childrenDateOfBirth } = state?.dayCare;

  const formik = useFormik<ChildrenInfo>({
    initialValues: {
      children:
        childrenDateOfBirth.length > 0 ? [...childrenDateOfBirth] : [{ month: '', year: '' }],
    },
    validationSchema: formSchema,
    validate: async (values: ChildrenInfo) => {
      try {
        await formSchema.validate(values, { abortEarly: false });
      } catch (e) {
        return yupToFormErrors(e);
      }

      let thereAreErrors = false;
      const customErrors = { children: [] as TErrorProps[] };

      values?.children?.forEach((child, i) => {
        customErrors.children.push({});

        const { months, years } = getBirthAvailableMonthsAndYears(
          child.month,
          child.year,
          allow9MonthsOutFromNow
        );

        const selectedMonthIsNotValid = months.findIndex((x) => x.value === child.month) === -1;
        const selectedYearIsNotValid = !years.includes(child.year);

        if (selectedMonthIsNotValid) {
          thereAreErrors = true;
          customErrors.children[i].month = `children[${i}].month is not valid`;
        }

        if (selectedYearIsNotValid) {
          thereAreErrors = true;
          customErrors.children[i].year = `children[${i}].month is not valid`;
        }
      });

      return thereAreErrors ? customErrors : null;
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit(values, formikHelper) {
      formikHelper.setSubmitting(false);
      dispatch({
        type: 'setDayCareChildrenDateOfBirth',
        childrenDateOfBirth: values.children,
      });
      goNext();
    },
  });

  const { children } = formik.values;

  // Handlers
  const handleAddChildrenCount = () => {
    const updatedChildren = [...children, { month: '', year: '' }];
    formik.setFieldValue('children', updatedChildren);
  };

  const handleRemoveChildrenCount = (index: number) => {
    const updatedChildren = [...children.slice(0, index), ...children.slice(index + 1)];
    formik.setFieldValue('children', updatedChildren);
  };

  const handleNext = useCallback(() => {
    formik.handleSubmit();
  }, []);

  // Flags
  const isAddNewChildButtonDisabled = children.length >= MAX_NUMBER_OF_CHILDREN;
  const errors: any = formik.errors.children;

  return {
    formik,
    isAddNewChildButtonDisabled,
    errors,
    handleAddChildrenCount,
    handleRemoveChildrenCount,
    handleNext,
  };
}

// Styles
const useStyles = makeStyles((theme) => ({
  mainContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  header: {
    marginBottom: theme.spacing(3),
  },
  addAnotherChildButton: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
}));

/**
 * Main Function
 */
function WhoNeedsCareDayCenterPage() {
  const classes = useStyles();

  // A/B test - enrollment-birthdate-9-months-out
  const birthdate9MonthsOutTestEvaluation = useFeatureFlag(
    CLIENT_FEATURE_FLAGS.BIRTHDATE_9_MONTHS_OUT
  );
  const birthdate9MonthsOutTestIsEnabled = birthdate9MonthsOutTestEvaluation?.variationIndex === 2;

  useEffect(() => {
    AnalyticsHelper.logTestExposure(
      CLIENT_FEATURE_FLAGS.BIRTHDATE_9_MONTHS_OUT,
      birthdate9MonthsOutTestEvaluation
    );
  }, []);

  const {
    formik,
    isAddNewChildButtonDisabled,
    errors,
    handleAddChildrenCount,
    handleRemoveChildrenCount,
    handleNext,
  } = useChildrenDateOfBirthForm(birthdate9MonthsOutTestIsEnabled);

  return (
    <>
      <Head>
        <title>Who needs care?</title>
      </Head>
      <Grid container className={classes.mainContainer}>
        <Grid item xs={12} className={classes.header}>
          <Header>Who needs care?</Header>
        </Grid>

        {/* Child Container */}
        {formik.values.children.map((child, i) => (
          <ChildBirthdayFields
            child={child}
            childIndex={i}
            key={`${i + child.year}`}
            onChange={formik.handleChange}
            onRemoveChild={() => handleRemoveChildrenCount(i)}
            error={errors?.[i]}
            allow9MonthsOutFromNow={birthdate9MonthsOutTestIsEnabled}
          />
        ))}
        {/* End Child Container */}

        <Grid item xs={12}>
          <Button
            color="secondary"
            variant="outlined"
            size="large"
            fullWidth
            disabled={isAddNewChildButtonDisabled}
            className={classes.addAnotherChildButton}
            onClick={handleAddChildrenCount}>
            Add Another Child
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button color="primary" variant="contained" size="large" fullWidth onClick={handleNext}>
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default WhoNeedsCareDayCenterPage;
