import { useQuery } from '@apollo/client';
import { useAppDispatch, useSeekerState } from '@/components/AppState';
import { GET_INSTANT_BOOK_LOCATION_ELIGIBLE } from '@/components/request/GQL';
import { SKIP_AUTH_CONTEXT_KEY } from '@/constants';
import logger from '@/lib/clientLogger';

export function useLoadInstantBookEligibleLocation() {
  const { zipcode } = useSeekerState();
  const dispatch = useAppDispatch();

  useQuery(GET_INSTANT_BOOK_LOCATION_ELIGIBLE, {
    variables: {
      zipcode,
    },
    context: { [SKIP_AUTH_CONTEXT_KEY]: true },
    onCompleted: ({ getInstantBookLocationEligible }) => {
      dispatch({
        type: 'cc_setIbEligibleLocation',
        eligible: getInstantBookLocationEligible.eligible,
      });
    },
    onError: () => {
      logger.error({ event: 'getInstantBookLocationEligibleError' });
    },
  });
}
