import getConfig from 'next/config';
import { Box, Button, Grid, List, ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Banner, Typography } from '@care/react-component-lib';
import { Icon24UtilityBullet } from '@care/react-icons';

import { useSeekerCCState } from '@/components/AppState';
import { logChildCareEvent } from '@/utilities/childCareAnalyticsHelper';
import { CC_PRE_RATE_CARD_PATH } from '@/constants';

const useStyles = makeStyles((theme) => ({
  nextButtonContainer: {
    padding: theme.spacing(2.5, 0, 3),
    marginBottom: theme.spacing(51.5),
  },
  sectionOneTitle: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(3),
  },
  whatNextWrapper: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  listLabel: {
    paddingLeft: '10px',
  },
  listWrap: {
    marginTop: theme.spacing(2),
  },
}));

// Constants
const {
  publicRuntimeConfig: { CZEN_GENERAL },
} = getConfig();

const nextSteps = [
  { infoText: 'Continue with a basic plan or go Premium', key: 'upgrade' },
  { infoText: "We'll alert you with interested caregivers", key: 'interested' },
  { infoText: "Choose the caregiver that's the best fit", key: 'chooseCargiver' },
];

export default function Home() {
  const classes = useStyles();
  const { enrollmentSource } = useSeekerCCState();

  const handleNext = () => {
    logChildCareEvent('Job Posted', 'PAJ - Finish', enrollmentSource);
    window.location.assign(CC_PRE_RATE_CARD_PATH(CZEN_GENERAL));
  };

  return (
    <>
      <Box ml={1} mr={1}>
        <Banner type="confirmation" width="100%" roundCorners>
          <Typography variant="body2">Thanks for sharing!</Typography>
        </Banner>
      </Box>
      <Grid container className={classes.whatNextWrapper}>
        <Grid item xs={12}>
          <Typography variant="h2" color="textPrimary" className={classes.sectionOneTitle}>
            What’s next
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.listWrap}>
          <List>
            {nextSteps.map((step) => (
              <ListItem disableGutters key={step.key}>
                <Grid container>
                  <Icon24UtilityBullet />
                  <div className={classes.listLabel}>{step.infoText}</div>
                </Grid>
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item xs={12} className={classes.nextButtonContainer}>
          <Button color="primary" variant="contained" size="large" fullWidth onClick={handleNext}>
            Got it
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
