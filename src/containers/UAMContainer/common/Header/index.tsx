import { Stack, Typography } from '@mui/material';

const Header: React.FC<Props> = ({ mb = 4 }) => {
  return (
    <Stack justifyContent={'center'} alignItems="center" flexDirection={'column'} mb={mb}>
      <Typography variant="body1" mb={1}>
        The Research Corporation of the University of Hawaii
      </Typography>
      <Typography variant="h2">Financial System Login</Typography>
    </Stack>
  );
};

type Props = {
  mb?: number;
};

export default Header;
