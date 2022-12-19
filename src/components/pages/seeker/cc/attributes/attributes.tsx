import { Box, Button, Grid, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import { SEEKER_CHILD_CARE_PAJ_ROUTES } from '@/constants';
import { useAppDispatch, useSeekerCCState } from '@/components/AppState';
import { NeedHelpWith, NeedHelpWithLabels, CaregiverAttributesLabels } from '@/types/seekerCC';
import { CCCaregiverAttributes } from '@/types/common';
import { logChildCareEvent } from '@/utilities/childCareAnalyticsHelper';
import { Banner, Typography } from '@care/react-component-lib';

const useStyles = makeStyles((theme) => ({
  nextButtonContainer: {
    padding: theme.spacing(5, 0, 3, 0),
  },
  sectionOneTitle: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(3),
  },
  sectionTwoTitle: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(5),
  },
  cgAttributes: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(3),
    '& .MuiFormControlLabel-label': {
      width: '90%',
      fontSize: '16px',
    },
  },
  cgAttributesWrapper: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

function CareGiverAttributes() {
  const classes = useStyles();
  const router = useRouter();
  const state = useSeekerCCState();
  const { cargiverAttributes, needHelpWith } = state.jobPost;
  const { enrollmentSource } = state;
  const dispatch = useAppDispatch();

  const needHelpWithOptions = [
    {
      name: NeedHelpWith.HOMEWORK_HELP,
      label: NeedHelpWithLabels.HOMEWORK_HELP,
      value: needHelpWith.includes(NeedHelpWith.HOMEWORK_HELP),
    },
    {
      name: NeedHelpWith.STRUCTURED_ACTIVITIES,
      label: NeedHelpWithLabels.STRUCTURED_ACTIVITIES,
      value: needHelpWith.includes(NeedHelpWith.STRUCTURED_ACTIVITIES),
    },
    {
      name: NeedHelpWith.LIGHT_HOUSEKEEPING,
      label: NeedHelpWithLabels.LIGHT_HOUSEKEEPING,
      value: needHelpWith.includes(NeedHelpWith.LIGHT_HOUSEKEEPING),
    },
  ];

  const attributeOptions = [
    {
      name: CCCaregiverAttributes.CPR_TRAINED,
      label: CaregiverAttributesLabels.CPR_TRAINED,
      value: cargiverAttributes.includes(CCCaregiverAttributes.CPR_TRAINED),
    },
    {
      name: CCCaregiverAttributes.COMFORTABLE_WITH_PETS,
      label: CaregiverAttributesLabels.COMFORTABLE_WITH_PETS,
      value: cargiverAttributes.includes(CCCaregiverAttributes.COMFORTABLE_WITH_PETS),
    },
    {
      name: CCCaregiverAttributes.COLLEGE_DEGREE,
      label: CaregiverAttributesLabels.COLLEGE_DEGREE,
      value: cargiverAttributes.includes(CCCaregiverAttributes.COLLEGE_DEGREE),
    },
    {
      name: CCCaregiverAttributes.OWN_TRANSPORTATION,
      label: CaregiverAttributesLabels.OWN_TRANSPORTATION,
      value: cargiverAttributes.includes(CCCaregiverAttributes.OWN_TRANSPORTATION),
    },
    {
      name: CCCaregiverAttributes.DOES_NOT_SMOKE,
      label: CaregiverAttributesLabels.DOES_NOT_SMOKE,
      value: cargiverAttributes.includes(CCCaregiverAttributes.DOES_NOT_SMOKE),
    },
  ];

  // eslint-disable-next-line prettier/prettier
  const getUpdateList = (
    attributeList: Array<string>,
    elementName: string,
    isElementChecked: boolean
  ): Array<string> => {
    if (isElementChecked) {
      attributeList.push(elementName);
    } else {
      attributeList.splice(attributeList.indexOf(elementName), 1);
    }

    return attributeList;
  };

  const needHelpHandleChange = (event: any) => {
    const currentNeedHelpList = needHelpWith.slice();
    const elementName = event?.currentTarget.name;
    const elementChecked = event?.currentTarget.checked;
    dispatch({
      type: 'setNeedHelpWith',
      value: getUpdateList(currentNeedHelpList, elementName, elementChecked),
    });
  };

  const cgAttributesHandleChange = (event: any) => {
    const currentCGAttrList = cargiverAttributes.slice();
    const elementName = event?.currentTarget.name;
    const elementChecked = event?.currentTarget.checked;

    dispatch({
      type: 'setCargiverAttributes',
      value: getUpdateList(currentCGAttrList, elementName, elementChecked),
    });
  };

  const getOptionLabel = (optionsArray: string[], lookup: any): string[] => {
    const labelsList = optionsArray.map((optionKey) => lookup[optionKey]);
    return labelsList;
  };

  const handleNext = () => {
    logChildCareEvent('Job Posted', 'PAJ - Additional Needs', enrollmentSource, {
      additional_needs: [
        ...getOptionLabel(needHelpWith, NeedHelpWithLabels),
        ...getOptionLabel(cargiverAttributes, CaregiverAttributesLabels),
      ],
    });

    router.push(SEEKER_CHILD_CARE_PAJ_ROUTES.IDEAL_CAREGIVER);
  };

  return (
    <>
      <Box ml={1} mr={1}>
        <Banner type="information" width="100%" roundCorners>
          <Typography variant="body2">
            Great. Please select anything that applies to you.
          </Typography>
        </Banner>
      </Box>
      <Grid container className={classes.cgAttributesWrapper}>
        <Grid item xs={12}>
          <Typography variant="h2" color="textPrimary" className={classes.sectionOneTitle}>
            What do you need help with?
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            {needHelpWithOptions.map((option) => (
              <FormControlLabel
                control={
                  <Checkbox
                    name={option.name}
                    checked={option.value}
                    onChange={needHelpHandleChange}
                  />
                }
                label={option.label}
                labelPlacement="start"
                className={classes.cgAttributes}
                key={option.name}
              />
            ))}
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h2" color="textPrimary" className={classes.sectionTwoTitle}>
            Your ideal caregiver qualities?
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            {attributeOptions.map((option) => (
              <FormControlLabel
                control={
                  <Checkbox
                    name={option.name}
                    checked={option.value}
                    onChange={cgAttributesHandleChange}
                  />
                }
                label={option.label}
                labelPlacement="start"
                className={classes.cgAttributes}
                key={option.name}
              />
            ))}
          </FormGroup>
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

export default CareGiverAttributes;
