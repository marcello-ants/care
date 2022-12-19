import { useEffect } from 'react';
import FullWidthLayout from '@/components/layouts/FullWidthLayout';
import ShortEnrollmentHeader from '@/components/features/ShortEnrollmentHeader/ShortEnrollmentHeader';
import { CoreGlobalFooter } from '@care/navigation';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import ShortEnrollmentForm from '@/components/ShortEnrollmentForm';
import { SHORT_ENROLLMENT_ROUTES } from '@/constants';
import ShortEnrollmentContainer from './short-enrollment-container';

function ShortEnrollmentPage() {
  useEffect(() => {
    AnalyticsHelper.logEvent({
      name: 'Screen Viewed',
      data: {
        job_flow: 'SingleEnrollment',
        screen_name: 'short-enrollment',
        source: 'short-enrollment',
        referrer: document.referrer,
      },
    });
  }, []);

  return (
    <ShortEnrollmentContainer>
      <ShortEnrollmentForm nextPageURL={SHORT_ENROLLMENT_ROUTES.PASSWORD} />
    </ShortEnrollmentContainer>
  );
}

ShortEnrollmentPage.Layout = FullWidthLayout;
ShortEnrollmentPage.Header = <ShortEnrollmentHeader />;
ShortEnrollmentPage.Footer = <CoreGlobalFooter minimal />;
ShortEnrollmentPage.disableScreenViewed = true;
export default ShortEnrollmentPage;
