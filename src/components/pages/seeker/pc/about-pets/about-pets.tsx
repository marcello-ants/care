import { FormikProvider } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';
import { Typography } from '@care/react-component-lib';
import OverlaySpinner from '@/components/OverlaySpinner';
import AboutPetsForm, { FormikSelectField } from './aboutPetsForm';

export const PET_NUMBER = [0, 1, 2, 3, 4];
export const PET_SELECT_OPTIONS = [
  { label: 'Dogs', name: 'dogs' },
  { label: 'Cats', name: 'cats' },
  { label: 'Other', name: 'other' },
];

const useStyles = makeStyles((theme) => ({
  header: {
    marginTop: theme.spacing(1),
  },
  subheader: {
    marginTop: theme.spacing(2),
  },
  selectorContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
  selector: {
    width: '90%',
    marginTop: theme.spacing(3),
  },
  button: {
    padding: theme.spacing(4, 0, 3),
    marginBottom: theme.spacing(3),
    textAlign: 'center',
  },
  error: {
    marginTop: theme.spacing(4),
    color: theme.palette.care.red[500],
  },
}));

function AboutPets() {
  const classes = useStyles();
  const formik = AboutPetsForm();

  if (formik.isSubmitting) {
    return <OverlaySpinner isOpen wrapped />;
  }

  return (
    <Grid container>
      <Grid item xs={12} className={classes.header}>
        <Typography variant="h2" color="textPrimary" className={classes.header}>
          Tell us about your pets!
        </Typography>
      </Grid>
      <Grid item xs={12} className={classes.subheader}>
        <Typography variant="h3" color="textPrimary" className={classes.subheader}>
          How many pets need care?
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <FormikProvider value={formik}>
          <Grid item xs={12} className={classes.selectorContainer}>
            {PET_SELECT_OPTIONS.map(({ name, label }) => (
              <Grid item xs={12} className={classes.selector} key={name}>
                <FormikSelectField
                  name={name}
                  label={label}
                  errorDisplayed={Boolean(formik.errors.generalFormError)}
                  options={PET_NUMBER}
                />
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12} className={classes.error}>
            <Typography careVariant="body3">{formik.errors.generalFormError}</Typography>
          </Grid>
          <Grid item xs={12} className={classes.button}>
            <Button
              color="primary"
              variant="contained"
              size="large"
              fullWidth
              onClick={formik.submitForm}
              tabIndex={0}>
              Next
            </Button>
          </Grid>
        </FormikProvider>
      </Grid>
    </Grid>
  );
}

export default AboutPets;
