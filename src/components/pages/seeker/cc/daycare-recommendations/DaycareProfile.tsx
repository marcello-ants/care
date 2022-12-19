/* eslint-disable react/require-default-props */
import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import { useTheme, useMediaQuery, makeStyles, Grid, Button, Box } from '@material-ui/core';
import { BottomDrawer, SideDrawer, Typography } from '@care/react-component-lib';

import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import CustomGoogleMap from '@/components/features/googleMap/googleMap';
import { DaycareProviderProfile } from '@/types/seekerCC';
import { findChildCareProviders_findChildCareProviders_ProviderSearchSuccess_providers_address as ProviderAddress } from '@/__generated__/findChildCareProviders';
import { VERTICALS_NAMES } from '@/constants';
import { useFlowState, useSeekerCCState } from '@/components/AppState';
import { CenterType } from '@/__generated__/globalTypes';
import { DaycareCenterBadge, InHomeDaycareBadge, LicenseBadge, RatingBadge } from './Badges';
import DaycareRatingReview from './DaycareRatingReview';

const useStyles = makeStyles((theme) => ({
  closeButton: {
    alignSelf: 'center',
  },
  header: {
    borderBottom: `1px solid ${theme.palette.care.grey[300]}`,
  },
  imagePrimary: {
    width: '100%',
  },
  imageContainer: {
    [theme.breakpoints.up('md')]: {
      width: '433px',
      height: '279px',
      justifyContent: 'unset',
      alignItems: 'unset',
      marginRight: theme.spacing(1),
    },
    width: '100%',
    minHeight: '202px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: '10px',
    '& img': {
      flexShrink: '0',
      minWidth: '100%',
      minHeight: '100%',
    },
  },
  licenseDate: {
    marginLeft: '4px',
    color: theme.palette.care.grey[600],
  },
  requirementsList: {
    paddingLeft: theme.spacing(2),
  },
  moreReviewsButton: {
    width: '270px',
  },
  line: {
    border: 0,
    borderTop: `1px solid ${theme.palette.care.grey[300]}`,
  },
  map: {
    [theme.breakpoints.up('md')]: {
      width: '286px',
      height: '279px',
    },
    width: '100%',
    height: '221px',
  },
  reviewsTitle: {
    marginRight: theme.spacing(1),
  },
}));

const drawerDesktopProps = { hideCloseButton: true };

interface DaycareProfileProps {
  isOpen: boolean;
  dayCare?: DaycareProviderProfile;
  onClose: () => void;
}

const mapProviderAddress = (address: ProviderAddress): string => {
  let addressFormatted = '';

  if (address.addressLine1) {
    addressFormatted = `${addressFormatted}${address.addressLine1},`;
  }

  if (address.city) {
    addressFormatted = `${addressFormatted} ${address.city},`;
  }

  if (address.state) {
    addressFormatted = `${addressFormatted} ${address.state}`;
  }

  if (address.zip) {
    addressFormatted = `${addressFormatted} ${address.zip}`;
  }

  return addressFormatted;
};

