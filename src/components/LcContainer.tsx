import { ReactNode } from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    margin: theme.spacing(0, 'auto', 2),
    justifyContent: 'center',
    width: '100%',
    maxWidth: 410,
    [theme.breakpoints.up('md')]: {
      maxWidth: 628,
      margin: theme.spacing(6, 'auto', 4),
    },
  },
}));

interface LcContainerProps {
  children: ReactNode;
  // eslint-disable-next-line react/no-unused-prop-types, react/require-default-props
  classes?: ReturnType<typeof useStyles>;
}

export default function LcContainer(props: LcContainerProps) {
  const classes = useStyles(props);
  const { children } = props;
  return <div className={classes.root}>{children}</div>;
}
