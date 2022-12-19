import { Grid, makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import { ProfileAvatar, Typography, Rating, ReadMore } from '@care/react-component-lib';
import {
  Icon24InfoAvailability,
  Icon24InfoPayments,
  Icon24UtilityCheckmarkLarge,
} from '@care/react-icons';

import {
  buildTags,
  providerGetDaysSinceSignup,
} from '@/components/pages/seeker/sc/lc/caregiver-profile/caregiverProfileHelper';
import ShowMore from '@/components/ShowMore';
import { SIX_MONTHS_IN_DAYS } from '@/constants';
import { SeniorCareProviderProfile } from '@/types/seeker';
import {
  isSCProviderProfile,
  buildArrFromServices,
  buildBadgesFromObject,
} from '@/components/shared/CaregiverDrawer/utils';
import { ProviderProfile } from '@/components/pages/seeker/lc/types';

const useStyles = makeStyles((theme) => ({
  info: ({ isDrawerView }: any) => ({
    paddingLeft: theme.spacing(2),
    display: isDrawerView ? 'flex' : '',
    flexDirection: isDrawerView ? 'column' : 'row',
    justifyContent: isDrawerView ? 'center' : '',
  }),
  infoBelowName: {
    display: 'flex',
    flexDirection: ({ isDrawerView }: any) => (isDrawerView ? 'column-reverse' : 'column'),
  },
  numberReviews: {
    verticalAlign: 'text-top',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      '&:first-child': {
        marginTop: ({ isDrawerView }: any) => (isDrawerView ? theme.spacing(2) : 0),
      },
    },
    '&:first-child': {
      marginRight: theme.spacing(3),
    },
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  readMore: {
    fontSize: '16px',
  },
  badgesSection: {
    marginTop: theme.spacing(3),
  },
  badgesContainer: {
    padding: theme.spacing(0, 0, 2),
  },
  badge: {
    border: 'none',
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  tag: {
    color: theme.palette?.care?.navy[600],
    marginTop: theme.spacing(0.5),
  },
  subtitle: {
    margin: theme.spacing(3, 0, 2),
  },
  listedAttributesContainer: {
    marginBottom: theme.spacing(-2),
  },
  profileInfoSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flexDirection: ({ isDrawerView }: any) => (isDrawerView ? '' : 'row'),
    },
  },
  rateAndExperienceSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.up('md')]: {
      flexDirection: ({ isDrawerView }: any) => (isDrawerView ? '' : 'column'), // AQUI
    },
  },
  avatar: {
    display: 'flex',
    width: '100%',
  },
  list: {
    paddingLeft: 0,
    margin: 0,
  },
  listItem: {
    display: 'flex',
    listStyle: 'none',
    paddingBottom: theme.spacing(3),
  },
}));

interface CaregiverProps {
  currentProvider: ProviderProfile | SeniorCareProviderProfile;
  isDrawerView?: boolean;
}

