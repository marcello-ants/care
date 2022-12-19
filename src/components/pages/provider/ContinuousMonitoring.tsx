/* eslint-disable camelcase */
import { useState } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { Checkbox, FormControlLabel, Typography } from '@care/react-component-lib';
import {
  ContinuousMonitoringEnrollmentStatus,
  ContinuousMonitoringEnrollmentStatus_continuousMonitoringEnrollmentStatus,
} from '@/__generated__/ContinuousMonitoringEnrollmentStatus';
import { useMutation, useQuery } from '@apollo/client';
import { EnrollInContinuousMonitoring } from '@/__generated__/EnrollInContinuousMonitoring';
import {
  ENROLL_IN_CONTINUOUS_MONITORING,
  GET_CONTINUOUS_MONITORING_ENROLLMENT_STATUS,
} from '@/components/request/ContinuousMonitoringGQL';
import OverlaySpinner from '@/components/OverlaySpinner';
import { CLIENT_FEATURE_FLAGS, CZEN_MHP } from '@/constants';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import { useProviderCCState } from '@/components/AppState';

type ContinuousMonitoringProps = {
  uid: string;
};

const useStyles = makeStyles((theme) => ({
  header: {
    fontSize: 21,
    fontWeight: 700,
    marginBottom: theme.spacing(2),
  },
  text: {
    marginBottom: theme.spacing(3),
    lineHeight: '22px',
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
      lineHeight: '20px',
    },
  },
  checkboxLabel: {
    '& span:nth-child(2)': {
      fontSize: 14,
      transform: 'translateY(-1px)',
      lineHeight: '20px',
    },
  },
  buttonWrapper: {
    marginTop: theme.spacing(3),
    textAlign: 'center',
  },
}));

const ContinuousMonitoring = ({ uid }: ContinuousMonitoringProps) => {
  const classes = useStyles();

  const featureFlags = useFeatureFlags();
  const providerState = useProviderCCState();

  const providerCCFreeGatedExperience =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.PROVIDER_CC_FREE_GATED_EXPERIENCE]?.value;

  const isFreeGated = providerCCFreeGatedExperience && providerState.freeGated;

  const { loading, data: cmConsentData } = useQuery<ContinuousMonitoringEnrollmentStatus>(
    GET_CONTINUOUS_MONITORING_ENROLLMENT_STATUS,
    {
      variables: {
        memberId: uid,
      },
    }
  );

  const { needsConsent, consentMessagesList } =
    cmConsentData?.continuousMonitoringEnrollmentStatus || {};

  if (!isFreeGated || (!loading && !needsConsent)) {
    window.location.assign(CZEN_MHP);
  }

  const [consentIndex, setConsentIndex] = useState(0);
  const [isCurrentConsentAccepted, setIsCurrentConsentAccepted] = useState(false);

  const currentConsentMessage = consentMessagesList?.[consentIndex]?.message;

  const numberOfConsents = consentMessagesList?.length || 1;

  const [enrollInContinuousMonitoring, { loading: enrollIsLoading }] =
    useMutation<EnrollInContinuousMonitoring>(ENROLL_IN_CONTINUOUS_MONITORING, {
      update: (cache, { data }) => {
        if (
          data &&
          data?.enrollInContinuousMonitoring.__typename === 'EnrollInContinuousMonitoringSuccess'
        ) {
          cache.modify({
            fields: {
              continuousMonitoringEnrollmentStatus(
                existingData: ContinuousMonitoringEnrollmentStatus_continuousMonitoringEnrollmentStatus
              ): ContinuousMonitoringEnrollmentStatus_continuousMonitoringEnrollmentStatus {
                return {
                  ...existingData,
                  needsConsent: false,
                };
              },
            },
          });
        }
      },
    });

  const acceptConsentHandler = async () => {
    const consentGivenMessageIds =
      consentMessagesList &&
      consentMessagesList.map((consent) => consent && consent.consentMessageId);

    enrollInContinuousMonitoring({
      variables: {
        input: {
          consentGivenMessageIds,
          memberId: uid,
        },
      },
    }).then(() => {
      window.location.assign(CZEN_MHP);
    });
  };

  if (!needsConsent || !isFreeGated) return <OverlaySpinner isOpen wrapped />;

  return (
    <>
      <Typography className={classes.header} variant="h3" align="center">
        Disclosure
      </Typography>
      {currentConsentMessage && (
        <div
          className={classes.text}
          dangerouslySetInnerHTML={{
            __html: currentConsentMessage,
          }}
        />
      )}
      <Typography className={classes.header} variant="h3" align="center">
        Authorization
      </Typography>
      <FormControlLabel
        className={classes.checkboxLabel}
        label="By checking this box, I acknowledge that I have read, understand, and agree to this Disclosure, and I authorize the requested background check."
        control={
          <Checkbox
            checked={isCurrentConsentAccepted}
            onChange={(e) => setIsCurrentConsentAccepted(e.target.checked)}
          />
        }
      />
      <div className={classes.buttonWrapper}>
        {consentIndex === numberOfConsents - 1 ? (
          <Button
            color="secondary"
            variant="contained"
            size="medium"
            onClick={acceptConsentHandler}
            disabled={!isCurrentConsentAccepted || enrollIsLoading}>
            Continue
          </Button>
        ) : (
          <Button
            color="secondary"
            variant="contained"
            size="medium"
            disabled={!isCurrentConsentAccepted}
            onClick={() => {
              setConsentIndex(consentIndex + 1);
              setIsCurrentConsentAccepted(false);
            }}>
            Next
          </Button>
        )}
      </div>
    </>
  );
};

export default ContinuousMonitoring;
