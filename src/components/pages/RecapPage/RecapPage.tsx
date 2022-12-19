import React from 'react';
import CaregiversPreview from '@/components/features/caregiversPreview/CaregiversPreview';
import DidYouKnow from '@/components/features/DidYouKnow/DidYouKnow';
import Header from '@/components/Header';
import { Grid, makeStyles } from '@material-ui/core';
import { Caregiver } from '@/components/features/caregiversPreview/CaregiverCard';

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    margin: '0 auto',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  header: {
    paddingTop: theme.spacing(1),
    marginBottom: theme.spacing(4),
  },
}));

interface RecapProps {
  title: string;
  onComplete: () => void;
  info: string;
  caregivers: Caregiver[];
  icon?: React.ReactElement;
  showIcon?: Boolean;
}

const RecapPage = (props: RecapProps) => {
  const classes = useStyles();
  const { title, info, onComplete, caregivers, showIcon, icon } = props;

  return (
    <Grid container className={classes.gridContainer}>
      {showIcon && icon}
      <Grid item xs={12} className={classes.header}>
        <Header>{title}</Header>
      </Grid>
      <DidYouKnow info={info} />
      <CaregiversPreview caregivers={caregivers} onComplete={onComplete} />
    </Grid>
  );
};

RecapPage.defaultProps = {
  showIcon: false,
  icon: <></>,
};

export default RecapPage;
