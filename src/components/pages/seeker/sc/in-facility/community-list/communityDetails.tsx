import clsx from 'clsx';

import { Grid, makeStyles, Typography } from '@material-ui/core';
import { Divider, ReadMore } from '@care/react-component-lib';
import {
  Icon24InfoLocation,
  Icon24InfoPayments,
  Icon24UtilityCheckmark,
  Icon24UtilityMinus,
} from '@care/react-icons';
import CustomGoogleMap from '@/components/features/googleMap/googleMap';
import SkipOrSaveButton from '@/components/SkipOrSaveButton';
import { CommunityDetail, CommunityTypeDetail } from '@/types/seeker';
import { AppDispatch } from '@/types/app';
import CommunityServiceAmenitiesList from './CommunityServiceAmenitiesList';
import Carousel from './Carousel';

const useStyles = makeStyles((theme) => ({
  markerLabel: {
    marginTop: theme.spacing(7),
    maxWidth: '12ch',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  icon: {
    width: 24,
    height: 24,
  },
  copy: {
    marginLeft: theme.spacing(1),
  },
  locationContainer: {
    marginTop: theme.spacing(1),
  },
  actions: {
    padding: 0,
    borderTop: `1px solid ${theme.palette?.care?.grey[400]}`,
  },
  content: {
    padding: theme.spacing(0, 3, 3),
    flex: '1 1 auto',
    overflowY: 'auto',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(0, 10, 3, 4),
    },
  },
  drawerContainer: {
    maxWidth: 600,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 'calc(100% - 30px)',
  },
  servicesAndAmenities: {
    marginTop: theme.spacing(4),
  },
  divider: {
    margin: theme.spacing(4, 0),
  },
  seniorHousingHeader: {
    marginTop: ({ hasServicesOrAmenities }: { hasServicesOrAmenities: boolean }) =>
      hasServicesOrAmenities ? 0 : theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  aboutFacility: {
    marginBottom: theme.spacing(2),
  },
  drawerMap: {
    width: '100%',
    height: 206,
  },
  cityAndPrice: {
    marginBottom: theme.spacing(3),
  },
  cost: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  leftMargin: {
    marginLeft: theme.spacing(1),
  },
  seniorHousingListItem: {
    marginBottom: theme.spacing(2),
  },
  notAvailable: {
    opacity: 0.6,
  },
  bold: {
    ...theme.typography.h4,
  },
}));

function CommunityDetails({
  community,
  setIsDrawerOpen,
  savedFacilitiesIds,
  dispatch,
  fireAmplitudeEvent,
  displayCTA,
}: {
  community: CommunityDetail;
  setIsDrawerOpen: any;
  savedFacilitiesIds: string[];
  dispatch: AppDispatch;
  fireAmplitudeEvent: any;
  displayCTA: boolean;
}) {
  const hasServicesOrAmenities = Boolean(
    community.careServices ||
      community.onSiteServices ||
      community.facilityAmenities ||
      community.foodAmenities
  );
  const classes = useStyles({ hasServicesOrAmenities });
  const markers =
    community.latitude && community.longitude && community.name
      ? [
          {
            position: { lat: community.latitude!, lng: community.longitude! },
            name: community.name!,
            icon: '/app/enrollment/pin.svg',
            label: {
              className: classes.markerLabel,
              text: community.name!,
            },
          },
        ]
      : undefined;

  const steps =
    community.images && community.images.length > 0
      ? community.images.map((img) => {
          return { imgPath: img.medium };
        })
      : undefined;

  const onSave = () => {
    if (!savedFacilitiesIds.includes(community.id)) {
      dispatch({
        type: 'setSALCSavedFacilitiesIds',
        SALCSavedFacilitiesIds: [...savedFacilitiesIds, community.id],
      });
    }
    fireAmplitudeEvent('Interested');
    setIsDrawerOpen(false);
  };

  const onSkip = () => {
    const checkedFacilities = savedFacilitiesIds.filter(
      (facility: any) => facility !== community.id
    );
    dispatch({
      type: 'setSALCSavedFacilitiesIds',
      SALCSavedFacilitiesIds: checkedFacilities,
    });
    fireAmplitudeEvent('Pass');
    setIsDrawerOpen(false);
  };

  return (
    <div className={classes.drawerContainer}>
      <div className={classes.content}>
        <Typography variant="h1">{community.name}</Typography>
        <div className={classes.cityAndPrice}>
          <Grid container alignItems="center" className={classes.locationContainer}>
            <Icon24InfoLocation className={classes.icon} />
            <Grid item>
              <Typography className={classes.copy} variant="body2">
                {community.location}
              </Typography>
            </Grid>
          </Grid>
          {community.baseCost && (
            <Grid container alignItems="center" className={classes.locationContainer}>
              <Icon24InfoPayments className={classes.icon} />
              <Grid item>
                <Typography className={classes.copy} variant="body2">
                  Starting at ${community.baseCost}/mo
                </Typography>
              </Grid>
            </Grid>
          )}
        </div>

        {steps && steps.length > 0 && <Carousel steps={steps} />}
        {markers && (
          <CustomGoogleMap
            config={{
              setAutomaticBounds: markers.length !== 1,
              containerClassName: classes.drawerMap,
              options: {
                disableDefaultUI: true,
                styles: [
                  {
                    featureType: 'poi',
                    stylers: [{ visibility: 'off' }],
                  },
                ],
              },
            }}
            data={{
              center: markers.length === 1 ? markers[0].position : undefined,
              markers,
            }}
          />
        )}
        {hasServicesOrAmenities && (
          <Typography className={classes.servicesAndAmenities} variant="h2">
            Services and amenities
          </Typography>
        )}

        {community.careServices && (
          <CommunityServiceAmenitiesList title="Care Services" list={community.careServices} />
        )}

        {community.onSiteServices && (
          <CommunityServiceAmenitiesList title="On site services" list={community.onSiteServices} />
        )}

        {community.facilityAmenities && (
          <CommunityServiceAmenitiesList
            title="Facility amenities"
            list={community.facilityAmenities}
          />
        )}

        {community.foodAmenities && (
          <CommunityServiceAmenitiesList title="Food amenities" list={community.foodAmenities} />
        )}

        {hasServicesOrAmenities && (
          <div className={classes.divider}>
            <Divider />
          </div>
        )}

        <Grid container alignItems="center">
          <Grid item>
            <Typography variant="h2" className={classes.seniorHousingHeader}>
              Senior housing types
            </Typography>
            {community.communityTypes &&
              community.communityTypes.map((communityType: CommunityTypeDetail) => (
                <Grid
                  key={communityType.title}
                  container
                  alignItems="center"
                  className={clsx(classes.seniorHousingListItem, {
                    [classes.notAvailable]: !communityType.available,
                  })}>
                  {communityType.available ? <Icon24UtilityCheckmark /> : <Icon24UtilityMinus />}
                  <Typography variant="body2" className={classes.leftMargin}>
                    {communityType.title}
                  </Typography>
                </Grid>
              ))}
          </Grid>
        </Grid>
        <div className={classes.divider}>
          <Divider />
        </div>
        <Grid container alignItems="center">
          <Grid item>
            <Typography variant="h2" className={classes.aboutFacility}>
              About the facility
            </Typography>
            {community.description?.length && (
              <ReadMore
                color="textPrimary"
                component="div"
                variant="body2"
                value={community.description}
                charLimit={150}
                showLessButton
              />
            )}
            {community.baseCost && community.name && (
              <>
                <Typography variant="h4" className={classes.cost}>
                  Cost
                </Typography>
                <Typography variant="body2">
                  <span>Rooms at&nbsp;</span>
                  {community.name}
                  <span>&nbsp;start at</span>{' '}
                  <span className={classes.bold}>${community.baseCost}/month.</span>
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
      </div>
      {displayCTA && (
        <div className={classes.actions}>
          <SkipOrSaveButton
            isDrawerView
            onSave={onSave}
            onSkip={onSkip}
            showToastMessage={false}
            saveButtonText="Interested"
          />
        </div>
      )}
    </div>
  );
}

export default CommunityDetails;
