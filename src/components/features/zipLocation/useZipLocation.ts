/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["draft"] }] */

import { useEffect, useReducer, useCallback, Reducer } from 'react';
import { useLazyQuery } from '@apollo/client';
import produce from 'immer';
import { SKIP_AUTH_CONTEXT_KEY } from '@/constants';
import logger from '@/lib/clientLogger';
import { isValidZipCode } from '@/utilities/globalValidations';
import { getZipcodeSummary, getZipcodeSummaryVariables } from '@/__generated__/getZipcodeSummary';
import { GET_ZIP_CODE_SUMMARY } from '../../request/GQL';

interface ZipState {
  city: string;
  state: string;
  zipcode: string;
  helperText: string;
  error: boolean;
  lat: number | null;
  lng: number | null;
}

const initialState: ZipState = {
  city: '',
  state: '',
  zipcode: '',
  helperText: '',
  lat: null,
  lng: null,
  error: false,
};

type ZipAction =
  | { type: 'setError'; message: string }
  | { type: 'clearResult' }
  | { type: 'setResult'; city: string; state: string; lat: number | null; lng: number | null }
  | { type: 'setZipcodeHook'; zipcode: string };

export const errorText = 'Enter a valid ZIP code (e.g. "02453")';
const GQLcallError =
  'Sorry, we experienced an issue on our end. Please try again, then click Next.';

const zipReducer = produce((draft: ZipState, action: ZipAction): ZipState => {
  switch (action.type) {
    case 'setError':
      draft.error = true;
      draft.helperText = action.message;
      return draft;
    case 'clearResult':
      draft.error = false;
      draft.helperText = '';
      draft.city = '';
      draft.state = '';
      draft.lng = null;
      draft.lat = null;
      return draft;
    case 'setResult':
      draft.error = false;
      draft.helperText = `${action.city}, ${action.state}`;
      draft.city = action.city;
      draft.state = action.state;
      draft.lng = action.lng;
      draft.lat = action.lat;
      return draft;
    case 'setZipcodeHook':
      draft.zipcode = action.zipcode;
      return draft;
    default:
      return draft;
  }
});

type UseZipLocation = {
  initialZipcode: string;
  validateOnLostFocusOrClick: boolean;
  populateZipOnPageEnter: boolean;
};

function useZipLocation({
  initialZipcode,
  validateOnLostFocusOrClick = false,
  populateZipOnPageEnter,
}: UseZipLocation) {
  const [zipComponentState, dispatch] = useReducer<Reducer<ZipState, ZipAction>>(zipReducer, {
    ...initialState,
    zipcode: initialZipcode,
  });
  const { zipcode } = zipComponentState;

  const [getZipCodeSummary, { variables, loading, data, error: graphQLError }] = useLazyQuery<
    getZipcodeSummary,
    getZipcodeSummaryVariables
  >(GET_ZIP_CODE_SUMMARY, {
    context: { [SKIP_AUTH_CONTEXT_KEY]: true },
  });

  const validateZipCode = useCallback(
    (showError: boolean) => {
      if (isValidZipCode(zipcode)) {
        getZipCodeSummary({
          variables: {
            zipcode,
          },
        });
      } else if (!isValidZipCode(zipcode) && showError) {
        dispatch({ type: 'setError', message: errorText });
      } else {
        dispatch({ type: 'setError', message: '' });
      }
    },
    [dispatch, zipcode]
  );

  const setZipcodeHook = useCallback(
    (zip: string) => {
      dispatch({ type: 'setZipcodeHook', zipcode: zip });
    },
    [dispatch]
  );

  const dispatchInvalidCallResult = () => {
    logger.error({ event: 'getZipCodeSummaryError' });
    dispatch({ type: 'clearResult' });
    if (validateOnLostFocusOrClick) {
      dispatch({ type: 'setError', message: populateZipOnPageEnter ? errorText : GQLcallError });
    }
  };

  const dispatchSuccessfulCallResult = () => {
    if (!data) {
      return;
    }

    const { getZipcodeSummary: getZipcodeSummaryData } = data;
    const failedValidationMessage = 'InvalidZipcodeError';

    if (getZipcodeSummaryData.__typename === failedValidationMessage) {
      dispatch({ type: 'setError', message: errorText });
      return;
    }

    const {
      zipcode: fetchedZipcode,
      city,
      state,
      latitude: lat,
      longitude: lng,
    } = getZipcodeSummaryData;

    setZipcodeHook(fetchedZipcode);
    dispatch({
      type: 'setResult',
      city,
      state,
      lat,
      lng,
    });
  };

  useEffect(() => {
    if (populateZipOnPageEnter) {
      getZipCodeSummary({});
    }
  }, []);

  useEffect(() => {
    validateZipCode(validateOnLostFocusOrClick);
  }, [validateZipCode, zipcode]);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (graphQLError) {
      dispatchInvalidCallResult();
      return;
    }

    dispatchSuccessfulCallResult();
  }, [loading, variables, graphQLError]);

  return {
    zipComponentState,
    zipcode,
    loading,
    validateZipCode,
    setZipcodeHook,
  };
}

export default useZipLocation;
