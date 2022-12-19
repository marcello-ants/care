import { useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { logger } from '@sentry/utils';

import AuthService from '@/lib/AuthService';
import WelcomeBack from '@/components/pages/provider/WelcomeBack';
import OverlaySpinner from '@/components/OverlaySpinner';
import FreeGatedProviderHeader from '@/components/pages/provider/FreeGatedProviderHeader';

import { GET_SITTER_INFO } from '@/components/request/GQL';
import { getCaregiver_getCaregiver_member as MemberDetails } from '@/__generated__/getCaregiver';
import { captureException } from '@sentry/nextjs';
import { CLIENT_SIDE_ERROR_TAG } from '@/constants';
import { ServiceType } from '@/__generated__/globalTypes';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

const WelcomeBackPage = () => {
  const authService = AuthService();
  const apolloClient = useApolloClient();

  const [isPageLoading, setIsPageLoading] = useState(true);

  const [memberDetails, setMemberDetails] = useState<MemberDetails | null>(null);

  const logoutHandler = async () => {
    AnalyticsHelper.logEvent({
      name: 'CTA Interacted',
      data: {
        cta_text: 'logout (menu)',
      },
    });
    await authService.logout();
  };

  useEffect(() => {
    if (authService) {
      (async () => {
        try {
          const user = await authService.getUser();

          if (!user) {
            authService.login();
          } else {
            // get full member details

            // calling this query throws unknown error when we just enrolled using first 3 steps of cc flow, and try to access this page
            // todo need further investigation on GQL side (https://carecom.atlassian.net/browse/PRO-2412)
            const { data } = await apolloClient.query({
              query: GET_SITTER_INFO,
              // cut 'mem:' from sub property to clean user UUID
              variables: {
                id: user.profile.sub.substring(4),
                serviceId: ServiceType.CHILD_CARE,
              },
            });

            setMemberDetails(data.getCaregiver.member);
            setIsPageLoading(false);
          }
        } catch (e) {
          captureException(e);
          logger.error({ error: e as Error, tags: [CLIENT_SIDE_ERROR_TAG] });
        }
      })();
    }
  }, []);

  if (isPageLoading && !memberDetails) {
    return <OverlaySpinner isOpen wrapped />;
  }

  return (
    <>
      <FreeGatedProviderHeader memberDetails={memberDetails} logoutHandler={logoutHandler} />
      <WelcomeBack firstName={memberDetails?.firstName} />
    </>
  );
};

// reset page Header
WelcomeBackPage.Header = <div />;

export default WelcomeBackPage;
