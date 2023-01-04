import { createTheme } from '@mui/material/styles';
import { COLOR_CODE } from './constants';
const defaultTheme = createTheme();

const { breakpoints } = defaultTheme;

const configTheme = createTheme({
  palette: {
    primary: {
      main: COLOR_CODE.PRIMARY,
      dark: COLOR_CODE.PRIMARY_DARK,
      light: COLOR_CODE.PRIMARY_LIGHT,
    },
    secondary: {
      main: COLOR_CODE.PRIMARY,
    },
    grey: {
      '50': COLOR_CODE.GREY_50,
      '100': COLOR_CODE.GREY_100,
      '200': COLOR_CODE.GREY_200,
      '300': COLOR_CODE.GREY_300,
      '400': COLOR_CODE.GREY_400,
      '500': COLOR_CODE.GREY_500,
      '600': COLOR_CODE.GREY_600,
      '700': COLOR_CODE.GREY_700,
      '800': COLOR_CODE.GREY_800,
      '900': COLOR_CODE.GREY_900,
    },
    success: {
      main: COLOR_CODE.SUCCESS,
    },
    warning: {
      main: COLOR_CODE.WARNING,
    },
    error: {
      main: COLOR_CODE.DANGER,
    },
    info: {
      main: COLOR_CODE.INFO,
    },
    text: {
      primary: COLOR_CODE.PRIMARY,
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
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: 32,
          fontWeight: 'bold',
          [breakpoints.down('md')]: {
            fontSize: 32,
          },
        },
        h2: {
          fontSize: 26,
          fontWeight: 'bold',
          [breakpoints.down('md')]: {
            fontSize: 26,
          },
        },
        h3: {
          fontSize: 20,
          fontWeight: 'bold',
          [breakpoints.down('md')]: {
            fontSize: 20,
          },
        },
        h4: {
          fontSize: 18,
          fontWeight: 'bold',
          [breakpoints.down('md')]: {
            fontSize: 18,
          },
        },
        h5: {
          fontSize: 16,
          fontWeight: 'bold',

          [breakpoints.down('md')]: {
            fontSize: 16,
          },
        },
        body1: {
          fontSize: 16,
          [breakpoints.down('md')]: {
            fontSize: 16,
          },
        },
        body2: {
          fontSize: 14,
          [breakpoints.down('md')]: {
            fontSize: 14,
          },
        },
        subtitle1: {
          // type: small in Figma
          fontSize: 12,
          [breakpoints.down('md')]: {
            fontSize: 12,
          },
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
    },
  },
});

// export const theme = responsiveFontSizes(configTheme);
export const theme = configTheme;
