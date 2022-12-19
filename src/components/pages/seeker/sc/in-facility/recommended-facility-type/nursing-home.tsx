import React, { useEffect } from 'react';
import { makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import { Typography, Link } from '@care/react-component-lib';
import {
  IconIllustrationSmallPolaroids,
  IconIllustrationMediumChecklist,
  IconIllustrationLargeNursing,
} from '@care/react-icons';
import { SeniorLivingOptions } from '@/types/seeker';
import { redirectToProviderSearch } from '@/components/pages/seeker/czenProviderHelper/czenProviderHelper';

import IconCard from '@/components/IconCard';
import generateDynamicHeader from '@/components/pages/seeker/sc/in-facility/dynamicHeaderHelper';
import { useSeekerState, useAppDispatch } from '@/components/AppState';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

import RecommendedFacilityLayout from './layout';

const AnalyticsData = {
  lead_step: 'facility recommendation',
  lead_flow: 'mhp module',
  member_type: 'Seeker',
  cta_clicked: '',
};

const useStyles = makeStyles((theme) => ({
  textSpace: {
    marginTop: theme.spacing(2),
  },
  cardsContainer: {
    marginTop: theme.spacing(4),
  },
}));

const NursingHome = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { whoNeedsCare, zipcode } = useSeekerState();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch({
      type: 'setRecommendedHelpType',
      recommendedHelpType: SeniorLivingOptions.NURSING_HOME,
    });
  }, []);

  const handleFindCaregiver = () => {
    const data = {
      ...AnalyticsData,
      cta_clicked: 'Find a caregiver',
    };

    AnalyticsHelper.logEvent({
      name: 'Lead Create - Senior Living',
      data,
    });
    redirectToProviderSearch(zipcode, undefined, isDesktop);
  };

  const handleViewArticlesAndGuides = () => {
    const data = {
      ...AnalyticsData,
      cta_clicked: 'View articles and guides',
    };

    AnalyticsHelper.logEvent({
      name: 'Lead Create - Senior Living',
      data,
    });
    window.location.assign(
      'https://www.care.com/c/stories/15645/questions-ask-assisted-living-facility/'
    );
  };

  return (
    <RecommendedFacilityLayout
      icon={<IconIllustrationLargeNursing height="167px" width="200px" />}
      header={`A nursing home may be a good fit for ${generateDynamicHeader(
        whoNeedsCare!,
        'yourself',
        'your',
        ''
      )} given the extensive support needed.`}>
      <>
        <Typography careVariant="link3" className={classes.textSpace}>
          <span>
            We don’t currently have nursing homes available on our site, but you can try finding one
            via the
          </span>{' '}
          <Link
            inline
            careVariant="link3"
            rel="noreferrer"
            target="_blank"
            href="https://www.medicare.gov/care-compare/?providerType=NursingHome&redirect=true">
            Medicare website.
          </Link>{' '}
          <span>Otherwise, you can explore in-home options and resources by Care.com:</span>
        </Typography>
        <div className={classes.cardsContainer}>
          <IconCard
            header="Need in-home care in the meantime?"
            icon={<IconIllustrationSmallPolaroids size="65px" />}
            onClick={handleFindCaregiver}
            linkContent="Find a caregiver"
            iconTitle="Polaroids"
          />
          <IconCard
            header="Learn more about the senior care planning process"
            icon={<IconIllustrationMediumChecklist size="65px" />}
            onClick={handleViewArticlesAndGuides}
            linkContent="View articles and guides"
            iconTitle="Checklist"
          />
        </div>
      </>
    </RecommendedFacilityLayout>
  );
};

export default NursingHome;
