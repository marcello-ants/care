import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { AppContext, AppProps } from 'next/app';
import getConfig from 'next/config';
import Head from 'next/head';
import { ApolloProvider } from '@apollo/client';
import { CssBaseline, makeStyles, ThemeProvider } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { theme } from '@care/material-ui-theme';
import { CoreGlobalFooter } from '@care/navigation';
import DayJSUtils from '@date-io/dayjs';
import Cookies from 'universal-cookie';
import { setUser } from '@sentry/nextjs';
import {
  CLIENT_FEATURE_FLAGS,
  CZEN_JSESSIONID_COOKIE_KEY,
  CZEN_VISITOR_COOKIE_KEY,
  CZEN_SECURE_AUTH_COOKIE_KEY,
  CSC_SESSION_COOKIE_NAME,
  SEEKER_TUTORING_ROUTES,
  SEEKER_HOUSEKEEPING_ROUTES,
  SEEKER_PET_CARE_ROUTES,
  SEEKER_CHILD_CARE_ROUTES,
  FLOWS,
  CZEN_SESSION_COOKIE_KEY,
} from '@/constants';
import { AppPageComponent } from '@/types/app';
import { useApollo } from '@/lib/ApolloClient';
import AuthService from '@/lib/AuthService';
import logger from '@/lib/clientLogger';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import logClickEvent from '@/utilities/log-click-event';
import AmpliHelper from '@/utilities/ampliAnalyticsHelper';
import AuthError from '@/pages/auth-error';
// import { FacebookApiKeyProvider } from '@/components/FacebookApiKeyContext';
import { FeatureFlags, FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { AppStateProvider, getFlowName } from '@/components/AppState';
import PageTransition from '@/components/PageTransition';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import ProgressFlowNavbar from '@/components/ProgressFlowNavbar';
import { useDaycareAutoSubmit } from '@/components/features/daycareAutoSubmit/useDaycareAutoSubmit';

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  // @axe-core/react is a dev dependency as it's only used when running the server locally
  // eslint-disable-next-line import/no-extraneous-dependencies
  import('@axe-core/react').then(({ default: axe }) => {
    axe(React, ReactDOM, 1000);
  });
}

const {
  publicRuntimeConfig: { CZEN_GENERAL },
} = getConfig();

const useStyles = makeStyles({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    overflowX: 'hidden',
    flex: '1 0 auto',
  },
  headerWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  content: {
    margin: 'auto',
    maxWidth: '410px',
  },
  contentFullWidth: {
    margin: 'auto',
    maxWidth: '410px',
    [theme.breakpoints.up('md')]: {
      paddingLeft: '80px',
      paddingRight: '80px',
      maxWidth: '100%',
    },
  },
  wrapper: {
    // accounting for header height + 1px border to avoid unnecessary scrolling
    minHeight: `calc(100vh - (${theme.spacing(7)}px + 1px))`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
      // accounting for header height + 1px border to avoid unnecessary scrolling
      minHeight: `calc(100vh - (${theme.spacing(8)}px + 1px))`,
    },
    // only targets IE10 and IE11
    '@media all and (-ms-high-contrast:none)': {
      height: `calc(100vh - (${theme.spacing(8)}px + 1px))`,
    },
  },

  bgWrapper: {
    minHeight: `calc(100vh - (${theme.spacing(7)}px + 1px))`, // the 56px + 1px are from the header
    flex: '1 0 auto',
    position: 'relative',
    [theme.breakpoints.up('md')]: {
      paddingBottom: theme.spacing(10),
    },
    [theme.breakpoints.down('sm')]: {
      paddingBottom: theme.spacing(6),
    },
    overflow: 'hidden',
  },
  appWrapper: {
    height: '100vh',
  },
});

type ErrorData = {
  errorMsg: string;
  path?: string;
  payload?: { [key: string]: any };
  serverError?: { [key: string]: any };
  [key: string]: any;
};

// If we pull in @care/cookie-flow-auth we can get rid of this and import their interface
interface IAuthDataContext {
  memberUuid: string;
  isImpersonated: boolean;
  isLoggedIn: boolean;
}

const initialProps = {
  onError(type: string, errorData: ErrorData) {
    const { errorMsg, path, payload, serverError } = errorData;

    logger.error(errorMsg, {
      tags: [type],
      path,
      payload,
      serverError,
    });
  },
};

