// External Dependencies
import React from 'react';
import { makeStyles } from '@material-ui/core';

// Internal Dependencies
import { icons } from './images';

// Types + Interfaces
interface IProps {
  photoIndex: number;
  isDesktopOrUp?: boolean;
}

const useStyles = makeStyles(() => ({
  iconImage: {
    width: '72px',
  },
  iconImageMobile: {
    position: 'absolute',
    right: '20px',
    bottom: '20px',
  },
}));

const CardImage = ({ photoIndex, isDesktopOrUp }: IProps) => {
  const classes = useStyles();
  const clipArtThumbnail = icons[photoIndex];

  return (
    <img
      src={clipArtThumbnail}
      className={
        isDesktopOrUp ? `${classes.iconImage}` : `${classes.iconImage} ${classes.iconImageMobile}`
      }
      alt="Daycare profile"
    />
  );
};

CardImage.defaultProps = {
  isDesktopOrUp: false,
};

export default CardImage;
