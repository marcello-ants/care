import { Grid, makeStyles } from '@material-ui/core';
import { StatelessSelector, Pill, Typography } from '@care/react-component-lib';
import Header from '@/components/Header';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { useAppDispatch, useSeekerState } from '@/components/AppState';
import useNextRoute from '@/components/hooks/useNextRoute';
import logger from '@/lib/clientLogger';
import { SEEKER_IN_FACILITY_ROUTES, SEEKER_ROUTES, CLIENT_FEATURE_FLAGS } from '@/constants';
import { useRouter } from 'next/router';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';

import { SENIOR_CARE_TYPE } from '@/__generated__/globalTypes';
import AmpliHelper from '@/utilities/ampliAnalyticsHelper';

const useStyles = makeStyles((theme) => ({
  selector: {
    '& .MuiListItem-root': {
      [theme.breakpoints.up('md')]: {
        paddingBottom: `${theme.spacing(0.75)}px !important`,
        paddingTop: `${theme.spacing(0.75)}px !important`,
        '&:last-child': {
          paddingBottom: '0px !important',
        },
        '&:first-child': {
          paddingTop: `${theme.spacing(1)}px !important`,
        },
      },
      marginBottom: theme.spacing(0),
    },
    marginTop: theme.spacing(2),
  },
  hero: {
    margin: '0 auto',
    height: 225,
    width: '100%',
    maxWidth: 410,
    [theme.breakpoints.up('md')]: {
      borderRadius: 16,
    },
  },
  heroContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(-3, -3, 3),
    },
    [theme.breakpoints.up('md')]: {
      borderRadius: 16,
    },
    maxWidth: 440,
    flexDirection: 'column',
    marginBottom: theme.spacing(3),
    height: 225,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  heroText: {
    color: 'white',
    padding: theme.spacing(0, 3),
    // targeting iPhone 5 and smaller devices, to keep consistency on the hero text
    '@media all and (max-device-width: 320px)': {
      padding: '0px 24px',
      fontSize: '25px',
    },
    fontSize: '1.75rem',
    fontWeight: 'bold',
    lineHeight: '2rem',
    marginBottom: theme.spacing(2),
  },
}));

const pillOptions = [
  {
    label: 'In-home care',
    value: SENIOR_CARE_TYPE.IN_HOME,
  },
  {
    label: 'Senior living community',
    value: SENIOR_CARE_TYPE.IN_FACILITY,
  },
  {
    label: 'I am not sure yet',
    value: SENIOR_CARE_TYPE.NOT_SURE,
  },
];

export default function Home() {
  const dispatch = useAppDispatch();
  const { pushNextRoute } = useNextRoute();
  const router = useRouter();
  const { typeOfCare: oldTypeOfCare } = useSeekerState();
  const classes = useStyles();
  const featureFlags = useFeatureFlags();
  const recommendationOptimizationVariation =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION];
  const isRecommendationOptimizationVariation =
    recommendationOptimizationVariation?.variationIndex === 1;
  const handleChange = (value: string[]) => {
    // onChange fires on render had to do a check for router to stop redirecting when first rendered
    if (value.length) {
      const data = {
        enrollment_step: 'type of care sc',
        cta_clicked: value,
        member_type: 'Seeker',
      };
      AnalyticsHelper.logEvent({
        name: 'Member Enrolled',
        data,
      });

      if (AmpliHelper.useAmpli(featureFlags.flags)) {
        AmpliHelper.ampli.memberEnrolledTypeOfSeniorCareNeed({
          ...AmpliHelper.getCommonData(),
          cta_clicked: value?.[0],
          member_type: 'seeker',
        });
      }

      const typeOfcare = value[0] as SENIOR_CARE_TYPE;
      logger.info({ event: 'seniorCareSeekerTypeOfCareSelection', typeOfcare });
      dispatch({ type: 'setTypeOfCare', typeOfcare });

      // We can't rely on useNextRoute yet since typeOfcare is not yet available in that context
      if (typeOfcare === SENIOR_CARE_TYPE.IN_FACILITY) {
        AnalyticsHelper.logTestExposure(
          CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION,
          recommendationOptimizationVariation
        );

        if (isRecommendationOptimizationVariation) {
          router.push(SEEKER_IN_FACILITY_ROUTES.LOCATION_OPTIMIZED_FLOW);
        } else {
          router.push(SEEKER_IN_FACILITY_ROUTES.CARE_TRUST);
        }
      } else if (oldTypeOfCare === SENIOR_CARE_TYPE.IN_FACILITY) {
        router.push(SEEKER_ROUTES.HELP_TYPE);
      } else {
        pushNextRoute();
      }
    }
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <div
            className={classes.heroContainer}
            style={{
              backgroundImage: `url(/app/enrollment/sc-seeker-enrollment-imageTest-gradient.jpeg)`,
            }}
            title="Find trusted senior care near you">
            <Typography align="left" className={classes.heroText}>
              <span>Find trusted senior care&nbsp;</span>
              <br />
              <span>&nbsp;near you</span>
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Header>What type of care are you interested in?</Header>
        </Grid>
        <Grid item xs={12}>
          <StatelessSelector
            onChange={handleChange}
            name="careType"
            single
            className={classes.selector}>
            {pillOptions.map((pill) => (
              <Pill key={pill.value} {...pill} size="md" />
            ))}
          </StatelessSelector>
        </Grid>
      </Grid>
    </>
  );
}
