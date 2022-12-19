import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextareaAutosize,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { SegmentControl, Typography } from '@care/react-component-lib';
import { makeStyles } from '@material-ui/core/styles';
import Header from '@/components/Header';
import useEnterKey from '@/components/hooks/useEnterKey';
import { useAppDispatch, useSeekerState } from '@/components/AppState';
import { Gender } from '@/types/common';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import stripInvalidCharacters from '@/utilities/stripInvalidCharacters';
import {
  CLIENT_FEATURE_FLAGS,
  POST_A_JOB_ROUTES,
  SEEKER_ROUTES,
  NUMBER_OF_LEAD_CONNECT_RESULTS,
} from '@/constants';
import { useLazyQuery } from '@apollo/client';
import { getTopCaregivers, getTopCaregiversVariables } from '@/__generated__/getTopCaregivers';
import GET_TOP_CAREGIVERS from '@/components/request/TopCaregiversGQL';
import { ComponentProps, useEffect, useRef } from 'react';
import { GetTopCaregiverStopwatch } from '@/components/features/Stopwatch/GetTopCaregiverStopWatch';
import {
  generateInputAndCallGetTopCaregivers,
  GetTopCaregiversPartialParams,
} from '@/components/pages/seeker/sc/getTopCaregiversHelper';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import AmpliHelper from '@/utilities/ampliAnalyticsHelper';

const whoNeedsCareOptions = [
  {
    label: 'My parent',
    value: 'PARENT',
  },
  {
    label: 'My spouse',
    value: 'SPOUSE',
  },
  {
    label: 'My grandparent',
    value: 'GRANDPARENT',
  },
  {
    label: 'My friend/extended relative',
    value: 'OTHER',
  },
];

const useStyles = makeStyles((theme) => ({
  radioList: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    margin: theme.spacing(0),
    '&:not(:last-child)': {
      marginBottom: theme.spacing(3),
    },
  },
  lovedOneLabel: {
    fontSize: '16px',
  },
  lovedOneContainer: {
    margin: theme.spacing(1, 0, 3, 0),
  },
  bulletPointList: {
    listStyleType: 'disc',
  },
  bulletPointItem: {
    marginLeft: theme.spacing(2),
    minHeight: '39px',
    display: 'list-item',
  },
  textBox: {
    fontFamily: theme.typography.fontFamily,
    backgroundColor: '#FFFFFF',
  },
  detailsBox: {
    width: '100%',
    fontFamily: theme.typography.fontFamily,
    borderRadius: '10px',
    boxShadow: '0 0 0 1px #C0C0C0',
    border: '5px solid transparent',
    fontSize: '14px',
    '-webkit-appearance': 'none',
    [theme.breakpoints.down('sm')]: {
      resize: 'none',
    },
  },
  nextButtonContainer: {
    padding: theme.spacing(4, 3, 0),
  },
  ageSelector: {
    width: '40%',
  },
  inputBox: {
    backgroundColor: '#FFF',
  },
  genderSelector: {
    width: '75%',
    marginBottom: theme.spacing(0),
  },
  subheader: {
    margin: theme.spacing(4, 0, 2, 0),
  },
  subtitle: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  examplesText: {
    marginBottom: theme.spacing(1),
  },
  radioGroup: {
    marginTop: theme.spacing(1),
  },
}));

type SegmentControlOptionsProps = ComponentProps<typeof SegmentControl>['options'];

