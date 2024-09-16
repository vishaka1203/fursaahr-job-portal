import React from 'react';
import Sidenav from '../Components/Sidenav';
import Box from '@mui/material/Box';
import Navbar from './../Components/Navbar';
import AllCategoriesList from './AllCategories/allCategoriesList';

const allCategories = () => {
  return (
    <>
      <div className="bgcolor">
        <Navbar />
        <Box sx={{ display: 'flex' }}>
          <Sidenav />

          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <AllCategoriesList />
          </Box>
        </Box>
      </div>
    </>
  );
};

export default allCategories;
