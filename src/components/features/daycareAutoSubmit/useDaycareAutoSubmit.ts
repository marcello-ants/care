/* eslint-disable import/prefer-default-export */
import { useEffect, useRef, useState } from 'react';
import { ApolloError, useMutation } from '@apollo/client';

import logger from '@/lib/clientLogger';
import AuthService from '@/lib/AuthService';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import {
  useAppDispatch,
  useFlowState,
  useSeekerCCState,
  useSeekerState,
} from '@/components/AppState';
import { POST_CHILD_CARE_LEAD } from '@/components/request/GQL';
import { CARE_DATES, VERTICALS_NAMES, CLIENT_FEATURE_FLAGS } from '@/constants';
import { postChildCareLead, postChildCareLeadVariables } from '@/__generated__/postChildCareLead';
import {
  ChildCareLeadContactMethod,
  ChildCareLeadsSubmissionMethod,
  DayCareTimeOfDay,
  ServiceType,
  SubServiceType,
} from '@/__generated__/globalTypes';
import {
  mapAttendingDays,
  mapChildrenDoB,
  mapMonthToDate,
} from '@/utilities/account-creation-utils';
import { DayCareFrequencyOptions } from '@/types/seekerCC';
import useCrmEventDaycare from '@/components/hooks/useCrmEventDaycare';
import useFeatureFlag from '@/components/hooks/useFeatureFlag';
import { convertDaycareLeadsToCrmEventFormat } from '@/utilities/daycareHelper';

const COUNTDOWN_TIME_IN_MS = 25 * 60 * 1000;
const RETRY_COUNTDOWN_TIME_IN_MS = 5 * 1000;

function handleChildCareDayCareLeadAutoSubmitError(graphQLError: ApolloError) {
  logger.error({
    event: 'childCareDayCareLeadAutoSubmitError',
    graphQLError: graphQLError?.message,
  });
}

