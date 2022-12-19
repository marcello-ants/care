import { Formik } from 'formik';
import { Button, makeStyles, Grid } from '@material-ui/core';
import { Modal } from '@care/react-component-lib';
import { useSeekerState, useAppDispatch } from '@/components/AppState';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { PhoneField, validatePhoneNumber } from '@/components/PhoneInput';
import FormikInlineTextField from '@/components/blocks/FormikInlineTextField';
import {
  validateFirstName,
  validateLastName,
} from '@/components/features/accountCreation/accountCreationForm';

const useStyles = makeStyles(() => ({
  modalRoot: {
    '& .MuiDialogContent-root > div:first-child': {
      paddingTop: 24,
    },
  },
}));

interface Props {
  open: boolean;
  onClose: () => void;
  phonePromptTitle: string;
  namePromptTitle: string;
  enrollmentStep: string;
}

export const shouldPromptForPhone = (phoneNumber: string) =>
  typeof validatePhoneNumber(phoneNumber ?? '') !== 'undefined';

export const shouldPromptForName = (firstName: string, lastName: string) =>
  typeof validateFirstName(firstName ?? '') !== 'undefined' ||
  typeof validateLastName(lastName ?? '') !== 'undefined';

export const SeekerInfoModal = ({
  onClose,
  open,
  phonePromptTitle,
  namePromptTitle,
  enrollmentStep,
}: Props) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { seekerInfo } = useSeekerState();
  const showNameFields = shouldPromptForName(seekerInfo.firstName, seekerInfo.lastName);

  const fireAmplitudeEvent = (name: string, cta: string, extraData: object = {}) => {
    const data = {
      enrollment_step: enrollmentStep,
      member_type: 'Seeker',
      cta_clicked: cta,
      ...extraData,
    };

    AnalyticsHelper.logEvent({
      name,
      data,
    });
  };

  return (
    <Formik
      initialValues={{
        firstName: seekerInfo.firstName,
        lastName: seekerInfo.lastName,
        phoneNumber: seekerInfo.phone,
      }}
      onSubmit={(values) => {
        fireAmplitudeEvent('CTA Interacted', 'continue', {
          screen_name: 'lead seeker info collection module',
          cta_link_type: 'lead flow - seeker info collection',
        });

        dispatch({
          type: 'setSeekerInfo',
          email: seekerInfo.email,
          firstName: values.firstName || seekerInfo.firstName,
          lastName: values.lastName || seekerInfo.lastName,
          phone: values.phoneNumber,
        });
      }}>
      {(formik) => (
        <Modal
          open={open}
          onClose={() => {
            fireAmplitudeEvent('CTA Interacted', 'x', {
              screen_name: 'lead seeker info collection module',
              cta_link_type: 'lead flow - seeker info collection',
            });
            onClose();
          }}
          title={showNameFields ? namePromptTitle : phonePromptTitle}
          variant="dynamicFloating"
          className={classes.modalRoot}
          ButtonPrimary={
            <Button
              color="secondary"
              variant="contained"
              onClick={formik.submitForm}
              disabled={
                !formik.isValid ||
                !formik.values.phoneNumber ||
                (showNameFields && !formik.values.firstName) ||
                (showNameFields && !formik.values.lastName)
              }>
              Continue
            </Button>
          }>
          {showNameFields && (
            <Grid container>
              <Grid item xs={12} md={6}>
                <FormikInlineTextField
                  id="firstName"
                  name="firstName"
                  label="First name"
                  validate={validateFirstName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormikInlineTextField
                  id="lastName"
                  name="lastName"
                  label="Last name"
                  validate={validateLastName}
                />
              </Grid>
            </Grid>
          )}
          <Grid item xs={12}>
            <PhoneField id="phoneNumber" name="phoneNumber" label="Phone number" />
          </Grid>
        </Modal>
      )}
    </Formik>
  );
};