const TOUCH_ICONS_BASE_URL = `${CZEN_GENERAL}/img/mw/touchIcons`;
const touchIcons = [
  // For iPad with high-resolution Retina display running iOS 7:
  {
    sizes: '152x152',
    href: `${TOUCH_ICONS_BASE_URL}/apple-touch-icon-152x152-precomposed.png`,
  },
  // For iPad with high-resolution Retina display running iOS 6:
  {
    sizes: '144x144',
    href: `${TOUCH_ICONS_BASE_URL}/apple-touch-icon-144x144-precomposed.png`,
  },
  // For iPhone with high-resolution Retina display running iOS 7:
  {
    sizes: '120x120',
    href: `${TOUCH_ICONS_BASE_URL}/apple-touch-icon-120x120-precomposed.png`,
  },
  // For iPhone with high-resolution Retina display running iOS 6:
  {
    sizes: '114x114',
    href: `${TOUCH_ICONS_BASE_URL}/apple-touch-icon-114x114-precomposed.png`,
  },
  // For the iPad mini and the first- and second-generation iPad on iOS 7:
  {
    sizes: '76x76',
    href: `${TOUCH_ICONS_BASE_URL}/apple-touch-icon-76x76-precomposed.png`,
  },
  // For the iPad mini and the first- and second-generation iPad on iOS 6:
  {
    sizes: '72x72',
    href: `${TOUCH_ICONS_BASE_URL}/apple-touch-icon-72x72-precomposed.png`,
  },
  // For non-Retina iPhone, iPod Touch, and Android 2.1+ devices:
  {
    href: `${TOUCH_ICONS_BASE_URL}/apple-touch-icon-precomposed.png`,
  },
];

function getMeta() {
  return (
    <>
      <title>Babysitters, Nannies, Child Care, Senior & Home Care Services</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="description"
        content="Care.com - Find a local babysitter, nanny, pet sitter, tutor or senior caregiver near you. Post a job for child care, babysitting, tutoring, senior home health care, pet care & housekeeping. Hire an available full or part time babysitter and nanny when you need one. Browse listings and services by experience, hourly pay rates, and more."
      />
      <meta name="keywords" content="babysitter, nanny, child care, home care, sitter, care" />
      <meta name="robots" content="noindex,nofollow" />
      <link rel="shortcut icon" href={`${CZEN_GENERAL}/img/crcm-favicon.ico`} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      {touchIcons.map((icon) => (
        <link
          key={icon.href}
          rel="apple-touch-icon-precomposed"
          href={icon.href}
          sizes={icon.sizes}
        />
      ))}
    </>
  );
}

type EnrollmentAppProps = Omit<AppProps, 'Component'> & {
  Component: AppPageComponent;
  enrollmentSessionId: string;
  czenVisitorId: string | undefined;
  czenJSessionId: string | undefined;
  czenSessionId: string | undefined;
  referrerCookie: string | undefined;
  err: Error;
  ldClientFlags: FeatureFlags;
  czenAuthCookieExists: boolean;
  // facebookAppId: string;
  careDeviceId: string;
  hasMemberCookie: boolean;
  cookieAuthContext: IAuthDataContext | undefined;
};

