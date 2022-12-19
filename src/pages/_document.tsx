import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';
import getConfig from 'next/config';
import {
  SERVER_FEATURE_FLAGS,
  WINDOW_SENTRY_SESSION_REPLAY_KEY,
  WINDOW_SENTRY_TRACE_TRANSACTION_KEY,
  WINDOW_SPLUNK_TRACE_TRANSACTION_KEY,
} from '@/constants';
import { GTMScripts } from '@care/google-tag-manager';

const {
  publicRuntimeConfig: { cdnRoot, GOOGLE_TAG_MANAGER_ID },
  serverRuntimeConfig: { SIFT_SCIENCE_ACCOUNT_ID, SIFT_SCIENCE_ENABLED },
} = getConfig();

const baseFontPath = `${cdnRoot}/css/cms/font-face/ProximaNova`;

interface DocumentProps {
  splunkRumEval: string;
  gtmEnabled: boolean;
  sentrySessionReplay: boolean;
  sentryTraceTransaction: boolean;
  cspNonce: string | undefined;
}

export default class MyDocument extends Document<DocumentProps> {
  render() {
    const isSplunkRumEnabled = this.props.splunkRumEval === 'on';

    return (
      <Html lang="en">
        <Head>
          {/* In order to use CSS in JSS with CSP we must follow this meta tag convention https://material-ui.com/styles/advanced/#what-is-csp-and-why-is-it-useful */}
          <meta property="csp-nonce" content={this.props.cspNonce} />
          <link
            rel="preload"
            href={`${baseFontPath}/proximanova-regular-webfont.woff2`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href={`${baseFontPath}/proximanova-bold-webfont.woff2`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <style
            nonce={this.props.cspNonce}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `
              @font-face {
                font-family: 'Proxima Nova';
                font-display: swap;
                src: url('${baseFontPath}/proximanova-regular-webfont.woff2') format('woff2'),
                  url('${baseFontPath}/proximanova-regular-webfont.woff') format('woff');
              }
              @font-face {
                font-family: 'Proxima Nova';
                font-display: swap;
                src: url('${baseFontPath}/proximanova-bold-webfont.woff2') format('woff2'),
                  url('${baseFontPath}/proximanova-bold-webfont.woff') format('woff');
                font-weight: 700;
              }
            `,
            }}
          />
          {isSplunkRumEnabled && (
            <script defer src="/app/enrollment/scripts/splunk-otel-web-0.11.4.js" />
          )}
          {this.props.gtmEnabled && (
            <GTMScripts nonce={this.props.cspNonce} containerId={GOOGLE_TAG_MANAGER_ID} />
          )}
          {SIFT_SCIENCE_ENABLED === 'true' && SIFT_SCIENCE_ACCOUNT_ID && (
            <script
              type="text/javascript"
              nonce={this.props.cspNonce}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: `
                var _sift = window._sift = window._sift || [];
                _sift.push(['_setAccount', '${SIFT_SCIENCE_ACCOUNT_ID}']);
                (function() {
                  function ls() {
                    var e = document.createElement('script');
                    e.src = 'https://cdn.sift.com/s.js';
                    document.body.appendChild(e);
                  }
                  window.addEventListener('load', ls, false);
                })();
              `,
              }}
            />
          )}
          <script
            type="text/javascript"
            nonce={this.props.cspNonce}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `
                window.${WINDOW_SENTRY_SESSION_REPLAY_KEY} = ${this.props.sentrySessionReplay};
                window.${WINDOW_SENTRY_TRACE_TRANSACTION_KEY} = ${this.props.sentryTraceTransaction};
                window.${WINDOW_SPLUNK_TRACE_TRANSACTION_KEY} = ${isSplunkRumEnabled};
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          <img src={`/trackVisit.trace${Date.now()}`} width="1" height="1" alt="" />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with server-side generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  let splunkRumEval = 'off';
  let gtmEnabled = false;
  let sentrySessionReplay = false;
  const sentryTraceTransaction = ctx.req?.careContext?.sentryTraceTransaction ?? false;

  // evaluate our server-side Launch Darkly flags
  const { ldClient, ldUser } = ctx.req?.careContext || {};

  if (ldClient && ldUser) {
    const [splunkRumEvalFlag, gtmEnabledFlag, sentrySessionReplayFlag] = await Promise.all([
      ldClient.variationDetail(SERVER_FEATURE_FLAGS.SPLUNK_RUM_EVAL, ldUser, false),
      ldClient.variationDetail(SERVER_FEATURE_FLAGS.GTM_ENABLED, ldUser, false),
      ldClient.variationDetail(SERVER_FEATURE_FLAGS.SENTRY_SESSION_REPLAY, ldUser, false),
    ]);

    splunkRumEval = splunkRumEvalFlag.value;
    gtmEnabled = gtmEnabledFlag.value;
    sentrySessionReplay = sentrySessionReplayFlag.value;
  }

  const { nonce } = ctx.req?.careContext || {};

  // This adds the tag `nonce` to <style id="jss-server-side">
  const nonceAugmentedSheets = {
    ...sheets.getStyleElement(),
    props: { ...sheets.getStyleElement().props, ...(nonce ? { nonce } : {}) },
  };

  // allow the user to provide query params that take precedence over the LD flags
  return {
    ...initialProps,
    splunkRumEval,
    gtmEnabled,
    sentrySessionReplay,
    sentryTraceTransaction,
    cspNonce: nonce,

    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...React.Children.toArray(initialProps.styles), nonceAugmentedSheets],
  };
};
