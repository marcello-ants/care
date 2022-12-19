import { Rating, Typography } from '@care/react-component-lib';
import { makeStyles } from '@material-ui/core';
import { providerGetDaysSinceSignup } from '@/components/pages/seeker/sc/lc/caregiver-profile/caregiverProfileHelper';
import { SIX_MONTHS_IN_DAYS } from '@/constants';

export interface IRatingOrExperience {
  averageRating?: number;
  numberReviews: number;
  yearsOfExperience: number;
  signUpDate?: Date;
}

const useStyles = makeStyles((theme) => ({
  tag: {
    color: theme.palette?.care?.navy[600],
    marginTop: theme.spacing(0.5),
  },
}));

function RatingOrExperience({
  averageRating,
  numberReviews,
  yearsOfExperience,
  signUpDate,
}: IRatingOrExperience) {
  const classes = useStyles();
  const experience = Math.ceil(yearsOfExperience);
  const daysSinceSignUp = providerGetDaysSinceSignup(signUpDate);

  return (
    <div>
      {(averageRating !== undefined && averageRating > 0) || numberReviews > 0 ? (
        <Rating value={averageRating} precision={0.1} readOnly size="small" data-testid="rating" />
      ) : (
        <Typography careVariant="tag" className={classes.tag}>
          {daysSinceSignUp < SIX_MONTHS_IN_DAYS
            ? 'New member'
            : `${experience} ${experience > 1 ? 'yrs' : 'yr'} exp`}
        </Typography>
      )}
    </div>
  );
}
RatingOrExperience.defaultProps = {
  averageRating: 0,
};

export default RatingOrExperience;
