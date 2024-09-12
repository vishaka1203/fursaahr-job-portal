import React from 'react';
import Sidenav from '../Components/Sidenav';
import Box from '@mui/material/Box';
import Navbar from './../Components/Navbar';

const allRequests = () => {
  return (
    <>
      <div className="bgco">
        <Navbar />
        <Box height={30} />
        <Box sx={{ display: 'flex' }}>
          <Sidenav />

          <Box component="main" sx={{ flexGrow: 1, p: 3 }}></Box>
        </Box>
      </div>
    </>
  );
};

export default allRequests;
