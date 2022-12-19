// External Dependencies
import { Box } from '@material-ui/core';
import { Icon24UtilityWarning } from '@care/react-icons';
import { Typography } from '@care/react-component-lib';

// Styles
import useStyles from './styles';

function ProviderError() {
  // Styles
  const classes = useStyles();

  return (
    <Box className={classes.errorBanner}>
      <Box>
        <Icon24UtilityWarning color="#CF230C" />
      </Box>
      <Box>
        <Typography variant="h4">Whoops! Something went wrong</Typography>
        <Typography careVariant="body3">
          There was an error when we tried to submit your request. Please try again.
        </Typography>
      </Box>
    </Box>
  );
}

export default ProviderError;
