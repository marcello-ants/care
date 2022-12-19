import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  signUpMainContainer: {
    background: theme?.palette?.care?.white,
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(5),
    paddingLeft: theme.spacing(3),
    borderRadius: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(5),
      paddingRight: theme.spacing(8),
      paddingBottom: theme.spacing(5),
      paddingLeft: theme.spacing(8),
    },
    '& > img': {
      position: 'absolute',
      right: theme.spacing(-6.5),
      top: theme.spacing(-17.5),
      width: '256px',
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
      [theme.breakpoints.up('md')]: {
        display: 'block',
        position: 'absolute',
        width: '430px',
        right: theme.spacing(-33.75),
        top: theme.spacing(-12.5),
        zIndex: '-1',
      },
    },
  },
  mainHeaderDesktop: {
    marginBottom: theme.spacing(1),
    color: theme?.palette?.care?.navy[800],
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  mainHeaderMobile: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
    color: theme?.palette?.care?.black,
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  mainSubtitleDesktop: {
    marginBottom: theme.spacing(6),
    color: theme?.palette?.care?.grey[700],
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  mainSubtitleMobile: {
    color: theme?.palette?.care?.grey[700],
    marginBottom: theme.spacing(6),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
}));

export default useStyles;
