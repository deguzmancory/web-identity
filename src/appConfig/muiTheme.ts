import { createTheme } from '@mui/material/styles';
import { COLOR_CODE } from './constants';

export const theme = createTheme({
  palette: {
    primary: {
      main: COLOR_CODE.PRIMARY,
    },
    secondary: {
      main: COLOR_CODE.PRIMARY,
    },
  },
  typography: {
    fontFamily: ['Arial'].join(','),
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#484C4F',
          fontSize: 14,
          padding: '8px 12px',
        },
      },
    },
  },
});
