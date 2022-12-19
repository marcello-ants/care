import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  sectionTitle: {
    color: theme?.palette?.care?.grey[700],
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  sectionTitleDisclaimer: {
    display: 'inline',
    marginLeft: theme.spacing(1),
  },
  inputContainer: {
    '& > div': {
      padding: 0,
    },
  },
  inputsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    '& > div': {
      padding: 0,
    },
  },
  submitButton: {
    display: 'block',
    margin: '0 auto',
    maxWidth: '410px',
    width: '100%',
  },
  companyInquiries: {
    color: theme?.palette?.care?.grey[700],
    marginTop: theme.spacing(4),
    textAlign: 'center',
    '& > a': {
      textDecoration: 'none',
      color: theme?.palette?.care?.blue[700],
    },
  },
}));

export default useStyles;
