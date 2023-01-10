import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'src/redux/store';
import { isEmpty } from 'src/validations';
import './styles.scss';
import { Backdrop, CircularProgress } from '@mui/material';
import { useConfirmSignIn } from 'src/queries';
import { Navigator, Toastify } from 'src/services';
import { PATHS } from 'src/appConfig/paths';
import DuoWrapper from './DuoWrapper';
import appConfig from 'src/appConfig';

const DuoContainers: React.FC<Props> = ({ duo }) => {
  const { confirmSignIn } = useConfirmSignIn({
    onSuccess(data, variables, context) {
      const signInSession = data.signInUserSession;
      if (signInSession) Navigator.jumpToWebFis(PATHS.dashboard);
      else Toastify.error('Error when useConfirmSignIn');
    },
    onError(error, variables, context) {
      Toastify.error(`Error when useConfirmSignIn: ${error.message}`);
    },
  });

  const handle2FAComplete = (sigResponse) => {
    confirmSignIn({
      code: sigResponse,
      user: duo.user,
    });
  };
  return (
    <>
      {!isEmpty(duo.sigRequest) && (
        <>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
            onClick={() => {}}
          >
            <CircularProgress color="inherit" />
            <DuoWrapper
              host={appConfig.DUO_HOST_ID}
              sigRequest={duo.sigRequest}
              sigResponseCallback={(sigResponse) => {
                handle2FAComplete(sigResponse);
              }}
            />
          </Backdrop>
        </>
      )}
    </>
  );
};
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const mapStateToProps = (state: IRootState) => ({
  duo: state.auth.duo,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DuoContainers);