export default function App({
  Component,
  pageProps,
  router,
  ldClientFlags,
  err,
  enrollmentSessionId,
  czenVisitorId,
  czenJSessionId,
  czenSessionId,
  referrerCookie,
  czenAuthCookieExists,
  // facebookAppId,
  careDeviceId,
  hasMemberCookie,
  cookieAuthContext,
}: EnrollmentAppProps) {
  const classes = useStyles();
  const Layout = Component.Layout || DefaultLayout;
  const HeadTags = Component.HeadTags || getMeta();
  const isExternalLoginPage = router.asPath === '/external-login-form';
  const [clickEventLogged, setClickEventLogged] = useState(false);
  const [ampliInitialized, setAmpliInitialized] = useState(false);

  useEffect(() => {
    AnalyticsHelper.setDefaultUserProps(careDeviceId);
  }, []);

  useEffect(() => {
    if (!ampliInitialized && AmpliHelper.useAmpli(ldClientFlags)) {
      AmpliHelper.setDefaultUserProps(careDeviceId);
      setAmpliInitialized(true);
    }
  }, [ampliInitialized, ldClientFlags]);

  useEffect(() => {
    if (!clickEventLogged && cookieAuthContext?.memberUuid) {
      logClickEvent(cookieAuthContext?.memberUuid);
      setClickEventLogged(true);
    }
  }, [clickEventLogged, cookieAuthContext?.memberUuid]);

  const componentRequestsAuthCheck = Component.CheckAuthCookie || false;
  const showAuthCookieError = componentRequestsAuthCheck && czenAuthCookieExists;

  /* istanbul ignore next */
  const usePageTransition =
    Component.usePageTransition !== undefined ? Component?.usePageTransition : true;

  let transitionKey: string;
  if (usePageTransition) {
    transitionKey = router.asPath?.split('?')[0];
  } else {
    transitionKey = Component.transitionKey || router.route;
  }

  const setDataByURL = (url: string) => {
    if (url === '/seeker/sc') {
      return {
        screen_name: 'seeker.enroll.consolidatedFlow.seniorcare.updateGuided.intro',
        screen_template: 'seeker.enroll.consolidatedFlow.seniorcare.updateGuided.intro',
      };
    }

    return {};
  };

  const fireScreenViewedEvent = (url: string) => {
    const data = setDataByURL(url);

    /* istanbul ignore next */
    const recapPages = [
      SEEKER_CHILD_CARE_ROUTES.RECAP,
      SEEKER_TUTORING_ROUTES.RECAP,
      SEEKER_HOUSEKEEPING_ROUTES.RECAP,
      SEEKER_PET_CARE_ROUTES.RECAP,
    ];

    if (
      !Component.disableScreenViewed &&
      !url.startsWith('/seeker/sc/lc') &&
      !url.startsWith('/ltcg') &&
      recapPages.every((pagePath) => !url.startsWith(pagePath))
    ) {
      AnalyticsHelper.logEvent({
        name: 'Screen Viewed',
        data: {
          ...data,
          referer: document.referrer,
        },
      });

      if (AmpliHelper.useAmpli(ldClientFlags) && url === '/seeker/sc') {
        AmpliHelper.ampli.screenViewedTypeOfSeniorCareNeed({
          ...AmpliHelper.getCommonData(),
          ...data,
          referer: document.referrer,
        });
      }
    }
  };

  useEffect(() => {
    fireScreenViewedEvent(router.pathname);
  }, [router.pathname]);

  // TODO: Discuss how we want to handle SSR moving forward
  if (typeof window === 'undefined') {
    return (
      <>
        <Head>{HeadTags}</Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className={classes.wrapper} />
        </ThemeProvider>
      </>
    );
  }

  // we're using `useRef` to ensure that Sentry.setUser() is invoked just once and before any child components are rendered
  const rumUserInitializedRef = useRef<boolean>(false);
  if (!rumUserInitializedRef.current) {
    setUser({
      id: careDeviceId,

      // other user identifiers that might be useful for debugging purposes
      enrollmentSessionId,
      czenSessionId,
      czenVisitorId,
    });

    if (typeof window !== 'undefined' && window.SplunkRum) {
      window.SplunkRum.setGlobalAttributes({
        'enduser.careDeviceId': careDeviceId,
        'enduser.sessionId': czenSessionId,
        'enduser.visitorId': czenVisitorId,
      });
    }

    rumUserInitializedRef.current = true;
  }

  const cookieFlowEvaluation = ldClientFlags[CLIENT_FEATURE_FLAGS.COOKIE_FLOW_AUTH];
  const cscSessionCookieFlowEvaluation =
    ldClientFlags[CLIENT_FEATURE_FLAGS.CSC_SESSION_COOKIE_FLOW];
  const cookieFlowEnabled = cookieFlowEvaluation?.value;
  const authService = AuthService(
    cookieFlowEnabled,
    cookieFlowEvaluation,
    cscSessionCookieFlowEvaluation
  );
  const apolloClient = useApollo(initialProps, authService, cookieFlowEnabled);
  let footerTopDisclaimer = null;

  /* istanbul ignore else */
  if (router.asPath === '/seeker/sc') {
    footerTopDisclaimer = (
      <>
        <span>*The</span>{' '}
        <a
          href="https://www.cdc.gov/coronavirus/2019-ncov/community/retirement/considerations.html"
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: 'none' }}>
          CDC
        </a>{' '}
        <span>
          has found retirement communities and independent living facilities to present higher risk
          of COVID-19 infection and transmission.
        </span>
      </>
    );
  } else if (router.asPath === '/seeker/sc/recap') {
    footerTopDisclaimer =
      'The images shown are for display purposes only and do not represent actual Care.com caregivers';
  }

  const Footer = isExternalLoginPage
    ? null
    : Component.Footer || <CoreGlobalFooter minimal topDisclaimer={footerTopDisclaimer} />;

  const Header = isExternalLoginPage ? null : Component.Header || <ProgressFlowNavbar />;

  useEffect(() => {
    const aaaFlagEvaluation = ldClientFlags[CLIENT_FEATURE_FLAGS.ENROLLMENT_MFE_AAA];
    const globalHoldOut = ldClientFlags[CLIENT_FEATURE_FLAGS.GLOBAL_HOLD_OUT];

    if (aaaFlagEvaluation) {
      AnalyticsHelper.logTestExposure(CLIENT_FEATURE_FLAGS.ENROLLMENT_MFE_AAA, aaaFlagEvaluation);
    }

    if (globalHoldOut && globalHoldOut?.reason?.kind !== 'OFF') {
      AnalyticsHelper.logTestExposure(CLIENT_FEATURE_FLAGS.GLOBAL_HOLD_OUT, globalHoldOut);
    }
  }, []);

  const shouldAppendDaycareAutoSubmit =
    getFlowName(router.asPath) === FLOWS.SEEKER_DAYCARE_CHILD_CARE.name;

  function DaycareAutoSubmit() {
    useDaycareAutoSubmit();
    return null;
  }

  return (
    <div suppressHydrationWarning className={classes.appWrapper}>
      <Head>{HeadTags}</Head>
      <FeatureFlagsProvider flags={ldClientFlags}>
        {/* We don't use facebook login now */}
        {/* <FacebookApiKeyProvider apiKey={facebookAppId}> */}
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ApolloProvider client={apolloClient}>
            <MuiPickersUtilsProvider utils={DayJSUtils}>
              <AppStateProvider
                czenJSessionId={czenJSessionId}
                referrerCookie={referrerCookie}
                userHasAccount={hasMemberCookie}
                memberUuid={cookieAuthContext?.memberUuid}>
                {Header}
                {/* makes sure footer stays at the bottom */}
                <div className={classes.wrapper}>
                  <div className={classes.bgWrapper}>
                    {/* manually passing any errors here for _errors.tsx because https://github.com/vercel/next.js/issues/8592 */}
                    <Layout>
                      <PageTransition>
                        {/* If the component requires to check the cookie and if auth cookie exists hijack the component and display AuthError page */}
                        {showAuthCookieError ? (
                          <AuthError {...pageProps} err={err} key={transitionKey} />
                        ) : (
                          <>
                            {shouldAppendDaycareAutoSubmit && <DaycareAutoSubmit />}
                            <Component {...pageProps} err={err} key={transitionKey} />
                          </>
                        )}
                      </PageTransition>
                    </Layout>
                  </div>
                  {Footer}
                </div>
              </AppStateProvider>
            </MuiPickersUtilsProvider>
          </ApolloProvider>
        </ThemeProvider>
        {/* </FacebookApiKeyProvider> */}
      </FeatureFlagsProvider>
    </div>
  );
}

