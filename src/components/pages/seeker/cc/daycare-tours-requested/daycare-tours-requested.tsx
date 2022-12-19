// External Dependencies
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Grid, makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { getUserEmail } from '@/lib/AuthService';

// Custom Dependencies
import { Typography, Link } from '@care/react-component-lib';
import {
  IconIllustrationMediumStar,
  Icon24UtilityCheckmark,
  Icon24UtilityNextArrow,
} from '@care/react-icons';

// Internal Dependencies
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { SEEKER_DAYCARE_CHILD_CARE_ROUTES } from '@/constants';
import { hash256, getLeadCountSMB, getLeadCountNational } from '@/utilities/account-creation-utils';
import { TealiumData, TealiumUtagService } from '@/utilities/utagHelper';
import { ServiceType } from '@/__generated__/globalTypes';
import { useSeekerCCState, useAppState } from '@/components/AppState';

// Styles
const useStyles = makeStyles((theme) => ({
  listItem: {
    paddingLeft: theme.spacing(0),
    alignItems: 'unset',
    '& p': {
      display: 'inline',
    },
  },
  subtitle: {
    fontWeight: 'bold',
  },
  buttonEndIcon: {
    display: 'inline',
    margin: 0,
    position: 'absolute',
    right: '20px',
    top: '16px',
  },
}));

// Types
type LinkType = 'licensing' | 'interview' | 'costs';

// Constants
const LINKURLS = {
  licensing: 'https://www.care.com/c/stories/16111/child-care-center-licensing-by-state/',
  interview: 'https://www.care.com/c/stories/10258/the-day-care-guide-interviewing-day-cares/',
  costs: 'https://www.care.com/c/stories/10259/the-day-care-guide-the-cost-of-day-care/',
};

/**
 * Builds and displays the "Tours Requested" view in the Day Care Flow.
 *
 * @returns JSX "Tours Requested" view.
 */
function DaycareToursRequested() {
  const classes = useStyles();
  const router = useRouter();
  const { dayCare, careKind, careDate } = useSeekerCCState();
  const {
    flow: { memberId, czenJSessionId },
  } = useAppState();

  // Handlers
  function handleContinue() {
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data: {
        cta_clicked: 'continue',
      },
    });

    router.push(SEEKER_DAYCARE_CHILD_CARE_ROUTES.ACCOUNT_PASSWORD);
  }

  function handleLinksClick(linkType: LinkType) {
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data: {
        cta_clicked: linkType,
      },
    });

    window.location.assign(LINKURLS[linkType]);
  }

  // Amplitude Tracking - Page Loading
  useEffect(() => {
    const amplitudeData = {
      screen_name: 'toursrequested',
      member_type: 'seeker',
    };
    AnalyticsHelper.logEvent({
      name: 'Screen Viewed',
      data: amplitudeData,
    });

    hash256(getUserEmail()).then((hash) => {
      const emailSHA256 = hash;
      const slots = ['/us-marketplace/daycare/leads-submitted/'];
      const leadCountSMB = getLeadCountSMB(dayCare.recommendations);
      const leadCountNational = getLeadCountNational(dayCare.recommendations);

      const tealiumData: TealiumData = {
        ...(memberId && { memberId }),
        tealium_event: 'DAYCARE_LEADS_SUBMITTED',
        leadCount: dayCare.recommendations.reduce(
          (accepted, recommentation) => (recommentation.selected ? accepted + 1 : accepted),
          0
        ),
        leadCountSMB,
        leadCountNational,
        sessionId: czenJSessionId,
        slots,
        email: getUserEmail(),
        emailSHA256,
        memberType: 'seeker',
        overallStatus: 'basic',
        serviceId: ServiceType.CHILD_CARE,
        subServiceId: careKind,
        intent: careDate,
      };

      TealiumUtagService.view(tealiumData);
    });
  }, []);

  return (
    <Grid container>
      <Box pl={1} pr={1}>
        <Grid item xs={12}>
          <IconIllustrationMediumStar size="125px" />
          <Typography variant="h2">Your tours were requested!</Typography>
          <Box mt={1}>
            <Typography variant="body2">Daycares will contact you shortly.</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box mt={4}>
            <Typography variant="body1" className={classes.subtitle}>
              Things to know
            </Typography>
            <List component="nav">
              <ListItem className={classes.listItem}>
                <Icon24UtilityCheckmark />
                <Box ml={1}>
                  <Typography variant="body2">
                    Check licensing information and verify records.
                  </Typography>{' '}
                  <Link
                    variant="body2"
                    onClick={() => {
                      handleLinksClick('licensing');
                    }}>
                    Learn more
                  </Link>
                </Box>
              </ListItem>
              <ListItem className={classes.listItem}>
                <Icon24UtilityCheckmark />
                <Box ml={1}>
                  <Typography variant="body2">
                    Check out our tips on how to interview daycare providers.
                  </Typography>{' '}
                  <Link
                    variant="body2"
                    onClick={() => {
                      handleLinksClick('interview');
                    }}>
                    Learn more
                  </Link>
                </Box>
              </ListItem>
              <ListItem className={classes.listItem}>
                <Icon24UtilityCheckmark />
                <Box ml={1}>
                  <Typography variant="body2">
                    Care can be affordable. Learn about the different costs.
                  </Typography>{' '}
                  <Link
                    variant="body2"
                    onClick={() => {
                      handleLinksClick('costs');
                    }}>
                    Learn more
                  </Link>
                </Box>
              </ListItem>
            </List>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box mt={4}>
            <Button
              fullWidth
              size="large"
              color="primary"
              variant="contained"
              onClick={handleContinue}
              endIcon={
                <Icon24UtilityNextArrow color="#FFFFFF" className={classes.buttonEndIcon} />
              }>
              Continue
            </Button>
          </Box>
        </Grid>
      </Box>
    </Grid>
  );
}

export default DaycareToursRequested;
