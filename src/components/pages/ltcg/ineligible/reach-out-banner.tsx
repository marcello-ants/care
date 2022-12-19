import React from 'react';
import { Typography, useTheme, makeStyles } from '@material-ui/core';
import { Banner, Link } from '@care/react-component-lib';
import { Icon24InfoPhone } from '@care/react-icons';

const useStyles = makeStyles({
  spacingTop: {
    marginTop: 20,
  },
  displayFlex: {
    display: 'flex',
  },
  oneSpace: {
    marginLeft: 5,
  },
});

const ReachOutBanner = ({
  bannerText,
  phoneNumber,
}: {
  bannerText: string;
  phoneNumber: string;
}) => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <div className={classes.spacingTop}>
      <Banner
        fullWidth
        roundCorners
        icon={<Icon24InfoPhone color={theme.palette.care?.blue[700]} />}>
        <Typography variant="h3">{bannerText}</Typography>
        <div className={classes.displayFlex}>
          <Typography variant="body2">Call</Typography>
          <Link href={`tel:${phoneNumber}`} careVariant="link2" className={classes.oneSpace}>
            {phoneNumber}
          </Link>
        </div>
      </Banner>
    </div>
  );
};

export default ReachOutBanner;
