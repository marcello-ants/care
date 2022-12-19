import useFlowHelper from '@/components/hooks/useFlowHelper';
import { FLOWS } from '@/constants';

function useIsInFacility() {
  const { currentFlow } = useFlowHelper();

  return { isInFacility: currentFlow === FLOWS.SEEKER_IN_FACILITY.name };
}

export default useIsInFacility;
