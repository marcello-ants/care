/* eslint-disable camelcase */
import type { SplunkOtelWebType } from '@splunk/otel-web';
import { Currency, DateTime, Decimal, LocalDate, LocalTime, Upload, URL } from '@/lib/customTypes';

declare module 'http' {
  interface IncomingMessage {
    enrollmentSessionId?: string;
    facebookAppId: string;
    careDeviceId?: string;
  }
}

declare global {
  interface Window {
    _sift: {
      push: (arg0: string[]) => void;
    };
    utag_cfg_ovrd: {
      noview: boolean;
    };
    utagData: {
      slots: any[];
      events: any[];
    };
    utag: {
      track(tealiumEvent: string, data?: any);
    };
    SENTRY_SESSION_REPLAY: boolean;
    SENTRY_TRACE_TRANSACTION: boolean;
    SPLUNK_TRACE_TRANSACTION: boolean;
    SplunkRum: SplunkOtelWebType;
  }
  type globalScalarCurrency = Currency;
  type globalScalarDecimal = Decimal;
  type globalScalarLocalDate = LocalDate;
  type globalScalarLocalTime = LocalTime;
  type globalScalarURL = URL;
  type globalScalarUpload = Upload;
  type globalScalarDateTime = DateTime;
  type globalScalarPhoneNumber = string;
}

declare module '@care/fastify-context' {
  interface CareRequestContext {
    sentryTraceTransaction?: boolean;
  }
}

export default {};
