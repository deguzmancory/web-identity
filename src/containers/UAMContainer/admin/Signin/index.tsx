/* eslint-disable react-hooks/exhaustive-deps */
import { Formik, FormikProps } from 'formik';
import { History } from 'history';
import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { PATHS } from 'src/appConfig/paths';
import { Button, Form, Grid, Input, InputPassword, View } from 'src/components/common';
import { SignInPayload, useLogin, useProfile, useResendSignUp } from 'src/queries';
import { useUserId } from 'src/queries/UAM/useUserId';
import { hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { IRootState } from 'src/redux/rootReducer';
import { ErrorService, Navigator, Yup } from 'src/services';
import { Tenants } from 'src/services/tenantService';
import { UAMBody } from '../../common';
import EmailConfirmationModal from '../../common/EmailConfirmationModal';
import MFAConfirmationModal from '../../common/MFAConfirmationModal';
import './styles.scss';
type FormValue = {
  email: string;
  password: string;
};

const INTIAL: FormValue = { email: '', password: '' };

const Signin: React.FC<Props> = ({ onShowDialog, onHideDialog }) => {
  const formRef = useRef<FormikProps<FormValue>>(null);

  const { login, isSigning } = useLogin({
    onSuccess(data, variables, context) {
      if (data.challengeName === 'CUSTOM_CHALLENGE')
        onShowDialog({
          type: DIALOG_TYPES.CONTENT_DIALOG,
          data: {
            content: <MFAConfirmationModal user={data} signInPayload={variables} />,
            hideTitle: true,
          },
        });
    },
    onError(error, variables, context) {
      handleError(error, variables);
    },
  });

  const { getUserId, isGettingUserId } = useUserId({
    onSuccess(data, variables, context) {
      login({ username: data.data.userId, password: variables.password });
    },
    onError(error, variables, context) {
      formRef.current.setErrors({
        email: '  ',
        password: ErrorService.MESSAGES.incorrectCredentials,
      });
    },
  });

  const { loading } = useProfile();

  const { resendSignUp } = useResendSignUp();

  const handleLogin = (values: FormValue) => {
    const { email, password } = values;

    login({ username: `${Tenants.ADMIN}|${email}`, password });
  };

  const handleConfirmSuccess = (payload: SignInPayload) => {
    onHideDialog();
    login(payload);
  };

  const handleError = (error: AuthError, variables: SignInPayload) => {
    switch (error.code) {
      case ErrorService.TYPES.NotAuthorizedException:
        // if (isIdle)
        return getUserId(variables);

      // return formRef.current.setErrors({
      //   email: ErrorService.MESSAGES.incorrectAccount,
      //   password: ErrorService.MESSAGES.incorrectAccount,
      // });

      case ErrorService.TYPES.UserNotFoundException:
        return formRef.current.setErrors({ email: ErrorService.MESSAGES.accountNotExist });

      case ErrorService.TYPES.UserNotConfirmedException:
        resendSignUp(
          { username: variables.username },
          {
            onSuccess(data) {
              onShowDialog({
                type: DIALOG_TYPES.CONTENT_DIALOG,
                data: {
                  content: (
                    <EmailConfirmationModal
                      username={variables.username}
                      onConfirmSuccess={() =>
                        handleConfirmSuccess({
                          username: variables.username,
                          password: variables.password,
                        })
                      }
                    />
                  ),
                  hideTitle: true,
                },
              });
            },
          }
        );
        return;
      case ErrorService.TYPES.UsernameExistsException:
        return;

      default:
        return ErrorService.handler(error);
    }
  };

  // =========================== FORGOT PASSWORD ===========================
  const handleForgotPassword = (data: FormValue) => {
    Navigator.navigate(PATHS.forgotPassword, { email: data.email });
  };

  // =========================== SCHEMA ===========================
  const SigninSchema = Yup.object().shape({
    email: Yup.string().required().email(),
    password: Yup.string().required(),
  });

  return (
    <UAMBody>
      <Formik
        initialValues={INTIAL}
        onSubmit={handleLogin}
        validationSchema={SigninSchema}
        innerRef={formRef}
      >
        {({ values, errors, touched, getFieldProps, handleSubmit }) => (
          <Form onSubmit={handleSubmit} autoComplete="off" className="ctn-uam__form">
            <Grid.Wrap>
              <Grid.Item variant="is-full">
                <Input
                  label="Email Address"
                  required
                  placeholder="Email Address"
                  errorMessage={touched.email ? errors.email : ''}
                  {...getFieldProps('email')}
                />
              </Grid.Item>
              <Grid.Item variant="is-full">
                <InputPassword
                  label="Password"
                  required
                  placeholder="Password"
                  errorMessage={touched.password ? errors.password : ''}
                  {...getFieldProps('password')}
                />
              </Grid.Item>
              <Grid.Item variant="is-full">
                <View flexGrow={1} align="flex-end">
                  <Button
                    type="button"
                    variant="link"
                    className="ctn-uam__link my-1 text-is-16 fit-width fw-medium"
                    onClick={() => handleForgotPassword(values)}
                  >
                    Forgot Password?
                  </Button>
                </View>
              </Grid.Item>
              <Grid.Item variant="is-full">
                <View flexGrow={1}>
                  <Button
                    type="submit"
                    variant="secondary"
                    className="my-2 fw-medium "
                    isLoading={isSigning || loading || isGettingUserId}
                  >
                    Log In
                  </Button>
                </View>
              </Grid.Item>
            </Grid.Wrap>
          </Form>
        )}
      </Formik>
    </UAMBody>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & { history: History };

const mapStateToProps = (state: IRootState) => ({
  // isSigningIn: state.auth.is,
  // error: state.auth.error,
});

const mapDispatchToProps = {
  onShowDialog: showDialog,
  onHideDialog: hideDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
