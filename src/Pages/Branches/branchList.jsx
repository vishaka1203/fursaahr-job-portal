import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DataTable from './../../Components/DataTable';
import AddBranch from './addBranch';

const columns = [
  { id: 'branchName', label: 'Branch Name', minWidth: 170 },
  { id: 'address1', label: 'Address 1', minWidth: 170 },
  { id: 'address2', label: 'Address 2', minWidth: 170 },
  { id: 'viewUsers', label: 'View Users', minWidth: 100, align: 'center' },
  { id: 'edit', label: 'Edit', minWidth: 100, align: 'center' },
  { id: 'delete', label: 'Delete', minWidth: 100, align: 'center' },
  { id: 'viewInvoice', label: 'View Invoice', minWidth: 100, align: 'center' },
];

function createData(branch) {
  return {
    branchName: branch.branchname,
    address1: branch.address1,
    address2: branch.address2,
    viewUsers: (
      <IconButton>
        <VisibilityIcon />
      </IconButton>
    ),
    edit: (
      <IconButton>
        <EditIcon />
      </IconButton>
    ),
    delete: (
      <IconButton color="error">
        <DeleteIcon />
      </IconButton>
    ),
    viewInvoice: (
      <IconButton>
        <ReceiptIcon />
      </IconButton>
    ),
  };
}

export default function BranchList() {
  const [rows, setRows] = useState([]);
  const [openAddBranch, setOpenAddBranch] = useState(false); // State for dialog

  useEffect(() => {
    fetch('https://feedle.in/fursaahr/api/getbranches.php')
      .then((response) => response.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const formattedRows = data.data.map((branch) => createData(branch));
          setRows(formattedRows);
        } else {
          console.error('Expected array but received:', data);
        }
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Function to handle opening the Add Branch dialog
  const handleOpenAddBranch = () => {
    setOpenAddBranch(true);
  };

  // Function to handle closing the Add Branch dialog
  const handleCloseAddBranch = () => {
    setOpenAddBranch(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpenAddBranch}>
        + Add Branch
      </Button>
      <DataTable columns={columns} rows={rows} title="Branches" />

      <Dialog open={openAddBranch} onClose={handleCloseAddBranch}>
        <DialogTitle>Add New Branch</DialogTitle>
        <DialogContent>
          <AddBranch onClose={handleCloseAddBranch} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddBranch}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
