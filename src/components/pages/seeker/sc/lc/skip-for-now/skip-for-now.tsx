import LcHeader from '@/components/LcHeader';
import { Button, makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import { Typography } from '@care/react-component-lib';
import { useFlowState, useSeekerState } from '@/components/AppState';
import CaregiversPreview from '@/components/features/caregiversPreview/CaregiversPreview';
import { redirectToProviderSearch } from '@/components/pages/seeker/czenProviderHelper/czenProviderHelper';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import logger from '@/lib/clientLogger';
import { useEffect } from 'react';
import { LEAD_CONNECT_CZEN_REDIRECT_MSG } from '@/constants';
import FullWidthLayout from '@/components/layouts/FullWidthLayout';
import LcContainer from '@/components/LcContainer';
import { providersToShow, providerProfileToCaregiver } from '../helpers';

const useStyles = makeStyles((theme) => ({
  paragraph: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(0, 3),
    [theme.breakpoints.up('md')]: {
      textAlign: 'center',
    },
  },
  buttonContainer: {
    padding: theme.spacing(3, 5),
    [theme.breakpoints.up('md')]: {
      alignSelf: 'center',
      paddingLeft: 0,
      paddingRight: 0,
      width: '295px',
    },
  },
  lcContainer: {
    paddingTop: theme.spacing(3),
  },
}));

function SkipForNow() {
  const seekerState = useSeekerState();
  const { memberId: seekerId } = useFlowState();
  const acceptedProviders = seekerState?.leadAndConnect?.acceptedProviders;
  const providers = providersToShow(acceptedProviders);
  const providersLength = providers.length;
  const classes = useStyles(providersLength);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    const amplitudeData = {
      screen_name: 'skippedMessaging',
      source: 'lead and connect',
      user_id: seekerId,
    };
    AnalyticsHelper.logEvent({
      name: 'Screen Viewed',
      data: amplitudeData,
    });
  }, []);

  return (
    <>
      <LcHeader
        header={`We’ve saved ${
          acceptedProviders.length > 1 ? 'these caregivers' : 'this caregiver'
        } to your favorites list so you can easily access them later`}
      />

      <LcContainer classes={{ root: classes.lcContainer }}>
        <CaregiversPreview
          caregivers={providers.map(providerProfileToCaregiver)}
          avatarProps={{ variant: 'rounded' }}
        />

        <Typography variant="body2" className={classes.paragraph}>
          In the meantime, we’ll send you to view our full list of caregivers.
        </Typography>
        <div className={classes.buttonContainer}>
          <Button
            size="large"
            color="primary"
            variant="contained"
            onClick={() => {
              const amplitudeData = {
                screen_name: 'skippedMessaging',
                source: 'lead and connect',
                cta_clicked: 'next',
                user_id: seekerId,
              };
              AnalyticsHelper.logEvent({
                name: 'CTA Interacted',
                data: amplitudeData,
              });
              logger.info({ event: LEAD_CONNECT_CZEN_REDIRECT_MSG });
              redirectToProviderSearch(seekerState.jobPost?.zip, undefined, isDesktop);
            }}
            fullWidth>
            Next
          </Button>
        </div>
      </LcContainer>
    </>
  );
}

SkipForNow.Layout = FullWidthLayout;

export default SkipForNow;
