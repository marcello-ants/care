import { useEffect, useState } from 'react';
import { theme } from '@care/material-ui-theme';
import { Box, Button, makeStyles } from '@material-ui/core';
import { GoogleMaps, GoogleMapsActions, useGoogleMaps } from '@care/seeker-react-components';
import { Icon24UtilitySearch } from '@care/react-icons';
import { InlineTextField, Typography } from '@care/react-component-lib';
import { AddressInput } from '@/__generated__/globalTypes';
import { logIbAddressErrorEvent } from '@/utilities/analyticsPagesUtils';

const useStyles = makeStyles(() => ({
  addressSearchContainer: {
    position: 'relative',
    marginTop: theme.spacing(-2.75),
    '&& > .MuiTextField-root': {
      paddingLeft: 0,
      paddingRight: 0,
    },
    '&& label': {
      paddingLeft: theme.spacing(5),
      textAlign: 'left',
    },
    '&& input': {
      paddingLeft: theme.spacing(7),
    },
  },
  loopIcon: {
    position: 'absolute',
    top: 42,
    left: 20,
    zIndex: 2,
  },
  locationContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationText: {
    textAlign: 'left',
    whiteSpace: 'pre-wrap',
  },
  editLocationButton: {
    width: 81,
  },
  notFoundContainer: {
    padding: theme.spacing(5, 0),
    textAlign: 'center',
  },
  suiteContainer: {
    '&& > .MuiTextField-root': {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
}));

interface AddressSearchProps {
  seekerAddress: AddressInput;
  setSeekerAddress: (address: AddressInput) => void;
  displayAddress: string;
  setDisplayAddress: (displayAddress: string) => void;
  pageName: string;
}

const AddressSearch = ({
  seekerAddress,
  setSeekerAddress,
  displayAddress,
  setDisplayAddress,
  pageName,
}: AddressSearchProps): JSX.Element => {
  const classes = useStyles();
  const [{ placeDetails, predictions }, dispatch] = useGoogleMaps();
  const addressLabelText = 'Street address';
  const addressLabelTextOnInput = 'Search address';
  const suiteLabelText = 'Apt or Suite (optional)';
  const invalidAddressText = 'Invalid address';
  const notFoundText = 'Address not found';
  const notFoundDescription = `Make sure it's spelled correctly or try adding a city, state or zip code`;
  const CITY_POSITION: number = 2;
  const STATE_POSITION: number = 3;

  const [label, setLabel] = useState(addressLabelText);
  const [showAddressSearch, setShowAddressSearch] = useState<boolean>(true);
  const [shouldSaveAddress, setShouldSaveAddress] = useState<boolean>(false);

  const isValidAddress = seekerAddress.zip && seekerAddress.addressLine1;

  const handleFocus = () => {
    setLabel(addressLabelTextOnInput);
  };

  const handleBlur = () => {
    setLabel(addressLabelText);
  };

  const setGoogleMapsPlaceInfo = (inputText: string) => {
    dispatch({ type: GoogleMapsActions.SET_INPUT_SEARCH, payload: inputText });
    dispatch({ type: GoogleMapsActions.SET_PLACE_DETAILS, payload: null });
    dispatch({ type: GoogleMapsActions.CLEAR_PREDICTIONS });
  };

  const handleEditClick = () => {
    setGoogleMapsPlaceInfo(seekerAddress.addressLine1);
    setShowAddressSearch(true);
    setShouldSaveAddress(false);
  };

  const handlePredictionClick = () => {
    setShowAddressSearch(false);
    setShouldSaveAddress(true);
  };

  useEffect(() => {
    if (shouldSaveAddress && placeDetails) {
      setSeekerAddress({
        ...seekerAddress,
        addressLine1: placeDetails.prediction.structured_formatting.main_text,
        city: placeDetails.prediction.terms[CITY_POSITION].value,
        state: placeDetails.prediction.terms[STATE_POSITION].value,
        zip: placeDetails.zip || '',
        longitude: placeDetails.longitude,
        latitude: placeDetails.latitude,
      });
      setDisplayAddress(
        `${placeDetails.prediction.structured_formatting.main_text} \n${
          placeDetails.prediction.structured_formatting.secondary_text
        } ${placeDetails.zip || ''}`
      );
      setShouldSaveAddress(false);
    }
  }, [shouldSaveAddress, placeDetails]);

  useEffect(() => {
    if (displayAddress) {
      setShowAddressSearch(false);
    }
  }, []);

  const handleSuiteChange = (value: string) => {
    setSeekerAddress({
      ...seekerAddress,
      addressLine2: value,
    });
  };

  const addressSearchMode = showAddressSearch || shouldSaveAddress;

  useEffect(() => {
    if (addressSearchMode && !predictions) {
      logIbAddressErrorEvent(notFoundText, pageName);
    }
  }, [addressSearchMode, predictions]);
  useEffect(() => {
    if (!addressSearchMode && !isValidAddress) {
      logIbAddressErrorEvent(invalidAddressText, pageName);
    }
  }, [addressSearchMode, isValidAddress]);

  return (
    <Box>
      {addressSearchMode ? (
        <Box className={classes.addressSearchContainer}>
          <Icon24UtilitySearch className={classes.loopIcon} />
          <GoogleMaps.InputSearch label={label} onFocus={handleFocus} onBlur={handleBlur} />
          {predictions ? (
            predictions.map((prediction) => (
              <GoogleMaps.Prediction
                {...prediction}
                key={prediction.place_id}
                onClick={handlePredictionClick}
              />
            ))
          ) : (
            <Box className={classes.notFoundContainer}>
              <Typography variant="h2">{notFoundText}</Typography>
              <Typography variant="body1">{notFoundDescription}</Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Box>
          <Box className={classes.locationContainer}>
            <Box className={classes.locationText}>
              <Typography>{displayAddress}</Typography>
            </Box>
            <Box>
              <Button
                color="secondary"
                variant="outlined"
                size="small"
                className={classes.editLocationButton}
                onClick={handleEditClick}>
                Edit
              </Button>
            </Box>
          </Box>
          {!isValidAddress && (
            <Box mt={2}>
              <Typography variant="body2" color="error">
                {invalidAddressText}
              </Typography>
            </Box>
          )}
          <Box className={classes.suiteContainer}>
            <InlineTextField
              id="aptOrSuite"
              InputLabelProps={{ shrink: false }}
              name="aptOrSuite"
              label={suiteLabelText}
              value={seekerAddress.addressLine2}
              onChange={(e) => handleSuiteChange(e.target.value)}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

const AddressSearchWrapper = (props: AddressSearchProps) => {
  return (
    <GoogleMaps.Provider>
      <AddressSearch {...props} />
    </GoogleMaps.Provider>
  );
};

export default AddressSearchWrapper;
