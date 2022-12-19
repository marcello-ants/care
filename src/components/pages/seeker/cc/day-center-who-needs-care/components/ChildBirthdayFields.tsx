// External Dependencies
import React, { useMemo } from 'react';
import { Button, FormHelperText, Grid, InputLabel, MenuItem } from '@material-ui/core';
import { Select, Typography } from '@care/react-component-lib';

// Internal Dependencies
import { ChildDateOfBirth } from '@/types/seekerCC';
import { getBirthAvailableMonthsAndYears } from '../utils';
import useStyles from './ChildBirthdayFields.styles';

// Interfaces
interface TErrorProps {
  year?: string;
  month?: string;
}

type SelectInputProps = React.ComponentProps<typeof Select>;
interface IChildBirthdayFieldsProps {
  child: ChildDateOfBirth;
  onRemoveChild: () => void;
  onChange: SelectInputProps['onChange'];
  childIndex: number;
  error?: TErrorProps;
  allow9MonthsOutFromNow?: boolean;
}

function ChildBirthdayFields({
  child,
  childIndex: i,
  onChange,
  onRemoveChild,
  error,
  allow9MonthsOutFromNow,
}: IChildBirthdayFieldsProps) {
  const classes = useStyles();

  const { months, years } = useMemo(
    () => getBirthAvailableMonthsAndYears(child.month, child.year, allow9MonthsOutFromNow),
    [child.year, child.month, allow9MonthsOutFromNow]
  );

  const monthsOptions = useMemo(() => {
    return months.map((month) => {
      return (
        <MenuItem key={month.value} value={month.value}>
          {month.name}
        </MenuItem>
      );
    });
  }, [months]);

  const yearsOptions = useMemo(() => {
    return years.map((year: string) => {
      return (
        <MenuItem key={year} value={year}>
          {year}
        </MenuItem>
      );
    });
  }, [years]);

  return (
    <Grid
      // eslint-disable-next-line react/no-array-index-key
      item
      xs={12}
      className={`${
        i === 0
          ? `${classes.childContainer}`
          : `${classes.childContainer} ${classes.childContainerNth}`
      }`}>
      <Typography variant="h3">Child {i + 1}</Typography>
      {i !== 0 && (
        <Button className={classes.removeChildButton} onClick={onRemoveChild}>
          Remove Child
        </Button>
      )}
      <Grid item xs={12} className={classes.optionsContainer}>
        <Grid item xs={6} className={`${classes.selectContainer} ${classes.monthSelect}`}>
          <InputLabel id={`month-select-label-${i}`}>Birth month</InputLabel>
          <Select
            className={classes.fullWidth}
            labelId={`month-select-label-${i}`}
            id={`month-select-child-${i}`}
            name={`children[${i}].month`}
            onChange={onChange}
            value={child.month}
            error={Boolean(error?.month)}>
            {monthsOptions}
          </Select>
          {error?.month && (
            <FormHelperText className={classes.error}>Select their birth month</FormHelperText>
          )}
        </Grid>
        <Grid item xs={6} className={`${classes.selectContainer} ${classes.yearSelect}`}>
          <InputLabel id={`year-select-label-${i}`}>Birth year</InputLabel>
          <Select
            className={classes.fullWidth}
            labelId={`year-select-label-${i}`}
            id={`year-select-child-${i}`}
            name={`children[${i}].year`}
            onChange={onChange}
            value={child.year}
            error={Boolean(error?.year)}>
            {yearsOptions}
          </Select>
          {error?.year && (
            <FormHelperText className={classes.error}>Select their birth year</FormHelperText>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

ChildBirthdayFields.defaultProps = {
  error: undefined,
  allow9MonthsOutFromNow: undefined,
};

export type { IChildBirthdayFieldsProps, TErrorProps };
export default ChildBirthdayFields;
