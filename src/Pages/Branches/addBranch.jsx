// AddBranch.jsx
import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

export default function AddBranch({ onAddBranch }) {
  const [open, setOpen] = useState(false);
  const [branchData, setBranchData] = useState({
    branchName: '',
    address1: '',
    address2: '',
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setBranchData({
      ...branchData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onAddBranch(branchData);
    setBranchData({ branchName: '', address1: '', address2: '' });
    handleClose();
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add Branch
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Branch</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="branchName"
            label="Branch Name"
            type="text"
            fullWidth
            value={branchData.branchName}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="address1"
            label="Address 1"
            type="text"
            fullWidth
            value={branchData.address1}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="address2"
            label="Address 2"
            type="text"
            fullWidth
            value={branchData.address2}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
