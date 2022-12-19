import { Box, Button, Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import { StatelessSelector, Pill, Banner, Typography } from '@care/react-component-lib';
import { ServiceType } from '@/__generated__/globalTypes';
import stripInvalidCharacters from '@/utilities/stripInvalidCharacters';
import { SEEKER_CHILD_CARE_PAJ_ROUTES } from '@/constants';
import { useAppDispatch, useSeekerCCState } from '@/components/AppState';
import useProviderCount from '@/components/hooks/useProviderCount';
import { IdealCaregiver, IdealCaregiverLabels } from '@/types/seekerCC';
import { logChildCareEvent } from '@/utilities/childCareAnalyticsHelper';

const useStyles = makeStyles((theme) => ({
  nextButtonContainer: {
    padding: theme.spacing(4, 0, 3),
    marginBottom: theme.spacing(48),
  },
  sectionOneTitle: {
    marginTop: theme.spacing(3),
  },
  idealCaregiverWrapper: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  idealCGOptionsWrap: {
    marginTop: theme.spacing(2),
    '& .MuiTypography-body1': {
      fontSize: '16px',
    },
    '& li': {
      marginBottom: theme.spacing(0),
    },
  },
  caregiverDescription: {
    width: '100%',
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.care?.white,
  },
}));

export default function Home() {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { jobPost, enrollmentSource } = useSeekerCCState();
  const { idealCaregiverQualities, personalityCustomContentTwo } = jobPost;
  const { displayProviderMessage, numOfProviders } = useProviderCount(ServiceType.CHILD_CARE);

  const idealCGOptions = [
    {
      label: IdealCaregiverLabels.PATIENT,
      name: IdealCaregiver.PATIENT,
      value: idealCaregiverQualities.includes(IdealCaregiver.PATIENT),
    },
    {
      label: IdealCaregiverLabels.ENERGETIC,
      name: IdealCaregiver.ENERGETIC,
      value: idealCaregiverQualities.includes(IdealCaregiver.ENERGETIC),
    },
    {
      label: IdealCaregiverLabels.LOVING,
      name: IdealCaregiver.LOVING,
      value: idealCaregiverQualities.includes(IdealCaregiver.LOVING),
    },
    {
      label: IdealCaregiverLabels.RELIABLE,
      name: IdealCaregiver.RELIABLE,
      value: idealCaregiverQualities.includes(IdealCaregiver.RELIABLE),
    },
    {
      label: IdealCaregiverLabels.CARING,
      name: IdealCaregiver.CARING,
      value: idealCaregiverQualities.includes(IdealCaregiver.CARING),
    },
    {
      label: IdealCaregiverLabels.RESPONSIBLE,
      name: IdealCaregiver.RESPONSIBLE,
      value: idealCaregiverQualities.includes(IdealCaregiver.RESPONSIBLE),
    },
  ];

  const handleIdealCGChange = (values: Array<string>) => {
    dispatch({ type: 'setIdealCaregiverQualities', value: values });
  };

  const handleCGDescriptionChange = (event: any) => {
    dispatch({
      type: 'setPersonalityCustomContentTwo',
      personalityCustomContentTwo: stripInvalidCharacters(event.target.value) ?? undefined,
    });
  };

  const getOptionLabel = (optionsArray: string[], lookup: any): string[] => {
    const labelsList = optionsArray.map((optionKey) => lookup[optionKey]);
    return labelsList;
  };

  const handleNext = () => {
    logChildCareEvent('Job Posted', 'PAJ - Ideal caregiver', enrollmentSource, {
      caregiver_count: null, // @TODO - where can we take this on the page?
      personality: getOptionLabel(idealCaregiverQualities, IdealCaregiverLabels),
      ideal_caregiver_text: personalityCustomContentTwo.length > 0 ? 1 : 0,
    });
    router.push(SEEKER_CHILD_CARE_PAJ_ROUTES.LAST_STEP);
  };

  return (
    <>
      {displayProviderMessage && (
        <Box ml={1} mr={1}>
          <Banner type="information" width="100%" roundCorners>
            <Typography variant="body2">
              Nice! {numOfProviders} caregivers within a mile are good matches.
            </Typography>
          </Banner>
        </Box>
      )}
      <Grid container className={classes.idealCaregiverWrapper}>
        <Grid item xs={12}>
          <Typography variant="h2" color="textPrimary" className={classes.sectionOneTitle}>
            My ideal caregiver is:
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <StatelessSelector
            onChange={handleIdealCGChange}
            name="idealCaregivers"
            className={classes.idealCGOptionsWrap}
            horizontal>
            {idealCGOptions.map((option) => (
              <Pill
                label={option.label}
                value={option.name}
                variant="fill"
                selected={option.value}
                key={option.name}
              />
            ))}
          </StatelessSelector>
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="personalityCustomContentTwo"
            placeholder="Tell us a little about your ideal caregiver"
            multiline
            rows={3}
            className={classes.caregiverDescription}
            value={personalityCustomContentTwo}
            inputProps={{
              maxLength: 850,
            }}
            onChange={handleCGDescriptionChange}
          />
        </Grid>
        <Grid item xs={12} className={classes.nextButtonContainer}>
          <Button color="primary" variant="contained" size="large" fullWidth onClick={handleNext}>
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
