import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

type BlueWrapperIconProps = {
  icon: React.ReactElement;
  className?: string;
  width?: number;
  height?: number;
  iconColor?: string;
  iconSize?: string;
};

const useStyles = ({ width, height }: { width: number; height: number }) => {
  return makeStyles((theme) => ({
    iconContainer: {
      backgroundColor: theme?.palette?.care?.navy[800],
      borderRadius: '50%',
      width,
      height,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxSizing: 'border-box',
      marginBottom: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        marginBottom: theme.spacing(3),
      },
    },
  }))();
};

const BlueWrapperIcon = ({
  className,
  icon,
  width = 64,
  height = 64,
  iconColor,
  iconSize,
}: BlueWrapperIconProps) => {
  const classes = useStyles({ width, height });

  return (
    <div className={clsx(classes.iconContainer, className)} data-testid="blue-icon-wrapper">
      {React.cloneElement(icon, { color: iconColor, size: iconSize })}
    </div>
  );
};

BlueWrapperIcon.defaultProps = {
  className: '',
  width: 64,
  height: 64,
  iconColor: '#fff',
  iconSize: '39px',
};

export default BlueWrapperIcon;
