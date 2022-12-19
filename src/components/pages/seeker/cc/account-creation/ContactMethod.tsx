// External dependencies
import React, { useEffect } from 'react';
import { RadioGroup, FormControl, FormHelperText, makeStyles } from '@material-ui/core';
import { Radio, FormControlLabel, Typography } from '@care/react-component-lib';

// Internal dependencies
import { CLIENT_FEATURE_FLAGS } from '@/constants';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';

interface ContactMethodProps {
  value: string;
  onChange: (input: React.ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
}

const useClasses = makeStyles(() => ({
  fieldsetRoot: {
    width: '100%',
  },
  labelFlex: {
    flexGrow: 1,
  },
}));

export default function ContactMethod(props: ContactMethodProps) {
  const { value, onChange, error } = props;
  const featureFlags = useFeatureFlags();
  const classes = useClasses();

  useEffect(() => {
    // test exposure
    AnalyticsHelper.logTestExposure(
      CLIENT_FEATURE_FLAGS.CC_DC_CONTACT_METHOD,
      featureFlags?.flags[CLIENT_FEATURE_FLAGS.CC_DC_CONTACT_METHOD]
    );
  }, []);

  return (
    <FormControl component="fieldset" error={error} classes={{ root: classes.fieldsetRoot }}>
      <Typography variant="h4">Preferred contact method</Typography>
      <RadioGroup
        aria-label="contactMethod"
        name="contactMethod"
        value={value}
        row
        onChange={onChange}>
        <FormControlLabel
          value="PHONE"
          control={<Radio />}
          label="Call me"
          classes={{ root: classes.labelFlex }}
        />
        <FormControlLabel
          value="MAIL"
          control={<Radio />}
          label="Email me"
          classes={{ root: classes.labelFlex }}
        />
      </RadioGroup>
      <FormHelperText error>{error ? 'Contact method is required' : ''}</FormHelperText>
    </FormControl>
  );
}
