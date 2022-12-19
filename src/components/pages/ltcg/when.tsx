import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Grid, makeStyles } from '@material-ui/core';
import { StatelessSelector, Pill } from '@care/react-component-lib';
import Header from '@/components/Header';

import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { LTCG_ROUTES } from '@/constants';
import { WhenOptions, WhenOptionsMap } from '@/types/ltcg';
import { useAppDispatch, useLtcgState } from '@/components/AppState';

const options = Object.keys(WhenOptionsMap).map((value) => ({
  label: WhenOptionsMap[value as WhenOptions],
  value,
}));

const useStyles = makeStyles((theme) => ({
  selector: {
    marginTop: theme.spacing(2),
    '& .MuiListItem-root': {
      marginBottom: 0,
      paddingBottom: theme.spacing(2),
    },
  },
}));

function WhenPage() {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { careDate } = useLtcgState();

  const handleOptionClick = (value: WhenOptions[]) => {
    dispatch({ type: 'setLtcgCareDate', careDate: value[0] });
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data: {
        screen_name: 'where',
        source: 'ltcg experience',
        cta_clicked: value[0],
        enrollment_step: 'intent',
      },
    });

    router.push(LTCG_ROUTES.DETAILS_ABOUT_YOURSELF);
  };

  useEffect(() => {
    AnalyticsHelper.logScreenViewed('when', 'ltcg experience');
  }, []);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Header>How soon are you wanting to hire a caregiver?</Header>
      </Grid>
      <Grid item xs={12}>
        <StatelessSelector
          single
          className={classes.selector}
          onChange={handleOptionClick}
          value={careDate}>
          {options.map((opt) => (
            <Pill key={opt.label} {...opt} size="md" />
          ))}
        </StatelessSelector>
      </Grid>
    </Grid>
  );
}

export default WhenPage;
