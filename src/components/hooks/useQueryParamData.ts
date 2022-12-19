import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { CARE_DATES, FLOWS } from '@/constants';
import { CareKind, DefaultCareKind } from '@/types/seekerCC';
import { ServiceTypes } from '@/types/seekerPC';
import { useAppDispatch, useFlowState } from '../AppState';

const intentStringParam: { [key: string]: CARE_DATES } = {
  rightnow: CARE_DATES.RIGHT_NOW,
  withinweek: CARE_DATES.WITHIN_A_WEEK,
  withinmonth: CARE_DATES.IN_1_2_MONTHS,
  justbrowsing: CARE_DATES.JUST_BROWSING,
};

const subServicesStringParam: { [key: string]: DefaultCareKind | ServiceTypes } = {
  daycare: DefaultCareKind.DAY_CARE_CENTERS,
  nanny: DefaultCareKind.NANNIES_RECURRING_BABYSITTERS,
  babysitter: DefaultCareKind.ONE_TIME_BABYSITTERS,
  sitting: ServiceTypes.SITTING,
  boarding: ServiceTypes.BOARDING,
  grooming: ServiceTypes.GROOMING,
  training: ServiceTypes.TRAINING,
};

const sources = ['seo', 'sem', 'vhp', 'community', 'semChildcare'];
const ccSubServices = ['daycare', 'nanny', 'babysitter'];
const pcSubServices = ['sitting', 'boarding', 'grooming', 'training'];

export default function useQueryParamData() {
  const dispatch = useAppDispatch();
  const { flowName } = useFlowState();
  const { intent, source, subService, zipcode } = useRouter().query;

  useEffect(() => {
    if (zipcode) {
      dispatch({ type: 'setZipcode', zipcode: zipcode as string });
    }

    if (source && sources.includes(source as string)) {
      if (flowName === FLOWS.SEEKER_CHILD_CARE.name) {
        dispatch({ type: 'cc_setEnrollmentSource', value: source as string });
      } else if (flowName === FLOWS.SEEKER_TUTORING.name) {
        dispatch({ type: 'tu_setEnrollmentSource', value: source as string });
      } else if (flowName === FLOWS.SEEKER_HOUSEKEEPING.name) {
        dispatch({ type: 'hk_setEnrollmentSource', value: source as string });
      } else if (flowName === FLOWS.SEEKER_PET_CARE.name) {
        dispatch({ type: 'pc_setEnrollmentSource', value: source as string });
      }
    }

    const intentString = intent && (intent as string).toLowerCase();
    if (intentString && Object.keys(intentStringParam).includes(intentString)) {
      if (flowName === FLOWS.SEEKER_CHILD_CARE.name) {
        dispatch({ type: 'setCareDate', careDate: intentStringParam[intentString] as CARE_DATES });
      } else if (flowName === FLOWS.SEEKER_TUTORING.name) {
        dispatch({
          type: 'setTutoringDate',
          careDate: intentStringParam[intentString] as CARE_DATES,
        });
      } else if (flowName === FLOWS.SEEKER_HOUSEKEEPING.name) {
        dispatch({
          type: 'setHousekeepingDate',
          careDate: intentStringParam[intentString] as CARE_DATES,
        });
      } else if (flowName === FLOWS.SEEKER_PET_CARE.name) {
        dispatch({
          type: 'setPetCareDate',
          careDate: intentStringParam[intentString] as CARE_DATES,
        });
      }
    }

    const subServiceString = subService && (subService as string).toLowerCase();
    if (subServiceString) {
      if (flowName === FLOWS.SEEKER_CHILD_CARE.name && ccSubServices.includes(subServiceString)) {
        dispatch({
          type: 'setCareKind',
          careKind: subServicesStringParam[subServiceString] as CareKind,
        });
      } else if (
        flowName === FLOWS.SEEKER_PET_CARE.name &&
        pcSubServices.includes(subServiceString)
      ) {
        dispatch({
          type: 'setServiceType',
          serviceType: subServicesStringParam[subServiceString] as ServiceTypes,
        });
      }
    }
  }, [flowName]);
}