const Caregiver = (props: CaregiverProps) => {
  const { currentProvider, isDrawerView } = props;
  const classes = useStyles({ isDrawerView });
  const theme = useTheme();
  const isTabletOrUp = useMediaQuery(theme.breakpoints.up('sm'));
  const isDesktopOrUp = useMediaQuery(theme.breakpoints.up('md'));
  const showAttributesAsOneColumn = isDrawerView && isDesktopOrUp;
  const isSCProvider = isSCProviderProfile(currentProvider);

  const renderAttributes = () => (
    <Grid container spacing={0}>
      {(currentProvider as SeniorCareProviderProfile).listedAttributes.map(
        (listedAttribute: any) => (
          <Grid item xs={12} sm={showAttributesAsOneColumn ? 12 : 6} key={listedAttribute}>
            <ul className={classes.list}>
              <li className={classes.listItem}>
                <Icon24UtilityCheckmarkLarge className={classes.icon} />{' '}
                <Typography variant="body2">{listedAttribute}</Typography>
              </li>
            </ul>
          </Grid>
        )
      )}
    </Grid>
  );

  const renderAttributesArr = (attributesArray: string[]) => (
    <Grid container spacing={0}>
      {attributesArray.map((listedAttribute: any) => (
        <Grid item xs={12} sm={showAttributesAsOneColumn ? 12 : 6} key={listedAttribute}>
          <ul className={classes.list}>
            <li className={classes.listItem}>
              <Icon24UtilityCheckmarkLarge className={classes.icon} />{' '}
              <Typography variant="body2">{listedAttribute}</Typography>
            </li>
          </ul>
        </Grid>
      ))}
    </Grid>
  );

  const badges: any[] = isSCProvider
    ? buildTags(currentProvider as SeniorCareProviderProfile, classes.badge)
    : buildBadgesFromObject(currentProvider as ProviderProfile, classes.badge);

  const ccServices = !isSCProvider
    ? buildArrFromServices((currentProvider as ProviderProfile).services)
    : [];

  const getYearsExperienceDisplayString = (yearsExperience: number) => {
    return yearsExperience >= 10 ? '10+' : `${yearsExperience}`;
  };

  const ProviderServices = () => {
    const services = isSCProvider
      ? (currentProvider as SeniorCareProviderProfile).listedAttributes
      : ccServices;

    const renderedServices = isSCProvider ? renderAttributes() : renderAttributesArr(ccServices);

    return services.length > 0 ? (
      <Grid item xs={12}>
        <Typography variant="h4" className={classes.subtitle}>
          Can help with:
        </Typography>
        {services.length > 6 ? (
          <ShowMore
            heightLimit={!isTabletOrUp || showAttributesAsOneColumn ? 260 : 120}
            showMoreLabel={`View all items ${currentProvider.displayName} can help with`}
            showLessLabel="Show less">
            {renderedServices}
          </ShowMore>
        ) : (
          <>
            <div className={classes.listedAttributesContainer}>{renderedServices}</div>
          </>
        )}
      </Grid>
    ) : null;
  };

  const averageRating =
    currentProvider.averageRating === undefined ? 0 : currentProvider.averageRating;
  const reviewsCount = isSCProvider
    ? (currentProvider as SeniorCareProviderProfile).numberReviews
    : (currentProvider as ProviderProfile).numberOfReviews; // to handle difference in naming
  const daysSinceSignUp = providerGetDaysSinceSignup(currentProvider?.signUpDate);

  const renderExperience = () => {
    if (
      (averageRating !== undefined && averageRating > 0) ||
      (reviewsCount !== undefined && reviewsCount > 0)
    ) {
      return (
        <>
          <Rating precision={0.1} value={averageRating} readOnly size="medium" />
          {isDrawerView && (
            <Typography careVariant="info1" className={classes.numberReviews}>
              ({reviewsCount})
            </Typography>
          )}
        </>
      );
    }

    if (isSCProvider) {
      if (daysSinceSignUp < SIX_MONTHS_IN_DAYS) {
        return (
          !isDrawerView && (
            <Typography careVariant="tag" className={classes.tag}>
              New member
            </Typography>
          )
        );
      }
      return (
        !isDrawerView && (
          <Typography careVariant="tag" className={classes.tag}>
            Member since {currentProvider.signUpDate?.toLocaleDateString()}
          </Typography>
        )
      );
    }

    return <></>;
  };

  return (
    <>
      <div className={classes.profileInfoSection}>
        <div className={classes.avatar}>
          <ProfileAvatar
            alt={currentProvider.displayName}
            src={currentProvider.imgSource}
            size="xLarge"
            variant="rounded"
            online={false}
          />
          <Grid item xs={12} className={classes.info}>
            <Typography variant="h3">{currentProvider.displayName}</Typography>
            <div className={classes.infoBelowName}>
              {currentProvider.distanceFromSeeker && currentProvider.distanceFromSeeker <= 1 ? (
                <Typography careVariant="body3" color="secondary">
                  <span>
                    {currentProvider.cityAndState} • {'< 1 mi'}
                  </span>
                </Typography>
              ) : (
                <Typography careVariant="body3" color="secondary">
                  <span>{currentProvider.cityAndState}</span>
                  <span>&nbsp;•</span>{' '}
                  <span>
                    {currentProvider &&
                      currentProvider.distanceFromSeeker &&
                      Math.trunc(currentProvider.distanceFromSeeker)}{' '}
                  </span>
                  <span>mi&nbsp;</span>
                  {isDrawerView && <span>away</span>}
                </Typography>
              )}

              <div>{renderExperience()}</div>
            </div>
          </Grid>
        </div>

        <div className={classes.rateAndExperienceSection}>
          <div className={classes.iconContainer}>
            <Icon24InfoAvailability className={classes.icon} />{' '}
            {currentProvider.yearsOfExperience > 0 ? (
              <Typography variant="h5">
                {getYearsExperienceDisplayString(currentProvider.yearsOfExperience)} yrs experience
              </Typography>
            ) : (
              <Typography variant="h5">New to senior care</Typography>
            )}
          </div>

          <div className={classes.iconContainer}>
            <Icon24InfoPayments className={classes.icon} />{' '}
            <Typography variant="h5">
              <span>$</span>
              {currentProvider.minRate}
              <span>
                {currentProvider.maxRate !== currentProvider.minRate
                  ? `-${currentProvider.maxRate}`
                  : ''}
              </span>
              <span>/hr</span>
            </Typography>
          </div>
        </div>
      </div>
      <Grid item xs={12} className={classes.badgesSection}>
        <div className={classes.badgesContainer}>{badges}</div>
        <ReadMore
          value={currentProvider.biography}
          charLimit={290}
          showLessButton
          showMoreLabel="read more"
          showLessLabel="read less"
          className={classes.readMore}
        />
        <ProviderServices />
      </Grid>
    </>
  );
};

Caregiver.defaultProps = {
  isDrawerView: false,
};

export default Caregiver;
