import React from 'react';
import Sidenav from '../Components/Sidenav';
import Navbar from '../Components/Navbar';
import Box from '@mui/material/Box';
import InvoiceList from '../Pages/invoices/invoicesList';
const Invoices = () => {
  return (
    <>
      <div className="bgcolor">
        <Navbar />
        <Box sx={{ display: 'flex' }}>
          <Sidenav />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <InvoiceList />
          </Box>
        </Box>
      </div>
    </>
  );
};

export default Invoices;
