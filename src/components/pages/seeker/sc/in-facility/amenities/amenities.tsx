import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { StatelessSelector, Pill } from '@care/react-component-lib';
import { Grid, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Header from '@/components/Header';
import FixElementToBottom from '@/components/FixElementToBottom';

import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { SEEKER_IN_FACILITY_ROUTES } from '@/constants';
import { SeniorCareFacilityAmenity } from '@/__generated__/globalTypes';

const useStyles = makeStyles((theme) => ({
  selector: {
    '& .MuiListItem-root': {
      marginBottom: theme.spacing(0),
      paddingBottom: `${theme.spacing(0.5)}px !important`,
    },
    '&:first-child': {
      paddingTop: `0px !important`,
    },
  },
  bodyText: {
    fontWeight: 'normal',
    lineHeight: '24px',
    margin: theme.spacing(1, 0, 2),
  },
  buttonContainer: {
    padding: 0,
  },
}));

const options = [
  { label: 'Pet friendly', value: SeniorCareFacilityAmenity.PET_FRIENDLY },
  {
    label: 'Art classes',
    value: SeniorCareFacilityAmenity.ART_CLASSES,
  },
  {
    label: 'Exercise groups',
    value: SeniorCareFacilityAmenity.EXERCISE_GROUPS,
  },
  { label: 'Community dining', value: SeniorCareFacilityAmenity.COMMUNITY_DINING },
  {
    label: 'Library',
    value: SeniorCareFacilityAmenity.LIBRARY,
  },
  {
    label: 'Beauty salon',
    value: SeniorCareFacilityAmenity.BEAUTY_SALON,
  },
];

const AmenitiesPage = () => {
  const [amenities, setAmenities] = useState<SeniorCareFacilityAmenity[]>([]);
  const router = useRouter();
  const classes = useStyles();

  useEffect(() => {
    AnalyticsHelper.logEvent({ name: 'Screen Viewed' });
  }, []);

  const handleChange = (values: SeniorCareFacilityAmenity[]) => setAmenities(values);

  const handleNext = () => {
    const eventInfo = {
      name: 'Member enrolled',
      data: {
        vertical: 'Seniorcare',
        enrollment_step: 'amenities',
        member_type: 'Seeker',
        cta_clicked: 'Next',
        amenities_selected: amenities.join(','),
      },
    };
    AnalyticsHelper.logEvent(eventInfo);

    router.push(SEEKER_IN_FACILITY_ROUTES.RECAP);
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Header>
          Communities often offer activities and amenities. Is your loved one interested in any of
          these?
        </Header>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2" className={classes.bodyText}>
          Select all that apply.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <StatelessSelector className={classes.selector} value={amenities} onChange={handleChange}>
          {options.map((option) => (
            <Pill key={option.value} size="md" {...option} />
          ))}
        </StatelessSelector>
      </Grid>
      <FixElementToBottom useFade>
        <div className={classes.buttonContainer}>
          <Button size="large" color="primary" variant="contained" fullWidth onClick={handleNext}>
            Next
          </Button>
        </div>
      </FixElementToBottom>
    </Grid>
  );
};

AmenitiesPage.disableScreenViewed = true;

export default AmenitiesPage;
