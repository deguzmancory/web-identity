import { Location } from 'history';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, RouteProps, Switch, useHistory } from 'react-router-dom';

import { PATHS } from 'src/appConfig/paths';
import { View } from 'src/components/common';
import Navbar from 'src/components/Navbar';
import { IRootState } from 'src/redux/rootReducer';
import { Navigator, TenantService } from 'src/services';
import Dev from './Dev';

import Sidebar from 'src/components/Sidebar';
import AuthContainer from './StartupContainers/AuthContainer';
import ContentContainer from './StartupContainers/ContentContainer';
import DialogContainer from './StartupContainers/DialogContainer';
import LoadingContainer from './StartupContainers/LoadingContainer';
import NotFound from './StartupContainers/NotFound';
import ResponsiveContainer from './StartupContainers/ResponsiveContainer';
import SplashScreen from './StartupContainers/SplashScreen';
import ToastContainer from './StartupContainers/ToastContainer';
import UploadProgressContainer from './StartupContainers/UploadProgressContainer';
import ForgotPassword from './UAMContainer/ForgotPassword';
import ResetPassword from './UAMContainer/ResetPassword';
import Signin from './UAMContainer/Signin';

import Footer from 'src/components/Footer';
import { useComponentDidMount } from 'src/hooks';
import Welcome from './UAMContainer/Welcome';

const Routing: React.FC<{ location: Location }> = (props) => {
  Navigator.setTopHistory(useHistory());

  useComponentDidMount(() => {
    const currentWebTenant = TenantService.getWebTenant();
    TenantService.setTenant({ name: currentWebTenant });
  });

  return (
    <View>
      <Navbar />
      <Switch location={props.location}>
        <Route path={PATHS.root} render={() => <Redirect to={PATHS.signIn} />} exact />
        <CustomRoute path={PATHS.signIn} component={Signin} />
        <CustomRoute path={PATHS.forgotPassword} component={ForgotPassword} />
        <CustomRoute path={PATHS.resetPassword} component={ResetPassword} />
        <CustomRoute path={PATHS.welcome} component={Welcome} />

        <Route path={PATHS.dev} component={Dev} />
        <CustomRoute path={PATHS.dev} component={Dev} />
        <Route component={NotFound} />
      </Switch>
      <Sidebar />
      <AuthContainer />
      <ContentContainer />
      <LoadingContainer />
      <DialogContainer />
      <ToastContainer />
      <ResponsiveContainer />
      <UploadProgressContainer />

      <Footer />
    </View>
  );
};

export default Routing;

const CRouting: React.FC<Props> = ({ isAuthenticated, pageRequiredAuth, component, ...rest }) => {
  const renderRoute = (Component: any) => (props: RouteProps) => {
    if (isAuthenticated === null) return <SplashScreen />;

    if ((isAuthenticated && pageRequiredAuth) || (!isAuthenticated && !pageRequiredAuth)) {
      // Before render component, check permission first
      return <Component {...props} />;
    }

    const redirectPath = isAuthenticated ? PATHS.myProfile : PATHS.signIn;
    const redirectProps = {
      to: {
        pathname: redirectPath,
        state: { from: props.location },
      },
    };
    return <Redirect {...redirectProps} />;
  };

  return <Route {...rest} render={renderRoute(component)} />;
};

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  RouteProps & { pageRequiredAuth?: boolean };

const mapStateToProps = (state: IRootState) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = {};

const CustomRoute = connect(mapStateToProps, mapDispatchToProps)(CRouting);
