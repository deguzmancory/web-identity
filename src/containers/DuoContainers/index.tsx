import { Close } from '@mui/icons-material';
import { Backdrop, CircularProgress, IconButton, Tooltip } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import appConfig from 'src/appConfig';
import { PATHS } from 'src/appConfig/paths';
import { useConfirmSignIn } from 'src/queries';
import { setDuoSigRequest } from 'src/redux/auth/authSlice';
import { hideDialog, showDialog } from 'src/redux/dialog/dialogSlice';
import { DIALOG_TYPES } from 'src/redux/dialog/type';
import { IRootState } from 'src/redux/store';
import { Navigator } from 'src/services';
import { isEmpty } from 'src/validations';
import DuoWrapper from './DuoWrapper';
import './styles.scss';

const DuoContainers: React.FC<Props> = ({
  duo,
  onSetDuoSigRequest,
  onShowDialog,
  onHideDialog,
}) => {
  const { confirmSignIn } = useConfirmSignIn({
    onSuccess(data, variables, context) {
      const signInSession = data.signInUserSession;
      if (signInSession) Navigator.jumpToWebFis(PATHS.dashboard);
      else {
        handleHideDuoModal('Unknown.');
      }
    },
    onError(error, variables, context) {
      handleHideDuoModal(error.message);
    },
  });

  const handleHideDuoModal = (error: string) => {
    onShowDialog({
      type: DIALOG_TYPES.OK_DIALOG,
      data: {
        title: `Error`,
        content: `Error when login: ${error} Please try to login again.`,
        okText: 'Login Again',
        onOk: () => {
          onClearDuoData();
          onHideDialog();
        },
        onCancel: () => {
          onClearDuoData();
          onHideDialog();
        },
      },
    });
  };

  const onClearDuoData = () => {
    onSetDuoSigRequest({
      sigRequest: null,
      user: null,
    });
  };

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
            <Tooltip title={'Close'} arrow placement="right-start">
              <IconButton
                className={`duo-wrapper__close`}
                onClick={() => {
                  onClearDuoData();
                }}
              >
                <Close />
              </IconButton>
            </Tooltip>
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

const mapDispatchToProps = {
  onSetDuoSigRequest: setDuoSigRequest,
  onShowDialog: showDialog,
  onHideDialog: hideDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(DuoContainers);
