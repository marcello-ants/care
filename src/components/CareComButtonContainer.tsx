/* istanbul ignore next */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

type styleProps = {
  mt: number;
  mb: number;
};

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    padding: theme.spacing(0, 2),
    marginTop: ({ mt }: styleProps) => theme.spacing(mt),
    marginBottom: ({ mb }: styleProps) => theme.spacing(mb),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(0, 3),
    },
  },
}));

function CareComButtonContainer({
  children,
  mt = 0,
  mb = 0,
}: {
  children: React.ReactNode;
  mt?: number;
  mb?: number;
}) {
  const classes = useStyles({ mt, mb });

  return <div className={classes.buttonContainer}>{children}</div>;
}

CareComButtonContainer.defaultProps = {
  mt: 0,
  mb: 0,
};

export default CareComButtonContainer;
