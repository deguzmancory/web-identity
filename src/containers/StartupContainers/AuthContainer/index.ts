/* eslint-disable react-hooks/exhaustive-deps */
import { Auth, Hub } from 'aws-amplify';
import { History } from 'history';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { PATHS } from 'src/appConfig/paths';
import { useComponentDidMount } from 'src/hooks';
import { setAuthenticated, setUserName } from 'src/redux/auth/authSlice';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator, TokenService } from 'src/services';

const AuthContainer: React.FC<Props> = ({
  history,
  isAuthenticated,
  onSetAuth,
  onSetUserName,
  isWelcomeScreen,
}) => {
  // =========================== Didmount ===========================
  useEffect(() => {
    Hub.listen('auth', authLogin);
    return () => {
      Hub.remove('auth', authLogin);
    };
  }, [isAuthenticated]);

  useComponentDidMount(async () => {
    try {
      await TokenService.getToken();
      authenticate();
    } catch (error) {
      clearAuth();
    }
  });

  const authLogin = (res: { payload: { event: string; data?: any } }) => {
    const { payload } = res;
    const { event } = payload;
    switch (event) {
      case 'signIn':
        if (!isWelcomeScreen) {
          authenticate();
        }
        break;
      case 'signOut':
        clearAuth();
        break;
      case 'signIn_failure':
        console.log('signin error', payload?.data?.message);
        break;
      default:
        break;
    }
  };

  const clearAuth = () => {
    onSetAuth(false);
    TokenService.clearToken();
  };

  const authenticate = () => {
    if (!isAuthenticated) {
      // 2. Get current user
      Auth.currentAuthenticatedUser()
        .then((user) => {
          Navigator.jumpToWebFis(PATHS.dashboard);
        })
        .catch(() => {
          clearAuth();
        });
    }
  };

  return null;
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & { history: History };

const mapStateToProps = (state: IRootState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isWelcomeScreen: state.auth.isWelcomeScreen,
});

const mapDispatchToProps = {
  onSetAuth: setAuthenticated,
  onSetUserName: setUserName,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthContainer));
