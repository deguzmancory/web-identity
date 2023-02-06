import { Yup } from 'src/services';

export type WelcomeFormValue = {
  password: string;
  confirmPassword: string;
};

export enum WELCOME_KEY {
  PASSWORD = 'password', //pragma: allowlist secret
  CONFIRM_PASSWORD = 'confirmPassword', //pragma: allowlist secret
  USERNAME = 'username',
  TOKEN = 'token',
}

export const initialWelcomeFormValue: WelcomeFormValue = {
  password: '',
  confirmPassword: '',
};

export const welcomeFormSchema = Yup.object().shape({
  password: Yup.string().password().required(),
  confirmPassword: Yup.string().required(),
});
