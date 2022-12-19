import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  line: {
    borderBottom: `1px solid ${theme.palette.default?.light}`,
    lineHeight: '0.1em',
    width: '100%',
  },
  content: {
    paddingRight: theme.spacing(2.5),
    paddingLeft: theme.spacing(2.5),
    color: theme.palette.grey[600],
  },
}));

const DividerWithText = ({ children }: { children: string }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.line} />
      <span className={classes.content}>{children}</span>
      <div className={classes.line} />
    </div>
  );
};

export default DividerWithText;