function Page() {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    jobPost: { lovedOne, selfNeedsCare, comesFromFlow, zip, rate },
    helpTypes,
    leadAndConnect: { maxDistanceFromSeeker },
    typeOfCare,
  } = useSeekerState();

  const { flags } = useFeatureFlags();
  const leadConnectBucket =
    flags[CLIENT_FEATURE_FLAGS.LEAD_CONNECT_PROVIDER_NETWORK]?.variationIndex;
  const leadConnectFifteenCaregiversBucket =
    flags[CLIENT_FEATURE_FLAGS.LEAD_CONNECT_FIFTEEN_CAREGIVERS]?.variationIndex;
  const getTopCaregiverStopwatch = useRef(new GetTopCaregiverStopwatch('about-loved-one'));
  const isSelfFromLovedOne = lovedOne.whoNeedsCare === 'SELF';
  const isSelfFromNeedsCare = selfNeedsCare === true;
  const isSelf = isSelfFromLovedOne || isSelfFromNeedsCare;

  const genderOptions: SegmentControlOptionsProps = [
    { label: 'Female', value: 'FEMALE', selected: lovedOne.gender === 'FEMALE' },
    { label: 'Male', value: 'MALE', selected: lovedOne.gender === 'MALE' },
  ];

  const examples = isSelf
    ? [
        'Do you have any underlying conditions?',
        'What are your hobbies/interests?',
        'How would you like to structure your ideal day?',
      ]
    : [
        'Do they have any underlying conditions?',
        'What are their hobbies/interests?',
        'How would they structure their ideal day?',
      ];

  function handleGenderChange(value: Gender) {
    dispatch({ type: 'setLovedOneGender', gender: value });
  }

  function handleAgeChange(event: any) {
    dispatch({ type: 'setLovedOneAge', age: event.target.value });
  }

  function handleWhoNeedsCareChange(event: any) {
    dispatch({ type: 'setLovedOneWhoNeedsCare', whoNeedsCare: event.target.value });
  }

  function handleTextFieldChange(event: any) {
    dispatch({
      type: 'setLovedOneDetails',
      details: stripInvalidCharacters(event.target.value) ?? undefined,
    });
  }

  const handleNext = () => {
    const data = {
      job_step: 'about you',
      cta_clicked: 'next',
    };
    AnalyticsHelper.logEvent({
      name: 'Job Posted',
      data,
    });

    if (AmpliHelper.useAmpli(flags, typeOfCare)) {
      AmpliHelper.ampli.jobPostedWhoNeedsCare({
        ...AmpliHelper.getCommonData(),
        cta_clicked: 'next',
      });
    }

    router?.push(POST_A_JOB_ROUTES.IDEAL_CAREGIVER);
  };

  // Users stay on this page for a while, so warm up the cache for L+C
  const [getTopCaregiver, { data: getTopCaregiverSuccess, error: getTopCaregiverError }] =
    useLazyQuery<getTopCaregivers, getTopCaregiversVariables>(GET_TOP_CAREGIVERS);

  useEffect(() => {
    if (zip) {
      getTopCaregiverStopwatch.current.start();
      const getTopCaregiversPartialParams: GetTopCaregiversPartialParams = {
        zipcode: zip,
        rate,
        helpTypes,
      };
      generateInputAndCallGetTopCaregivers(
        leadConnectBucket,
        getTopCaregiversPartialParams,
        getTopCaregiver,
        maxDistanceFromSeeker,
        leadConnectFifteenCaregiversBucket
      );
    } else {
      router.push(SEEKER_ROUTES.LOCATION);
    }
  }, []);

  useEffect(() => {
    const getTopCaregiversPartialParams = { zipcode: zip!, rate, helpTypes };
    const params = {
      getTopCaregiverSuccess,
      getTopCaregiverError,
      desiredNumResults: NUMBER_OF_LEAD_CONNECT_RESULTS(leadConnectFifteenCaregiversBucket === 1),
      leadConnectBucket,
      getTopCaregiversPartialParams,
      maxDistanceFromSeeker,
      leadConnectFifteenCaregiversBucket,
    };

    if (maxDistanceFromSeeker === 10) {
      getTopCaregiverStopwatch.current.stop(params);
    }

    // For PN requests if we don't get enough results for 10 miles, push out to 20 miles
    if (
      zip &&
      (leadConnectBucket === 1 || leadConnectBucket === 2) &&
      getTopCaregiverSuccess &&
      getTopCaregiverSuccess.topCaregivers.length < 7 &&
      maxDistanceFromSeeker !== 20
    ) {
      dispatch({ type: 'setMaxDistanceFromSeeker', maxDistanceFromSeeker: 20 });
      generateInputAndCallGetTopCaregivers(
        leadConnectBucket,
        getTopCaregiversPartialParams,
        getTopCaregiver,
        20,
        leadConnectFifteenCaregiversBucket
      );
    }
  }, [getTopCaregiverSuccess, getTopCaregiverError]);

  useEnterKey(true, handleNext);

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Header>Share a few details about who needs care.</Header>
        </Grid>
        <span>
          {comesFromFlow || (!comesFromFlow && !isSelfFromNeedsCare) ? (
            <>
              <Grid item xs={12}>
                <Typography variant="h4" className={classes.subheader}>
                  Who needs care?
                </Typography>
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    className={classes.radioGroup}
                    aria-label="Who needs care"
                    name="who-needs-care"
                    onChange={handleWhoNeedsCareChange}
                    value={lovedOne.whoNeedsCare}>
                    {whoNeedsCareOptions.map((option) => (
                      <FormControlLabel
                        classes={{
                          label: classes.lovedOneLabel,
                        }}
                        control={<Radio />}
                        label={option.label}
                        value={option.value}
                        key={option.value}
                        labelPlacement="start"
                        className={classes.radioList}
                      />
                    ))}

                    {comesFromFlow || (!comesFromFlow && isSelfFromNeedsCare) ? (
                      <FormControlLabel
                        classes={{
                          label: classes.lovedOneLabel,
                        }}
                        control={<Radio />}
                        label="Myself"
                        value="SELF"
                        labelPlacement="start"
                        className={classes.radioList}
                      />
                    ) : null}
                  </RadioGroup>
                </FormControl>
              </Grid>
            </>
          ) : null}
        </span>
        <Grid item xs={12} className={classes.genderSelector}>
          <Typography variant="h4" className={classes.subtitle}>
            Gender
          </Typography>
          <SegmentControl options={genderOptions} onChange={handleGenderChange} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" className={classes.subtitle}>
            Age
          </Typography>
          <Select
            onChange={handleAgeChange}
            className={classes.ageSelector}
            inputProps={{
              className: classes.inputBox,
            }}
            value={lovedOne.age}>
            <MenuItem value="THIRTIES">30&apos;s</MenuItem>
            <MenuItem value="FORTIES">40&apos;s</MenuItem>
            <MenuItem value="FIFTIES">50&apos;s</MenuItem>
            <MenuItem value="SIXTIES">60&apos;s</MenuItem>
            <MenuItem value="SEVENTIES">70&apos;s</MenuItem>
            <MenuItem value="EIGHTIES">80&apos;s</MenuItem>
            <MenuItem value="NINETIES">90&apos;s</MenuItem>
            <MenuItem value="HUNDREDS">100&apos;s</MenuItem>
          </Select>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4" className={classes.subheader}>
          <strong>
            {isSelf ? 'What should we know about you?' : 'What should we know about them?'}
          </strong>
        </Typography>
        <Grid item xs={12} className={classes.lovedOneContainer}>
          <Typography variant="body2" className={classes.examplesText}>
            Examples:
          </Typography>
          <List className={classes.bulletPointList}>
            {examples.map((example) => (
              <ListItem key={example} disableGutters className={classes.bulletPointItem}>
                <Typography careVariant="body3">{example}</Typography>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12}>
          <TextareaAutosize
            className={classes.detailsBox}
            id="details"
            name="details"
            placeholder="Share details here"
            minRows={7}
            onChange={handleTextFieldChange}
            value={lovedOne.details}
          />
        </Grid>
        <Grid item xs={12} className={classes.nextButtonContainer}>
          <Button color="primary" variant="contained" size="large" onClick={handleNext} fullWidth>
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default Page;
