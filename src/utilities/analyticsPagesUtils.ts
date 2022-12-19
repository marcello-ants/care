import { AnalyticsHelper } from '@/utilities/analyticsHelper';

const commonIbData = {
  job_flow: 'MW VHP enrollment',
  final_step: false,
};

export const logIbDayTimeEvent = (startTime: string, endTime: string) => {
  AnalyticsHelper.logEvent({
    name: 'Member Enrolled',
    data: {
      ...commonIbData,
      enrollment_step: 'Booking Date',
      booking_start_time: startTime,
      booking_end_time: endTime,
      cta_clicked: 'next',
    },
  });
};

export const logIbPayEvent = (rate: number) => {
  AnalyticsHelper.logEvent({
    name: 'Member Enrolled',
    data: {
      ...commonIbData,
      enrollment_step: 'Booking Max Rate',
      booking_rate: rate,
      cta_clicked: 'next',
    },
  });
};

export const logIbAddressEvent = () => {
  AnalyticsHelper.logEvent({
    name: 'Member Enrolled',
    data: {
      ...commonIbData,
      enrollment_step: 'Booking Location',
      cta_clicked: 'next',
    },
  });
};

export const logIbIsHomeAddressEvent = (isHomeAddress: boolean) => {
  AnalyticsHelper.logEvent({
    name: 'Member Enrolled',
    data: {
      ...commonIbData,
      enrollment_step: 'Booking Location Confirmation',
      is_booking_location_home: isHomeAddress,
      cta_clicked: 'next',
    },
  });
};

export const logIbHomeAddressEvent = () => {
  AnalyticsHelper.logEvent({
    name: 'Member Enrolled',
    data: {
      ...commonIbData,
      enrollment_step: 'Home Address',
      cta_clicked: 'next',
    },
  });
};

export const logIbNameHDYHAUEvent = (howDidYouHearAboutUs: string) => {
  AnalyticsHelper.logEvent({
    name: 'Member Enrolled',
    data: {
      ...commonIbData,
      enrollment_step: 'First and Last Name',
      hdyhau: howDidYouHearAboutUs,
      cta_clicked: 'next',
    },
  });
};

export const logIbEmailPasswordEvent = (createdPassword: boolean) => {
  AnalyticsHelper.logEvent({
    name: 'Member Enrolled',
    data: {
      enrollment_step: 'Email And Password',
      cta_clicked: 'Join now',
      created_password: createdPassword ? 'Yes' : 'No',
      member_type: 'Seeker',
      job_flow: 'MW VHP enrollment',
      final_step: true,
    },
  });
};

export const logIbDayTimeErrorEvent = (errorMessage: string) => {
  AnalyticsHelper.logEvent({
    name: 'Error Viewed',
    data: {
      enrollment_step: 'Booking Date',
      error_type: 'Form Validation Error',
      error: errorMessage,
    },
  });
};

export const logIbAddressErrorEvent = (errorMessage: string, screenName: string) => {
  AnalyticsHelper.logEvent({
    name: 'Error Viewed',
    data: {
      enrollment_step: screenName,
      error_type: 'Form Validation Error',
      error: errorMessage,
    },
  });
};
