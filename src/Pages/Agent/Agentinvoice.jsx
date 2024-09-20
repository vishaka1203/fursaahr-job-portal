import React from 'react';

import Box from '@mui/material/Box';
import AgentSidenav from '../../Components/AgentSidenav';
import AgentNavbar from './../../Components/AgentNavbar';

import AgentInvoiceList from './AgentInvoice/agentInvoiceList';

const Agentinvoice = () => {
  return (
    <>
      <div className="bgcolor">
        <AgentNavbar />
        <Box height={30} />
        <Box sx={{ display: 'flex' }}>
          <AgentSidenav />

          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <AgentInvoiceList />
          </Box>
        </Box>
      </div>
    </>
  );
};

export default Agentinvoice;