/**
 * Invoked during SSR to build the map of data we need to provide to the client.  This function also serves to disable
 * static page generation in favor of SSR for *all* pages, which is currently needed in order to inject
 * the proper env-specific config at runtime rather than at build time.
 * @param appContext
 */
export async function getInitialProps(appContext: AppContext) {
  const {
    ctx: { req },
  } = appContext;
  let enrollmentSessionId;
  let czenVisitorId;
  let czenJSessionId;
  let czenSessionId;
  let referrerCookie;
  let czenAuthCookie;
  let careDeviceId;
  let hasMemberCookie = false;
  let cookieAuthContext: IAuthDataContext | undefined;
  const ldClientFlags: FeatureFlags = {};

  if (req) {
    // parse cookies from the request with a no-op decoder so we don't make any assumptions about how each cookie is encoded
    const cookies = new Cookies(req.headers.cookie, {
      decode: (c) => c,
    });
    referrerCookie = cookies.get('rc');

    ({ enrollmentSessionId } = req);
    // ({ facebookAppId } = req);
    ({ careDeviceId } = req);

    czenVisitorId = cookies.get(CZEN_VISITOR_COOKIE_KEY) ?? undefined;
    czenJSessionId = cookies.get(CZEN_JSESSIONID_COOKIE_KEY) ?? undefined;
    czenSessionId = cookies.get(CZEN_SESSION_COOKIE_KEY) ?? undefined;
    czenAuthCookie =
      cookies.get(CZEN_SECURE_AUTH_COOKIE_KEY) || cookies.get(CSC_SESSION_COOKIE_NAME);
    hasMemberCookie = typeof cookies.get(CSC_SESSION_COOKIE_NAME) !== 'undefined';

    const { ldClient, ldUser } = req.careContext || {};
    if (ldClient && ldUser) {
      const clientFlagPromises = Object.values(CLIENT_FEATURE_FLAGS).map(async (flagName) => {
        ldClientFlags[flagName] = await ldClient.variationDetail(flagName, ldUser, undefined);
      });
      await Promise.all(clientFlagPromises);
    }

    const { session } = req.careContext || {};
    if (session) {
      const isLoggedIn = session.state === 'authenticated';
      const jwt = isLoggedIn ? session.jwt : undefined;

      cookieAuthContext = {
        memberUuid: jwt?.impersonated || jwt?.sub || '',
        isLoggedIn,
        isImpersonated: Boolean(jwt?.impersonated),
      };
    }
  }

  const czenAuthCookieExists = typeof czenAuthCookie === 'string' && czenAuthCookie.length > 0;
  return {
    enrollmentSessionId,
    czenVisitorId,
    czenJSessionId,
    czenSessionId,
    referrerCookie,
    ldClientFlags,
    czenAuthCookieExists,
    // facebookAppId,
    careDeviceId,
    hasMemberCookie,
    cookieAuthContext,
  };
}

App.getInitialProps = getInitialProps;
