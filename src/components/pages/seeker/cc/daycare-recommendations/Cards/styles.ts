import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  daycare: {
    borderColor: theme.palette.care?.grey[300],
    borderRadius: theme.spacing(1),
    borderWidth: '1px',
    borderStyle: 'solid',
    position: 'relative',
  },
  daycareMainImage: {
    width: '100%',
    height: '104px',
    objectFit: 'contain',
    [theme.breakpoints.up('md')]: {
      height: '100%',
    },
  },
  daycareIconImage: {
    display: 'flex',
    justifyContent: 'center',
  },
  daycareIconImageContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  daycareInfo: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  daycareAddressContainer: {
    display: 'inline-block',
    width: '75%',
  },
  imageLink: {
    cursor: 'pointer',
  },
  imageLinkExperiment: {
    display: 'flex',
    height: '100%',
    cursor: 'pointer',
  },
  imageLinkBackground: {
    display: 'flex',
    width: '100%',
    height: '104px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: `${theme.spacing(1)}px ${theme.spacing(1)}px 0px 0px`,
    [theme.breakpoints.up('md')]: {
      height: '100%',
      borderRadius: `${theme.spacing(1)}px 0px 0px ${theme.spacing(1)}px`,
    },
  },
  address: {
    cursor: 'pointer',
  },
  daycareName: {
    cursor: 'pointer',
    fontWeight: 'bold',
    width: '80%',
  },
  daycareCheckBox: {
    paddingTop: theme.spacing(1),
    textAlign: 'right',
    verticalAlign: 'center',
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(0, 0, 1.5, 0),
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
  },
}));

export default useStyles;
