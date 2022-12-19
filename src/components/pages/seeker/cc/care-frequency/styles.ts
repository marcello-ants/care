import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  nextButtonContainer: {
    padding: theme.spacing(4, 0, 3),
    marginBottom: theme.spacing(51.5),
  },
  careFreqWrapper: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  errorText: {
    color: theme.palette.error.main,
    fontSize: '12px',
    lineHeight: '16px',
    marginBottom: theme.spacing(1),
  },
  frequency: {
    marginTop: theme.spacing(4),
  },
  daysPills: {
    '& li': {
      width: theme.spacing(5),
      margin: '0 auto',
    },
  },
  // A/B Test - growth-daycare-days-selector
  daysSelectorTestDaysPills: {
    '& li': {
      width: theme.spacing(5),
      marginRight: theme.spacing(3),
      marginTop: theme.spacing(3),
    },
  },
}));

export default useStyles;
