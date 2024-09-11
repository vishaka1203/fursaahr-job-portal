import React from 'react';
import Sidenav from '../Components/Sidenav';
import Box from '@mui/material/Box';
import Navbar from './../Components/Navbar';

const appInfo = () => {
  return (
    <>
      <Navbar />
      <Box sx={{ display: 'flex' }}>
        <Sidenav />
        <h1>appInfo</h1>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}></Box>
      </Box>
    </>
  );
};

export default appInfo;
