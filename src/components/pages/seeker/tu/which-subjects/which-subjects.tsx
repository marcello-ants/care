import { Pill, StatelessSelector } from '@care/react-component-lib';
import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import { Subjects, SubjectsLabels } from '@/types/seekerTU';
import { useAppDispatch, useSeekerTUState } from '@/components/AppState';
import { useEffect, useState } from 'react';
import useFlowNavigation from '@/components/features/flowNavigation/useFlowNavigation';
import { logCareEvent } from '@/utilities/amplitudeAnalyticsHelper';

const useStyles = makeStyles((theme) => ({
  nextButtonContainer: {
    padding: theme.spacing(4, 0, 3),
    marginBottom: theme.spacing(48),
  },
  errorText: {
    color: theme.palette.error.main,
    marginTop: theme.spacing(2),
  },
  sectionOneTitle: {
    marginTop: theme.spacing(3),
  },
  subjectsWrapper: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  subjectsWrap: {
    marginTop: theme.spacing(2),
    '& .MuiTypography-body1': {
      fontSize: '16px',
    },
    '& li': {
      marginBottom: theme.spacing(0),
    },
  },
}));

const WhichSubjects = () => {
  const classes = useStyles();
  const { goNext } = useFlowNavigation();
  const dispatch = useAppDispatch();
  const { selectedSubjects } = useSeekerTUState();
  const [showError, setShowError] = useState(false);

  const subjectsOptions = [
    {
      label: SubjectsLabels.ART,
      name: Subjects.ART,
      value: selectedSubjects.includes(Subjects.ART),
    },
    {
      label: SubjectsLabels.BUSINESS,
      name: Subjects.BUSINESS,
      value: selectedSubjects.includes(Subjects.BUSINESS),
    },
    {
      label: SubjectsLabels.COMPUTERS,
      name: Subjects.COMPUTERS,
      value: selectedSubjects.includes(Subjects.COMPUTERS),
    },
    {
      label: SubjectsLabels.DANCE,
      name: Subjects.DANCE,
      value: selectedSubjects.includes(Subjects.DANCE),
    },
    {
      label: SubjectsLabels.ENGLISH,
      name: Subjects.ENGLISH,
      value: selectedSubjects.includes(Subjects.ENGLISH),
    },
    {
      label: SubjectsLabels.FOREIGN_LANGUAGE,
      name: Subjects.FOREIGN_LANGUAGE,
      value: selectedSubjects.includes(Subjects.FOREIGN_LANGUAGE),
    },
    {
      label: SubjectsLabels.MATH,
      name: Subjects.MATH,
      value: selectedSubjects.includes(Subjects.MATH),
    },
    {
      label: SubjectsLabels.MUSIC_AND_DRAMA,
      name: Subjects.MUSIC_AND_DRAMA,
      value: selectedSubjects.includes(Subjects.MUSIC_AND_DRAMA),
    },
    {
      label: SubjectsLabels.MUSICAL_INSTRUMENTS,
      name: Subjects.MUSICAL_INSTRUMENTS,
      value: selectedSubjects.includes(Subjects.MUSICAL_INSTRUMENTS),
    },

    {
      label: SubjectsLabels.SCIENCE,
      name: Subjects.SCIENCE,
      value: selectedSubjects.includes(Subjects.SCIENCE),
    },
    {
      label: SubjectsLabels.SPECIAL_EDUCATION,
      name: Subjects.SPECIAL_EDUCATION,
      value: selectedSubjects.includes(Subjects.SPECIAL_EDUCATION),
    },
    {
      label: SubjectsLabels.SPORTS_AND_FITNESS,
      name: Subjects.SPORTS_AND_FITNESS,
      value: selectedSubjects.includes(Subjects.SPORTS_AND_FITNESS),
    },
    {
      label: SubjectsLabels.TEST_PREP,
      name: Subjects.TEST_PREP,
      value: selectedSubjects.includes(Subjects.TEST_PREP),
    },
    {
      label: SubjectsLabels.OTHER,
      name: Subjects.OTHER,
      value: selectedSubjects.includes(Subjects.OTHER),
    },
  ];

  const handleSubjectsChange = (values: Array<string>) => {
    dispatch({ type: 'setSelectedSubjects', value: values });
  };

  const handleNext = () => {
    if (selectedSubjects.length === 0) {
      setShowError(true);
    } else {
      logCareEvent('Member Enrolled', 'Caregiver tasks', {
        caregiver_tasks: selectedSubjects.map((subject) => SubjectsLabels[subject as Subjects]),
      });
      goNext();
    }
  };

  useEffect(() => {
    if (selectedSubjects.length > 0 && showError) {
      setShowError(false);
    }
  }, [selectedSubjects]);

  return (
    <Grid container className={classes.subjectsWrapper}>
      <Grid item xs={12}>
        <Typography variant="h2" color="textPrimary">
          Which subjects do you need help with?
        </Typography>
        <Typography variant="h3" color="textPrimary" className={classes.sectionOneTitle}>
          Select all that apply
        </Typography>
        <StatelessSelector
          onChange={handleSubjectsChange}
          name="selectedSubjects"
          className={classes.subjectsWrap}
          horizontal>
          {subjectsOptions.map((option) => (
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
      {showError && (
        <Grid item xs={12}>
          <Typography variant="subtitle2" className={classes.errorText}>
            Please select the type of service needed
          </Typography>
        </Grid>
      )}
      <Grid item xs={12} className={classes.nextButtonContainer}>
        <Button color="primary" variant="contained" size="large" fullWidth onClick={handleNext}>
          Next
        </Button>
      </Grid>
    </Grid>
  );
};

export default WhichSubjects;
