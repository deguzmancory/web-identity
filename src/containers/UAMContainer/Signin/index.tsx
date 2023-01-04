import { History } from 'history';
import React from 'react';
import AdminSignin from '../admin/Signin';

const SignIn: React.FC<Props> = (props) => {
  // if (TenantService.isAdmin()) return <AdminSignin {...props} />;
  return <AdminSignin {...props} />;
};

type Props = { history: History };

export default SignIn;
