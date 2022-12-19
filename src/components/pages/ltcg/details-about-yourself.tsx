import { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Button, Grid, makeStyles } from '@material-ui/core';
import { Banner, Typography } from '@care/react-component-lib';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { isValidZipCode } from '@/utilities/globalValidations';
import ZipInput from '@/components/ZipInput';
import { DateField } from '@/components/DateFormatInput';
import FormikInlineTextField from '@/components/blocks/FormikInlineTextField';
import {
  validateFirstName,
  validateLastName,
} from '@/components/features/accountCreation/accountCreationForm';
import { useAppDispatch, useLtcgState } from '@/components/AppState';
import CareComButtonContainer from '@/components/CareComButtonContainer';
import useEnterKey from '@/components/hooks/useEnterKey';
import { YesOrNoAnswer } from '@/__generated__/globalTypes';
import { Location } from '@/types/common';

dayjs.extend(customParseFormat);

const useStyles = makeStyles((theme) => ({
  descriptionTopSpacing: {
    marginTop: theme.spacing(2),
  },
  titleContainer: {
    marginTop: (props: any) => (props.showZipInput ? theme.spacing(4) : 0),
    marginBottom: theme.spacing(3),
  },
  inputContainer: {
    marginTop: theme.spacing(-3),
    '& .MuiFormControl-root': {
      padding: theme.spacing(0, 0, 2),
    },
  },
  zipContainer: {
    '& .MuiFormControl-root': {
      marginTop: -22,
    },
  },
}));

function validateStreetAddress(streetAddress: string) {
  return streetAddress.trim().length > 0 ? undefined : 'Please enter a valid street address';
}

const eighteenYearsAgo = dayjs().subtract(18, 'year');
function validateDOB(value: string) {
  const invalidDateMsg = 'Please enter a valid date of birth format (mm/dd/yyyy)';
  if (value.trim().length === 10) {
    const birthDate = dayjs(value, 'MM/DD/YYYY', true);
    if (!birthDate.isValid()) {
      return invalidDateMsg;
    }
    if (birthDate.isAfter(eighteenYearsAgo, 'year')) {
      return 'You must be 18 years or older to use Care.com';
    }

    return undefined;
  }

  return invalidDateMsg;
}

const DetailsAboutYourself = () => {
  const dispatch = useAppDispatch();
  const { caregiverNeeded, location } = useLtcgState();
  // if they need to find a caregiver, they already entered a zip
  const showZipInput = caregiverNeeded !== YesOrNoAnswer.YES;
  const classes = useStyles({ showZipInput });
  const { isSubmitting, isValid, submitForm } = useFormikContext();
  const [zipError, setZipError] = useState(false);

  const handleNext = () => {
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data: {
        screen_name: 'details-about-yourself',
        source: 'ltcg experience',
        cta_clicked: 'next',
        enrollment_step: 'first and last name',
      },
    });
    submitForm();
  };

  const isNextEnabled =
    isValid && !isSubmitting && isValidZipCode(location?.zipcode ?? '') && !zipError;

  useEnterKey(isNextEnabled, handleNext);

  const handleZipInputChange = (newLocation: Location) => {
    dispatch({ type: 'setLtcgLocation', location: newLocation });
  };
  const handleZipError = (e: boolean) => {
    setZipError(e);
  };

  useEffect(() => {
    AnalyticsHelper.logScreenViewed('details-about-yourself', 'ltcg experience');
  }, []);

  return (
    <Grid container>
      {showZipInput && (
        <Grid item xs={12}>
          <Banner fullWidth roundCorners type="confirmation">
            <Typography careVariant="body3">
              You can keep your existing caregiver while taking advantage of our partnership with
              your insurance carrier.
            </Typography>
          </Banner>
        </Grid>
      )}

      <Grid item xs={12} className={classes.titleContainer}>
        <Typography variant="h2">Share a few details about yourself.</Typography>
        <Typography variant="body2" className={classes.descriptionTopSpacing}>
          We use this information to verify your identify and keep our platform safe. It will not be
          shared with anyone.
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <div className={classes.inputContainer}>
          <FormikInlineTextField
            id="firstName"
            name="firstName"
            label="First name"
            validate={validateFirstName}
          />
        </div>

        <div className={classes.inputContainer}>
          <FormikInlineTextField
            id="lastName"
            name="lastName"
            label="Last name"
            validate={validateLastName}
          />
        </div>

        <div className={classes.inputContainer}>
          <FormikInlineTextField
            id="address"
            name="address"
            label="Street address"
            validate={validateStreetAddress}
          />
        </div>

        {showZipInput && (
          <div className={classes.zipContainer}>
            <ZipInput
              location={location}
              onError={handleZipError}
              onChange={handleZipInputChange}
            />
          </div>
        )}

        <div className={classes.inputContainer}>
          <DateField
            id="dateOfBirth"
            name="dateOfBirth"
            label="Your birth date (MM/DD/YYYY)"
            validate={validateDOB}
          />
        </div>

        <CareComButtonContainer mt={3}>
          <Button
            fullWidth
            size="large"
            color="primary"
            variant="contained"
            onClick={handleNext}
            disabled={!isNextEnabled}>
            Next
          </Button>
        </CareComButtonContainer>
      </Grid>
    </Grid>
  );
};

export default DetailsAboutYourself;
