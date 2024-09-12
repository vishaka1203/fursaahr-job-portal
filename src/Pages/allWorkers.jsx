import React from 'react';
import Sidenav from '../Components/Sidenav';
import Navbar from '../Components/Navbar';
import Box from '@mui/material/Box';
import AllWorkersList from './AllWorkers/allWorkersList';

const AllWorkers = () => {
  return (
    <>
      <div className="bgcolor">
        <Navbar />
        <Box height={30} />
        <Box sx={{ display: 'flex' }}>
          <Sidenav />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <AllWorkersList />
          </Box>
        </Box>
      </div>
    </>
  );
};

export default AllWorkers;
