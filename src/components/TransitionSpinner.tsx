import { Typography } from '@material-ui/core';
import { Spinner } from '@care/react-component-lib';
import { makeStyles } from '@material-ui/core/styles';
import { HEIGHT_MINUS_TOOLBAR } from '@/constants';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: HEIGHT_MINUS_TOOLBAR,
  },
  wrapper: {
    // pushing up 48px to center vertically 48px = container's page top padding
    transform: `translateY(-48px)`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  message: {
    paddingTop: theme.spacing(1),
  },
}));

interface ITransitionSpinner {
  message: string;
}

function TransitionSpinner({ message }: ITransitionSpinner) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <Spinner size="40px" />
        <Typography className={classes.message} variant="h2">
          {message}
        </Typography>
      </div>
    </div>
  );
}

export default TransitionSpinner;
