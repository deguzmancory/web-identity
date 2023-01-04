import { AppBar, Toolbar } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { IMAGES } from 'src/appConfig/images';
import { IRootState } from 'src/redux/rootReducer';
import { Image } from '../common';

const Navbar: React.FC<Props> = () => {
  const { showNavbar } = useSelector((state: IRootState) => state.common);

  if (!showNavbar) return null;
  return (
    <AppBar variant="elevation" position="fixed">
      <Toolbar variant="regular">
        <Image src={IMAGES.logoFull} />
      </Toolbar>
    </AppBar>
  );
};

type Props = {};

export default Navbar;
