import { Grid, Stack, Typography } from '@mui/material';
import { FormikProps, useFormik } from 'formik';
import { History } from 'history';
import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { COLOR_CODE } from 'src/appConfig/constants';
import { PATHS } from 'src/appConfig/paths';
import { Button, Form, Input, InputPassword } from 'src/components/common';
import { useLogin, useProfile } from 'src/queries';
import { setDuoSigRequest } from 'src/redux/auth/authSlice';
import { IRootState } from 'src/redux/rootReducer';
import { ErrorService, Navigator } from 'src/services';
import { UAMBody } from '../common';
import { initialSignInFormValue, signInFormSchema, SignInFormValue, SIGNIN_KEY } from './helpers';

const Signin: React.FC<Props> = ({ onSetDuoSigRequest }) => {
  const formRef = useRef<FormikProps<SignInFormValue>>(null);

  const { login, isSigning } = useLogin({
    onSuccess(data, variables, context) {
      if (data.challengeName === 'CUSTOM_CHALLENGE') {
        onSetDuoSigRequest({
          sigRequest: data?.challengeParam?.sig_request,
          user: data,
        });
      }
    },
    onError(error) {
      handleError(error);
    },
  });

  const { loading } = useProfile();

  const handleLogin = (values: SignInFormValue) => {
    const { username, password } = values;

    login({ username, password });
  };

  const handleError = (error: AuthError) => {
    switch (error.code.trim()) {
      case ErrorService.TYPES.NotAuthorizedException:
        return setErrors({
          username: ErrorService.MESSAGES.incorrectAccount,
          password: ErrorService.MESSAGES.incorrectAccount,
        });

      case ErrorService.TYPES.UserNotFoundException:
        return setErrors({ username: ErrorService.MESSAGES.accountNotExist });

      case ErrorService.TYPES.UsernameExistsException:
        return setErrors({ username: ErrorService.MESSAGES.incorrectCredentials });

      default:
        return ErrorService.handler(error);
    }
  };

  // =========================== FORGOT PASSWORD ===========================
  const handleForgotPassword = (data: SignInFormValue) => {
    Navigator.navigate(PATHS.forgotPassword, { email: data.username });
  };

  const { values, errors, touched, getFieldProps, handleSubmit, setErrors } = useFormik({
    initialValues: initialSignInFormValue,
    onSubmit: handleLogin,
    validationSchema: signInFormSchema,
    innerRef: formRef,
  });

  const getErrorMessage = (fieldName: SIGNIN_KEY) => {
    // eslint-disable-next-line security/detect-object-injection
    return touched[fieldName] && errors[fieldName] ? errors[fieldName] : '';
  };

  return (
    <UAMBody>
      <Form onSubmit={handleSubmit} autoComplete="off" className="ctn-uam__form">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Input
              label="Username"
              required
              autoComplete="username"
              placeholder="Username"
              errorMessage={getErrorMessage(SIGNIN_KEY.USERNAME)}
              {...getFieldProps(SIGNIN_KEY.USERNAME)}
            />
          </Grid>
          <Grid item xs={12}>
            <InputPassword
              label="Password"
              required
              autoComplete="current-password"
              placeholder="Password"
              errorMessage={getErrorMessage(SIGNIN_KEY.PASSWORD)}
              {...getFieldProps(SIGNIN_KEY.PASSWORD)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="default"
              className=""
              isFull
              isLoading={isSigning || loading}
            >
              Log In
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Stack flexDirection={'row'} justifyContent={'center'}>
              <Button variant="link" onClick={() => handleForgotPassword(values)}>
                Forgot Password?
              </Button>
            </Stack>
            <Stack flexDirection={'row'} justifyContent={'center'} mt={2}>
              <Typography variant="body2" className="mr-1">
                Don't have an account?
              </Typography>
              <Link to={PATHS.signUp}>
                <Typography variant="body2" fontWeight="bold" color={COLOR_CODE.INFO}>
                  Learn more
                </Typography>
              </Link>
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </UAMBody>
  );
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & { history: History };

const mapStateToProps = (state: IRootState) => ({});

const mapDispatchToProps = {
  onSetDuoSigRequest: setDuoSigRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
