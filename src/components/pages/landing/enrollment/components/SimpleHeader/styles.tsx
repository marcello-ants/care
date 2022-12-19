import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  headerContent: {
    width: '100%',
    display: 'flex',
    maxWidth: '1376px',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& > div': {
      display: 'flex',
      alignItems: 'center',
    },
    '& > div:first-child': {
      flex: '1',
    },
  },
  header: {
    background: theme?.palette?.care?.white,
    display: 'flex',
    justifyContent: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      padding: `${theme.spacing(3.25)}px ${theme.spacing(4)}px`,
    },
  },
  loginLink: {
    width: '130px',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
    },
  },
  loginDesktop: {
    display: 'flex',
    alignItems: 'baseline',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  loginMobile: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
}));

export default useStyles;
