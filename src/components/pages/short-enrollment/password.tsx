import { makeStyles } from '@material-ui/core';
import { CoreGlobalFooter } from '@care/navigation';

import FullWidthLayout from '@/components/layouts/FullWidthLayout';
import Password from '@/components/Password';
import { useAppState } from '@/components/AppState';
import ShortEnrollmentHeader from '@/components/features/ShortEnrollmentHeader/ShortEnrollmentHeader';
import { useTealiumTrackingOnPasswordScreen } from '@/components/hooks/useTealiumTrackingOnPasswordScreen';
import { VerticalsAbbreviation, VERTICALS_NAMES_TO_ABBREVIATION } from '@/constants';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(4)}px`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    [theme.breakpoints.up('md')]: {
      paddingTop: 0,
      justifyContent: 'center',
    },
  },
}));

const ShortEnrollmentPassword = () => {
  const classes = useStyles();
  const appState = useAppState();

  let vertical;
  const { vertical: verticalFromState } = appState.seeker;

  if (verticalFromState) {
    vertical = VERTICALS_NAMES_TO_ABBREVIATION[verticalFromState] as VerticalsAbbreviation;
  }

  useTealiumTrackingOnPasswordScreen(vertical);

  return (
    <div className={classes.root}>
      <Password vertical={vertical as VerticalsAbbreviation} isShortEnrollment />
    </div>
  );
};

ShortEnrollmentPassword.Layout = FullWidthLayout;
ShortEnrollmentPassword.Header = <ShortEnrollmentHeader showButtons={false} />;
ShortEnrollmentPassword.Footer = <CoreGlobalFooter minimal />;

export default ShortEnrollmentPassword;
