import React from 'react';
import { Button, makeStyles, Link } from '@material-ui/core';
import CareComButtonContainer from '@/components/CareComButtonContainer';

const useStyles = makeStyles((theme) => ({
  linkStyles: {
    color: theme.palette.grey[600],
    paddingTop: '4px',
  },
  linkContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

interface BottomButtonsProps {
  buttonText?: string;
  linkText?: string;
  handleContinue: () => void;
  handleOptionComparison: (event: any) => void;
}

const BottomButtons = ({
  buttonText,
  linkText,
  handleContinue,
  handleOptionComparison,
}: BottomButtonsProps) => {
  const classes = useStyles();

  return (
    <>
      <CareComButtonContainer mt={4} mb={2}>
        <Button color="primary" variant="contained" size="large" fullWidth onClick={handleContinue}>
          {buttonText}
        </Button>
      </CareComButtonContainer>
      <div className={classes.linkContainer}>
        <Link
          component="button"
          variant="subtitle1"
          className={classes.linkStyles}
          onClick={handleOptionComparison}>
          {linkText}
        </Link>
      </div>
    </>
  );
};

BottomButtons.defaultProps = {
  buttonText: 'Yes, continue',
  linkText: "This doesn't look right",
};

export default BottomButtons;
