import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  empty: {
    '& > .MuiSelect-select': {
      color: theme.palette.care?.grey[700],
      fontWeight: 'normal',
    },
  },
  inputContainer: {
    width: '100%',
    '& > div': {
      padding: 0,
    },
  },
  error: {
    color: theme?.palette?.care?.red[800],
    marginLeft: theme.spacing(1.25),
    marginTop: theme.spacing(0.5),
  },
}));

export default useStyles;
