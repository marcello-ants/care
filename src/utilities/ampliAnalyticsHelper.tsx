import getConfig from 'next/config';
import { CLIENT_FEATURE_FLAGS, VERTICALS_NAMES } from '@/constants';
import { ampli, Ampli, ApiKey, DefaultOptions } from '@/__generated__/ampli';
import { SENIOR_CARE_TYPE } from '@/__generated__/globalTypes';
import { CareFrequency } from '@/types/seeker';
import { FeatureFlags } from '@/components/FeatureFlagsContext';
import amplitude from 'amplitude-js';
import getVertical from './verticalUtils';
import { getCzenSessionId, getCzenVisitorId } from './czenCookiesHelper';

const { publicRuntimeConfig } = getConfig();

type AmplitudeWebPlatformType = 'mobile_web' | 'desktop';
type AmplitudeVerticalType = ReturnType<AmpliHelper['getAmplitudeTypeFromVertical']>;

class AmpliHelper {
  private initialized: boolean = false;

  public ampli: Ampli = ampli;

  // Only call this once when we first call Ampli
  private initialize = () => {
    if (!this.initialized) {
      // There are only two environments/projects for Ampli
      const isProd = publicRuntimeConfig.AMPLITUDE_ENV === 'prod';
      const apiKey = ApiKey[isProd ? 'production' : 'development'];

      // Must used a named instance until we get rid of old non-Ampli events
      const amplitudeInstance = amplitude.getInstance('ampli-instance');
      amplitudeInstance.init(apiKey, undefined, DefaultOptions);

      this.ampli.load({
        disabled: publicRuntimeConfig.ANALYTICS_ENABLED !== 'true',
        client: { instance: amplitudeInstance },
      });

      this.initialized = true;
    }
  };

  // Called in _app.tsx to set basic user properties
  setDefaultUserProps = (careDeviceId: string) => {
    this.initialize();
    this.ampli.identify(
      undefined,
      {
        czen_session_id: getCzenSessionId(),
        visitor_id: getCzenVisitorId(),
      },
      { device_id: careDeviceId } as any
    );
  };

  // Old strings used for event properties are slightly different - need a couple map functions
  getAmplitudeTypeFromVertical = (vertical: string) => {
    switch (vertical) {
      case VERTICALS_NAMES.CHILD_CARE:
        return 'child_care';
      case VERTICALS_NAMES.HOUSEKEEPING:
        return 'housekeeping';
      case VERTICALS_NAMES.PET_CARE:
        return 'pet_care';
      case VERTICALS_NAMES.SENIOR_CARE:
        return 'senior_care';
      case VERTICALS_NAMES.TUTORING:
        return 'tutoring';
      default:
        return undefined;
    }
  };

  mapCareFrequencyToTypeOfCare = (careFrequency?: CareFrequency) => {
    switch (careFrequency) {
      case 'recurring':
        return 'recurring';
      case 'onetime':
        return 'one_time';
      case 'livein':
        return 'live_in';
      default:
        return 'one_time';
    }
  };

  // Populate data common to all events
  getCommonData = () => ({
    url: window.location.href,
    url_path: window.location.pathname,
    vertical: this.getAmplitudeTypeFromVertical(getVertical()) as AmplitudeVerticalType,
    web_platform: (window.innerWidth < 600 ? 'mobile_web' : 'desktop') as AmplitudeWebPlatformType,
  });

  // During testing this will control when to use Ampli
  // Current: feature flag must be on and only for SC in-home seekers
  useAmpli = (featureFlags: FeatureFlags, seekerTypeOfCare?: SENIOR_CARE_TYPE) => {
    return (
      featureFlags?.[CLIENT_FEATURE_FLAGS.AMPLITUDE_USE_AMPLI]?.variationIndex &&
      (!seekerTypeOfCare || seekerTypeOfCare === SENIOR_CARE_TYPE.IN_HOME)
    );
  };
}

export default new AmpliHelper();
