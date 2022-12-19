import React, { useEffect } from 'react';
import { Card, Typography } from '@care/react-component-lib';
import { Icon24UtilityCheckmarkLarge } from '@care/react-icons';
import { useTheme, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useAppDispatch } from './AppState';
import useNearbyCaregivers from './hooks/useNearbyCaregivers';

const useStyles = makeStyles((theme) => ({
  message: {
    padding: theme.spacing(3, 2),
    display: 'flex',
    alignItems: 'center',
    height: theme.spacing(8),
  },
  messageContainer: {
    // added ? in order for test to pass
    backgroundColor: theme.palette.care?.blue[100],
    marginBottom: theme.spacing(4),
    borderRadius: theme.spacing(1),
  },
  invisibleMessageContainer: {
    // margin and border matching messageContainer
    marginBottom: theme.spacing(4),
    borderRadius: theme.spacing(1),
    display: 'none',
  },
  messageIcon: {
    marginRight: theme.spacing(2),
  },
  messageText: {
    // added ? in order for test to pass
    color: theme.palette.care?.blue[700],
  },
}));

type CaregiversNearbyProps = {
  zip: string;
};

export default function CaregiversNearby(props: CaregiversNearbyProps) {
  const dispatch = useAppDispatch();
  const { zip } = props;
  const { displayCaregiverMessage, numCaregivers, currentSearchRadius } = useNearbyCaregivers(zip);
  const classes = useStyles();
  const theme = useTheme();

  useEffect(() => {
    if (displayCaregiverMessage) {
      dispatch({
        type: 'setCaregiversNearbySearchRadius',
        caregiversNearbySearchRadius: currentSearchRadius,
      });
    }
  }, [displayCaregiverMessage]);

  return (
    <Card
      careVariant="contrast"
      className={
        displayCaregiverMessage ? classes.messageContainer : classes.invisibleMessageContainer
      }>
      <CardContent className={classes.message}>
        <Icon24UtilityCheckmarkLarge
          size="20px"
          color={theme.palette.care?.blue[700]}
          className={classes.messageIcon}
        />
        <Typography variant="h4" className={classes.messageText}>
          We found {numCaregivers.toString()} caregivers near you!
        </Typography>
      </CardContent>
    </Card>
  );
}
