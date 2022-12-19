import { MouseEventHandler, ReactNode } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { Typography } from '@care/react-component-lib';
import Header from '@/components/Header';
import EmailPasswordForm from '@/components/features/accountCreation/EmailPasswordForm';

type SeekerEmailPasswordPageProps = {
  handleJoinNow: MouseEventHandler<HTMLButtonElement>;
  headerText: ReactNode;
  subHeaderText?: ReactNode;
};

const useStyles = makeStyles((theme) => ({
  subheader: {
    // added ? in order for test to pass
    color: theme.palette.care?.grey[600],
    margin: theme.spacing(1, 0),
  },
  newLine: {
    display: 'block',
  },
}));

function SeekerEmailPasswordPage({
  handleJoinNow,
  headerText,
  subHeaderText,
}: SeekerEmailPasswordPageProps) {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs={12}>
        <Header>{headerText}</Header>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4" className={classes.subheader}>
          {subHeaderText}
        </Typography>
      </Grid>
      <EmailPasswordForm handleJoinNow={handleJoinNow} />
    </Grid>
  );
}

SeekerEmailPasswordPage.defaultProps = {
  subHeaderText: 'It only takes a few seconds.',
};

export default SeekerEmailPasswordPage;
