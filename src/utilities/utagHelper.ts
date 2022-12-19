import getConfig from 'next/config';
import { GtmHelper } from '@care/google-tag-manager';

export type TealiumData = {
  sessionId: string | undefined | null;
  memberId?: string | undefined;
  email?: string | undefined | null;
  slots: string[];
  // eslint-disable-next-line camelcase
  tealium_event?: string;
  [key: string]: unknown;
};

export namespace TealiumUtagService {
  let scriptSrc = '';
  const { publicRuntimeConfig } = getConfig();

  // Typically set "noview" flag (no first page automatic view event) to true for Single Page Apps (SPAs)
  const init = () => {
    window.utag_cfg_ovrd = { noview: true };
    window.utagData = { slots: [], events: [] };
  };

  // Generic script loader with callback
  // eslint-disable-next-line class-methods-use-this
  const getScript = (src: string, callback: () => void) => {
    const d: any = document;
    const fn = () => {};
    const o = { callback: callback || fn };

    if (typeof src === 'undefined') {
      return;
    }

    const s: any = d.createElement('script');
    s.language = 'javascript';
    s.type = 'text/javascript';
    s.async = 1;
    s.charset = 'utf-8';
    s.src = src;
    if (typeof o.callback === 'function') {
      s.addEventListener(
        'load',
        () => {
          o.callback();
        },
        false
      );
    }
    const t: any = d.getElementsByTagName('script')[0];
    t.parentNode.insertBefore(s, t);
  };

  // Config settings used to build the path to the utag.js file
  const setConfig = (config: { account: string; profile: string; environment: string }) => {
    if (
      config.account !== undefined &&
      config.profile !== undefined &&
      config.environment !== undefined
    ) {
      scriptSrc = `https://tags.tiqcdn.com/utag/${config.account}/${config.profile}/${config.environment}/utag.js`;
    }
  };

  // Data layer is optional set of key/value pairs
  const track = (tealiumEvent: string, data?: any) => {
    setConfig({
      account: 'care',
      profile: 'us',
      environment: publicRuntimeConfig.TEALIUM_ENV,
    });
    if (scriptSrc === '') {
      return;
    }
    if (window.utag === undefined) {
      init();
      getScript(scriptSrc, () => {
        window.utag.track(tealiumEvent, data);
      });
    } else {
      window.utag.track(tealiumEvent, data);
    }

    window.utagData.slots.push(data.slots);
    window.utagData.events.push(data.tealium_event);
  };

  export const view = (data?: any) => {
    track('view', data);
    // We call gtm inside the utag until we don't fully migrate from Tealium
    GtmHelper.push({ event: 'View', ...data });
  };

  export const link = (data?: any) => {
    track('link', data);
  };
}
