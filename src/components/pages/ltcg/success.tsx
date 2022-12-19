import React, { useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import { makeStyles, Typography, useTheme } from '@material-ui/core';
import { Icon24InfoPhone, Icon24UtilityCheckmark } from '@care/react-icons';
import { Banner, Link } from '@care/react-component-lib';

import {
  CREATE_HOME_PAY_PROSPECT,
  HIRED_CAREGIVER_CRM_EVENT_CREATE,
} from '@/components/request/GQL';
import logger from '@/lib/clientLogger';
import Header from '@/components/Header';
import { useFlowState, useLtcgState } from '@/components/AppState';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { ServiceType, YesOrNoAnswer } from '@/__generated__/globalTypes';
import {
  createHomePayProspect,
  createHomePayProspectVariables,
} from '@/__generated__/createHomePayProspect';
import {
  CzenCrmEventHiredCaregiverCreate,
  CzenCrmEventHiredCaregiverCreateVariables,
} from '@/__generated__/CzenCrmEventHiredCaregiverCreate';
import { buildLTCGHomePayProspectVariables } from './accountCreationHelpers';

const useStyles = makeStyles((theme) => ({
  subheader: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  list: {
    marginBottom: theme.spacing(5),
  },
  listItem: {
    display: 'flex',
    marginBottom: theme.spacing(2),
  },
  listIcon: {
    marginRight: theme.spacing(1),
  },
  animatedImage: {
    marginBottom: theme.spacing(2),
    height: 104,
  },
  animationImage: {
    width: 104,
  },
  phoneNumberContainer: {
    display: ({ isLookingForCaregiver }: any) => (isLookingForCaregiver ? 'inline-flex' : 'flex'),
  },
  wantToSpeakWithSomeone: {
    display: 'inline',
  },
  call: {
    marginRight: 5,
  },
}));

const list = [
  'Reviewing how reimbursement works.',
  'Setting up payroll between you and your caregiver.',
  'Ensuring your caregiver has the right tools to capture needed reimbursement information.',
];

const lookingForCaregiverList = [
  'Assessing your needs.',
  'Finding great caregivers near you.',
  'Working with you to hire the best option.',
];

function Success() {
  const apolloClient = useApolloClient();
  const state = useLtcgState();
  const flowState = useFlowState();
  const { memberId } = flowState;
  const { caregiverNeeded } = state;
  const isLookingForCaregiver = caregiverNeeded === YesOrNoAnswer.YES;
  const classes = useStyles({ isLookingForCaregiver });
  const theme = useTheme();
  const selectedList = isLookingForCaregiver ? lookingForCaregiverList : list;

  useEffect(() => {
    AnalyticsHelper.logScreenViewed('success', 'ltcg experience');
    (async () => {
      try {
        const { data: createHomePayProspectData } = await apolloClient.mutate<
          createHomePayProspect,
          createHomePayProspectVariables
        >({
          mutation: CREATE_HOME_PAY_PROSPECT,
          variables: buildLTCGHomePayProspectVariables(state),
        });

        if (
          createHomePayProspectData?.createHomePayProspect.__typename ===
          'CreateHomePayProspectSuccess'
        ) {
          logger.info({
            event: 'createHomePayProspectMutationSuccess',
            prospectId: createHomePayProspectData?.createHomePayProspect.prospect.prospectId,
          });
        } else {
          logger.error({
            event: 'createHomePayProspectMutationError',
          });
        }
      } catch (error: any) {
        logger.error({
          event: 'createHomePayProspectMutationError',
          error,
        });
      }
    })();

    if (caregiverNeeded === YesOrNoAnswer.NO) {
      (async () => {
        try {
          const crmEventHiredCaregiverVariables: CzenCrmEventHiredCaregiverCreateVariables = {
            input: {
              czenCrmEventHiredCaregiver: {
                vertical: ServiceType.SENIOR_CARE,
                isEnrollment: true,
              },
              userId: memberId ?? '',
            },
          };
          const { data: crmEventHiredCaregiverData } = await apolloClient.mutate<
            CzenCrmEventHiredCaregiverCreate,
            CzenCrmEventHiredCaregiverCreateVariables
          >({
            mutation: HIRED_CAREGIVER_CRM_EVENT_CREATE,
            variables: crmEventHiredCaregiverVariables,
          });

          if (
            crmEventHiredCaregiverData?.czenCrmEventHiredCaregiverCreate.__typename ===
              'CzenCrmEventResponse' &&
            crmEventHiredCaregiverData?.czenCrmEventHiredCaregiverCreate.success === true
          ) {
            logger.info({
              event: 'CzenCrmEventHiredCaregiverCreateSuccess',
            });
          } else {
            logger.error({
              event: 'CzenCrmEventHiredCaregiverCreateError',
            });
          }
        } catch (error: any) {
          logger.error({
            event: 'CzenCrmEventHiredCaregiverCreateError',
            error,
          });
        }
      })();
    }
  }, []);

  return (
    <div>
      <div className={classes.animatedImage}>
        <img
          src="/app/enrollment/success-animation-2x.gif"
          alt="Success animation"
          className={classes.animationImage}
        />
      </div>
      <Header>Thanks for sharing your information! Here&apos;s what comes next:</Header>
      <Typography variant="body2" className={classes.subheader}>
        {' '}
        <span>Expect a call from our team within 1 business day. They are ready to help</span>
        <span>{isLookingForCaregiver ? ' by doing' : ' you learn more about'}</span>
        <span>&nbsp;the following:</span>
      </Typography>
      <div className={classes.list}>
        {selectedList.map((item) => (
          <div key={item} className={classes.listItem}>
            <Icon24UtilityCheckmark className={classes.listIcon} />
            <Typography variant="body2">{item}</Typography>
          </div>
        ))}
      </div>
      <Banner
        fullWidth
        roundCorners
        icon={<Icon24InfoPhone color={theme.palette.care?.blue[700]} />}>
        {isLookingForCaregiver ? (
          <div>
            <Typography variant="h3">Want to speak with an expert now?</Typography>
          </div>
        ) : (
          <div>
            <Typography variant="h3">Be on the lookout for a call from us.</Typography>
            <Typography variant="body2" className={classes.wantToSpeakWithSomeone}>
              Want to speak with someone immediately?{' '}
            </Typography>
          </div>
        )}

        <div className={classes.phoneNumberContainer}>
          <Typography variant="body2" className={classes.call}>
            Call
          </Typography>
          <Link href="tel:877-367-1959" careVariant="link2">
            877-367-1959
          </Link>
        </div>
      </Banner>
    </div>
  );
}

export default Success;
