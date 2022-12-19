import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import {
  Button,
  Grid,
  makeStyles,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';
import { useAppDispatch, useProviderCCState } from '@/components/AppState';
import Header from '@/components/Header';
import LanguageSelector from '@/components/pages/provider/LanguageSelector';
import {
  COVID_VACCINATION_OPTIONS,
  PROVIDER_CHILD_CARE_ROUTES,
  CLIENT_FEATURE_FLAGS,
} from '@/constants';
import {
  StepperInput,
  Pill,
  StatelessSelector,
  Checkbox,
  FormControlLabel,
  Select,
  Selector,
  Typography,
  ExpandableListBlock,
  Modal,
} from '@care/react-component-lib';
import OverlaySpinner from '@/components/OverlaySpinner';
import { Language, ServiceType, EducationLevel } from '@/__generated__/globalTypes';
import { CAREGIVER_ATTRIBUTES_UPDATE } from '@/components/request/GQL';
import {
  caregiverAttributesUpdate,
  caregiverAttributesUpdateVariables,
} from '@/__generated__/caregiverAttributesUpdate';
import { ApolloError, useMutation } from '@apollo/client';
import logger from '@/lib/clientLogger';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import { Icon24UtilityChevron } from '@care/react-icons';

type StylesProps = {
  aboutMeExpanded: boolean;
};

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    margin: '0 auto',
  },
  title: {
    marginTop: theme.spacing(5),
  },
  education: {
    marginTop: theme.spacing(3),
    width: '100%',
  },
  skillsContainer: {
    display: 'flex',
    flexDirection: 'column',
    '& > div > div': {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  skillList: {
    marginTop: theme.spacing(3),
  },
  selector: {
    '& .MuiListItem-root': {
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
      padding: '0px !important',
    },
  },
  allItemsSelector: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(-1),
  },
  experience: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  nextButtonContainer: {
    marginTop: theme.spacing(5),
    padding: theme.spacing(2, 2),
  },
  error: {
    color: theme.palette.error.main,
  },
  hidden: {
    visibility: 'hidden',
  },
  vaccinationDescription: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.25),
  },
  vaccinationSelectorWrapper: {
    marginTop: theme.spacing(2),
  },
  freeGatedAboutMeSelector: {
    maxHeight: ({ aboutMeExpanded }: StylesProps) => (aboutMeExpanded ? 'none' : 280),
    overflowY: 'hidden',
    paddingLeft: 1,
    transform: 'translateX(-1px)',
  },
  freeGatedAboutMeShowMoreButton: {
    marginTop: theme.spacing(1.5),
    background: 'none',
    border: 'none',
    color: theme.palette.care.blue[700],
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    outline: 0,
    WebkitTapHighlightColor: 'transparent',
    '&:hover': {
      color: theme.palette.care.blue[900],
    },
  },
  freeGatedAboutMeShowMoreIcon: {
    transform: ({ aboutMeExpanded }: StylesProps) => (aboutMeExpanded ? 'rotate(180deg)' : ''),
  },
  freeGatedAboutMeShowMoreText: {
    fontSize: theme.spacing(2),
    lineHeight: '22px',
    marginLeft: theme.spacing(1),
    fontWeight: 700,
  },
}));

const helpWith = [
  'mealPreparation',
  'laundryAssistance',
  'lightHousekeeping',
  'errands',
  'groceryShopping',
  'carpooling',
  'craftAssistance',
  'swimmingSupervision',
  'travel',
  'remoteLearningAssistance',
];
export const helpWithMap: { [key in typeof helpWith[number]]: string } = {
  mealPreparation: 'Cooking/meal prep',
  laundryAssistance: 'Laundry',
  lightHousekeeping: 'Light housekeeping',
  errands: 'Errands',
  groceryShopping: 'Grocery shopping',
  carpooling: 'Carpool',
  craftAssistance: 'Crafts',
  swimmingSupervision: 'Swimming supervision',
  travel: 'Travel',
  remoteLearningAssistance: 'Remote learning',
};

