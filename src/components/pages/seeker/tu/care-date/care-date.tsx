import { useAppDispatch, useSeekerTUState } from '@/components/AppState';
import CareDatePage from '@/components/pages/seeker/care-date/care-date';
import { CARE_DATES, CARE_DATE_LABELS } from '@/constants';
import useNextRoute from '@/components/hooks/useNextRoute';
import { logCareEvent } from '@/utilities/amplitudeAnalyticsHelper';

export const dateOptions = [
  { label: CARE_DATE_LABELS.RIGHT_NOW, value: CARE_DATES.RIGHT_NOW },
  { label: CARE_DATE_LABELS.WITHIN_A_WEEK, value: CARE_DATES.WITHIN_A_WEEK },
  { label: CARE_DATE_LABELS.IN_1_2_MONTHS, value: CARE_DATES.IN_1_2_MONTHS },
  { label: CARE_DATE_LABELS.JUST_BROWSING, value: CARE_DATES.JUST_BROWSING },
];

function TutoringDatePage() {
  const { careDate } = useSeekerTUState();
  const dispatch = useAppDispatch();
  const { pushNextRoute } = useNextRoute();

  const handleNext = () => {
    logCareEvent('Member Enrolled', 'Intent', {
      intent: CARE_DATE_LABELS[careDate],
    });
    pushNextRoute();
  };

  const onChangeHandler = (value: string[]) => {
    if (!value.length) {
      return;
    }
    const selection = value[0];

    dispatch({ type: 'setTutoringDate', careDate: selection as CARE_DATES });
  };

  return (
    <CareDatePage
      heading="How soon do you need a tutor?"
      dateOptions={dateOptions}
      selectedCareDate={careDate}
      onChangeDateHandler={onChangeHandler}
      handleNext={handleNext}
    />
  );
}

export default TutoringDatePage;
