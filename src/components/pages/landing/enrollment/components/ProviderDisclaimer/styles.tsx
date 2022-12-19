import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  disclaimer: {
    color: theme?.palette?.care?.grey[700],
    maxWidth: '410px',
    margin: '0 auto',
    textAlign: 'center',
  },
}));

export default useStyles;
