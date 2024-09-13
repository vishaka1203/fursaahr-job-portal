import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DataTable from './../../Components/DataTable';
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Snackbar,
  Alert,
  DialogContentText,
} from '@mui/material';

const columns = [
  { id: 'branchName', label: 'Branch Name', minWidth: 170 },
  { id: 'address1', label: 'Address 1', minWidth: 170 },
  { id: 'address2', label: 'Address 2', minWidth: 170 },
  { id: 'area', label: 'Area', minWidth: 100, align: 'center' },
  { id: 'viewUsers', label: 'View Users', minWidth: 100, align: 'center' },
  { id: 'edit', label: 'Edit', minWidth: 100, align: 'center' },
  { id: 'delete', label: 'Delete', minWidth: 100, align: 'center' },
  { id: 'viewInvoice', label: 'View Invoice', minWidth: 100, align: 'center' },
];

function createData(
  branch,
  handleEditClick,
  handleDeleteClick,
  handleViewInvoiceClick
) {
  return {
    branchName: branch.branchname,
    address1: branch.address1,
    address2: branch.address2,
    area: branch.area,
    block: branch.block,
    viewUsers: (
      <IconButton>
        <VisibilityIcon />
      </IconButton>
    ),
    edit: (
      <IconButton onClick={() => handleEditClick(branch)}>
        <EditIcon />
      </IconButton>
    ),
    delete: (
      <IconButton color="error" onClick={() => handleDeleteClick(branch)}>
        <DeleteIcon />
      </IconButton>
    ),
    viewInvoice: (
      <IconButton onClick={() => handleViewInvoiceClick(branch)}>
        <ReceiptIcon />
      </IconButton>
    ),
  };
}

export default function BranchList() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [branchName, setBranchName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [area, setArea] = useState('');
  const [block, setblock] = useState(''); // Ensure it's an empty string
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);

  useEffect(() => {
    fetch('https://feedle.in/fursaahr/api/getbranches.php')
      .then((response) => response.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const formattedRows = data.data.map((branch) =>
            createData(
              branch,
              handleEditClick,
              handleDeleteClick,
              handleViewInvoiceClick
            )
          );
          setRows(formattedRows);
        } else {
          console.error('Expected array but received:', data);
        }
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleAddBranchClick = () => {
    setEditMode(false);
    setOpen(true);
    clearForm();
  };

  const handleClose = () => {
    setOpen(false);
    clearForm();
  };

  const clearForm = () => {
    setBranchName('');
    setAddress1('');
    setAddress2('');
    setArea('');
    setblock(''); // Ensure block is cleared
    setSelectedBranchId(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEditClick = (branch) => {
    setEditMode(true);
    setSelectedBranchId(branch.id);
    setBranchName(branch.branchname);
    setAddress1(branch.address1);
    setAddress2(branch.address2);
    setArea(branch.area);
    setblock(branch.block);
    setOpen(true);
  };

  const handleDeleteClick = (branch) => {
    setBranchToDelete(branch);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!branchToDelete) return;

    fetch('https://feedle.in/fursaahr/api/deletebranch.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: branchToDelete.id }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSnackbarMessage('Branch deleted successfully');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          setRows((prevRows) =>
            prevRows.filter(
              (row) => row.branchName !== branchToDelete.branchname
            )
          );
        } else {
          setSnackbarMessage(`Error: ${data.message}`);
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setSnackbarMessage('An error occurred');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      })
      .finally(() => {
        setDeleteDialogOpen(false);
        setBranchToDelete(null);
      });
  };

  const handleSave = () => {
    if (typeof block !== 'string' || !block.trim()) {
      setSnackbarMessage('Block Name cannot be empty!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const url = editMode
      ? 'https://feedle.in/fursaahr/api/editbranch.php'
      : 'https://feedle.in/fursaahr/api/createbranch.php';

    const bodyData = {
      branchname: branchName,
      address1,
      address2,
      area,
      block,
    };

    if (editMode && selectedBranchId) {
      bodyData.id = selectedBranchId;
    }

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSnackbarMessage(
            editMode
              ? 'Branch updated successfully'
              : 'Branch added successfully'
          );
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          handleClose();
        } else {
          setSnackbarMessage(`Error: ${data.message}`);
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setSnackbarMessage('An error occurred');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const handleViewInvoiceClick = (branch) => {
    fetch('https://feedle.in/fursaahr/api/get_all_invoices_by_branchid.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ branchId: branch.id }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setInvoices(data.data);
          setInvoiceDialogOpen(true);
        } else {
          console.error('Expected array but received:', data);
          setSnackbarMessage('No invoices found');
          setSnackbarSeverity('warning');
          setSnackbarOpen(true);
        }
      })
      .catch((error) => {
        console.error('Error fetching invoices:', error);
        setSnackbarMessage('An error occurred while fetching invoices');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const handleInvoiceDialogClose = () => {
    setInvoiceDialogOpen(false);
  };

  return (
    <div>
      <DataTable
        columns={columns}
        rows={rows}
        title="Branches"
        button={{ text: 'Add Branch +' }}
        onButtonClick={handleAddBranchClick}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Branch' : 'Add Branch'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Branch Name"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Address 1"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              fullWidth
            />
            <TextField
              label="Address 2"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              fullWidth
            />
            <TextField
              label="Area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              fullWidth
            />
            <TextField
              label="Block"
              value={block}
              onChange={(e) => setblock(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this branch?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={invoiceDialogOpen}
        onClose={handleInvoiceDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Invoices</DialogTitle>
        <DialogContent>
          {invoices.length > 0 ? (
            <Box>
              {/* Render your invoices here */}
              {invoices.map((invoice) => (
                <Box key={invoice.id}>
                  <p>{invoice.description}</p>
                  {/* Add other invoice details as needed */}
                </Box>
              ))}
            </Box>
          ) : (
            <p>No invoices found.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleInvoiceDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