export function useDaycareAutoSubmit() {
  const authService = AuthService();
  const [triggerAutosubmit, setTriggerAutosubmit] = useState<'timeout' | 'close' | null>(null);
  const dispatch = useAppDispatch();
  const createCrmEventDaycare = useCrmEventDaycare();
  const dayCareAutoAcceptBackendFlag = useFeatureFlag(
    CLIENT_FEATURE_FLAGS.DAYCARE_AUTO_ACCEPT_BACKEND
  );
  const {
    phoneNumber,
    firstName,
    lastName,
    enrollmentSource,
    careDate,
    dayCare: {
      recommendationsTrackingId,
      recommendations,
      submissionCompleted,
      autoSubmit,
      startMonth,
      additionalInformation,
      dayTime,
      careFrequency,
      childrenDateOfBirth,
      contactMethod,
    },
    isSendLeadEnabled,
  } = useSeekerCCState();
  const isUserJustBrowsing = careDate === CARE_DATES.JUST_BROWSING;
  const { memberId } = useFlowState();
  const { zipcode } = useSeekerState();
  const [postLead] = useMutation<postChildCareLead, postChildCareLeadVariables>(
    POST_CHILD_CARE_LEAD,
    {
      onError: handleChildCareDayCareLeadAutoSubmitError,
    }
  );
  const timeoutIdRef = useRef<{ timeoutId: ReturnType<typeof setTimeout> | null }>({
    timeoutId: null,
  });
  const resetTimeout = () => {
    if (timeoutIdRef.current.timeoutId) {
      clearTimeout(timeoutIdRef.current.timeoutId);
      timeoutIdRef.current.timeoutId = null;
    }
  };
  const handleAutoSubmit = async (type: 'timeout' | 'close') => {
    timeoutIdRef.current.timeoutId = null;
    // abort in case submission was completed in some other way (manually)
    if (
      submissionCompleted ||
      !autoSubmit.startTime ||
      autoSubmit.attempts >= 3 ||
      !isSendLeadEnabled ||
      isUserJustBrowsing ||
      dayCareAutoAcceptBackendFlag?.value
    ) {
      return;
    }

    const authStore = authService.getStore();
    let success: boolean;

    try {
      const seekerUuid = authStore.profile.sub.split(':')[1] as string;
      const result = await postLead({
        variables: {
          childCareLeadInput: {
            submissionMethod: ChildCareLeadsSubmissionMethod.AUTO,
            providerIds: recommendations.map((next) => next.id),
            trackingId: recommendationsTrackingId,
            zipcode,
            source: 'ENROLLMENT',
            childCareExpectations: additionalInformation,
            startDate: mapMonthToDate(startMonth!),
            childrenDatesOfBirth: mapChildrenDoB(childrenDateOfBirth),
            timeOfDay: dayTime ? DayCareTimeOfDay[dayTime] : DayCareTimeOfDay.MORNING,
            attendingDays: mapAttendingDays(
              careFrequency.careType === DayCareFrequencyOptions.FULL_TIME
                ? ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
                : careFrequency.specifcDays
            ),
            contactMethod: contactMethod as ChildCareLeadContactMethod,
            seekerInfo: {
              id: seekerUuid,
              email: authStore.profile.email,
              firstName,
              lastName,
              phoneNumber: phoneNumber.replace(/\D/g, ''),
            },
          },
        },
      });

      success = Boolean(result.data?.childCareLeadCreate?.batchId);
    } catch {
      success = false;
    }

    if (success) {
      recommendations.forEach((recommendation) => {
        AnalyticsHelper.logEvent({
          name: 'Member Enrolled',
          data: {
            member_type: 'Seeker',
            vertical: VERTICALS_NAMES.CHILD_CARE,
            enrollment_flow: enrollmentSource,
            enrollment_step: 'recommendations',
            action: 'leadSubmission',
            tracking_id: recommendationsTrackingId,
            provider_id: recommendation.id,
            member_id: memberId,
            source: type,
          },
        });
      });

      // Trigger Iterable Event
      createCrmEventDaycare({
        variables: {
          input: {
            czenCrmEventLeadsSubmitted: {
              autoAccept: false,
              leadCount: recommendations.length,
              vertical: ServiceType.CHILD_CARE,
              subVertical: SubServiceType.DAY_CARE,
              leads: convertDaycareLeadsToCrmEventFormat(recommendations),
              enrollment: true,
            },
            userId: authStore.profile.sub.split(':')[1] as string,
          },
        },
      });

      dispatch({ type: 'cc_autoSubmitDayCares' });
    } else {
      dispatch({ type: 'cc_increaseDayCareAutoSubmitAttempt' });
      // retry submission up to 3 times
      if (autoSubmit.attempts < 3) {
        timeoutIdRef.current.timeoutId = setTimeout(
          () => setTriggerAutosubmit(type),
          RETRY_COUNTDOWN_TIME_IN_MS
        );
      }
    }
  };

  useEffect(() => {
    /* istanbul ignore next */
    const handleUnload = () => {
      setTriggerAutosubmit('close');
    };
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      resetTimeout();
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  useEffect(() => {
    if (!triggerAutosubmit) return;
    setTriggerAutosubmit(null);
    handleAutoSubmit(triggerAutosubmit);
  }, [triggerAutosubmit, handleAutoSubmit]);

  useEffect(() => {
    if (autoSubmit.startTime) {
      const startTime = new Date(autoSubmit.startTime);
      const timeSinceCountdownStartInMs = Date.now() - startTime.getTime();
      const timeout = COUNTDOWN_TIME_IN_MS - timeSinceCountdownStartInMs;
      timeoutIdRef.current.timeoutId = setTimeout(
        () => {
          setTriggerAutosubmit('timeout');
        },
        timeout > 0 ? timeout : 0
      );
    }

    return resetTimeout;
  }, [autoSubmit.startTime]);
}
