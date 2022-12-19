import { ChangeEvent } from 'react';
import { Grid, Slider, Typography } from '@material-ui/core';
import { useTimeFormatsMap } from '../lib/TimeFormats';

type TimeRangeSliderProps = {
  className?: string;
  values: string[];
  locale?: string;
  onChange: (values: string[]) => void;
  min?: number;
};

// we store times as a "HH:mm" string
// but the MUI slider requires numbers for the values
// so this function converts the string to HH.(mm/60)
function toSliderValue(value: string): number {
  const [hour, minutes] = value.split(':');
  return Number(hour) + Number(minutes) / 60;
}

// convenience function for doing the above with a start and end time array
// which is how MUI sends & receives values for a range slider
function toSliderValues(values: string[]): number[] {
  const [startTime, endTime] = values;
  return [toSliderValue(startTime), toSliderValue(endTime)];
}

const TimeRangeSlider = (props: TimeRangeSliderProps) => {
  const { className, locale, values, onChange, min } = props;

  const timeFormatsMap = useTimeFormatsMap(locale);
  const formatTimeValue = (value: number) => timeFormatsMap[value].label;

  function handleChange(event: ChangeEvent<{}>, newValues: number | number[]) {
    const [prevStart, prevEnd] = values;
    if (Array.isArray(newValues)) {
      const newStart = timeFormatsMap[newValues[0]].value;
      const newEnd = timeFormatsMap[newValues[1]].value;

      if (prevStart !== newStart || prevEnd !== newEnd) {
        onChange([newStart, newEnd]);
      }
    }
  }

  const sliderValues = toSliderValues(values);
  const valueDisplayText = `${formatTimeValue(sliderValues[0])} - ${formatTimeValue(
    sliderValues[1]
  )}`;

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography align="center" variant="body2">
          <strong>{valueDisplayText}</strong>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Slider
          data-testid="time-slider"
          className={className}
          onChange={handleChange}
          step={0.5}
          max={24}
          min={min}
          value={sliderValues}
        />
      </Grid>
    </Grid>
  );
};

TimeRangeSlider.defaultProps = {
  className: undefined,
  locale: undefined,
  min: undefined,
};

export default TimeRangeSlider;
