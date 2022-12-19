import { Button, makeStyles, Typography, useTheme } from '@material-ui/core';

import { Modal } from '@care/react-component-lib';
import { Icon24InfoTips } from '@care/react-icons';

import { useState } from 'react';
import { VerticalsAbbreviation } from '@/constants';

const useStyles = makeStyles((theme) => ({
  tipsButton: {
    marginLeft: theme.spacing(0.8),
    fontSize: '16px',
    color: theme.palette.care?.blue[700],
  },
  tipsContainer: {
    marginTop: theme.spacing(3),
    display: 'flex',
  },
  tipList: {
    margin: '0px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
  },
}));

const TITLES: { [key: string]: string } = {
  CC: 'Tell caregivers more about your:',
  PC: 'Tell pet caregivers more about your:',
  TU: 'Tell tutors more about your:',
};

const TIPS: { [key: string]: string[] } = {
  CC: ['Schedule', 'Current care situation', 'Additional needs for you loved one(s)'],
  PC: ['Schedule', 'Current pet care situation', 'Additional needs for your pet(s)'],
  TU: ['Schedule', 'Current tutoring situation', 'Additional tutoring needs'],
};

interface NeedSomeTipsBannerProps {
  verticalName: VerticalsAbbreviation;
}

const NeedSomeTipsBanner = ({ verticalName }: NeedSomeTipsBannerProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const [showPopup, setShowPopup] = useState<boolean>(false);

  return (
    <>
      <div className={classes.tipsContainer}>
        <Icon24InfoTips color={theme.palette.care?.yellow[600]} />
        <Typography className={classes.tipsButton} onClick={() => setShowPopup(true)}>
          Need some tips?
        </Typography>
      </div>
      <Modal
        title={TITLES[verticalName]}
        open={showPopup}
        variant="default"
        ButtonPrimary={
          <Button variant="contained" color="secondary" onClick={() => setShowPopup(false)}>
            Got it
          </Button>
        }
        onClose={() => setShowPopup(false)}>
        <div>
          <ul className={classes.tipList}>
            {TIPS[verticalName].map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      </Modal>
    </>
  );
};

export default NeedSomeTipsBanner;
