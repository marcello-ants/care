import { theme } from '@care/material-ui-theme';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  container: {
    color: theme.palette.care?.grey[600],
    fontSize: `${theme.spacing(1.5)}px`,
    lineHeight: `${theme.spacing(2)}px`,
    '& p': {
      margin: theme.spacing(0.5, 0),
    },
  },
  list: {
    paddingLeft: theme.spacing(2),
    marginTop: theme.spacing(0.5),
    '& li': {
      paddingLeft: theme.spacing(0.5),
    },
    '& li::marker': {
      fontSize: `${theme.spacing(1)}px`,
    },
  },
}));

const PasswordRequirements = () => {
  const classes = useStyles();

  return (
    <Box className={classes.container} mt={1}>
      <p>At least 8 characters in length</p>
      <p>No more than 2 repeated characters in a row</p>
      <p>At least 1 of each of the following:</p>

      <ul className={classes.list}>
        <li>Lowercase letters (a-z)</li>
        <li>Uppercase letters (A-Z)</li>
        <li>Numbers (0-9)</li>
        <li>Special characters (!@#$%^&*)</li>
      </ul>
    </Box>
  );
};

export default PasswordRequirements;
