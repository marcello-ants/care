import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { makeStyles, Typography } from '@material-ui/core';
import { Icon64BrandActionSuccessFilled } from '@care/react-icons';
import { Pill, StatelessSelector } from '@care/react-component-lib';
import Header from '@/components/Header';
import { useAppDispatch, useLtcgState } from '@/components/AppState';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { LTCG_ROUTES } from '@/constants';

import { YesOrNoAnswer } from '@/__generated__/globalTypes';

const useStyles = makeStyles((theme) => ({
  pillTitle: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  iconContainer: {
    width: 56,
    height: 56,
    marginBottom: theme.spacing(3),
  },

  selector: {
    '& .MuiListItem-root': {
      marginBottom: 0,
    },
  },
}));

function EligiblePolicy() {
  const classes = useStyles();
  const { caregiverNeeded } = useLtcgState();
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    AnalyticsHelper.logScreenViewed('eligible-policy', 'ltcg experience');
  }, []);

  const handleSelection = ([selection]: string[]) => {
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data: {
        screen_name: 'eligible-policy',
        source: 'ltcg experience',
        cta_clicked: selection.toString(),
      },
    });
    dispatch({ type: 'setLtcgCaregiverNeeded', caregiverNeeded: selection as YesOrNoAnswer });
    if (selection === YesOrNoAnswer.YES) {
      router.push(LTCG_ROUTES.WHERE);
    } else {
      router.push(LTCG_ROUTES.DETAILS_ABOUT_YOURSELF);
    }
  };

  return (
    <>
      <div className={classes.iconContainer}>
        <Icon64BrandActionSuccessFilled size={67} />
      </div>

      <Header>Good news! Your policy is eligible for use with Care.com.</Header>
      <Typography variant="h4" className={classes.pillTitle}>
        Do you need to find a caregiver?
      </Typography>
      <StatelessSelector
        onChange={handleSelection}
        single
        className={classes.selector}
        value={caregiverNeeded}>
        <Pill label="Yes" value={YesOrNoAnswer.YES} size="md" />
        <Pill label="No" value={YesOrNoAnswer.NO} size="md" />
      </StatelessSelector>
    </>
  );
}

export default EligiblePolicy;
