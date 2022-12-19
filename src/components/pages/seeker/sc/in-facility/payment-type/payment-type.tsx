import { useRouter } from 'next/router';
import { Grid, makeStyles } from '@material-ui/core';
import { StatelessSelector, Pill } from '@care/react-component-lib';

import {
  withPotentialMember,
  WithPotentialMemberProps,
} from '@/components/features/potentialMember/withPotentialMember';
import Header from '@/components/Header';
import { useAppDispatch, useSeekerState } from '@/components/AppState';

import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { SEEKER_IN_FACILITY_ROUTES } from '@/constants';
import { PaymentTypeOptions } from '@/types/seeker';

import { SeniorCarePaymentSource } from '@/__generated__/globalTypes';

const useStyles = makeStyles((theme) => ({
  selector: {
    marginTop: theme.spacing(2),
    // solves pill content overflowing
    '& .MuiGrid-grid-xs-10': {
      maxWidth: '100%',
      flexBasis: '100%',
    },
    '& .MuiListItem-root': {
      marginBottom: theme.spacing(0),
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
}));

const pillOptions = [
  {
    label: 'Private pay',
    value: PaymentTypeOptions.PRIVATE,
    description: 'Payment via your own resources',
  },
  {
    label: 'Medicaid and/or Medicare',
    value: PaymentTypeOptions.GOVERNMENT,
    description: 'Typically only individuals with low incomes are eligible for these programs.',
  },
  {
    label: 'Help guide me',
    value: PaymentTypeOptions.HELP,
    description: 'Answer a quick question to find out',
  },
];

function PaymentType(props: WithPotentialMemberProps) {
  const { userHasAccount } = props;
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { whoNeedsCare } = useSeekerState();

  const message =
    whoNeedsCare === 'SELF'
      ? 'How are you thinking about covering the cost?'
      : 'How is your family thinking about covering the cost?';

  const handleChange = (value: PaymentTypeOptions[]) => {
    const paymentType = value[0];
    dispatch({ type: 'setPaymentType', paymentType });

    const baseData = {
      cta_clicked: paymentType,
      member_type: 'Seeker',
    };
    let data;

    if (userHasAccount) {
      data = {
        ...baseData,
        lead_step: 'covering the cost',
        lead_flow: 'mhp module',
        payment_options: paymentType,
      };
    } else {
      data = {
        ...baseData,
        enrollment_step: 'covering the cost',
      };
    }

    AnalyticsHelper.logEvent({
      name: userHasAccount ? 'Lead Create - Senior Living' : 'Member Enrolled',
      data,
    });

    if (paymentType === PaymentTypeOptions.HELP) {
      // If a user is directed to the help questionnaire, clear any previous selections
      dispatch({
        type: 'setPaymentDetailTypes',
        paymentDetailTypes: [],
      });
      router.push(SEEKER_IN_FACILITY_ROUTES.PAYMENT_QUESTIONNAIRE);
    } else if (paymentType === PaymentTypeOptions.GOVERNMENT) {
      dispatch({
        type: 'setPaymentDetailTypes',
        paymentDetailTypes: [SeniorCarePaymentSource.GOVERNMENT_HEALTH_PROGRAM],
      });

      router.push(SEEKER_IN_FACILITY_ROUTES.PAYMENT_QUESTIONNAIRE);
    } else {
      dispatch({
        type: 'setPaymentDetailTypes',
        paymentDetailTypes: [SeniorCarePaymentSource.PRIVATE_PAY],
      });

      router.push(SEEKER_IN_FACILITY_ROUTES.RECAP);
    }
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Header>{message}</Header>
      </Grid>
      <Grid item xs={12}>
        <StatelessSelector
          onChange={handleChange}
          name="careType"
          single
          className={classes.selector}>
          {pillOptions.map((pill) => (
            <Pill
              key={pill.value}
              value={pill.value.toString()}
              label={pill.label}
              description={pill.description}
              size="lg"
            />
          ))}
        </StatelessSelector>
      </Grid>
    </Grid>
  );
}

PaymentType.defaultProps = {
  userHasAccount: false,
};

export default withPotentialMember(PaymentType);
