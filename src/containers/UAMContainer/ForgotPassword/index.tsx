import React from 'react';
import { TenantService } from 'src/services';
import AdminForgotPassword from '../admin/ForgotPassword';
import { History, Location } from 'history';

const ForgotPassword: React.FC<Props> = (props) => {
  if (TenantService.isAdmin()) return <AdminForgotPassword {...props} />;
  return null;
};

type Props = { history: History; location: Location<string> };

export default ForgotPassword;
