import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  errorBanner: {
    display: 'flex',
    flexDirection: 'row',
    color: theme?.palette?.care?.red[800],
    marginBottom: theme.spacing(5),
    '& > div:first-of-type': {
      display: 'flex',
      alignItems: 'center',
    },
    '& > div:last-of-type': {
      paddingLeft: theme.spacing(2.25),
    },
  },
}));

export default useStyles;
