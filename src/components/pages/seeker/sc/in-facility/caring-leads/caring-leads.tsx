import { useEffect, useState } from 'react';
import { Typography, Button, makeStyles } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useMutation, ApolloError, useQuery } from '@apollo/client';

import { CoreGlobalFooter } from '@care/navigation';

import {
  LEAD_SOURCES,
  SEEKER_IN_FACILITY_ROUTES,
  SKIP_AUTH_CONTEXT_KEY,
  TEALIUM_EVENTS,
  TEALIUM_SLOTS,
} from '@/constants';

import { useAppState, useSeekerState, useAppDispatch } from '@/components/AppState';
import FixElementToBottom from '@/components/FixElementToBottom';
import OverlaySpinner from '@/components/OverlaySpinner';
import {
  SENIOR_CARE_FACILITY_LEAD_GENERATE,
  GET_NUMBER_OF_SENIOR_CARE_FACILITIES_NEARBY,
} from '@/components/request/GQL';
import CareComButtonContainer from '@/components/CareComButtonContainer';
import useEnterKey from '@/components/hooks/useEnterKey';
import {
  withPotentialMember,
  WithPotentialMemberProps,
} from '@/components/features/potentialMember/withPotentialMember';
import { TealiumData, TealiumUtagService } from '@/utilities/utagHelper';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import logger from '@/lib/clientLogger';
import { helpTypesToServices } from '@/types/seeker';

import {
  seniorCareFacilityLeadGenerate,
  seniorCareFacilityLeadGenerateVariables,
} from '@/__generated__/seniorCareFacilityLeadGenerate';
import {
  getNumberOfSeniorCareFacilitiesNearby,
  getNumberOfSeniorCareFacilitiesNearbyVariables,
} from '@/__generated__/getNumberOfSeniorCareFacilitiesNearby';

import {
  isMemoryCareNeeded,
  recommendedCaringFacilityFlags,
} from '@/utilities/senior-care-facility-utility';
import { YesOrNoAnswer } from '@/__generated__/globalTypes';

import { SeekerInfoModal, shouldPromptForPhone, shouldPromptForName } from '../SeekerInfoModal';
import PersonalizedHelpFeatures from './personalized-help-features';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',

    // 48px       container padding 24px top - 24px bottom
    // 56px       topbar
    // 1px        topbar border
    // 124px      iphone statusbar
    minHeight: `calc(100vh - 48px - 56px + 1px - 124px)`,

    [theme.breakpoints.up('md')]: {
      minHeight: 'auto',
    },
  },

  list: {
    paddingLeft: theme.spacing(3),
    margin: theme.spacing(5),
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(0, 0, 6),
    },
  },

  listItem: {
    '&:first-child': {
      marginBottom: theme.spacing(2),
    },
  },
  terms: {
    marginTop: theme.spacing(4),
    display: 'block',
    lineHeight: '16px',
  },
}));

const fireAmplitudeEvent = (name: string, cta: string, extraData: object = {}) => {
  const data = {
    enrollment_step: 'caring leads in facility sc',
    member_type: 'Seeker',
    cta_clicked: cta,
    ...extraData,
  };

  AnalyticsHelper.logEvent({
    name,
    data,
  });
};

