import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRootState } from '../store';

export interface IAuthState {
  isAuthenticated?: boolean;
  user: {
    firstName: string;
    lastName: string;
    email?: string;
    userType?: string;
  };
  duo: {
    sigRequest: string;
    user: any;
  };
  isPasswordVerify: boolean;
  isWelcomeScreen: boolean;
}

const initialState: IAuthState = {
  isAuthenticated: null,
  user: {
    firstName: 'Tue',
    lastName: 'Truong',
  },
  duo: {
    sigRequest: null,
    user: null,
  },
  isPasswordVerify: false,
  isWelcomeScreen: false,
};

const userSelector = (state: IRootState) => state.auth.user;

export const userNameSelector = createSelector(
  userSelector,
  (user) => `${user.firstName} ${user.lastName}`
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setPasswordVerify: (state, action: PayloadAction<boolean>) => {
      state.isPasswordVerify = action.payload;
    },
    setIsWelcomeScreen: (state, action: PayloadAction<boolean>) => {
      state.isWelcomeScreen = action.payload;
    },
    setUserName: (
      state,
      action: PayloadAction<{
        firstName: string;
        lastName: string;
        email?: string;
        userType?: string;
      }>
    ) => {
      state.user = action.payload;
    },
    setDuoSigRequest: (
      state,
      action: PayloadAction<{
        sigRequest: string;
        user: any;
      }>
    ) => {
      state.duo = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setAuthenticated,
  setUserName,
  setPasswordVerify,
  setIsWelcomeScreen,
  setDuoSigRequest,
} = authSlice.actions;

export const authState = authSlice.getInitialState();

export default authSlice.reducer;
