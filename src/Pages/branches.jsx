import React from 'react';
import Sidenav from '../Components/Sidenav';
import Navbar from '../Components/Navbar';
import Box from '@mui/material/Box';

import BranchList from '../Pages/Branches/branchList';

const branches = () => {
  return (
    <>
      <div className="bgcolor">
        <Navbar />
        <Box height={30} />
        <Box sx={{ display: 'flex' }}>
          <Sidenav />

          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <BranchList />
          </Box>
        </Box>
      </div>
    </>
  );
};

export default branches;
