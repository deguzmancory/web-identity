import { Accept } from 'react-dropzone';

export const MFA_TYPE = {
  NOMFA: 'NOMFA',
  TOTP: 'TOTP',
  SMS: 'SMS',
};

export const DEBOUNCE_NORMAL = 400;
export const US_ID = 233;
export const USER_ROLE = 'USER';

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
  PRIMARY: '#0361D0',
  SECONDARY: '#0060a8',
  SUCCESS: '#219653',
  WARNING: '#ca9d00',
  DANGER: '#e00016',
  WHITE: '#fff',
  BACKGROUND: '#f7f8fa',
  INFO: '#428BE1',
  DISABLED: '#91979E',
  GRAY_900: '#1B1C1E',
  GRAY_500: '#91979E',
  GRAY_400: '#B5BDC5',
  GRAY_600: '#6D7176 ',
  GRAY_200: '#DEE1E5',
};

export enum BOOLEAN {
  true = 'true',
  false = 'false',
}
