import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/client';
import React, { useRef, useState } from 'react';
import { Grid, FormGroup, FormControl, FormControlLabel, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Checkbox, Modal, Selector, Typography } from '@care/react-component-lib';
import { CLIENT_FEATURE_FLAGS, COVID_VACCINATION_OPTIONS, PROVIDER_ROUTES } from '@/constants';
import { useAppDispatch, useProviderState } from '@/components/AppState';
import Header from '@/components/Header';
import useEnterKey from '@/components/hooks/useEnterKey';
import OverlaySpinner from '@/components/OverlaySpinner';
import FixElementToBottom from '@/components/FixElementToBottom';
import LanguageSelector from '@/components/pages/provider/LanguageSelector';

import { SENIOR_CARE_PROVIDER_ATTRIBUTES_UPDATE } from '@/components/request/GQL';

import {
  seniorCareProviderAttributesUpdate,
  seniorCareProviderAttributesUpdateVariables,
} from '@/__generated__/seniorCareProviderAttributesUpdate';

import { SeniorCareProviderQuality, Language, EducationLevel } from '@/__generated__/globalTypes';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';

// values should be mapped to real values
const dataItems = [
  {
    title: 'I have experience with:',
    options: [
      {
        label: 'Alzheimer’s or dementia',
        value: SeniorCareProviderQuality.ALZHEIMERS_OR_DEMENTIA_EXPERIENCE,
      },
      { label: 'Hospice / end of life care', value: SeniorCareProviderQuality.HOSPICE_EXPERIENCE },
    ],
  },

  {
    title: 'Certifications and training',
    options: [
      {
        label: 'Home Health Aide or Equivalent',
        value: SeniorCareProviderQuality.HOME_HEALTH_AIDE_EXPERIENCE,
      },
      {
        label: 'Certified Nursing Assistant',
        value: SeniorCareProviderQuality.CERTIFIED_NURSING_ASSISTANT,
      },
      { label: 'Registered Nurse', value: SeniorCareProviderQuality.REGISTERED_NURSE },
      { label: 'CPR Training', value: SeniorCareProviderQuality.CPR_TRAINED },
    ],
  },

  {
    title: 'Additional information',
    options: [
      { label: 'Non-smoker', value: SeniorCareProviderQuality.DOES_NOT_SMOKE },
      { label: 'Have a car', value: SeniorCareProviderQuality.OWN_TRANSPORTATION },
      { label: 'Comfortable with pets', value: SeniorCareProviderQuality.COMFORTABLE_WITH_PETS },
    ],
  },
];

const useStyles = makeStyles((theme) => ({
  formControlLabel: {
    margin: '0 auto',
  },
  checkboxList: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    margin: theme.spacing(0),
    '&:not(:last-child)': {
      marginBottom: theme.spacing(3),
    },
  },
  label: {
    fontSize: '16px',
  },
  title: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(4),
    display: 'inline-block',
  },

  languageTitle: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(4),
    display: 'inline-block',
  },
  error: {
    color: theme.palette.error.main,
  },
  vaccinationDescription: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.25),
  },
}));

