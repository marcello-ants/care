/* eslint-disable react/require-default-props */
import React, { ReactNode } from 'react';
import { Grid, Button, makeStyles } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { Card, Typography } from '@care/react-component-lib';

interface SavingCardProps {
  careType: string;
  icon: ReactNode;
  price?: number;
  link: string;
  isLoading: boolean;
}

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(2),
    padding: `${theme.spacing(3)}px ${theme.spacing(3)}px`,
    maxWidth: '300px',
    width: '100%',
    height: '100%',
  },
  careType: {
    margin: `${theme.spacing(1)}px ${theme.spacing(0)}px`,
  },
  prices: {
    display: 'flex',
    alignItems: 'center',
  },
  price: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
    lineHeight: '34px',
  },
  oldPrice: {
    textDecorationLine: 'line-through',
  },
  savings: {
    color: theme.palette.care?.red[500],
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    lineHeight: '24px',
    [theme.breakpoints.up('md')]: {
      height: '40px',
    },
  },
  pricesContainer: {
    height: '80px',
  },
  noCostInfo: {
    fontWeight: 'bold',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  upperLoadingBar: {
    width: '100%',
    marginBottom: theme.spacing(0.5),
  },
  lowerLoadingBar: {
    width: '60%',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  findButton: {
    width: '100%',
  },
  link: {
    textDecorationLine: 'none',
  },
}));

const SavingCard: React.FC<SavingCardProps> = ({ careType, icon, price = 0, link, isLoading }) => {
  const classes = useStyles();

  const LoadingIndicator = (
    <>
      <Skeleton variant="rect" animation="wave" height={34} className={classes.upperLoadingBar} />
      <Skeleton variant="rect" animation="wave" height={24} className={classes.lowerLoadingBar} />
    </>
  );

  const isPriceValid = price > 0;

  return (
    <Card careVariant="subtle" className={classes.card}>
      {icon}
      <Typography variant="body1" className={classes.careType}>
        {careType}
      </Typography>
      {isLoading ? (
        LoadingIndicator
      ) : (
        <Grid container className={classes.pricesContainer}>
          {isPriceValid ? (
            <>
              <Grid container className={classes.prices}>
                <Typography variant="body1" className={classes.price}>
                  {`$${price}/week`}
                </Typography>
              </Grid>
            </>
          ) : (
            <Typography variant="body1" className={classes.noCostInfo}>
              Sorry, we currently don&apos;t have any cost info
            </Typography>
          )}
        </Grid>
      )}
      <a className={classes.link} href={link}>
        <Button color="primary" variant="contained" size="large" className={classes.findButton}>
          Find {careType.toLowerCase()}
        </Button>
      </a>
    </Card>
  );
};

export default SavingCard;
