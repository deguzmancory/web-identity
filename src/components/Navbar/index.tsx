import { AppBar, Box, Link as MuiLink, Stack, Toolbar } from '@mui/material';
import cn from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { NO_OPENER } from 'src/appConfig/constants';
import { IMAGES } from 'src/appConfig/images';
import { PATHS } from 'src/appConfig/paths';
import { IRootState } from 'src/redux/rootReducer';
import { Image } from '../common';
import { navbarItems } from './helpers';
import './styles.scss';
const clsPrefix = 'ctn-navbar-desktop';

const Navbar: React.FC<Props> = () => {
  const { showNavbar } = useSelector((state: IRootState) => state.common);

  if (!showNavbar) return null;
  return (
    <AppBar variant="elevation" position="fixed">
      <Toolbar variant="regular">
        <Stack width={'100%'} flexDirection={'row'} justifyContent={'space-between'}>
          <Link to={PATHS.root}>
            <Image src={IMAGES.logoFull} className={`${clsPrefix}-logo`} />
          </Link>
          <Stack flexDirection={'row'}>
            {navbarItems.map((item) => (
              <Box
                className={`${clsPrefix}-item`}
                sx={{
                  cursor: 'pointer',
                }}
                key={item.label}
                my={'auto'}
              >
                <MuiLink
                  {...(item?.url && {
                    href: item.url,
                    target: '_blank',
                    rel: NO_OPENER,
                  })}
                  className={` ${clsPrefix}-link`}
                  underline="none"
                >
                  {item.label}
                </MuiLink>
                <Box
                  className={cn(`${clsPrefix}-item__sub subItems`, {
                    isLeft: item?.isDisplayLeft,
                  })}
                >
                  {[
                    item.subItems.map((subItem) => (
                      <Box
                        className={`subItem`}
                        key={subItem.label}
                        sx={{
                          cursor: 'pointer',
                        }}
                      >
                        <MuiLink
                          {...(subItem?.url && {
                            href: subItem.url,
                            target: '_blank',
                            rel: NO_OPENER,
                          })}
                          fontWeight="bold"
                          underline="none"
                        >
                          {subItem.label}
                        </MuiLink>
                      </Box>
                    )),
                  ]}
                </Box>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

type Props = {};

export default Navbar;
