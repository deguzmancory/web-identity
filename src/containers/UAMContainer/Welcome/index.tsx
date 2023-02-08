import { Stack, Typography } from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { History, Location } from 'history';
import React from 'react';
import { connect } from 'react-redux';
import { PATHS } from 'src/appConfig/paths';
import { Button, Form, Grid, Input, InputPassword, ValidatePassword } from 'src/components/common';
import { useComponentWillUnmount } from 'src/hooks';
import { ConfirmPasswordPayload, useConfirmPassword } from 'src/queries';
import { setIsWelcomeScreen } from 'src/redux/auth/authSlice';
import { hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { Navigator, Toastify } from 'src/services';
import { UAMBody } from '../common';
import {
  initialWelcomeFormValue,
  welcomeFormSchema,
  WelcomeFormValue,
  WELCOME_KEY,
} from './helpers';

const PasswordUpdated = React.lazy(() => import('./passwordUpdated'));

const Welcome: React.FC<Props> = ({ location, onSetWelcomeScreen, onShowDialog, onHideDialog }) => {
  const query = new URLSearchParams(location.search);
  const username = query.get(WELCOME_KEY.USERNAME);
  const token = query.get(WELCOME_KEY.TOKEN);

  React.useEffect(() => {
    onSetWelcomeScreen(true);
    // Check for query params "username" and "token". Should be included in link sent to email from forgot password submission.
    if (!query.has(WELCOME_KEY.USERNAME) || !query.has(WELCOME_KEY.TOKEN)) {
      Navigator.navigate(PATHS.forgotPassword);
      handleShowToastPasswordExpired();
    } else {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useComponentWillUnmount(() => onSetWelcomeScreen(false));

  const handleShowToastPasswordExpired = () => {
    Toastify.error(
      'The link to set up your account has expired. Please try again by resetting password.'
    );
  };

  const [isPasswordUpdated, setIsPasswordUpdated] = React.useState(false);

  const { confirmPassword, isLoading } = useConfirmPassword({
    onSuccess(data, variables, context) {
      setIsPasswordUpdated(true);
    },
    onError(error, variables, context) {
      handleShowToastPasswordExpired();
      setTimeout(() => {
        Navigator.navigate(PATHS.forgotPassword, { username: username });
      }, 2000);
    },
  });

  const handleWelcome = (values: WelcomeFormValue, helpers: FormikHelpers<WelcomeFormValue>) => {
    const { password, confirmPassword: _confirmPassword } = values;

    // eslint-disable-next-line security/detect-possible-timing-attacks
    if (password !== _confirmPassword) {
      setErrors({ confirmPassword: 'Password and Confirm Password do not match.' }); // pragma: allowlist secret
      return;
    } else {
      const body: ConfirmPasswordPayload = {
        username,
        newPassword: password,
        token,
      };
      return confirmPassword(body);
    }
  };

  const handleBackToLogin = () => {
    Navigator.navigate(PATHS.signIn, { username: username });
  };

  const { values, errors, touched, getFieldProps, handleSubmit, setErrors } = useFormik({
    initialValues: initialWelcomeFormValue,
    onSubmit: handleWelcome,
    validationSchema: welcomeFormSchema,
  });

  const getErrorMessage = (fieldName: WELCOME_KEY) => {
    // eslint-disable-next-line security/detect-object-injection
    return touched[fieldName] && errors[fieldName] ? errors[fieldName] : '';
  };

  return (
    <UAMBody bodyWidth="470px" mbHeader={2}>
      {isPasswordUpdated ? (
        <PasswordUpdated onBackToLogin={handleBackToLogin} />
      ) : (
        <>
          <Typography textAlign={'center'} mb={2}>
            Please set your password to proceed further.
          </Typography>

          <Form onSubmit={handleSubmit} autoComplete="off" className="ctn-uam__form">
            <Grid.Wrap>
              <Grid.Item variant="is-full">
                <Input label="Username" value={username} disabled />
              </Grid.Item>

              <Grid.Item variant="is-full">
                <InputPassword
                  label="Password"
                  required
                  autoComplete="current-password"
                  placeholder="New Password"
                  errorMessage={getErrorMessage(WELCOME_KEY.PASSWORD)}
                  {...getFieldProps(WELCOME_KEY.PASSWORD)}
                />
              </Grid.Item>

              {values.password && (
                <Grid.Item variant="is-full">
                  <ValidatePassword className="" password={values.password} />
                </Grid.Item>
              )}

              <Grid.Item variant="is-full">
                <InputPassword
                  label="Confirm Password"
                  required
                  autoComplete="confirm-password"
                  placeholder="Confirm Password"
                  errorMessage={getErrorMessage(WELCOME_KEY.CONFIRM_PASSWORD)}
                  {...getFieldProps(WELCOME_KEY.CONFIRM_PASSWORD)}
                />
              </Grid.Item>
              <Grid.Item variant="is-full">
                <Button type="submit" variant="default" className="" isFull isLoading={isLoading}>
                  Confirm
                </Button>
              </Grid.Item>
              <Grid.Item variant="is-full">
                <Stack flexDirection={'row'} justifyContent={'center'}>
                  <Button variant="link" onClick={() => handleBackToLogin()}>
                    Return to Login Page
                  </Button>
                </Stack>
              </Grid.Item>
            </Grid.Wrap>
          </Form>
        </>
      )}
    </UAMBody>
  );
};

type Props = typeof mapDispatchToProps & { history: History; location: Location<string> };

const mapDispatchToProps = {
  onSetWelcomeScreen: setIsWelcomeScreen,
  onShowDialog: showDialog,
  onHideDialog: hideDialog,
};

export default connect(undefined, mapDispatchToProps)(Welcome);
