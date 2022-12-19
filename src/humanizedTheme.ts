// @ts-nocheck

import { theme } from '@care/material-ui-theme';
import { createTheme } from '@material-ui/core';

const themeCopy = {
  ...theme,
  overrides: {
    ...theme.overrides,

    MuiCssBaseline: {
      '@global': {
        body: {
          background: theme.palette.care.latte[50],
          backgroundColor: theme.palette.care.latte[50],
        },
      },
    },
  },
};

export default createTheme(themeCopy);
