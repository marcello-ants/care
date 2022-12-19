import React from 'react';
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  useMediaQuery,
} from '@material-ui/core';
import { Typography } from '@care/react-component-lib';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ZipInput from '@/components/ZipInput';
import { Location } from '@/types/common';
import { UserInfoTaxCalculator } from '@/types/seekerCC';

interface Props {
  onChangeInfo: (data: UserInfoTaxCalculator) => void;
  handleError: (e: boolean) => void;
  userInfo: UserInfoTaxCalculator;
}

const useStyles = makeStyles((theme) => ({
  container: {
    padding: (props: any) =>
      props && props.isSmallScreen ? theme.spacing(6, 3) : theme.spacing(9, 1.5),
    marginTop: (props: any) => props && props.isExtraSmallScreen && theme.spacing(8.5),
  },
  headingText: {
    margin: theme.spacing(1, 0),
    fontSize: '2.25rem',
    lineHeight: '42px',
  },
  bodyText: {
    padding: theme.spacing(1, 0),
  },
  inputContainer: {
    paddingTop: theme.spacing(2),
  },
}));

const TaxCalculatorInputs: React.FC<Props> = ({ onChangeInfo, handleError, userInfo }) => {
  const kidsOptions = [1, 2];
  const hoursOptions = [10, 20, 40];
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles({ isSmallScreen, isExtraSmallScreen });

  const onZipInputChange = (location: Location) => {
    const newUserInfo = { ...userInfo, location };
    if (location.zipcode.length === 5) {
      onChangeInfo(newUserInfo);
    }
  };

  const inputChangeHandler = (
    e: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    const newUserInfo = { ...userInfo, [e.target.name as any]: e.target.value };
    onChangeInfo(newUserInfo);
  };

  return (
    <Container maxWidth="md" disableGutters className={classes.container}>
      <Typography variant="h1" className={classes.headingText}>
        Calculate your child care costs
      </Typography>
      <Grid container spacing={3} className={classes.inputContainer}>
        <Grid item xs={12} sm={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="zipcode-label">Where you live</InputLabel>
            <ZipInput
              location={userInfo.location}
              onError={handleError}
              onChange={onZipInputChange}
              showLabel={false}
              showLocationIcon={false}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="kids-option-label">Number of kids</InputLabel>
            <Select
              id="kids-option"
              name="kidsNumber"
              labelId="kinds-option-label"
              value={userInfo.kidsNumber}
              onChange={inputChangeHandler}>
              {kidsOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option === 1 ? '1' : '2+'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="hours-option-label">Hours a week you need care</InputLabel>
            <Select
              id="hours-option"
              name="hoursNumber"
              labelId="hours-option-label"
              value={userInfo.hoursNumber}
              onChange={inputChangeHandler}>
              {hoursOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TaxCalculatorInputs;
