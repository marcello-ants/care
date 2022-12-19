import { Grid } from '@material-ui/core';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@care/react-component-lib';
import { IconIllustrationMediumStar } from '@care/react-icons';
import Header from '@/components/Header';

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    margin: '0 auto',
  },
  textSpacing: {
    paddingBottom: theme.spacing(2),
  },
  textCentered: {
    textAlign: 'center',
  },
}));

function AgeRestrictionPage() {
  const classes = useStyles();

  return (
    <Grid container className={classes.gridContainer}>
      <Grid item xs={12} className={clsx(classes.textSpacing, classes.textCentered)}>
        <IconIllustrationMediumStar size={160} />
      </Grid>
      <Grid item xs={12} className={classes.textSpacing}>
        <Header>Looks like you’re under 18</Header>
      </Grid>
      <Grid item xs={12} className={classes.textSpacing}>
        <Typography variant="body2">
          <span>
            We’re sorry, you’re not eligible for membership at this time. According to a policy
            change, we’re no longer accepting members who are under 18.
          </span>
          <br />
          <br />
          <span>Please check back after your 18th birthday!</span>
        </Typography>
      </Grid>
    </Grid>
  );
}

export default AgeRestrictionPage;
