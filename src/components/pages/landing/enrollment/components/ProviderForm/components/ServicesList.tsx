/* eslint-disable import/prefer-default-export */
// External Dependencies
import { useState } from 'react';
import { Select, MenuItem, useMediaQuery } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { theme } from '@care/material-ui-theme';
import { Typography } from '@care/react-component-lib';

// Internal Constants
import { PROVIDER_SERVICES_DESKTOP, PROVIDER_SERVICES_MOBILE } from '../constants';

// Styles
import useStyles from './ServicesList.styles';

function ServicesList() {
  // Styles
  const classes = useStyles();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const formik = useFormikContext<{ providerService: string }>();
  const listOfServices = isDesktop ? PROVIDER_SERVICES_DESKTOP : PROVIDER_SERVICES_MOBILE;

  // Component's State
  const [typeOfService, setTypeOfService] = useState('');

  // Handlers
  const onServiceValueChange = (value: string) => {
    formik.setFieldValue('providerService', value);
    setTypeOfService(value as string);
  };

  return (
    <>
      <Select
        name="selectJobType"
        className={
          !typeOfService
            ? `${classes.inputContainer} ${classes.empty}`
            : `${classes.inputContainer}`
        }
        value={typeOfService}
        displayEmpty
        onChange={(e) => {
          onServiceValueChange(e.target.value as string);
        }}>
        <MenuItem value="" disabled>
          Select one:
        </MenuItem>
        {listOfServices.map((service: any) => {
          return (
            <MenuItem value={service.value} key={service.value}>
              {service.label}
            </MenuItem>
          );
        })}
      </Select>
      {formik.errors.providerService && (
        <Typography careVariant="info1" className={classes.error}>
          Please select a job
        </Typography>
      )}
    </>
  );
}

export { ServicesList };
