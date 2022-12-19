import { logCareEvent } from '@/utilities/amplitudeAnalyticsHelper';
import { useAppDispatch, useSeekerPCState } from '@/components/AppState';
import CareDatePage from '@/components/pages/seeker/care-date/care-date';
import { CARE_DATES, CARE_DATE_LABELS } from '@/constants';
import useNextRoute from '@/components/hooks/useNextRoute';
import useQueryParamData from '@/components/hooks/useQueryParamData';

const options = [
  { label: CARE_DATE_LABELS.RIGHT_NOW, value: CARE_DATES.RIGHT_NOW },
  { label: CARE_DATE_LABELS.WITHIN_A_WEEK, value: CARE_DATES.WITHIN_A_WEEK },
  { label: CARE_DATE_LABELS.IN_1_2_MONTHS, value: CARE_DATES.IN_1_2_MONTHS },
  { label: CARE_DATE_LABELS.JUST_BROWSING, value: CARE_DATES.JUST_BROWSING },
];

function PetCareDatePage() {
  const { careDate } = useSeekerPCState();
  const dispatch = useAppDispatch();
  const { pushNextRoute } = useNextRoute();

  useQueryParamData();

  const handleNext = () => {
    logCareEvent('Member Enrolled', 'Dates', {
      intent: CARE_DATE_LABELS[careDate],
    });
    pushNextRoute();
  };

  const onChangeHandler = (value: string[]) => {
    if (!value.length) {
      return;
    }
    const selection = value[0];

    dispatch({ type: 'setPetCareDate', careDate: selection as CARE_DATES });
  };

  return (
    <CareDatePage
      heading="When do you need pet care?"
      dateOptions={options}
      selectedCareDate={careDate}
      onChangeDateHandler={onChangeHandler}
      handleNext={handleNext}
    />
  );
}

export default PetCareDatePage;
