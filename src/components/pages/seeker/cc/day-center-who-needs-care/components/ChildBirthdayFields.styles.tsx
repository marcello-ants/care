// External Dependencies
import { makeStyles } from '@material-ui/core';
import { theme } from '@care/material-ui-theme';

const useStyles = makeStyles({
  childContainer: {
    padding: theme.spacing(0),
  },
  childContainerNth: {
    marginTop: theme.spacing(4),
    position: 'relative',
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  error: {
    color: theme.palette.care.red[800],
    paddingLeft: theme.spacing(1),
  },
  selectContainer: {
    marginTop: theme.spacing(1),
  },
  monthSelect: {
    marginRight: theme.spacing(0.5),
    '& label': {
      paddingLeft: theme.spacing(1),
    },
  },
  yearSelect: {
    marginLeft: theme.spacing(0.5),
    '& label': {
      paddingLeft: theme.spacing(1),
    },
  },
  removeChildButton: {
    position: 'absolute',
    top: '0',
    right: '0',
    width: 'auto',
    height: 'auto',
    lineHeight: 'unset',
    minWidth: 'auto',
    padding: theme.spacing(0),
    color: theme.palette.care.blue[700],
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
});

export default useStyles;
