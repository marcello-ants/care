import { useEffect, useState } from 'react';

import { TealiumData, TealiumUtagService } from '@/utilities/utagHelper';
import { hash256 } from '@/utilities/account-creation-utils';
import { useAppState } from '@/components/AppState';
import { getUserEmail } from '@/lib/AuthService';
import { VerticalsAbbreviation } from '@/constants';

export const useTealiumTrackingOnPasswordScreen = (vertical: VerticalsAbbreviation | undefined) => {
  const appState = useAppState();
  const { memberId, czenJSessionId } = appState.flow;
  const [tealiumSent, setTealiumSent] = useState(false);

  const getVerticalCareDate = (verticalType: string) => {
    switch (verticalType) {
      case 'CC':
      case 'DC':
        return appState.seekerCC.careDate;
      case 'HK':
        return appState.seekerHK.careDate;
      case 'PC':
        return appState.seekerPC.careDate;
      case 'TU':
        return appState.seekerTU.careDate;
      default:
        return 'Unknown Vertical';
    }
  };

  const getSubServiceId = (verticalType: string) => {
    switch (verticalType) {
      case 'HK':
        return 'HOUSEKEEP';
      case 'PC':
        return 'PETCAREXX';
      case 'TU':
        return 'TUTORINGX';
      case 'SC':
        return 'SENIRCARE';
      case 'CC':
      case 'DC':
        return 'CHILDCARE';
      default:
        return 'Unknown SubService Id';
    }
  };

  useEffect(() => {
    hash256(getUserEmail()).then((hash) => {
      const emailSHA256 = hash;
      const slots = [
        '/us-subscription/conversion/seeker/basic/signup/',
        '/us-subscription/conversion/seeker/basic/signup/cj/',
        '/us-subscription/conversion/seeker/basic/signup/impact/',
      ];
      const tealiumData: TealiumData = {
        ...(memberId && { memberId }),
        tealium_event: 'CONGRATS_BASIC_MEMBERSHIP',
        sessionId: czenJSessionId,
        email: getUserEmail(),
        emailSHA256,
        slots,
        memberType: 'seeker',
        overallStatus: 'basic',
        serviceId: vertical,
        subServiceId: getSubServiceId(vertical ?? ''),
        intent: getVerticalCareDate(vertical ?? ''),
      };

      if (!tealiumSent) {
        TealiumUtagService.view(tealiumData);
      }

      setTealiumSent(true);
    });
  }, []);
};
