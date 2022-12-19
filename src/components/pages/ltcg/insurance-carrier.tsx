import React, { ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import { makeStyles, RadioGroup, FormControlLabel, Button } from '@material-ui/core';
import { Radio } from '@care/react-component-lib';
import Header from '@/components/Header';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { InsuranceCarrierEnum, InsuranceCarrierMap } from '@/types/ltcg';
import { LTCG_ROUTES } from '@/constants';
import { useAppDispatch, useLtcgState } from '@/components/AppState';

export const InsuranceCarrierOptions = [
  { label: InsuranceCarrierMap.CNA, value: InsuranceCarrierEnum.CNA },
  { label: InsuranceCarrierMap.JOHN_HANCOCK, value: InsuranceCarrierEnum.JOHN_HANCOCK },
  { label: InsuranceCarrierMap.METLIFE, value: InsuranceCarrierEnum.METLIFE },
  { label: InsuranceCarrierMap.BANKERS_LIFE, value: InsuranceCarrierEnum.BANKERS_LIFE },
  { label: InsuranceCarrierMap.TRANS_AMERICA, value: InsuranceCarrierEnum.TRANS_AMERICA },
  { label: InsuranceCarrierMap.MUTUAL_OF_OMAHA, value: InsuranceCarrierEnum.MUTUAL_OF_OMAHA },
  {
    label: InsuranceCarrierMap.SENIOR_HEALTH_INSURANCE_COMPANY_OF_PENNSYLVANIA,
    value: InsuranceCarrierEnum.SENIOR_HEALTH_INSURANCE_COMPANY_OF_PENNSYLVANIA,
  },
  { label: InsuranceCarrierMap.UNSURE, value: InsuranceCarrierEnum.UNSURE },
  { label: InsuranceCarrierMap.NONE, value: InsuranceCarrierEnum.NONE },
];

const useStyles = makeStyles((theme) => ({
  header: { marginBottom: theme.spacing(3) },
  buttonContainer: { padding: theme.spacing(4, 3, 2) },
  radio: {
    padding: 0,
    margin: theme.spacing(0.25),
  },
  radioGroup: {
    '& .MuiIconButton-root': {
      paddingLeft: 0,
    },
  },
}));

function isEligibleInsuranceCarrier(insuranceCarrier: InsuranceCarrierEnum) {
  if (insuranceCarrier === InsuranceCarrierEnum.BANKERS_LIFE) {
    return true;
  }
  return false;
}

function InsuranceCarrier() {
  const { insuranceCarrier } = useLtcgState();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const classes = useStyles();

  useEffect(() => {
    AnalyticsHelper.logScreenViewed('insurance-carrier', 'ltcg experience');
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'setLtcgInsuranceCarrier',
      insuranceCarrier: e.target.value as InsuranceCarrierEnum,
    });
  };

  const handleButtonClick = () => {
    if (insuranceCarrier) {
      AnalyticsHelper.logEvent({
        name: 'Member Enrolled',
        data: {
          screen_name: 'insurance-carrier',
          source: 'ltcg experience',
          cta_clicked: 'next',
          user_type: insuranceCarrier,
        },
      });

      if (isEligibleInsuranceCarrier(insuranceCarrier)) {
        router.push(LTCG_ROUTES.ELIGIBLE_POLICY);
      } else {
        router.push(LTCG_ROUTES.POLICY_INELIGIBLE);
      }
    }
  };

  return (
    <>
      <div className={classes.header}>
        <Header>Who is your long-term care insurance carrier?</Header>
      </div>

      <RadioGroup
        value={insuranceCarrier}
        onChange={handleChange}
        name="insurance-carrier"
        className={classes.radioGroup}>
        {InsuranceCarrierOptions.map(({ label, value }) => (
          <FormControlLabel
            classes={{ root: classes.radio }}
            key={label}
            value={value}
            control={<Radio />}
            label={label}
          />
        ))}
      </RadioGroup>
      <div className={classes.buttonContainer}>
        <Button
          fullWidth
          color="primary"
          variant="contained"
          size="large"
          onClick={handleButtonClick}>
          Next
        </Button>
      </div>
    </>
  );
}

export default InsuranceCarrier;
