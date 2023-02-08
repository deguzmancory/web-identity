import apisauce from 'apisauce';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import appConfig from 'src/appConfig';
import { ProfilePayload } from 'src/queries';
import { GetPresignedPayload, UploadFilePayload } from 'src/queries/File/types';
import {
  ChangePasswordPayload,
  CompleteNewPasswordPayload,
  ConfirmPasswordPayload,
  ConfirmSignInPayload,
  ConfirmSignUpPayload,
  EmployerSignUpPayload,
  ForgotPasswordPayload,
  ResendSignUpPayload,
  SignInPayload,
  SignUpPayload,
  SubmitForgotPasswordPayload,
} from 'src/queries/UAM/types';
import { UpdateUserLastPasswordChangedParams } from 'src/queries/Users/types';
import { handleShowErrorMsg, newCancelToken, stringify } from 'src/utils';
import { TokenService, XApiKeyService } from '.';

axios.defaults.withCredentials = true;

const create = (baseURL = appConfig.API_URL) => {
  //
  // Create and configure an apisauce-based api object.
  //

  const api = apisauce.create({
    baseURL,
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: 0,
      Accept: 'application/json',
    },
    timeout: appConfig.CONNECTION_TIMEOUT,
  });

  api.axiosInstance.interceptors.request.use((config) => {
    return TokenService.getToken()
      .then((token) => {
        config.headers.Authorization = 'Bearer ' + token;
        return Promise.resolve(config);
      })
      .catch(() => {
        return Promise.resolve(config);
      });
  });
  const getRoot = () => api.get('');

  // ====================== Auth ======================
  const signIn = (body: SignInPayload) => Auth.signIn(body.username, body.password);
  const signUp = (body: SignUpPayload) => {
    const params = {
      username: body.username,
      password: body.password,
    };

    const attributes = {
      email: body.email,
      given_name: body.firstName,
      family_name: body.lastName,
      middle_name: body.middleName,
      birthdate: body.dateOfBirth,
      'custom:ssn': body.socialSecurityNumber,
      'custom:user_type': 'CLAIMANT',
    };

    return Auth.signUp({ ...params, attributes });
  };

  const employerSignUp = (body: EmployerSignUpPayload) => {
    const params = {
      username: body.username,
      password: body.password,
    };

    const attributes = {
      email: body.email,
      given_name: body.firstName,
      family_name: body.lastName,
      middle_name: body.middleName,
      phone_number: body.phoneNumber,
      'custom:fein': body.federalEmployerIdentificationNumber,
      'custom:title': body.title,
      'custom:online_business_id': body.onlineBusinessId,
      'custom:employer_type': body.employerType,
      'custom:user_type': 'EMPLOYER',
    };

    return Auth.signUp({ ...params, attributes });
  };

  const resendSignUp = (body: ResendSignUpPayload) => Auth.resendSignUp(body.username);

  const confirmSignUp = (body: ConfirmSignUpPayload) =>
    Auth.confirmSignUp(body.username, body.code);

  const signOut = () => Auth.signOut();

  const forgotPassword = (body: ForgotPasswordPayload) => Auth.forgotPassword(body.username);

  const submitForgotPassword = (body: SubmitForgotPasswordPayload) =>
    Auth.forgotPasswordSubmit(body.username, body.token, body.password);

  const changePassword = async (body: ChangePasswordPayload) => {
    return await Auth.currentAuthenticatedUser()
      .then((user) => {
        return Auth.changePassword(user, body.currentPassword, body.newPassword);
      })
      .catch((error) => handleShowErrorMsg(error));
  };

  const confirmSignIn = (body: ConfirmSignInPayload) => {
    return Auth.sendCustomChallengeAnswer(body.user, body.code);
  };

  const confirmPassword = (body: ConfirmPasswordPayload) => {
    return api.post(`/account-svc/v1/users/confirm-password`, body, newCancelToken());
  };

  const completeNewPassword = (body: CompleteNewPasswordPayload) =>
    Auth.completeNewPassword(body.user, body.password, body.requiredAttributes);

  // ====================== Profile ======================
  const getUserId = (params: { username: string }) => {
    const username = { username: params.username };
    const queryString = stringify(username);
    return api.get(`/account-svc/v1/users/user-id?${queryString}`, {}, newCancelToken());
  };

  // ====================== Claimant Profile ======================
  const getMyProfile = () => api.get('/account-svc/v1/me', {}, newCancelToken());

  const updateUserAvatar = (body: { avatarUrl: string }) =>
    api.patch(`/me/avatar`, body, newCancelToken());

  const updateMyProfile = (body: ProfilePayload) =>
    api.put(`/account-svc/v1/claimant/me`, body, newCancelToken());

  // ====================== Content ======================
  // const getContent = () => api.get('/content', {}, newCancelToken());
  const getContents = () => api.get('/account-svc/v1/contents', {}, newCancelToken());

  // ====================== File ======================
  const getPresignedUserServiceUrl = (params: GetPresignedPayload) => {
    return api.get('/file-svc/v1/presigned-upload-url', params, newCancelToken());
  };
  const uploadFile = (body: UploadFilePayload) => axios.put(body.url, body.fileData);

  const getDecodeUserServiceUrl = (params: { filePath: string }) =>
    api.get('/file-svc/v1/presigned-download-url', params, newCancelToken());

  const uploadFileWithProgress = (body: UploadFilePayload) =>
    axios.put(body.url, body.fileData, {
      onUploadProgress: (progress) => {
        const { loaded, total } = progress;
        const percentageProgress = Math.floor((loaded / total) * 100);
        body.setProgress(percentageProgress);
      },
    });

  // ====================== System Accounts ======================
  const searchUserAccounts = (params: { search: string }) => {
    const queryString = stringify(params);
    return api.get(`/users/search?${queryString}`, {}, newCancelToken());
  };
  const searchUserAccountsAxios = (params: { search: string; skip: number; take: number }) => {
    const queryString = stringify(params);
    return api.get(`${appConfig.API_URL}/users/search?${queryString}`, {}, newCancelToken());
  };
  const searchUserAccountsByOrderAxios = (params: {
    search: string;
    skip: number;
    take: number;
    order: string;
  }) => {
    const queryString = stringify(params);
    return api.get(`${appConfig.API_URL}/users/search?${queryString}`, {}, newCancelToken());
  };

  const updateUserLastPasswordChanged = (payload: UpdateUserLastPasswordChangedParams) => {
    const url = `/account-svc/v1/users/pass/${payload.username}`;
    const localXApiKey = XApiKeyService.getApiKey();

    const options = {
      headers: {
        ...(localXApiKey && {
          'X-API-KEY': localXApiKey,
        }),
      },
    };
    return api.put(url, undefined, options);
  };

  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  //
  // Notice we're not returning back the `api` created in step 1. That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    getRoot,
    // ====================== Auth ======================
    // getPermission,
    confirmSignIn,
    signIn,
    signUp,
    employerSignUp,
    resendSignUp,
    confirmSignUp,
    signOut,
    forgotPassword,
    submitForgotPassword,
    changePassword,
    // setPreferredMfa,
    completeNewPassword,

    // ====================== File ======================
    getPresignedUserServiceUrl,
    uploadFile,
    uploadFileWithProgress,
    getDecodeUserServiceUrl,

    // ====================== Content ======================
    getContents,

    // ====================== Users ======================
    getUserId,
    updateUserLastPasswordChanged,

    // ====================== Profile ======================
    getMyProfile,
    // updateMyProfile,
    updateUserAvatar,
    updateMyProfile,
    confirmPassword,

    // ====================== System Accounts ======================
    searchUserAccounts,
    searchUserAccountsAxios,
    searchUserAccountsByOrderAxios,
  };
};

export type Apis = ReturnType<typeof create>;

export default {
  create,
};
