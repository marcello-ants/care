import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Typography } from '@care/react-component-lib';

const useStyles = makeStyles(() => ({
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

interface RecommendedFacilityTypeLayoutProps {
  header: string;
  children: React.ReactElement;
  icon: React.ReactElement;
}

const RecommendedFacilityTypeLayout = ({
  header,
  children,
  icon,
}: RecommendedFacilityTypeLayoutProps) => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.imageContainer}>{icon}</div>
      <Typography variant="h2">{header}</Typography>
      {children}
    </div>
  );
};

export default RecommendedFacilityTypeLayout;
