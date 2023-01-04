import { Accept } from 'react-dropzone';

export const ONE_HOUR = 60 * 60 * 1000;

export const COMMON_TYPE: Accept = {
  'image/png': ['.png'],
  'image/jpg': ['.jpg'],
  'image/jpeg': ['.jpeg'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
};

export const muiResponsive = {
  MOBILE: '(max-width:600px)',
  TABLET: '(max-width:960px)',
  LARGE_SCREEN: '(max-width:1200px)',
  EXTRA_LARGE_SCREEN: '(max-width:1440px)',
};

export const COLOR_CODE = {
  PRIMARY: '#2F302F',
  PRIMARY_DARK: '#09170d', // primary 900
  PRIMARY_LIGHT: '#bec0be', // primary 300
  SECONDARY: '#0088CC',
  SUCCESS: '#2D934E',
  WARNING: '#E87839',
  DANGER: '#DB0012',
  WHITE: '#fff',
  BACKGROUND: '#f7f8fa',
  INFO: '#0088CC',
  DISABLED: '#91979E',
  GREY_900: '#333333',
  GREY_800: '#2d2f31',
  GREY_700: '#484c4f',
  GREY_600: '#6d7176',
  GREY_500: '#91979e',
  GREY_400: '#b5bdc5',
  GREY_300: '#cfd4d9',
  GREY_200: '#dee1e5',
  GREY_100: '#edeff1',
  GREY_50: '#f8f8f9',
  GREY_00: '#ffffff',
};

export enum BOOLEAN {
  true = 'true',
  false = 'false',
}
