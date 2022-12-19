import { ComponentType, FC, useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { captureException } from '@sentry/nextjs';
import OverlaySpinner from '@/components/OverlaySpinner';
import { useAppDispatch, useFlowState, useSeekerState } from '@/components/AppState';
import logger from '@/lib/clientLogger';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { GET_SEEKER_INFO } from '@/components/request/GQL';
import { CLIENT_SIDE_ERROR_TAG } from '@/constants';
import { AppPageComponent } from '@/types/app';
import { getSeekerInfo, getSeekerInfoVariables } from '@/__generated__/getSeekerInfo';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import AmpliHelper from '@/utilities/ampliAnalyticsHelper';

export interface WithPotentialMemberProps {
  userHasAccount?: boolean;
}

export const withPotentialMember = <P extends object>(Component: ComponentType<P>): FC<P> => {
  function PotentialMember(props: P) {
    const [isLoading, setIsLoading] = useState(false);
    const { flags } = useFeatureFlags();
    const { typeOfCare } = useSeekerState();
    const { memberUuid, userHasAccount, memberId } = useFlowState();
    const dispatch = useAppDispatch();
    const apolloClient = useApolloClient();

    useEffect(() => {
      (async () => {
        if (!memberId && userHasAccount) {
          setIsLoading(true);

          try {
            const getSeekerInfoResult = await apolloClient.query<
              getSeekerInfo,
              getSeekerInfoVariables
            >({
              query: GET_SEEKER_INFO,
              variables: { memberId: memberUuid as string },
            });

            const memberData = getSeekerInfoResult.data.getSeeker.member;
            const { firstName, lastName, email, contact, legacyId } = memberData;
            const phone = contact?.primaryPhone ?? '';

            if (legacyId) {
              AnalyticsHelper.setMemberId(legacyId);
              dispatch({ type: 'setMemberId', memberId: legacyId });

              if (AmpliHelper.useAmpli(flags, typeOfCare)) {
                AmpliHelper.ampli.identify(legacyId);
              }
            } else {
              logger.warn('legacyId is null');
            }

            dispatch({
              type: 'setSeekerInfo',
              firstName: firstName ?? '',
              lastName: lastName ?? '',
              email: email ?? '',
              phone,
            });
          } catch (e) {
            captureException(e);
            logger.error({ error: e as Error, tags: [CLIENT_SIDE_ERROR_TAG] });
          } finally {
            setIsLoading(false);
          }
        } else if (memberId && isLoading) {
          setIsLoading(false);
        }
      })();
    }, [memberId]);

    if (isLoading) {
      return <OverlaySpinner isOpen wrapped />;
    }

    return <Component {...props} userHasAccount={userHasAccount} />;
  }

  PotentialMember.displayName = `withPotentialMember(${Component.displayName || Component.name})`;
  PotentialMember.disableScreenViewed = (Component as AppPageComponent).disableScreenViewed;
  PotentialMember.Layout = (Component as AppPageComponent).Layout;
  PotentialMember.Footer = (Component as AppPageComponent).Footer;

  return PotentialMember;
};