function CaringLeads(props: WithPotentialMemberProps) {
  const classes = useStyles();

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isShowingSpinner, setIsShowingSpinner] = useState(true);
  const [isSeekerInfoModalOpen, setIsSeekerInfoModalOpen] = useState(false);
  const {
    zipcode,
    whoNeedsCareAge,
    amenities,
    condition,
    paymentDetailTypes,
    whoNeedsCare,
    helpTypes,
    seekerInfo,
  } = useSeekerState();
  const {
    flow: { memberId, czenJSessionId },
  } = useAppState();
  const { userHasAccount } = props;
  const memoryCareNeeded = isMemoryCareNeeded(helpTypes) ? YesOrNoAnswer.YES : YesOrNoAnswer.NO;
  const facilitiesCountType = recommendedCaringFacilityFlags(condition, helpTypes);

  const { data, error, loading } = useQuery<
    getNumberOfSeniorCareFacilitiesNearby,
    getNumberOfSeniorCareFacilitiesNearbyVariables
  >(GET_NUMBER_OF_SENIOR_CARE_FACILITIES_NEARBY, {
    variables: {
      zipcode,
      ...facilitiesCountType,
    },
    context: { [SKIP_AUTH_CONTEXT_KEY]: true },
  });

  const numberOfFacilities =
    (!error && data?.getNumberOfSeniorCareFacilitiesNearby?.count) ||
    data?.getNumberOfSeniorCareFacilitiesNearby?.countIndependentLivingFacilities ||
    data?.getNumberOfSeniorCareFacilitiesNearby?.countAssistedLivingFacilities ||
    data?.getNumberOfSeniorCareFacilitiesNearby?.countMemoryCareFacilities;

  useEffect(() => {
    if (!loading && !numberOfFacilities) {
      router.push(SEEKER_IN_FACILITY_ROUTES.OPTIONS);
    } else {
      setIsShowingSpinner(loading);
    }
  }, [loading, numberOfFacilities]);

  useEffect(() => {
    AnalyticsHelper.logEvent({
      name: 'Screen Viewed',
      data: {
        source: userHasAccount ? LEAD_SOURCES.NTH_DAY : LEAD_SOURCES.ENROLLMENT,
      },
    });
  }, []);

  const { firstName, lastName, email, phone } = seekerInfo;

  const handleSuccess = () => {
    dispatch({ type: 'setSeniorCareFacilityLeadGenerateMutationError', value: false });
    router.push(SEEKER_IN_FACILITY_ROUTES.PAYOFF);
  };
  const handleError = (graphQLError: ApolloError) => {
    dispatch({ type: 'setSeniorCareFacilityLeadGenerateMutationError', value: true });
    router.push(SEEKER_IN_FACILITY_ROUTES.PAYOFF);
    logger.error({ event: 'seniorCareFacilityLeadGenerate', graphQLError: graphQLError.message });
  };
  const [seniorCareFacilityLeadGenerateMutation] = useMutation<
    seniorCareFacilityLeadGenerate,
    seniorCareFacilityLeadGenerateVariables
  >(SENIOR_CARE_FACILITY_LEAD_GENERATE, {
    onCompleted: handleSuccess,
    onError: handleError,
  });

  const submitRequest = () => {
    const tealiumData: TealiumData = {
      ...(memberId && { memberId }),
      sessionId: czenJSessionId,
      leadCount: numberOfFacilities,
      tealium_event: TEALIUM_EVENTS.DAYCARE_LEADS,
      slots: TEALIUM_SLOTS.DAYCARE_LEADS_SUBMITTED,
    };
    TealiumUtagService.view(tealiumData);
    const extraAmplitudeData = {
      lead_count: numberOfFacilities,
    };
    fireAmplitudeEvent('Member Enrolled', 'Get connected', extraAmplitudeData);

    seniorCareFacilityLeadGenerateMutation({
      variables: {
        input: {
          // if use clicks button it means they've accepted terms
          acceptedCaringTermsOfUse: true,
          relationship: whoNeedsCare,
          serviceNeeded: helpTypesToServices(helpTypes),
          memoryCareFacilityNeeded: memoryCareNeeded,
          zipcode,
          email,
          firstName,
          lastName,
          phone,
          careRecipientCondition: condition,
          ageRange: whoNeedsCareAge,
          amenities,
          paymentSources: paymentDetailTypes,
        },
      },
    });
  };

  const handleClick = () => {
    if (
      shouldPromptForPhone(seekerInfo.phone) ||
      shouldPromptForName(seekerInfo.firstName, seekerInfo.lastName)
    ) {
      setIsSeekerInfoModalOpen(true);
    } else {
      submitRequest();
    }
  };

  useEffect(() => {
    if (
      isSeekerInfoModalOpen &&
      !shouldPromptForPhone(seekerInfo.phone) &&
      !shouldPromptForName(seekerInfo.firstName, seekerInfo.lastName)
    ) {
      setIsSeekerInfoModalOpen(false);
      submitRequest();
    }
  }, [isSeekerInfoModalOpen, seekerInfo.phone, seekerInfo.firstName, seekerInfo.lastName]);

  useEnterKey(true, handleClick);

  if (isShowingSpinner) {
    return <OverlaySpinner isOpen wrapped />;
  }

  return (
    <div className={classes.root}>
      <PersonalizedHelpFeatures />

      <div>
        <Typography variant="caption" color="textSecondary" className={classes.terms}>
          <span>By clicking &quot;Get connected &quot;, you agree to Caring.com’s</span>{' '}
          <a href="https://www.caring.com/about/terms" target="_blank" rel="noreferrer">
            Terms of Use
          </a>
          <span>,</span>{' '}
          <a href="https://www.caring.com/about/privacy/" target="_blank" rel="noreferrer">
            Privacy Policy
          </a>
          <span>, and</span>{' '}
          <a
            href="https://www.caring.com/about/contact-by-telephone/"
            target="_blank"
            rel="noreferrer">
            Agreement to be Contacted by Telephone.
          </a>{' '}
          <span>
            You also consent that Caring.com or its partner providers, may reach out to you about
            senior living solutions or Medicare insurance using a system that can auto-dial;
            however, you do not need to consent to this to use Caring’s service. You understand that
            Care.com and Caring, LLC, operator of the Caring.com website, are independently operated
            and not affiliated companies.
          </span>
        </Typography>
        <FixElementToBottom useFade={false}>
          <CareComButtonContainer mt={4} mb={2}>
            <Button
              color="primary"
              variant="contained"
              size="large"
              fullWidth
              onClick={handleClick}>
              Get connected
            </Button>
          </CareComButtonContainer>
        </FixElementToBottom>

        <SeekerInfoModal
          phonePromptTitle="What’s the best number for a senior care advisor to reach you at?"
          namePromptTitle="Share the best contact info for a senior care advisor to reach you at."
          enrollmentStep="caring leads in facility sc"
          open={isSeekerInfoModalOpen}
          onClose={() => setIsSeekerInfoModalOpen(false)}
        />
      </div>
    </div>
  );
}

CaringLeads.Footer = (
  <CoreGlobalFooter
    minimal
    topDisclaimer={`The images shown are for display purposes only and do not represent actual senior care family advisors. \n
Advisors will respond within 20 minutes during working hours Monday to Friday. Requests made outside working hours will receive a response on the subsequent working day.`}
  />
);

CaringLeads.disableScreenViewed = true;

export default withPotentialMember(CaringLeads);
