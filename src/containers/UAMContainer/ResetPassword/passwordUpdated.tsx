import { Grid, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';
import { Button, IconSuccess } from 'src/components/common';
import { Callback } from 'src/redux/types';

const PasswordUpdated: React.FC<Props> = ({ onBackToLogin }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack flexDirection={'row'} justifyContent={'center'} px={'auto'} alignItems={'center'}>
          <IconSuccess size={20} />
          <Typography variant="body1" textAlign={'center'} ml={1}>
            Your password has been successfully updated.
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Button isFull onClick={() => onBackToLogin()}>
          Login
        </Button>
      </Grid>
    </Grid>
  );
};

type Props = {
  onBackToLogin: Callback;
};

export default PasswordUpdated;
