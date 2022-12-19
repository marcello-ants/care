import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

import { Button, makeStyles } from '@material-ui/core';
import { IconIllustrationXlargeConfirm } from '@care/react-icons';
import { Typography } from '@care/react-component-lib';

const appDownloadLink = `https://d2k4k.app.goo.gl/?link=https://www.care.com/sitter/notificationCenter?%26dlsrc%3Dunsafe&apn=com.care.android.careview.providerapp&ibi=com.care.provider&isi=1367528046&efr=1&ofl=https://play.google.com/store/apps/details?id=com.care.android.careview.providerapp&hl=en_IN&gl=US`;

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: 350,
    margin: theme.spacing(13, 'auto', 4),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(7, 'auto', 4),
      alignItems: 'flex-start',
      textAlign: 'left',
    },
  },
  confirmImage: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      width: 192,
      margin: `0 auto ${theme.spacing(3)}px`,
    },
  },
  title: {
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      fontSize: 21,
      lineHeight: '26px',
      marginBottom: theme.spacing(3),
    },
  },
  qrCode: {
    marginTop: 42,
    marginBottom: 20,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  qrCodeDescription: {
    fontSize: 14,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  openAppButton: {
    marginTop: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

type WelcomeBackProps = {
  firstName: string | undefined;
};

const WelcomeBack = ({ firstName }: WelcomeBackProps) => {
  const classes = useStyles();

  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    QRCode.toCanvas(ref.current, appDownloadLink, { width: 125 });
  }, []);

  return (
    <div className={classes.container}>
      <IconIllustrationXlargeConfirm className={classes.confirmImage} width={300} />
      <Typography variant="h1" className={classes.title}>
        <span>Welcome back</span>
        <span>{firstName && `, ${firstName}`}</span>
      </Typography>
      <Typography variant="body2">You need to open the Care app to continue.</Typography>
      <canvas className={classes.qrCode} ref={ref} />
      <Typography variant="body2" className={classes.qrCodeDescription}>
        Scan the QR code to open the app.
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        size="large"
        fullWidth
        href={appDownloadLink}
        className={classes.openAppButton}>
        Open the app
      </Button>
    </div>
  );
};

export default WelcomeBack;
