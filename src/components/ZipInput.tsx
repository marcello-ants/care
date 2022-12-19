/* eslint-disable react/require-default-props */
import { FC, useState, useEffect, ChangeEvent, useRef } from 'react';
import { Grid, InputAdornment, makeStyles } from '@material-ui/core';
import { InlineTextField } from '@care/react-component-lib';
import { Icon24InfoLocation } from '@care/react-icons';
import { useRouter } from 'next/router';
import { Location } from '@/types/common';
import { validPartialZipCodeRegex, validZipCodeRegex } from '../utilities/globalValidations';
import useZipLocation from './features/zipLocation/useZipLocation';

export interface ZipInputProps {
  location?: Location;
  showLabel?: boolean;
  showLocationIcon?: boolean;
  prepopulateZip?: boolean;
  onChange: (location: Location) => void;
  onError: (error: boolean) => void;
  setValidateOnClick?: (arg: boolean) => void;
  validateOnLostFocusOrClick?: boolean;
  setShouldGoNext?: (arg: boolean) => void;
  validateOnClick?: boolean;
  className?: string;
  errorOverride?: string;
}

const useStyles = makeStyles((theme) => ({
  inlineTextFieldOverride: {
    paddingLeft: 0,
    paddingRight: 0,
    '& .MuiInputBase-root': {
      height: (props: any) => (props && props.showLabel ? '64px' : '46px'),
    },
    // removes number arrows from Chrome, Safari, Edge, Opera
    '& input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
      appearance: 'none',
      margin: 0,
    },
    // removes number arrows from Firefox
    '& input[type=number]': {
      appearance: 'textfield',
      paddingTop: (props: any) => (props && props.showLabel ? '18px' : 0),
    },
  },
  loadZipcodeLink: {
    marginBottom: theme.spacing(2),
  },
}));

const ZipInput: FC<ZipInputProps> = ({
  location,
  showLabel = true,
  showLocationIcon = true,
  validateOnLostFocusOrClick = false,
  validateOnClick = false,
  prepopulateZip = false,
  setValidateOnClick = () => null,
  setShouldGoNext = () => null,
  onChange,
  onError,
  className,
  errorOverride,
}) => {
  const [shouldValidate, setShouldValidate] = useState(false);
  const textInput = useRef<HTMLInputElement>(null);

  const classes = useStyles({ showLabel });

  const { zipComponentState, loading, validateZipCode, setZipcodeHook } = useZipLocation({
    initialZipcode: location?.zipcode ?? '',
    validateOnLostFocusOrClick,
    populateZipOnPageEnter: prepopulateZip,
  });

  const { zipcode, city, state, lat, lng, helperText, error } = zipComponentState;
  const { zipcode: zipcodeStingParam } = useRouter().query;

  useEffect(() => {
    if (zipcodeStingParam && !zipcode) {
      setZipcodeHook(zipcodeStingParam as string);
    }
  }, []);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setShouldGoNext(false);
    setValidateOnClick(false);
    const newZipcode = e.target.value;

    if (!validPartialZipCodeRegex.test(newZipcode)) {
      return;
    }
    setZipcodeHook(newZipcode);
  };

  useEffect(() => {
    validateZipCode(validateOnLostFocusOrClick);
  }, [zipcode]);

  useEffect(() => {
    onError(error || loading);
  }, [error, loading]);

  useEffect(() => {
    onChange({ zipcode, city, state, lat, lng });
  }, [zipcode, city, state]);

  useEffect(() => {
    if (!validateOnLostFocusOrClick) {
      return;
    }
    if (textInput && textInput.current) {
      textInput.current.onblur = () => setShouldValidate(true);
      textInput.current.onfocus = () => setShouldValidate(false);
    }
  }, []);

  const showValidationResult = (): { message: string; validationError: boolean } => {
    const isLoading = () => loading && { message: '', validationError: false };

    const defaultValidation = () =>
      !validateOnLostFocusOrClick && {
        message: zipcode ? helperText : '',
        validationError: Boolean(error && zipcode),
      };

    const validateOnCompleteZipcode = () =>
      validZipCodeRegex.test(zipcode) && { message: helperText, validationError: error };

    const validateOnButtonClick = () =>
      validateOnClick && { message: helperText, validationError: error };

    const onLostFocusValidation = () => ({
      message: shouldValidate ? helperText : '',
      validationError: shouldValidate && error,
    });

    return (
      isLoading() ||
      defaultValidation() ||
      validateOnCompleteZipcode() ||
      validateOnButtonClick() ||
      onLostFocusValidation()
    );
  };

  const { message, validationError } = showValidationResult();

  return (
    <Grid item xs={12} className={className}>
      <InlineTextField
        inputRef={textInput}
        id="zipCode"
        name="zipCode"
        label={showLabel && 'ZIP code'}
        type="number"
        helperText={message || errorOverride}
        error={Boolean(validationError || errorOverride)}
        value={zipcode}
        onChange={onInputChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {showLocationIcon && <Icon24InfoLocation />}
            </InputAdornment>
          ),
        }}
        classes={{ root: classes.inlineTextFieldOverride }}
      />
    </Grid>
  );
};

export default ZipInput;
