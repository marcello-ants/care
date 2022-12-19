import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import Header from '@/components/Header';
import { PAYMENT_DETAIL_TYPE_OPTIONS, PaymentDetailType } from '@/types/seeker';
import {
  withPotentialMember,
  WithPotentialMemberProps,
} from '@/components/features/potentialMember/withPotentialMember';
import { useAppDispatch, useSeekerState } from '@/components/AppState';
import { Pill, StatelessSelector } from '@care/react-component-lib';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import useEnterKey from '@/components/hooks/useEnterKey';
import useIsDisqualifiedFromSeniorFacilityLeads from '@/components/hooks/useIsDisqualifiedFromSeniorFacilityLeads';
import FixElementToBottom from '@/components/FixElementToBottom';
import { SEEKER_IN_FACILITY_ROUTES, CLIENT_FEATURE_FLAGS } from '@/constants';
import { SeniorCarePaymentSource } from '@/__generated__/globalTypes';
import CareComButtonContainer from '@/components/CareComButtonContainer';
import useIsDisqualifiedFromCaringLeads from '../account-creation/useIsDisqualifiedFromCaringLeads';

interface paymentOption {
  label: any;
  value: PaymentDetailType | undefined;
  description?: string | undefined;
}

const useStyles = makeStyles((theme) => ({
  selector: {
    marginTop: theme.spacing(2),
    '& .MuiListItem-root': {
      marginBottom: theme.spacing(0),
      [theme.breakpoints.up('md')]: {
        paddingTop: `${theme.spacing(0.75)}px !important`,
        paddingBottom: `${theme.spacing(0.75)}px !important`,
        '&:first-child': {
          paddingTop: `${theme.spacing(1)}px !important`,
        },
        '&:last-child': {
          paddingBottom: '0px !important',
        },
      },
    },
  },
  gridList: {
    marginBottom: '60px',
    [theme.breakpoints.up('sm')]: {
      marginBottom: '0',
    },
  },
  nextButton: {
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(1),
    },
  },
  buttonContainer: {
    padding: 0,
  },
  button: {
    marginTop: theme.spacing(3),
  },
  descriptionText: {
    marginTop: theme.spacing(2),
  },
  separator: {
    marginTop: theme.spacing(3),
  },
  topText: {
    color: theme.palette.care.grey[600],
    marginBottom: theme.spacing(1),
  },
  bannerContainer: {
    width: 327,
    position: 'absolute',
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

export function getRecommendationOptimizationRoute(
  noneOptionSelected: boolean,
  isDisqualifiedFromSeniorAssistedLivingLeads: boolean,
  hasSeniorLivingCommunitiesInZipcode: boolean,
  isDisqualifiedFromCaringLeads: boolean
) {
  if (noneOptionSelected) {
    return SEEKER_IN_FACILITY_ROUTES.NO_COMMUNITIES_BY_COVERING_COST;
  }

  if (!isDisqualifiedFromSeniorAssistedLivingLeads && hasSeniorLivingCommunitiesInZipcode) {
    return SEEKER_IN_FACILITY_ROUTES.COMMUNITY_LIST;
  }

  if (!isDisqualifiedFromCaringLeads) {
    return SEEKER_IN_FACILITY_ROUTES.CARING_LEADS;
  }

  return SEEKER_IN_FACILITY_ROUTES.OPTIONS;
}

function PaymentQuestionnaire(props: WithPotentialMemberProps) {
  const { userHasAccount } = props;
  const router = useRouter();
  const classes = useStyles();
  const {
    paymentDetailTypes: oldPaymentDetailTypes,
    whoNeedsCare,
    SALCCommunities,
  } = useSeekerState();
  const isDisabled = oldPaymentDetailTypes ? oldPaymentDetailTypes.length < 1 : true;
  const dispatch = useAppDispatch();
  const [isNextDisabled, setNextDisabled] = useState(true);
  const featureFlags = useFeatureFlags();
  const recommendationOptimizationVariation =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION];
  const isRecommendationOptimizationVariation =
    recommendationOptimizationVariation?.variationIndex === 1;
  const isDisqualifiedFromSeniorFacilityLeads = useIsDisqualifiedFromSeniorFacilityLeads();
  const isDisqualifiedFromCaringLeads = useIsDisqualifiedFromCaringLeads();

  useEffect(() => {
    setNextDisabled(isDisabled);
  }, [isDisabled]);

  function handleChange(values: string[]) {
    // last element in array is most recent selection (experimentally determined)

    const noneOptionLastSelected =
      values.length > 0 && values[values.length - 1] === PaymentDetailType.OTHER.toString();
    const noneOptionIndex = values.indexOf(PaymentDetailType.OTHER.toString());
    const noneOptionSelected = noneOptionIndex > -1;
    if (noneOptionLastSelected) {
      dispatch({
        type: 'setPaymentDetailTypes',
        paymentDetailTypes: [SeniorCarePaymentSource.OTHER],
      });
    } else {
      if (noneOptionSelected) {
        // Remove the none option from selected
        values.splice(noneOptionIndex, 1);
      }
      dispatch({
        type: 'setPaymentDetailTypes',
        paymentDetailTypes: values as SeniorCarePaymentSource[],
      });
    }
    setNextDisabled(values.length === 0);
  }

  const handleNext = () => {
    if (oldPaymentDetailTypes) {
      const baseData = {
        cta_clicked: 'Next',
        payment_options: oldPaymentDetailTypes.join(','),
        member_type: 'Seeker',
      };
      let data;

      if (userHasAccount) {
        data = {
          ...baseData,
          lead_step: 'payment questionnaire in facility sc',
          lead_flow: 'mhp module',
        };
      } else {
        data = {
          ...baseData,
          enrollment_step: 'payment questionnaire in facility sc',
        };
      }

      AnalyticsHelper.logEvent({
        name: userHasAccount ? 'Lead Create - Senior Living' : 'Member Enrolled',
        data,
      });

      const noneOptionSelected = oldPaymentDetailTypes.includes(SeniorCarePaymentSource.OTHER);
      const hasSeniorLivingCommunitiesInZipcode = (SALCCommunities?.length ?? 0) > 0;
      if (isRecommendationOptimizationVariation) {
        router.push(
          getRecommendationOptimizationRoute(
            noneOptionSelected,
            isDisqualifiedFromSeniorFacilityLeads,
            hasSeniorLivingCommunitiesInZipcode,
            isDisqualifiedFromCaringLeads
          )
        );
      } else if (userHasAccount && noneOptionSelected) {
        router.push(SEEKER_IN_FACILITY_ROUTES.NO_COMMUNITIES_BY_COVERING_COST);
      } else {
        router.push(SEEKER_IN_FACILITY_ROUTES.RECAP);
      }
    } else {
      router.push(SEEKER_IN_FACILITY_ROUTES.RECAP);
    }
  };

  let subject;
  if (!whoNeedsCare || whoNeedsCare === 'OTHER') {
    subject = 'does your loved one';
  } else if (whoNeedsCare === 'SELF') {
    subject = 'do you';
  } else {
    subject = `does your ${whoNeedsCare.toLowerCase()}`;
  }

  useEnterKey(!isNextDisabled, handleNext);

  useEffect(() => {
    AnalyticsHelper.logEvent({
      name: 'Screen Viewed',
      data: {
        lead_flow: userHasAccount ? 'mhp module' : undefined,
      },
    });
    AnalyticsHelper.logTestExposure(
      CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION,
      recommendationOptimizationVariation
    );
  }, []);

  const paymentOptions = isRecommendationOptimizationVariation
    ? PAYMENT_DETAIL_TYPE_OPTIONS
    : PAYMENT_DETAIL_TYPE_OPTIONS.filter(
        (option) => option.value !== PaymentDetailType.GOVERNMENT_HEALTH_PROGRAM
      ).map((option) => ({
        value: option.value,
        label: option.label,
      }));

  return (
    <Grid container className={classes.gridList}>
      <Grid item xs={12}>
        {isRecommendationOptimizationVariation ? (
          <>
            <Typography variant="h4" className={classes.topText}>
              One last thing we need to confirm
            </Typography>
            <Header>There are many ways families can cover the cost of senior living.</Header>
            <Grid className={classes.separator}>
              <Header>
                {subject.charAt(0).toUpperCase() + subject.slice(1)} have access to any of these
                items?
              </Header>
            </Grid>
            <Typography className={classes.separator}>Select all that apply.</Typography>
          </>
        ) : (
          <Header>{`Which of the following benefits ${subject} have access to?`}</Header>
        )}
      </Grid>
      <Grid item xs={12}>
        <StatelessSelector
          className={classes.selector}
          value={oldPaymentDetailTypes}
          onChange={handleChange}>
          {paymentOptions.map((option: paymentOption) => {
            let optionLabel = option.label;
            if (option.value === PaymentDetailType.OWNED_HOME && whoNeedsCare === 'SELF') {
              optionLabel = 'A home you own';
            }
            return (
              <Pill
                key={option.value}
                size={option.description ? 'lg' : 'md'}
                description={option.description}
                value={option.value?.toString()}
                label={optionLabel}
              />
            );
          })}
        </StatelessSelector>
      </Grid>
      <FixElementToBottom useFade={false}>
        <CareComButtonContainer mt={3} mb={2}>
          <Button
            size="large"
            color="primary"
            variant="contained"
            fullWidth
            onClick={handleNext}
            disabled={isNextDisabled}>
            {isRecommendationOptimizationVariation ? 'View results' : 'Next'}
          </Button>
        </CareComButtonContainer>
      </FixElementToBottom>
    </Grid>
  );
}

PaymentQuestionnaire.defaultProps = {
  userHasAccount: false,
};

PaymentQuestionnaire.disableScreenViewed = true;

export default withPotentialMember(PaymentQuestionnaire);
