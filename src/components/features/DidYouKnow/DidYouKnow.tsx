import { Icon24InfoTips } from '@care/react-icons';
import { Grid, makeStyles, Typography, useMediaQuery } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  info: {
    marginBottom: theme.spacing(6),
  },
}));

interface DidYouKnowProps {
  info: string;
}

const DidYouKnow = (props: DidYouKnowProps) => {
  const classes = useStyles();
  const isReallySmallDevice = useMediaQuery('(max-width:345px)');
  const { info } = props;

  return (
    <>
      <Grid item xs={isReallySmallDevice ? 12 : 1} className={classes.info}>
        <Icon24InfoTips />
      </Grid>
      <Grid item xs={isReallySmallDevice ? 12 : 11} className={classes.info}>
        <Typography variant="body2">{info}</Typography>
      </Grid>
    </>
  );
};

export default DidYouKnow;