const aboutMe = ['ownTransportation', 'comfortableWithPets', 'smokes'];
const aboutMeMap: { [key in typeof aboutMe[number]]: string } = {
  ownTransportation: 'Have a car',
  comfortableWithPets: 'Comfortable with pets',
  smokes: 'Non Smoker',
};

const education = [
  'SOME_HIGH_SCHOOL',
  'HIGH_SCHOOL_DIPLOMA',
  'GED',
  'SOME_COLLEGE',
  'COLLEGE_DEGREE',
  'SOME_GRADUATE_SCHOOL',
  'GRADUATE_DEGREE',
];
const educationMap: { [key in typeof education[number]]: string } = {
  SOME_HIGH_SCHOOL: 'Some high school',
  HIGH_SCHOOL_DIPLOMA: 'High school diploma',
  GED: 'GED',
  SOME_COLLEGE: 'Some college',
  COLLEGE_DEGREE: 'College degree',
  SOME_GRADUATE_SCHOOL: 'Some graduate school',
  GRADUATE_DEGREE: 'Graduate degree',
};

const skills = [
  'certifiedTeacher',
  'cprTrained',
  'earlyChildDevelopmentCoursework',
  'experienceWithTwins',
  'expSpecialNeedsChildren',
  'firstAidTraining',
  'childDevelopmentAssociate',
  'earlyChildhoodEducation',
  'certifiedNursingAssistant',
  'certifiedRegistedNurse',
  'doula',
  'trustlineCertifiedCalifornia',
  'nafccCertified',
];

// slightly modified values and order
const skillsFreeGated = [
  'certifiedTeacher',
  'cprTrained',
  'firstAidTraining',
  'earlyChildDevelopmentCoursework',
  'expSpecialNeedsChildren',
  'childDevelopmentAssociate',
  'earlyChildhoodEducation',
  'certifiedNursingAssistant',
  'certifiedRegistedNurse',
  'doula',
  'trustlineCertifiedCalifornia',
  'nafccCertified',
];

const skillsMap: { [key in typeof skills[number]]: string } = {
  certifiedTeacher: 'Certified teacher',
  cprTrained: 'CPR training',
  earlyChildDevelopmentCoursework: 'Early Child Development Coursework',
  experienceWithTwins: 'Experience with twins',
  expSpecialNeedsChildren: 'Experience with special needs children',
  firstAidTraining: 'First Aid training',
  childDevelopmentAssociate: 'Child Development Associated (CDA)',
  earlyChildhoodEducation: 'Early Childhood Education (EDE)',
  certifiedNursingAssistant: 'Certified Nursing Assistant',
  certifiedRegistedNurse: 'Certified Registered Nurse (RN)',
  doula: 'Doula certified',
  trustlineCertifiedCalifornia: 'Trustine certified (CA only)',
  nafccCertified: 'NAFCC certified',
};

const aboutMeWithSkills = [...aboutMe, ...skillsFreeGated];
const aboutMeWithSkillsMap = {
  ...aboutMeMap,
  ...skillsMap,
};

