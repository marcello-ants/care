import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button } from '@material-ui/core';
import { Modal } from '@care/react-component-lib';
import OverlaySpinner from '@/components/OverlaySpinner';
import AvailabilityComponent from '@/components/pages/availability';

import { ProviderState } from '@/types/provider';
import { ProviderCCState } from '@/types/providerCC';
import { Recurring } from '@/types/common';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

interface Props {
  providerState: ProviderState | ProviderCCState;
  nextRoute: string;
  onNextClick: (data: Recurring) => Promise<boolean>;
  isFreeGated?: boolean;
}

function Availability({ providerState, nextRoute, onNextClick, isFreeGated }: Props) {
  const router = useRouter();

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendAnalytics = (recurring: Recurring) => {
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data: {
        enrollment_flow: 'MW VHP Provider Enrollment',
        enrollment_step: 'provider_availability',
        cta_clicked: 'Next',
        start_date: recurring.start,
        end_date: recurring.end,
        day_of_week: Object.keys(recurring.schedule).join(','),
        time_of_day: Object.keys(recurring.careTimes).join(','),
      },
    });
  };

  const handleNext = async ({ recurring }: { recurring: Recurring }) => {
    setLoading(true);
    sendAnalytics(recurring);

    const successful = await onNextClick(recurring);

    if (successful) {
      router.push(nextRoute);
    } else {
      setLoading(false);
      setShowErrorModal(true);
    }
  };

  const componentProps = {
    header: isFreeGated ? 'My availability' : 'When are you available to work?',
    handleNext,
    appState: providerState,
    isFreeGated,
  };

  return loading ? (
    <OverlaySpinner isOpen wrapped />
  ) : (
    <>
      <AvailabilityComponent {...componentProps} />
      <Modal
        open={showErrorModal}
        title="Oops, something went wrong"
        ButtonPrimary={
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              setShowErrorModal(false);
              router.push(nextRoute);
            }}>
            Got it
          </Button>
        }
        onClose={() => {}}>
        We weren&apos;t able to save your availability. Don&apos;t worry though, you can update this
        from your profile later.
      </Modal>
    </>
  );
}

Availability.defaultProps = {
  isFreeGated: false,
};

export default Availability;
