import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  return {
    divider: {
      width: 150,
      height: 4,
      backgroundColor: theme.palette.grey[200],
    },
  };
});

const Divider = () => {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.divider} />
    </div>
  );
};

export default Divider;
