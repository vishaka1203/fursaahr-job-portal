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
import { useNavigate } from 'react-router-dom';

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
  handleViewInvoiceClick,
  branchData,
  navigate
) {
  const handleViewUserClick = (branchData) => {
    fetch('https://feedle.in/fursaahr/api/get_user_by_branchid.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ branchid: branchData.branchid }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const branchId = branchData.branchid;
          navigate(`/users/${branchId}`);
        } else {
          console.error('Expected array but received:', data);
        }
      });
  };

  return {
    branchName: branch.branchname,
    address1: branch.address1,
    address2: branch.address2,
    area: branch.area,
    viewUsers: (
      <IconButton onClick={() => handleViewUserClick(branch)}>
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
  const [block, setBlock] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);

  const navigate = useNavigate(); // React Router's useNavigate hook

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch(
          'https://feedle.in/fursaahr/api/getbranches.php'
        );
        const data = await response.json();
        console.log(data);
        if (data.success && Array.isArray(data.data)) {
          const branchData = data.data;
          const formattedRows = data.data.map((branch) =>
            createData(
              branch,
              handleEditClick,
              handleDeleteClick,
              handleViewInvoiceClick,
              branchData,
              navigate
            )
          );
          setRows(formattedRows);
        } else {
          console.error('Expected array but received:', data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchBranches();
  }, [navigate]);

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
    setBlock('');
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
    setBlock(branch.block);
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
    if (!branchName.trim()) {
      setSnackbarMessage('Branch Name is required!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (!address1.trim()) {
      setSnackbarMessage('Address 1 is required!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (!area.trim()) {
      setSnackbarMessage('Area is required!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (!block.trim()) {
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
      body: JSON.stringify({ branchid: branch.id }),
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
        title="Branch List"
        onAddClick={handleAddBranchClick}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit Branch' : 'Add Branch'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Branch Name"
            fullWidth
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Address 1"
            fullWidth
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Address 2"
            fullWidth
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Area"
            fullWidth
            value={area}
            onChange={(e) => setArea(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Block"
            fullWidth
            value={block}
            onChange={(e) => setBlock(e.target.value)}
            margin="normal"
          />
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
        <DialogTitle>Delete Branch</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this branch? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={invoiceDialogOpen} onClose={handleInvoiceDialogClose}>
        <DialogTitle>Invoices</DialogTitle>
        <DialogContent>
          <Box>
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <Box key={invoice.id} mb={2}>
                  <strong>Invoice ID:</strong> {invoice.id}
                  <br />
                  <strong>Date:</strong> {invoice.date}
                  <br />
                  <strong>Amount:</strong> {invoice.amount}
                  <br />
                  <strong>Status:</strong> {invoice.status}
                </Box>
              ))
            ) : (
              <p>No invoices found for this branch.</p>
            )}
          </Box>
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
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
