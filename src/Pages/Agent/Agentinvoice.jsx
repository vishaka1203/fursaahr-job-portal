import React from 'react';
import Navbar from '../../Components/Navbar';
import Box from '@mui/material/Box';
import AgentSidenav from '../../Components/AgentSidenav';

const Agentinvoice = () => {
  return (
    <>
      <div className="bgcolor">
        <Navbar />
        <Box height={30} />
        <Box sx={{ display: 'flex' }}>
          <AgentSidenav />

          <Box component="main" sx={{ flexGrow: 1, p: 3 }}></Box>
        </Box>
      </div>
    </>
  );
};

export default Agentinvoice;
