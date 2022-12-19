import clsx from 'clsx';
import {
  Box,
  CardContent,
  CardHeader,
  Container,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';

import { Card, ProfileAvatar, Rating, ReadMore, Typography } from '@care/react-component-lib';
import { Icon24UtilityFavoriteOff, Icon24UtilityFavoriteOn } from '@care/react-icons';

import QuotesIcon from '@/components/QuotesIcon';
import { ProviderProfile } from '@/components/pages/seeker/lc/types';

const useStyles = makeStyles((theme) => ({
  card: {
    cursor: 'pointer',
    marginBottom: theme.spacing(1),
    backgroundColor: theme.palette.care?.white,

    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(2),
      border: `1px solid ${theme.palette.care?.grey[300]}`,
    },
  },
  cardHeader: {
    alignItems: 'start',
    paddingBottom: 0,
  },
  cardHeaderContent: {
    [theme.breakpoints.up('md')]: {
      alignSelf: 'center',
    },
  },
  cardContent: {
    display: 'flex',
  },
  favoriteIcon: {
    padding: theme.spacing(0.5),
  },
  text: {
    [theme.breakpoints.up('md')]: {
      ...theme.typography.body2,
    },
  },
  readMore: {
    marginLeft: theme.spacing(2),
    pointerEvents: 'none',
  },
}));

interface ProfileCardTitleProps {
  isDesktopOrUp: boolean;
  profile: ProviderProfile;
}

interface ProfileCardSubtitleProps extends ProfileCardTitleProps {
  showRates: boolean;
}
interface ProfileCardHeaderProps extends ProfileCardSubtitleProps {
  isFavorited?: boolean;
  onFavorite: () => void;
}
export interface ProfileCardProps extends ProfileCardHeaderProps {
  isFavorited: boolean;
  hideDetails?: boolean;
  onClick: () => void;
}

const ProfileCardTitle = ({ isDesktopOrUp, profile }: ProfileCardTitleProps) => {
  return (
    <>
      <Typography variant={isDesktopOrUp ? 'h2' : 'h3'}>{profile.displayName}</Typography>
      {profile.averageRating ? (
        <div>
          <Rating size="small" readOnly value={profile.averageRating} />
          <Typography careVariant="info1">({profile.numberOfReviews})</Typography>
        </div>
      ) : (
        <Box marginBottom={1} />
      )}
    </>
  );
};

const ProfileCardSubtitle = ({
  isDesktopOrUp,
  profile,
  showRates = true,
}: ProfileCardSubtitleProps) => {
  const classes = useStyles();
  return (
    <Typography className={classes.text} careVariant="body3">
      <span>{profile.cityAndState}</span>
      <span>&nbsp;•</span>{' '}
      <span>{profile && profile.distanceFromSeeker && Math.trunc(profile.distanceFromSeeker)}</span>
      <span>&nbsp;mi away</span>
      {isDesktopOrUp ? <span> • </span> : <br />}
      <span>
        {showRates
          ? `$${profile.minRate}-${profile.maxRate}/hr • ${profile.yearsOfExperience} yrs exp.`
          : ''}
      </span>
    </Typography>
  );
};

interface ProfileSelectActionButtonProps {
  onClick: (e: any) => void;
  isFavorited?: boolean;
}

const ProfileSelectActionButton = ({ onClick, isFavorited }: ProfileSelectActionButtonProps) => {
  const classes = useStyles();

  return (
    <Container className={classes.favoriteIcon} data-testid="favoriteButton" onClick={onClick}>
      {isFavorited ? <Icon24UtilityFavoriteOn /> : <Icon24UtilityFavoriteOff />}
    </Container>
  );
};

ProfileSelectActionButton.defaultProps = {
  isFavorited: false,
};

const ProfileCardHeader = ({
  isDesktopOrUp,
  profile,
  showRates,
  onFavorite,
  isFavorited,
}: ProfileCardHeaderProps) => {
  const classes = useStyles();

  const heartIcon = (
    <ProfileSelectActionButton
      onClick={(e) => {
        e.stopPropagation();
        onFavorite();
      }}
      isFavorited={isFavorited}
    />
  );

  return (
    <CardHeader
      className={classes.cardHeader}
      classes={{ content: classes.cardHeaderContent }}
      avatar={
        <ProfileAvatar
          alt={profile.displayName}
          src={profile.imgSource}
          variant="rounded"
          size="xLarge"
        />
      }
      action={heartIcon}
      title={<ProfileCardTitle isDesktopOrUp={isDesktopOrUp} profile={profile} />}
      subheader={
        <ProfileCardSubtitle
          isDesktopOrUp={isDesktopOrUp}
          profile={profile}
          showRates={showRates}
        />
      }
    />
  );
};

ProfileCardHeader.defaultProps = {
  isFavorited: false,
};

const ProfileCard = ({
  profile,
  isFavorited,
  onFavorite,
  showRates,
  hideDetails,
  onClick,
}: ProfileCardProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const isDesktopOrUp = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Card
      data-testid="caregiverCard"
      key={profile.memberId}
      className={classes.card}
      careVariant="contrast"
      onClick={onClick}>
      <ProfileCardHeader
        isDesktopOrUp={isDesktopOrUp}
        profile={profile}
        onFavorite={onFavorite}
        showRates={showRates}
        isFavorited={isFavorited}
      />

      {!hideDetails && (
        <CardContent className={classes.cardContent}>
          <QuotesIcon />
          <ReadMore
            careVariant="body3"
            showLessButton
            charLimit={isDesktopOrUp ? 120 : 80}
            value={profile.biography}
            className={clsx(classes.text, classes.readMore)}
          />
        </CardContent>
      )}
    </Card>
  );
};

ProfileCard.defaultProps = {};

export default ProfileCard;
