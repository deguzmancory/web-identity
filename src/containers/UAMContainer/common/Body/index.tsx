import { Box, Container, Link, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';
import { IMAGES } from 'src/appConfig/images';
import { Image } from 'src/components/common';
import Header from '../Header';
import { portalOptions } from './helpers';

const Body: React.FC<Props> = ({ children }) => {
  return (
    <Box
      py={8}
      bgcolor="#E8EAE8"
      sx={{
        backgroundImage: `url(${IMAGES.backgroundDiamond})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top right',
        backgroundSize: 'auto',
      }}
    >
      <Container maxWidth="md">
        <Stack flexDirection={'row'} minHeight="600px" bgcolor={'white'}>
          <Box minWidth={'260px'} bgcolor={'#19112F'}>
            <Box minHeight={'100%'}>
              <Box
                height={'160px'}
                sx={{
                  backgroundImage: `url(${IMAGES.backgroundDiamondSmall})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'bottom left',
                  backgroundSize: 'contain',
                }}
              >
                <Stack
                  flexDirection={'row'}
                  justifyContent={'center'}
                  alignItems="center"
                  minHeight={'100%'}
                >
                  <Box
                    width={'28px'}
                    mr={2}
                    sx={{
                      transform: 'translateY(2px)',
                    }}
                  >
                    <Image src={IMAGES.iconComputer} alt="ic_computer" />
                  </Box>
                  <Typography variant="h1" color="white">
                    Log In
                  </Typography>
                </Stack>
              </Box>
              <Box>
                {portalOptions.map((portal) => (
                  <Link href={portal.url} key={portal.title} underline="none">
                    <Box px={4} py={2} bgcolor={portal.isActive ? '#5C517B' : 'transparent'}>
                      <Typography variant="h5" color="white">
                        {portal.title}
                      </Typography>
                    </Box>
                  </Link>
                ))}
              </Box>
            </Box>
          </Box>
          <Box width={'100%'}>
            <Stack justifyContent={'center'} alignItems="center" minHeight={'100%'}>
              <Box width={'400px'}>
                <Header />

                {children}
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

type Props = {
  children: React.ReactNode;
};

export default Body;
