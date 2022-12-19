import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  distanceInputContainer: {
    padding: theme.spacing(2, 0),
    '& > div': {
      padding: 0,
      maxWidth: '100%',
    },
  },
  distanceLabel: {
    padding: theme.spacing(1, 0, 3),
  },
}));

export default useStyles;
