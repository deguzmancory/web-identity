import { Stack, Typography } from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { History, Location } from 'history';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { COLOR_CODE } from 'src/appConfig/constants';
import { PATHS } from 'src/appConfig/paths';
import { Button, Form, Grid, InputPassword, ValidatePassword } from 'src/components/common';
import { useSubmitForgotPassword, useUpdateUserLastPasswordChanged } from 'src/queries';
import { hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { Navigator } from 'src/services';
import { handleShowErrorMsg } from 'src/utils';
import { UAMBody } from '../common';
import {
  initialResetPasswordFormValue,
  resetPasswordFormSchema,
  ResetPasswordFormValue,
  RESET_PASSWORD_KEY,
} from './helpers';

const PasswordUpdated = React.lazy(() => import('./passwordUpdated'));

const ResetPassword: React.FC<Props> = ({ location, onShowDialog, onHideDialog }) => {
  const query = new URLSearchParams(location.search);
  const username = query.get(RESET_PASSWORD_KEY.USERNAME);

  React.useEffect(() => {
    // Check for query params "username" and "token". Should be included in link sent to email from forgot password submission.
    if (!query.has(RESET_PASSWORD_KEY.USERNAME) || !query.has(RESET_PASSWORD_KEY.TOKEN)) {
      Navigator.navigate(PATHS.forgotPassword);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isPasswordUpdated, setIsPasswordUpdated] = React.useState(false);

  const { updateUserLastPasswordChanged } = useUpdateUserLastPasswordChanged();

  const { submitForgotPassword, isLoading } = useSubmitForgotPassword({
    onSuccess(data, variables, context) {
      setIsPasswordUpdated(true);
      updateUserLastPasswordChanged({ username });
    },
    onError(error, variables, context) {
      if (error.message.includes('Invalid code provided, please request a code again')) {
        onShowDialog({
          type: DIALOG_TYPES.OK_DIALOG,
          data: {
            title: `Error`,
            content: `The link above is valid for 60 minutes after you receive this email. Please submit send reset password link again!`,
            okText: 'Ok',
            onOk: () => {
              onHideDialog();
            },
            onCancel: () => {
              onHideDialog();
            },
          },
        });
        Navigator.navigate(PATHS.forgotPassword, { username: username });
        return;
      } else {
        handleShowErrorMsg(error);
      }
    },
  });

  const handleResetPassword = (
    values: ResetPasswordFormValue,
    helpers: FormikHelpers<ResetPasswordFormValue>
  ) => {
    const { password, confirmPassword } = values;

    // eslint-disable-next-line security/detect-possible-timing-attacks
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Password and Confirm Password do not match.' }); // pragma: allowlist secret
      return;
    } else {
      const body = {
        username: username,
        password: password,
        token: query.get(RESET_PASSWORD_KEY.TOKEN),
      };
      return submitForgotPassword(body);
    }
  };

  // =========================== FORGOT PASSWORD ===========================
  const handleBackToLogin = () => {
    Navigator.navigate(PATHS.signIn, { username: username });
  };

  const { values, errors, touched, getFieldProps, handleSubmit, setErrors } = useFormik({
    initialValues: initialResetPasswordFormValue,
    onSubmit: handleResetPassword,
    validationSchema: resetPasswordFormSchema,
  });

  const getErrorMessage = (fieldName: RESET_PASSWORD_KEY) => {
    // eslint-disable-next-line security/detect-object-injection
    return touched[fieldName] && errors[fieldName] ? errors[fieldName] : '';
  };

  return (
    <UAMBody bodyWidth="470px" mbHeader={2}>
      {isPasswordUpdated ? (
        <PasswordUpdated onBackToLogin={handleBackToLogin} />
      ) : (
        <>
          <Typography variant="h5" textAlign={'center'} mb={2}>
            Change Password for {username}
          </Typography>

          <Form onSubmit={handleSubmit} autoComplete="off" className="ctn-uam__form">
            <Grid.Wrap>
              <Grid.Item variant="is-full">
                <InputPassword
                  label="New Password"
                  required
                  autoComplete="current-password"
                  placeholder="New Password"
                  errorMessage={getErrorMessage(RESET_PASSWORD_KEY.PASSWORD)}
                  {...getFieldProps(RESET_PASSWORD_KEY.PASSWORD)}
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
                  errorMessage={getErrorMessage(RESET_PASSWORD_KEY.CONFIRM_PASSWORD)}
                  {...getFieldProps(RESET_PASSWORD_KEY.CONFIRM_PASSWORD)}
                />
              </Grid.Item>
              <Grid.Item variant="is-full">
                <Button type="submit" variant="default" className="" isFull isLoading={isLoading}>
                  Reset
                </Button>
              </Grid.Item>
              <Grid.Item variant="is-full">
                <Stack flexDirection={'row'} justifyContent={'center'}>
                  <Button variant="link" onClick={() => handleBackToLogin()}>
                    Return to Login Page
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
  onShowDialog: showDialog,
  onHideDialog: hideDialog,
};

export default connect(undefined, mapDispatchToProps)(ResetPassword);
