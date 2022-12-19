import QRCode from 'qrcode';
import { IconIllustrationXlargeConfirm, IconLogoIconCareLogo } from '@care/react-icons';
import { Typography } from '@care/react-component-lib';
import { makeStyles, Tab, Tabs } from '@material-ui/core';
import { useState, useEffect, useRef } from 'react';
import { ILayoutProps } from '@/types/layout';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

// Provider app ids; shouldn't be used in seeker flow
const APP_STORE_ID = '1367528046';
const ANDROID_APP_STORE_ID = 'com.care.android.careview.providerapp';

const useStyles = makeStyles((theme) => ({
  desktop: {
    marginTop: '58px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: theme.spacing(8),
    '& > div': {
      padding: '75px 0 155px',
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      gap: 0,
      '& > div': {
        padding: '0 0 75px',
      },
    },
  },
  separator: {
    width: '1px',
    background: theme.palette.grey[300],
    flexShrink: 0,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  qrCodeContainer: {
    width: '410px',
    flexShrink: 0,
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
      textAlign: 'center',
    },
  },
  desktopHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(3, 4),
    borderBottom: '3px solid #eee',
    '& p': {
      lineHeight: '40px',
    },
  },
  desktopContainer: {
    margin: 'auto',
    maxWidth: '815px',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 3),
    },
  },
  title: {
    textAlign: 'center',
    padding: '25px 0 15px',
    borderBottom: `4px solid ${theme.palette.grey[200]}`,
  },
  hero: {
    display: 'block',
    margin: theme.spacing(0, 'auto', 3),
  },
  heroText: {
    color: theme.palette.care.navy[600],
    fontSize: '28px',
    lineHeight: '36px',
    textAlign: 'right',
    fontFamily: 'Georgia, sans-serif',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  title2: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(2),
    },
  },
  tabs: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
    '& button': {
      width: '187px',
      textTransform: 'none',
    },
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(3),
    margin: theme.spacing(3, 0, 3),
    '& a': {
      display: 'flex',
    },
  },
  linkButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textDecoration: 'none',
    borderRadius: '100px',
    color: theme.palette.care.white,
    background: theme.palette.care.red[500],
    height: theme.spacing(7),
    fontSize: '21px',
    transition: '300ms',
    '&:hover': {
      background: theme.palette.care.red[400],
    },
    marginTop: theme.spacing(4),
  },
  qrcode: {
    margin: theme.spacing(3, 'auto'),
    display: 'block',
  },
}));

const appStoreURL = `https://apps.apple.com/app/id${APP_STORE_ID}`;
const googlePlayURL = `https://play.google.com/store/apps/details?id=${ANDROID_APP_STORE_ID}`;

const isAndroid = typeof window !== 'undefined' && /Android/.test(window.navigator.userAgent);
const isIos = typeof window !== 'undefined' && /iPhone|iPad|iPod/.test(window.navigator.userAgent);
const isDesktop = !isAndroid && !isIos;

const sendAnalytics = () => {
  AnalyticsHelper.logEvent({
    name: 'Member Enrolled',
    data: {
      enrollment_step: 'provider_app_download',
      enrollment_flow: 'MW VHP Provider Enrollment',
      cta_clicked: 'Download the app',
    },
  });
};

const AppDownload = () => {
  const classes = useStyles();
  const ref = useRef<HTMLCanvasElement>(null);

  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    QRCode.toCanvas(ref.current, tab ? googlePlayURL : appStoreURL, { margin: 0, version: 5 });
  }, [tab]);

  return isDesktop ? (
    <div className={classes.desktop}>
      <div>
        <IconIllustrationXlargeConfirm className={classes.hero} width={300} />
        <Typography className={classes.heroText}>
          You&apos;re one step closer to finding the perfect job.
        </Typography>
      </div>
      <div className={classes.separator} />
      <div className={classes.qrCodeContainer}>
        <Typography variant="h2" className={classes.title2}>
          Last step: Download the app
        </Typography>
        <Typography variant="body2">
          You need the Care.com Caregiver app to continue—it’s free! Get the app and get hired.
        </Typography>

        <div className={classes.tabs}>
          <Tabs value={tab} centered onChange={(event, newValue) => setTab(newValue)}>
            <Tab label="iPhone" />
            <Tab label="Android" />
          </Tabs>
        </div>

        <div className={classes.buttons}>
          {tab === 0 && (
            <a href={appStoreURL} onClick={sendAnalytics}>
              <img src="/app/enrollment/icon-app-store-black.png" alt="Download on the App Store" />
            </a>
          )}
          {tab === 1 && (
            <a href={googlePlayURL} onClick={sendAnalytics}>
              <img src="/app/enrollment/icon-google-play-black.png" alt="Get it on Google Play" />
            </a>
          )}
        </div>

        <canvas className={classes.qrcode} ref={ref} />
        <Typography align="center" careVariant="body3">
          Scan the QR code to download the app
        </Typography>
      </div>
    </div>
  ) : (
    <>
      <IconIllustrationXlargeConfirm className={classes.hero} width={192} />
      <Typography variant="h2" className={classes.title2}>
        You need to download the Care.com Caregiver app to continue — it’s free!
      </Typography>
      <Typography variant="body2">
        Review jobs, reply to messages and receive notifications on the go.
      </Typography>
      <a
        className={classes.linkButton}
        href={isIos ? appStoreURL : googlePlayURL}
        onClick={sendAnalytics}>
        Download now
      </a>
    </>
  );
};

export const AppDownloadHeader = () => {
  const classes = useStyles();

  return (
    <div className={isDesktop ? classes.desktopHeader : classes.title}>
      {isDesktop && <IconLogoIconCareLogo width={145} height={40} />}
      <Typography variant={isDesktop ? 'body2' : 'h4'}>Last step</Typography>
    </div>
  );
};

export const AppDownloadLayout = isDesktop
  ? ({ children }: ILayoutProps) => {
      const classes = useStyles();

      return <div className={classes.desktopContainer}>{children}</div>;
    }
  : null; // use default layout instead

export default AppDownload;
