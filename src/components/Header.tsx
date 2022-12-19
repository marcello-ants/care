import { ReactNode } from 'react';
import { Typography, makeStyles } from '@material-ui/core';

interface Props {
  children: ReactNode;
}

const useStyles = makeStyles({
  header: {
    marginTop: 0,
  },
});

const Header = ({ children }: Props) => {
  const classes = useStyles();

  return (
    <Typography variant="h2" className={classes.header}>
      {children}
    </Typography>
  );
};

export default Header;
