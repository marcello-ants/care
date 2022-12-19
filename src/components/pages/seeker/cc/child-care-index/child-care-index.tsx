import CareLocation from '@/pages/seeker/cc/care-location';
import { useAppDispatch } from '@/components/AppState';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ServiceIdsForMember, TimeIntent } from '@/types/seekerCC';
import useQueryParamData from '@/components/hooks/useQueryParamData';

function CareIndex() {
  const dispatch = useAppDispatch();
  const { query: { intent, serviceIdForMember } = {} } = useRouter();

  useEffect(() => {
    // GROW-1286: Previous intents should be cleared every time a user reaches the enrollment flow.
    // We set them even if they're undefined so they are reset to their default values
    dispatch({ type: 'setCzenIntent', intent: intent as TimeIntent });
    dispatch({
      type: 'setCzenServiceIdForMember',
      serviceIdForMember: serviceIdForMember as ServiceIdsForMember,
    });
  }, []);

  useQueryParamData();

  return <CareLocation />;
}

export default CareIndex;
