import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const ProgressWithStyles = withStyles((theme) => ({
  root: {
    height: 3,
    borderRadius: 5,
    marginBottom: -3,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: theme.palette.care?.navy[600],
  },
}))(LinearProgress);

interface ProgressBarProps {
  stepNumber: number;
  totalSteps: number;
}

const ProgressBar = ({ stepNumber, totalSteps }: ProgressBarProps) => {
  return <ProgressWithStyles value={(stepNumber / totalSteps) * 100} variant="determinate" />;
};

export default React.memo(ProgressBar);
