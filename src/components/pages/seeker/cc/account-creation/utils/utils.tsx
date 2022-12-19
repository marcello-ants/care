import { AnalyticsHelper } from '@/utilities/analyticsHelper';

const ENROLLMENT_FLOW = 'MW VHP';
const CTA_CLICKED = 'Next';
const MEMBER_TYPE = 'Seeker';

interface analyticsDataParams {
  enrollmentStep: string;
  enrollmentFlow?: string;
  ctaClicked?: string;
  memberType?: string;
  finalStep?: boolean;
  caregiverCount?: number;
}

const analyticsDataBuilder = (params: analyticsDataParams) => {
  const data = {
    ...params,
    enrollment_flow: params.enrollmentFlow || ENROLLMENT_FLOW,
    cta_clicked: params.ctaClicked || CTA_CLICKED,
    member_type: params.memberType || MEMBER_TYPE,
    final_step: params.finalStep || false,
  };
  return data;
};

export default analyticsDataBuilder;

export const formSubmissionUtil = (formik: any, eventName: string, data: any) => {
  if (!formik.isValid || formik.isSubmitting) {
    return;
  }
  AnalyticsHelper.logEvent({
    name: eventName,
    data,
  });

  formik.handleSubmit();
};
