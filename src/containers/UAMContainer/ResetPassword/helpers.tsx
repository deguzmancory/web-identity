import { Yup } from 'src/services';

export type ResetPasswordFormValue = {
  password: string;
  confirmPassword: string;
  code?: string;
};

export enum RESET_PASSWORD_KEY {
  PASSWORD = 'password', //pragma: allowlist secret
  CONFIRM_PASSWORD = 'confirmPassword', //pragma: allowlist secret
  USERNAME = 'username',
  TOKEN = 'token',
}

export const initialResetPasswordFormValue: ResetPasswordFormValue = {
  password: '',
  confirmPassword: '',
  code: '',
};

export const resetPasswordFormSchema = Yup.object().shape({
  password: Yup.string().required().password(),
  confirmPassword: Yup.string().required(),
});
