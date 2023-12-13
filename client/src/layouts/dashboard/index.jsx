import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import Nav from './nav';
import Main from './main';
import Header from './header';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/store/slices/authSlice';
import { CircularProgress, Stack } from '@mui/material';

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const [openNav, setOpenNav] = useState(false);
  // go to login if no token is present
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token === null) {
      navigate('/login');
    }
  }, [token, navigate]);

  if (token === undefined) {
    return (
      <Stack sx={{ height: '100%' }}>
        <CircularProgress sx={{ m: 'auto' }} />
      </Stack>
    );
  }

  return (
    <>
      <Header onOpenNav={() => setOpenNav(true)} />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />

        <Main>{children}</Main>
      </Box>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
