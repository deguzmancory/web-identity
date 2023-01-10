import omit from 'object.omit';
import React from 'react';
import duoWeb from 'src/lib/duo-web';

const DuoWrapper = ({ host, sigRequest, sigResponseCallback }) => {
  const handleDuoResponse = (duoForm) => {
    const sigResponse = duoForm.firstChild.value;
    return sigResponseCallback(sigResponse);
  };

  React.useEffect(() => {
    duoWeb.duoWeb().init({
      host,
      sig_request: sigRequest,
      submit_callback: handleDuoResponse,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const props = omit(host, sigRequest, sigResponseCallback);
  console.log('props: ', props);
  return <iframe title="duo_iframe" id="duo_iframe" {...props} />;
};

export default DuoWrapper;
