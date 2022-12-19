import { useEffect } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { Icon80MiniCelebrationNewMessageCelebrate } from '@care/react-icons';
import { useSeekerState } from '@/components/AppState';
import LcContainer from '@/components/LcContainer';
import FullWidthLayout from '@/components/layouts/FullWidthLayout';
import { MHP_FAVORITES_PATH } from '@/constants';
import { formatProviders, providersToShow } from '../helpers';

const useStyles = makeStyles((theme) => ({
  icon: {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginTop: 143,
  },
  text: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(0, 2),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      padding: 0,
    },
  },

  header: {
    marginBottom: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      // responsive font size; h2 on desktop should look like h1
      ...theme.typography.h1,
      marginBottom: theme.spacing(2),
    },
  },
}));

function MessageSent() {
  const classes = useStyles();
  const seekerState = useSeekerState();
  const acceptedProviders = seekerState?.leadAndConnect?.acceptedProviders;
  const providers = providersToShow(acceptedProviders);
  const message = providers.length
    ? `Your message has been sent to ${formatProviders(providers)}`
    : `Your message has been sent`;

  useEffect(() => {
    setTimeout(() => {
      window.location.assign(MHP_FAVORITES_PATH);
    }, 3000);
  }, []);

  return (
    <LcContainer>
      <div className={classes.icon}>
        <Icon80MiniCelebrationNewMessageCelebrate size={100} />
      </div>
      <div className={classes.text}>
        <Typography variant="h2" className={classes.header}>
          Message Sent!
        </Typography>
        <Typography variant="body2">{message}</Typography>
      </div>
    </LcContainer>
  );
}

MessageSent.Layout = FullWidthLayout;

export default MessageSent;
