import { useEffect } from 'react';
import { Icon64BrandActionClose } from '@care/react-icons';
import { Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AUTH_ROUTES } from '@/constants';
import Header from '@/components/Header';
import logger from '@/lib/clientLogger';

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down('md')]: {
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),
    },
  },
  icon: {
    position: 'relative',
    left: '-9px',
  },
  bodyText: {
    fontWeight: 'normal',
    lineHeight: '24px',
    margin: theme.spacing(2, 0, 4),
  },
  buttonContainer: {
    padding: theme.spacing(3.5, 3, 0),
  },
  skipButton: {
    marginTop: '10px',
    '& .MuiButton-label': {
      textDecoration: 'underline',
    },
    '&:hover': {
      background: 'none',
    },
    fontSize: 16,
    color: theme?.palette?.care?.grey[600],
  },
  logoutFrame: {
    width: 0,
    height: 0,
    position: 'absolute',
    border: 0,
  },
}));

function AuthError() {
  const classes = useStyles({});
  const returnUrl = window.location.href;

  const logout = () => {
    logger.info({ event: 'logOutClick', page: 'authError' });
    window.location.assign(AUTH_ROUTES.LOGOUT(returnUrl));
  };
  const goBack = () => {
    logger.info({ event: 'goBackClick', page: 'authError' });
    window.history.back();
  };

  useEffect(() => {
    logger.info({ event: 'authErrorScreenShown', page: 'authError' });
  }, []);

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <Icon64BrandActionClose size="59px" className={classes.icon} />
      </Grid>
      <Grid item xs={12}>
        <Header>It looks like you&apos;re already logged in.</Header>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2" className={classes.bodyText}>
          In order to start, you&apos;ll need to logout and create an account with a separate email
          address.
        </Typography>
      </Grid>
      <Grid item xs={12} className={classes.buttonContainer}>
        <Button onClick={logout} variant="contained" color="primary" fullWidth size="large">
          <span>Logout and continue</span>
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button fullWidth size="large" className={classes.skipButton} onClick={goBack}>
          <span>Go back</span>
        </Button>
      </Grid>
    </Grid>
  );
}

export default AuthError;
