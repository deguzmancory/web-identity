import React from 'react';
import { TenantService } from 'src/services';
import AdminSignin from '../admin/Signin';
import { History } from 'history';

const SignIn: React.FC<Props> = (props) => {
  if (TenantService.isAdmin()) return <AdminSignin {...props} />;
  return <AdminSignin {...props} />;
};

type Props = { history: History };

export default SignIn;
