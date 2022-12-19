import { Grid, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    textAlign: 'center',
  },
});

export default function Custom404() {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <Typography variant="h2">Page not found</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">
          We&apos;re sorry, there was a problem accessing the page that you requested
        </Typography>
      </Grid>
    </Grid>
  );
}
