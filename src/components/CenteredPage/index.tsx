import React from 'react';
import { Grid, useTheme, useMediaQuery, makeStyles } from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

type CenteredPageProps = {
  children: React.ReactNode;
  breakpoint?: Breakpoint | number;
};

const useStyles = makeStyles(() => ({
  root: {
    /*
     * This component center the content inside the App,
     * so we need to subtract the AppBar height and padding to the viewport
     */
    minHeight: 'calc(85vh - 104px)',
  },
}));

export default function CenteredPage(props: CenteredPageProps) {
  const { children, breakpoint = 'md' } = props;
  const theme = useTheme();
  const classes = useStyles();
  const isDesktop = useMediaQuery(theme.breakpoints.up(breakpoint));

  return (
    <Grid
      container
      className={isDesktop ? classes.root : undefined}
      direction="row"
      justifyContent="center"
      alignItems="center">
      <Grid item xs={12}>
        {children}
      </Grid>
    </Grid>
  );
}

CenteredPage.defaultProps = {
  breakpoint: 'md',
};