export default function DaycareProfile({ isOpen, onClose, dayCare }: DaycareProfileProps) {
  const classes = useStyles();
  const { memberId } = useFlowState();
  const {
    enrollmentSource,
    dayCare: { recommendationsTrackingId },
  } = useSeekerCCState();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isMobile = !isDesktop;
  const Drawer = isDesktop ? SideDrawer : BottomDrawer;
  const {
    dayCare: { shouldShowMap },
  } = useSeekerCCState();

  const map = (
    <CustomGoogleMap
      config={{
        containerClassName: classes.map,
        options: {
          disableDefaultUI: true,
          center: {
            lat: dayCare?.address?.latitude ? dayCare.address?.latitude : 0,
            lng: dayCare?.address?.longitude ? dayCare.address?.longitude : 0,
          },
        },
      }}
      data={{
        markers: [
          {
            position: {
              lat: dayCare?.address?.latitude ? dayCare.address?.latitude : 0,
              lng: dayCare?.address?.longitude ? dayCare.address?.longitude : 0,
            },
            title: dayCare?.name ? dayCare.name : '',
            icon: '/app/enrollment/pin.svg',
          },
        ],
      }}
    />
  );

  useEffect(() => {
    if (isOpen) {
      AnalyticsHelper.logEvent({
        name: 'Screen Viewed',
        data: {
          member_type: 'Seeker',
          vertical: VERTICALS_NAMES.CHILD_CARE,
          enrollment_flow: enrollmentSource,
          enrollment_step: 'recommendation_profile',
          tracking_id: recommendationsTrackingId,
          provider_id: dayCare!.id,
          member_id: memberId,
        },
      });
    }
  }, [isOpen]);

  return (
    <Drawer open={isOpen} anchor="right" onClose={onClose} {...(isDesktop && drawerDesktopProps)}>
      {!dayCare ? null : (
        <>
          {isMobile && (
            <Box paddingLeft={3} paddingRight={3} paddingBottom={1}>
              <Grid container>
                {dayCare.license && dayCare.license.certified && (
                  <LicenseBadge
                    name={dayCare.license.name ?? ''}
                    verifiedDate={dayCare.license.verifiedDate}
                  />
                )}
                {dayCare.avgReviewRating > 0 && (
                  <RatingBadge label={dayCare.avgReviewRating.toFixed(1)} />
                )}

                {dayCare.centerType === CenterType.FCC ? (
                  <InHomeDaycareBadge />
                ) : (
                  <DaycareCenterBadge />
                )}
              </Grid>
              <Box marginTop="8px" marginBottom="4px">
                <Typography variant="h1">{dayCare.name}</Typography>
              </Box>
            </Box>
          )}
          {isDesktop && (
            <Box
              width="783px"
              paddingLeft={3}
              paddingRight={3}
              paddingBottom={2}
              className={classes.header}>
              <Grid container justifyContent="space-between" wrap="nowrap">
                <Grid item container direction="column">
                  <Grid container>
                    {dayCare.license && dayCare.license.certified && (
                      <LicenseBadge
                        name={dayCare.license.name ?? ''}
                        verifiedDate={dayCare.license.verifiedDate}
                      />
                    )}
                    {dayCare.avgReviewRating > 0 && (
                      <RatingBadge label={dayCare.avgReviewRating.toFixed(1)} />
                    )}

                    {dayCare.centerType === CenterType.FCC ? (
                      <InHomeDaycareBadge />
                    ) : (
                      <DaycareCenterBadge />
                    )}
                  </Grid>
                  <Box marginTop="8px" marginBottom="4px">
                    <Typography variant="h2">{dayCare.name}</Typography>
                  </Box>
                  {dayCare.address && (
                    <Typography variant="subtitle2">
                      {mapProviderAddress(dayCare.address)}
                    </Typography>
                  )}
                </Grid>
                <Grid item className={classes.closeButton}>
                  <Button color="secondary" variant="outlined" size="small" onClick={onClose}>
                    Close
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
          <Box
            width={isDesktop ? '783px' : 'auto'}
            paddingTop={isDesktop ? 3 : 0}
            paddingLeft={3}
            paddingRight={3}
            paddingBottom={2}>
            {isMobile && (
              <Box marginBottom={2}>
                <Grid container direction="row" alignContent="center">
                  {dayCare.address && (
                    <Typography variant="subtitle2">
                      {mapProviderAddress(dayCare.address)}
                    </Typography>
                  )}
                </Grid>
              </Box>
            )}
            {dayCare.images && dayCare.images.length > 0 && (
              <Grid container>
                <Grid item className={classes.imageContainer}>
                  {dayCare.images[0].urlOriginal && (
                    <img
                      className={classes.imagePrimary}
                      src={dayCare.images[0].urlOriginal}
                      alt={dayCare.name ? dayCare.name : ''}
                    />
                  )}
                </Grid>
                {shouldShowMap && isDesktop && (
                  <Grid item>
                    <Box marginLeft={1}>{map}</Box>
                  </Grid>
                )}
              </Grid>
            )}
            {shouldShowMap && isMobile && (
              <Box marginTop={2} marginBottom={1}>
                {map}
              </Box>
            )}
            {dayCare.license && dayCare.license.certified && (
              <>
                <Box marginTop={3}>
                  <Typography variant="h3">Licensing Information</Typography>
                </Box>
                {dayCare.license.certified && dayCare.license.verifiedDate && (
                  <Box marginTop={3}>
                    <Typography variant="h4">State License Status</Typography>
                    <Box marginTop="4px">
                      <Grid container>
                        <Typography variant="subtitle2">Full Permit</Typography>
                        {dayCare.license.verifiedDate && (
                          <Typography variant="subtitle2" className={classes.licenseDate}>
                            {`(Care.com verified on ${dayjs(dayCare.license.verifiedDate).format(
                              'MM/DD/YYYY'
                            )})`}
                          </Typography>
                        )}
                      </Grid>
                    </Box>
                  </Box>
                )}
                <Box marginTop={4}>
                  <Typography variant="h4">What this means</Typography>
                </Box>
                <Box marginTop={1}>
                  <Typography variant="body2">
                    <span>This business has satisfied&nbsp;</span>
                    {dayCare.license.administrativeArea}
                    <span>
                      &apos;s requirements to be licensed. For the most up-to-date status and
                      inspection reports, please view this provider&apos;s profile on&nbsp;
                    </span>
                    {dayCare.license.externalUrl && (
                      <a href={dayCare.license.externalUrl} target="_blank" rel="noreferrer">
                        {dayCare.license.administrativeArea}&apos;s licensing website.
                      </a>
                    )}
                  </Typography>
                </Box>
                <Box marginTop={4}>
                  <Typography variant="h4">Licensing requirements typically include:</Typography>
                </Box>
                <Box marginTop={1}>
                  <ul className={classes.requirementsList}>
                    <li>Complying with safety and health inspections</li>
                    <li>Achieving the required levels of educational training</li>
                    <li>Maintaining a minimum caregiver-to-child ratio</li>
                    <li>Other state-defined requirements</li>
                  </ul>
                </Box>
                <Box marginTop={3} marginBottom={3}>
                  <hr className={classes.line} />
                </Box>
              </>
            )}
            <Box marginBottom={3} />
            {dayCare.description && (
              <>
                <Typography variant="h3">About us</Typography>
                <Box marginTop={2}>
                  <Typography variant="body2">{dayCare.description}</Typography>
                </Box>
              </>
            )}

            <Box marginTop={3} marginBottom={3}>
              <hr className={classes.line} />
            </Box>

            {dayCare.reviews && dayCare.reviews.length > 0 ? (
              <>
                <Box marginBottom={3}>
                  <Grid item container>
                    <Typography variant="h3" className={classes.reviewsTitle}>
                      {dayCare.reviews.length} {dayCare.reviews.length > 1 ? 'Reviews' : 'Review'}
                    </Typography>
                    <RatingBadge label={dayCare.avgReviewRating.toFixed(1)} />
                  </Grid>
                </Box>
                {dayCare.reviews.map((review, i) => (
                  <>
                    {review &&
                      review.reviewer?.firstName &&
                      review.reviewer.lastName &&
                      review.rating &&
                      review.text && (
                        // eslint-disable-next-line react/no-array-index-key
                        <Box key={i} marginBottom={4}>
                          <DaycareRatingReview
                            author={`${review.reviewer.firstName} ${review.reviewer.lastName}`}
                            rating={review.rating}
                            text={review.text}
                          />
                        </Box>
                      )}
                  </>
                ))}
              </>
            ) : (
              <Box marginBottom={3}>
                <Typography variant="h3">No Reviews</Typography>
                <Typography variant="body2">There are no reviews for this daycare yet.</Typography>
              </Box>
            )}
          </Box>
        </>
      )}
    </Drawer>
  );
}
