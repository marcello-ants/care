import React from 'react';
import { Typography, Tag } from '@care/react-component-lib';
import { Button, makeStyles } from '@material-ui/core';
import { SeniorLivingOptions } from '@/types/seeker';

interface OptionCardProps {
  image: React.ReactElement;
  title: string;
  text: string;
  type: SeniorLivingOptions;
  recommended?: boolean;
  flag?: boolean;
  handleContinue: (type: SeniorLivingOptions) => void;
}

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    paddingTop: theme.spacing(3),
  },
  titleSpacing: {
    marginBottom: theme.spacing(1),
  },
  marginLeftTag: {
    marginLeft: theme.spacing(2),
  },
  textSpacing: {
    marginBottom: theme.spacing(2),
  },
  buttonStyles: {
    marginBottom: theme.spacing(4),
    width: 'auto',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: theme.palette.grey[300],
  },
}));

const OptionCard = ({
  image,
  title,
  text,
  type,
  recommended,
  flag,
  handleContinue,
}: OptionCardProps) => {
  const classes = useStyles();
  return (
    <div className={classes.cardContainer}>
      <div>{image}</div>
      <div className={classes.titleSpacing}>
        <Typography variant="h4">
          {title}
          {recommended && (
            <Tag careColor="positive" className={classes.marginLeftTag}>
              Our recommendation
            </Tag>
          )}
        </Typography>
      </div>
      <Typography careVariant="body3" className={classes.textSpacing}>
        {text}
      </Typography>
      <Button
        color="secondary"
        variant="contained"
        className={classes.buttonStyles}
        onClick={() => handleContinue(type)}>
        {type === SeniorLivingOptions.NURSING_HOME && !flag
          ? 'Find caregivers'
          : 'This sounds right to me'}
      </Button>
      <div className={classes.separator} />
    </div>
  );
};

OptionCard.defaultProps = {
  recommended: false,
  flag: false,
};

export default OptionCard;