function Profile() {
  const classes = useStyles();
  const vaccinationRef = useRef<null | HTMLDivElement>(null);
  const {
    additionalDetails = [],
    languages: selectedLanguages,
    education,
    covidVaccinated,
  } = useProviderState();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorVaccination, setErrorVaccination] = useState(false);
  const [loading, setLoading] = useState(false);
  const featureFlags = useFeatureFlags();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const apolloClient = useApolloClient();
  const nextRoute = PROVIDER_ROUTES.PAY_RANGE;

  const providerVaccinationSeniorEnabled =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.PROVIDER_VACCINE_INDICATOR_SENIOR]?.value;

  const handleChange = (detail: SeniorCareProviderQuality) => {
    if (additionalDetails.includes(detail)) {
      dispatch({
        type: 'setAdditionalDetails',
        additionalDetails: additionalDetails.filter((opt) => opt !== detail),
      });
    } else {
      dispatch({
        type: 'setAdditionalDetails',
        additionalDetails: [...additionalDetails, detail],
      });
    }
  };

  const handleVaccinationChange = (value: string[]) => {
    setErrorVaccination(false);
    dispatch({ type: 'setCovidVaccinated', covidVaccinated: value[0] });
  };

  const sendAnalytics = () => {
    const data = {
      enrollment_flow: 'MW VHP Provider Enrollment',
      enrollment_step: 'provider_about_you',
      cta_clicked: 'Next',
    };
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data,
    });
  };

  const handleNext = async () => {
    let successful;

    if (!covidVaccinated && providerVaccinationSeniorEnabled) {
      setErrorVaccination(true);
      vaccinationRef.current?.scrollIntoView();
      return;
    }

    try {
      setLoading(true);
      const { data } = await apolloClient.mutate<
        seniorCareProviderAttributesUpdate,
        seniorCareProviderAttributesUpdateVariables
      >({
        mutation: SENIOR_CARE_PROVIDER_ATTRIBUTES_UPDATE,
        variables: {
          input: {
            qualities: additionalDetails,
            languages: selectedLanguages,
            ...(education ? { education } : {}),
            ...(providerVaccinationSeniorEnabled && { vaccinated: covidVaccinated === 'yes' }),
          },
        },
      });
      successful =
        data?.seniorCareProviderAttributesUpdate.__typename ===
        'SeniorCareProviderAttributesUpdateSuccess';
    } catch (e) {
      successful = false;
    }
    if (successful) {
      sendAnalytics();
      router.push(nextRoute);
    } else {
      setLoading(false);
      setShowErrorModal(true);
    }
  };

  const onNewLanguageSelected = (languages: Language[]) => {
    dispatch({ type: 'setProviderLanguages', languages });
  };

  const handleEducationChange = (checked: boolean) => {
    dispatch({ type: 'setEducation', education: checked ? EducationLevel.COLLEGE : null });
  };

  useEnterKey(true, handleNext);

  return (
    <>
      <Grid container>
        {loading ? (
          <OverlaySpinner isOpen wrapped />
        ) : (
          <>
            <Grid item xs={12}>
              <Header>Share a few more details about yourself. </Header>
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset" fullWidth>
                <FormGroup>
                  {dataItems.map((item) => (
                    <div key={item.title}>
                      <Typography variant="h4" className={classes.title}>
                        {item.title}
                      </Typography>
                      {item.options.map((opt) => (
                        <FormControlLabel
                          key={opt.label}
                          classes={{
                            label: classes.label,
                          }}
                          control={
                            <Checkbox
                              onChange={() => handleChange(opt.value)}
                              name="options"
                              checked={additionalDetails.includes(opt.value)}
                            />
                          }
                          label={opt.label}
                          labelPlacement="start"
                          className={classes.checkboxList}
                        />
                      ))}
                      {item.title === 'Additional information' && ( // Hardcoded Education checkbox under Additional information
                        <FormControlLabel
                          key="Have a college degree"
                          classes={{
                            label: classes.label,
                          }}
                          control={
                            <Checkbox
                              onChange={(event) => handleEducationChange(event.target.checked)}
                              name="education"
                              checked={Boolean(education)}
                            />
                          }
                          label="Have a college degree"
                          labelPlacement="start"
                          className={classes.checkboxList}
                        />
                      )}
                    </div>
                  ))}
                </FormGroup>
              </FormControl>
            </Grid>
            {providerVaccinationSeniorEnabled && (
              <>
                <Grid item xs={12} className={classes.title} ref={vaccinationRef}>
                  <Typography variant="h4">COVID vaccination</Typography>
                  <Typography
                    careVariant="body3"
                    color="secondary"
                    className={errorVaccination ? classes.error : ''}>
                    Response required
                  </Typography>
                  <Typography variant="body2" className={classes.vaccinationDescription}>
                    Show I’m fully vaccinated against COVID-19
                  </Typography>
                  <Typography careVariant="body3" color="secondary">
                    Families will see a badge on your profile indicating you’re fully vaccinated.
                    They may ask for proof.
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Selector
                    onChange={handleVaccinationChange}
                    name="covidVaccination"
                    options={COVID_VACCINATION_OPTIONS}
                    single
                    value={covidVaccinated}
                  />
                </Grid>
              </>
            )}
            <Typography variant="h4" className={classes.languageTitle}>
              Languages spoken
            </Typography>

            <LanguageSelector
              selectedLanguages={selectedLanguages}
              onNewLanguageSelected={onNewLanguageSelected}
            />
            <FixElementToBottom>
              <Button
                color="primary"
                variant="contained"
                fullWidth
                size="large"
                onClick={handleNext}>
                Next
              </Button>
            </FixElementToBottom>
          </>
        )}
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
              router.push(nextRoute);
            }}>
            Got it
          </Button>
        }
        onClose={() => {}}>
        We weren’t able to save your details. Don’t worry though, you can update this from your
        profile later.
      </Modal>
    </>
  );
}

export default Profile;
