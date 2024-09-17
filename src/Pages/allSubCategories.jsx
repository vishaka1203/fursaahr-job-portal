import React from 'react';
import Sidenav from '../Components/Sidenav';
import Box from '@mui/material/Box';
import Navbar from './../Components/Navbar';
import AllSubCategoriesList from './AllSubCategories/allSubCategoriesList';

const allSubCategories = () => {
  return (
    <>
      <Navbar />
      <Box sx={{ display: 'flex' }}>
        <Sidenav />

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <AllSubCategoriesList />
        </Box>
      </Box>
    </>
  );
};

export default allSubCategories;