function ProfilePage() {
  const helpWithRef = useRef<null | HTMLDivElement>(null);
  const educationRef = useRef<null | HTMLDivElement>(null);
  const vaccinationRef = useRef<null | HTMLDivElement>(null);
  const languagesRef = useRef<null | HTMLDivElement>(null);
  const [aboutMeExpanded, setAboutMeExpanded] = useState(false);
  const classes = useStyles({ aboutMeExpanded });
  const {
    languages,
    selectedAboutMe,
    selectedHelpWith,
    selectedSkills,
    education: educationSelected,
    experienceYears,
    covidVaccinated,
  } = useProviderCCState();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const featureFlags = useFeatureFlags();
  const [isWaiting, setIsWaiting] = useState(false);
  const [errorForHelpWith, setErrorForHelpWith] = useState(false);
  const [errorEducation, setErrorEducation] = useState(false);
  const [errorVaccination, setErrorVaccination] = useState(false);
  const [errorLanguages, setErrorLanguages] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const providerCCState = useProviderCCState();

  const providerCCFreeGatedExperience =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.PROVIDER_CC_FREE_GATED_EXPERIENCE]?.value;

  const isFreeGated = providerCCFreeGatedExperience && providerCCState.freeGated;

  const providerVaccinationEnabled =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.PROVIDER_VACCINE_INDICATOR]?.value;

  const onNewLanguageSelected = (langs: Language[]) => {
    setErrorLanguages(false);
    dispatch({ type: 'setProviderCCLanguages', languages: langs });
  };

  const onExperienceChanged = (years: number) =>
    dispatch({ type: 'setProviderCCExperienceYears', experienceYears: years });

  const handleHelpWithSelected = (...props: any[]) => {
    setErrorForHelpWith(false);
    dispatch({ type: 'setProviderCCSelectedHelpWith', selectedHelpWith: props[0] });
  };

  const handleAboutMeSelected = (...props: any[]) => {
    dispatch({ type: 'setProviderCCSelectedAboutMe', selectedAboutMe: props[0] });
  };

  const handleSkillsChange = (skill: string, checked: boolean) => {
    if (checked) {
      dispatch({ type: 'setProviderCCSelectedSkills', selectedSkills: [...selectedSkills, skill] });
    } else {
      dispatch({
        type: 'setProviderCCSelectedSkills',
        selectedSkills: [...selectedSkills.filter((item) => item !== skill)],
      });
    }
  };

  const handleVaccinationChange = (value: string[]) => {
    setErrorVaccination(false);
    dispatch({ type: 'setCovidVaccinated', covidVaccinated: value[0] });
  };

  const handleEducationChange = (
    event: React.ChangeEvent<{
      name?: string;
      value: unknown;
    }>
  ) => {
    setErrorEducation(false);
    dispatch({ type: 'setProviderCCEducation', education: event.target.value as string });
  };

  const [caregiverAttributesUpdateMutation] = useMutation<
    caregiverAttributesUpdate,
    caregiverAttributesUpdateVariables
  >(CAREGIVER_ATTRIBUTES_UPDATE, {
    onCompleted: () => {
      logger.info({
        event: 'providerCCProfileMutationSuccessful',
      });
      router.push(PROVIDER_CHILD_CARE_ROUTES.BIO);
    },
    onError: (graphQLError: ApolloError) => {
      setIsWaiting(false);
      setShowErrorModal(true);
      logger.error({
        event: 'providerCCProfileMutationFailed',
        graphQLError: graphQLError.message,
      });
    },
  });

  const getProfileData = () => ({
    caregiver: {
      comfortableWithPets: selectedAboutMe.includes('comfortableWithPets'),
      education: educationSelected as EducationLevel,
      languages,
      ownTransportation: selectedAboutMe.includes('ownTransportation'),
      smokes: !selectedAboutMe.includes('smokes'),
      yearsOfExperience: experienceYears,
      ...(providerVaccinationEnabled && { covidVaccinated: covidVaccinated === 'yes' }),
    },
    childcare: {
      // for free gated flow, skill values included in 'About me' section
      carpooling: selectedHelpWith.includes('carpooling'),
      certifiedNursingAssistant: isFreeGated
        ? selectedAboutMe.includes('certifiedNursingAssistant')
        : selectedSkills.includes('certifiedNursingAssistant'),
      certifiedRegistedNurse: isFreeGated
        ? selectedAboutMe.includes('certifiedRegistedNurse')
        : selectedSkills.includes('certifiedRegistedNurse'),
      certifiedTeacher: isFreeGated
        ? selectedAboutMe.includes('certifiedTeacher')
        : selectedSkills.includes('certifiedTeacher'),
      childDevelopmentAssociate: isFreeGated
        ? selectedAboutMe.includes('childDevelopmentAssociate')
        : selectedSkills.includes('childDevelopmentAssociate'),
      cprTrained: isFreeGated
        ? selectedAboutMe.includes('cprTrained')
        : selectedSkills.includes('cprTrained'),
      craftAssistance: selectedHelpWith.includes('craftAssistance'),
      doula: isFreeGated ? selectedAboutMe.includes('doula') : selectedSkills.includes('doula'),
      earlyChildDevelopmentCoursework: isFreeGated
        ? selectedAboutMe.includes('earlyChildDevelopmentCoursework')
        : selectedSkills.includes('earlyChildDevelopmentCoursework'),
      earlyChildhoodEducation: isFreeGated
        ? selectedAboutMe.includes('earlyChildhoodEducation')
        : selectedSkills.includes('earlyChildhoodEducation'),
      errands: selectedHelpWith.includes('errands'),
      expSpecialNeedsChildren: isFreeGated
        ? selectedAboutMe.includes('expSpecialNeedsChildren')
        : selectedSkills.includes('expSpecialNeedsChildren'),
      experienceWithTwins: selectedSkills.includes('experienceWithTwins'),
      firstAidTraining: isFreeGated
        ? selectedAboutMe.includes('firstAidTraining')
        : selectedSkills.includes('firstAidTraining'),
      groceryShopping: selectedHelpWith.includes('groceryShopping'),
      laundryAssistance: selectedHelpWith.includes('laundryAssistance'),
      lightHousekeeping: selectedHelpWith.includes('lightHousekeeping'),
      mealPreparation: selectedHelpWith.includes('mealPreparation'),
      nafccCertified: isFreeGated
        ? selectedAboutMe.includes('nafccCertified')
        : selectedSkills.includes('nafccCertified'),
      remoteLearningAssistance: selectedHelpWith.includes('remoteLearningAssistance'),
      swimmingSupervision: selectedHelpWith.includes('swimmingSupervision'),
      travel: selectedHelpWith.includes('travel'),
      trustlineCertifiedCalifornia: isFreeGated
        ? selectedAboutMe.includes('trustlineCertifiedCalifornia')
        : selectedSkills.includes('trustlineCertifiedCalifornia'),
    },
  });

  const sendAnalytics = () => {
    const data = {
      enrollment_flow: 'MW VHP Provider Enrollment',
      enrollment_step: 'provider_profile',
      cta_clicked: 'Next',
      ...getProfileData(),
    };
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data,
    });
  };

  const onSubmit = () => {
    if (selectedHelpWith.length === 0) {
      setErrorForHelpWith(true);
      helpWithRef.current?.scrollIntoView();
      return;
    }
    if (!covidVaccinated && providerVaccinationEnabled) {
      setErrorVaccination(true);
      vaccinationRef.current?.scrollIntoView();
      return;
    }
    if (!educationSelected) {
      setErrorEducation(true);
      educationRef.current?.scrollIntoView();
      return;
    }
    if (!languages.length) {
      setErrorLanguages(true);
      languagesRef.current?.scrollIntoView();
      return;
    }

    setIsWaiting(true);
    sendAnalytics();
    caregiverAttributesUpdateMutation({
      variables: {
        input: {
          ...getProfileData(),
          serviceType: ServiceType.CHILD_CARE,
        },
      },
    });
  };

  if (isWaiting) {
    return <OverlaySpinner isOpen={isWaiting} wrapped />;
  }

  return (
    <Grid container className={classes.gridContainer}>
      <Grid item xs={12} ref={helpWithRef}>
        <Header>{isFreeGated ? 'I’m open to these tasks' : 'I’m willing to help with...'}</Header>
      </Grid>
      <Grid item xs={12}>
        <Typography
          careVariant="body3"
          color="secondary"
          className={errorForHelpWith ? classes.error : ''}>
          Select at least one
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <StatelessSelector
          className={clsx(classes.selector, classes.allItemsSelector)}
          horizontal
          onChange={handleHelpWithSelected}
          value={selectedHelpWith}>
          {helpWith.map((value) => (
            <Pill key={value} label={helpWithMap[value]} value={value} name={value} />
          ))}
        </StatelessSelector>
      </Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4">Details about me</Typography>
      </Grid>
      <Grid item xs={12}>
        {isFreeGated ? (
          <>
            <StatelessSelector
              className={clsx(
                classes.selector,
                classes.allItemsSelector,
                classes.freeGatedAboutMeSelector
              )}
              horizontal
              onChange={handleAboutMeSelected}
              value={selectedAboutMe}>
              {aboutMeWithSkills.map((value) => (
                <Pill key={value} label={aboutMeWithSkillsMap[value]} value={value} />
              ))}
            </StatelessSelector>
            <button
              className={classes.freeGatedAboutMeShowMoreButton}
              type="button"
              onClick={() => setAboutMeExpanded(!aboutMeExpanded)}>
              <Icon24UtilityChevron
                color={theme.palette.care.blue[700]}
                className={classes.freeGatedAboutMeShowMoreIcon}
              />
              <span className={classes.freeGatedAboutMeShowMoreText}>
                {aboutMeExpanded ? 'Show less' : 'Show more'}
              </span>
            </button>
          </>
        ) : (
          <StatelessSelector
            className={clsx(classes.selector, classes.allItemsSelector)}
            horizontal
            onChange={handleAboutMeSelected}
            value={selectedAboutMe}>
            {aboutMe.map((value) => (
              <Pill key={value} label={aboutMeMap[value]} value={value} />
            ))}
          </StatelessSelector>
        )}
      </Grid>
      {providerVaccinationEnabled && (
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
              Families will see a badge on your profile indicating you’re fully vaccinated. They may
              ask for proof.
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.vaccinationSelectorWrapper}>
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
      <Grid item xs={12} className={classes.experience}>
        <StepperInput
          name="experience"
          min={0}
          max={10}
          inc={1}
          initialVal={experienceYears}
          stepperLabel="Years of experience"
          optionalLabel={experienceYears === 1 ? 'Year' : 'Years'}
          onChange={onExperienceChanged}
          maxInputSuffix
        />
      </Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4">Education</Typography>
      </Grid>
      <Grid item xs={12} ref={educationRef}>
        <FormControl className={classes.education}>
          <InputLabel id="education">Highest level achieved</InputLabel>
          <Select
            id="education"
            value={educationSelected}
            onChange={handleEducationChange}
            displayEmpty
            inputProps={{
              tabIndex: -1,
            }}
            MenuProps={{
              keepMounted: true,
            }}>
            <MenuItem value="" disabled>
              Select
            </MenuItem>
            {education.map((value) => (
              <MenuItem key={value} value={value}>
                {educationMap[value]}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText className={errorEducation ? classes.error : classes.hidden}>
            Required
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} className={classes.title} ref={languagesRef}>
        <Typography variant="h4">Languages spoken</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography
          careVariant="body3"
          color="secondary"
          className={errorLanguages ? classes.error : ''}>
          Select at least one
        </Typography>
      </Grid>
      <Grid item xs={12} className={classes.allItemsSelector}>
        <LanguageSelector
          selectedLanguages={languages}
          onNewLanguageSelected={onNewLanguageSelected}
        />
      </Grid>
      {!isFreeGated && (
        <>
          <Grid item xs={12} className={classes.title}>
            <Typography variant="h4">Skills/Training</Typography>
          </Grid>
          <Grid item xs={12} className={classes.skillsContainer}>
            <ExpandableListBlock minItems={6}>
              {skills.map((value) => (
                <FormControlLabel
                  key={value}
                  className={classes.skillList}
                  control={
                    <Checkbox
                      onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) =>
                        handleSkillsChange(value, checked)
                      }
                      name="options"
                      checked={selectedSkills.includes(value)}
                    />
                  }
                  label={skillsMap[value]}
                  labelPlacement={isDesktop ? 'end' : 'start'}
                />
              ))}
            </ExpandableListBlock>
          </Grid>
        </>
      )}
      <Grid item xs={12} className={classes.nextButtonContainer}>
        <Button color="primary" variant="contained" size="large" fullWidth onClick={onSubmit}>
          Next
        </Button>
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
              router.push(PROVIDER_CHILD_CARE_ROUTES.BIO);
            }}>
            Got it
          </Button>
        }
        onClose={() => {}}>
        We weren&apos;t able to save your profile settings. Don&apos;t worry though, you can update
        this from your profile later.
      </Modal>
    </Grid>
  );
}

export default ProfilePage;
