import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Link } from '@care/react-component-lib';
import { IconIllustrationMediumChecklist, IconIllustrationSmallPolaroids } from '@care/react-icons';
import { helpTypesToServices } from '@/types/seeker';
import { useAppDispatch, useAppState } from '@/components/AppState';
import Header from '@/components/Header';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { LEAD_SOURCES, POST_A_JOB_ROUTES } from '@/constants';
import { useRouter } from 'next/router';
import { Age } from '@/types/common';
import { SENIOR_CARE_TYPE } from '@/__generated__/globalTypes';
import IconCard from '@/components/IconCard';
import {
  withPotentialMember,
  WithPotentialMemberProps,
} from '@/components/features/potentialMember/withPotentialMember';

const useStyles = makeStyles((theme) => ({
  facilitiesButton: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  textContainer: {
    marginBottom: theme.spacing(2),
  },

  otherOptionsText: {
    marginBottom: theme.spacing(3),
  },
  blueText: {
    color: theme.palette.care?.blue[700],
  },
  marginBottom: {
    marginBottom: theme.spacing(1),
  },
}));

function Options(props: WithPotentialMemberProps) {
  const classes = useStyles();
  const { seeker: seekerState } = useAppState();
  const { helpTypes, zipcode, whoNeedsCareAge, recommendedHelpType } = seekerState;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { userHasAccount } = props;

  useEffect(() => {
    AnalyticsHelper.logEvent({
      name: 'Screen Viewed',
      data: {
        source: userHasAccount ? LEAD_SOURCES.NTH_DAY : LEAD_SOURCES.ENROLLMENT,
      },
    });
  }, []);

  const handleInHomeCardClick = () => {
    if (whoNeedsCareAge) {
      dispatch({
        type: 'setLovedOneAge',
        age: whoNeedsCareAge as Age,
      });
    }

    dispatch({
      type: 'setSeekerParams',
      servicesNeeded: helpTypesToServices(helpTypes),
      typeOfCare: SENIOR_CARE_TYPE.IN_HOME,
      zip: zipcode,
    });

    const data = {
      enrollment_step: 'options in facility sc',
      member_type: 'Seeker',
      cta_clicked: 'Get started',
    };
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data,
    });
    router.push(POST_A_JOB_ROUTES.POST_A_JOB);
  };

  const handleLearningCardClick = () => {
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data: {
        enrollment_step: 'options in facility sc',
        member_type: 'Seeker',
        cta_clicked: 'View articles and guides',
      },
    });
    window.location.assign(
      'https://www.care.com/c/stories/15645/questions-ask-assisted-living-facility/'
    );
  };

  return (
    <Grid container>
      <>
        <Grid item xs={12} className={classes.textContainer}>
          <Header>Unfortunately, no communities on Care.com match your needs.</Header>
        </Grid>
        <Grid item xs={12}>
          {recommendedHelpType === 'NURSING_HOME' ? (
            <Typography variant="body2" className={classes.otherOptionsText}>
              <span>
                We don’t currently have nursing homes available in your area, but you can try
                finding one via the
              </span>{' '}
              <Link
                inline
                careVariant="link3"
                rel="noreferrer"
                target="_blank"
                href="https://www.medicare.gov/care-compare/?providerType=NursingHome&redirect=true">
                Medicare website
              </Link>
              <span>. Otherwise, you can explore in-home options and resources by Care.com:</span>
            </Typography>
          ) : (
            <Typography variant="body2" className={classes.otherOptionsText}>
              While you continue your senior living community search, Care.com is here to help
            </Typography>
          )}
        </Grid>
      </>
      <Grid item xs={12}>
        <IconCard
          icon={<IconIllustrationSmallPolaroids size="64px" />}
          iconTitle="Find an in-home caregiver"
          header="Find an in-home caregiver"
          linkContent="Get started"
          onClick={handleInHomeCardClick}
        />
        <IconCard
          icon={<IconIllustrationMediumChecklist size="64px" />}
          iconTitle="Learn more about the senior care planning process"
          header="Learn more about the senior care planning process"
          linkContent="View articles and guides"
          onClick={handleLearningCardClick}
        />
      </Grid>
    </Grid>
  );
}

Options.disableScreenViewed = true;

export default withPotentialMember(Options);
