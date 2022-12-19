/* eslint-disable import/prefer-default-export */
// External Dependencies
import { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import get from 'lodash-es/get';
import { StepperInput } from '@care/react-component-lib';

// Internal Dependencies
import { useAppDispatch, useSeekerState } from '@/components/AppState';
import { DistanceUnit } from '@/__generated__/globalTypes';
import { CLIENT_FEATURE_FLAGS } from '@/constants';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import Header from '@/components/Header';

// Styles
import useStyles from './styles';

function TravelDistance() {
  // Styles
  const classes = useStyles();

  const dispatch = useAppDispatch();
  const daycareDistanceFromState = useSeekerState().maxDistanceFromSeekerDayCare.distance;

  // Feature flags + Launch Darkly
  const featureFlags = useFeatureFlags();
  const daycareDistance = get(
    featureFlags.flags[CLIENT_FEATURE_FLAGS.DAYCARE_DISTANCE_SETTINGS],
    'value',
    { increment: 2, initialValue: 10, maximum: 50, minimum: 2 }
  );

  useEffect(() => {
    if (daycareDistanceFromState === 0) {
      dispatch({
        type: 'setMaxDistanceFromSeekerDayCare',
        distance: daycareDistance.initialValue,
        unit: DistanceUnit.MILES,
      });
    }
  }, []);

  const onDistanceInputChange = (distance: number) => {
    dispatch({
      type: 'setMaxDistanceFromSeekerDayCare',
      distance,
      unit: DistanceUnit.MILES,
    });
  };

  return (
    <>
      <Grid item xs={12} className={classes.distanceLabel}>
        <Header>How far are you willing to travel?</Header>
      </Grid>
      <Grid item xs={12} className={classes.distanceInputContainer}>
        <StepperInput
          name="distance"
          min={daycareDistance.minimum}
          max={daycareDistance.maximum}
          inc={daycareDistance.increment}
          initialVal={
            daycareDistanceFromState === 0 ? daycareDistance.initialValue : daycareDistanceFromState
          }
          optionalLabel="miles"
          onChange={onDistanceInputChange}
        />
      </Grid>
    </>
  );
}

export { TravelDistance };
