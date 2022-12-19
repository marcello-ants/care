import React from 'react';
import { Grid, Typography, makeStyles } from '@material-ui/core';
import { Icon64BrandActionClose, Icon24UtilityInfo } from '@care/react-icons';

const useStyles = makeStyles((theme) => ({
  marginTopElements: {
    marginTop: theme.spacing(1),
  },
}));

interface IneligibleLayoutProps {
  headerText: string;
  children: React.ReactNode;
  icon?: 'info' | 'close';
}

const IneligibleLayout = ({ headerText, children, icon }: IneligibleLayoutProps) => {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs={12}>
        {icon === 'close' && <Icon64BrandActionClose size="64px" />}
        {icon === 'info' && <Icon24UtilityInfo size="64px" />}
        <Typography variant="h2" className={classes.marginTopElements}>
          {headerText}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {children}
      </Grid>
    </Grid>
  );
};

IneligibleLayout.defaultProps = {
  icon: undefined,
};
export default IneligibleLayout;
