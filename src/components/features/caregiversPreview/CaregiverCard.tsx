import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ProfileAvatar, Typography } from '@care/react-component-lib';
import RatingOrExperience from '@/components/features/caregiversPreview/RatingOrExperience';
import { ProfileAvatarProps } from '@care/react-component-lib/dist/components/ProfileAvatar/ProfileAvatar';

const useStyles = makeStyles((theme) => ({
  cardGridContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0 auto',
    alignItems: 'center',
  },
  cardDisplayName: {
    minWidth: 'auto',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    textAlign: 'center',
    marginTop: theme.spacing(1),
  },
}));

export type Caregiver = {
  displayName: string;
  imageURL: string;
  avgReviewRating?: number;
  numberOfReviews: number;
  yearsOfExperience: number;
  signUpDate?: Date;
};

export type CaregiverCardProps = {
  caregiver: Caregiver;
  avatarProps?: Pick<ProfileAvatarProps, 'variant'>;
};

function CaregiverCard({ caregiver, avatarProps }: CaregiverCardProps) {
  const classes = useStyles();
  const { displayName, imageURL, numberOfReviews, avgReviewRating, yearsOfExperience, signUpDate } =
    caregiver;

  return (
    <Grid container spacing={1} justifyContent="flex-start" alignContent="center">
      <Grid className={classes.cardGridContainer} item>
        <ProfileAvatar
          size="xLarge"
          alt={displayName}
          src={imageURL}
          variant={avatarProps?.variant ?? 'circular'}
        />
        <div className={classes.cardDisplayName}>
          <Typography variant="h5">{displayName}</Typography>
        </div>
        <RatingOrExperience
          numberReviews={numberOfReviews}
          averageRating={avgReviewRating}
          yearsOfExperience={yearsOfExperience}
          signUpDate={signUpDate}
        />
      </Grid>
    </Grid>
  );
}

export default CaregiverCard;
