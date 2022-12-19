import { Typography, makeStyles, Button, useMediaQuery, useTheme } from '@material-ui/core';

import { ProfileAvatar } from '@care/react-component-lib';
import { IconIllustrationSmallChatBubbles } from '@care/react-icons';

import LcContainer from '@/components/LcContainer';
import Flower from '@/components/features/flower/flower';
import { ProviderProfile } from '@/components/pages/seeker/lc/types';
import { HEIGHT_MINUS_TOOLBAR } from '@/constants';

const useStyles = makeStyles((theme) => ({
  lcContainer: {
    marginBottom: 0,
  },
  pageContainer: {
    height: HEIGHT_MINUS_TOOLBAR,
    boxSizing: 'border-box',
    padding: theme.spacing(0, 3),
  },
  header: {
    textAlign: 'center',
  },
  headerText: {
    [theme.breakpoints.up('md')]: { ...theme.typography.h1 },
  },
  subHeader: {
    marginTop: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      ...theme.typography.h2,
      marginTop: theme.spacing(4),
    },
  },
  providerAvatarsList: {
    margin: theme.spacing(4, 0, 4),
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  providerAvatar: {
    '&:not(:last-child)': {
      marginRight: theme.spacing(2),
    },
  },
  chatBubblesIcon: {
    width: '100%',
    paddingTop: 51,
    display: 'flex',
    justifyContent: 'center',
  },
  leftIcon: {
    position: 'absolute',
    top: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      top: 0,
    },
    left: -31,
    zIndex: 0,
  },
  rightIcon: {
    position: 'absolute',
    bottom: 0,
    right: -31,
  },
  buttonsContainer: {
    padding: theme.spacing(0, 2),
    [theme.breakpoints.up('md')]: {
      margin: '0 auto',
      paddingLeft: 0,
      paddingRight: 0,
      width: '295px',
    },
  },
  skipButton: {
    marginTop: 10,
    '& .MuiButton-label': {
      textDecoration: 'underline',
    },
    fontSize: 16,
    color: theme?.palette?.care?.grey[600],
  },
}));

interface UpgradeAndMessagePageProps {
  providerProfiles: ProviderProfile[];
  onUpgradeClick: () => void;
  onSkipClick: () => void;
}

function UpgradeAndMessagePage({
  providerProfiles,
  onUpgradeClick,
  onSkipClick,
}: UpgradeAndMessagePageProps) {
  const classes = useStyles();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <div className={classes.leftIcon}>
        <Flower />
      </div>
      <div className={classes.rightIcon}>
        <Flower />
      </div>
      <LcContainer classes={{ root: classes.lcContainer }}>
        <div className={classes.pageContainer}>
          <div className={classes.chatBubblesIcon}>
            <IconIllustrationSmallChatBubbles size={90} />
          </div>
          <div className={classes.header}>
            <Typography variant="h2" className={classes.headerText}>
              Let&apos;s get you started with learning more about these caregivers
            </Typography>
            <Typography variant="h4" color="textSecondary" className={classes.subHeader}>
              Send a quick message to start the process
            </Typography>
          </div>
          <div className={classes.providerAvatarsList}>
            {providerProfiles.slice(0, 5).map(({ imgSource, displayName, memberId }) => (
              <div className={classes.providerAvatar} key={memberId}>
                <ProfileAvatar
                  alt={displayName}
                  src={imgSource ?? ''}
                  size={isSmallScreen ? 'medium' : 'large'}
                  variant="rounded"
                  online={false}
                />
              </div>
            ))}
          </div>
          <div className={classes.buttonsContainer}>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              size="large"
              onClick={onUpgradeClick}>
              Send a message
            </Button>
            <Button fullWidth size="large" className={classes.skipButton} onClick={onSkipClick}>
              <span>Not yet</span>
            </Button>
          </div>
        </div>
      </LcContainer>
    </>
  );
}

export default UpgradeAndMessagePage;
