import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Sidenav from '../../../Components/Sidenav';
import Navbar from '../../../Components/Navbar';
import DataTable from '../../../Components/DataTable';

export default function UserList() {
  const { branchId } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openCountDialog, setOpenCountDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    mobile_number: '',
    whatsapp: '',
    email: '',
    password: '',
  });
  const [currentUserId, setCurrentUserId] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    fetch('https://feedle.in/fursaahr/api/get_user_by_branchid.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ branchid: branchId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.success && Array.isArray(data?.data)) {
          setUsers(data.data);
        } else {
          setSnackbarMessage('Unexpected data format.');
          setOpenSnackbar(true);
        }
      })
      .catch(() => {
        setSnackbarMessage('Error fetching users.');
        setOpenSnackbar(true);
      })
      .finally(() => setLoading(false));
  }, [branchId]);

  const handleViewInvoices = (userId) => {
    axios
      .post('https://feedle.in/fursaahr/api/view_invoices.php', { userId })
      .then((response) => {
        if (!response.data.success) {
          setSnackbarMessage('No invoices found.');
          setOpenSnackbar(true);
        }
      })
      .catch(() => {
        setSnackbarMessage('Error fetching invoices.');
        setOpenSnackbar(true);
      });
  };

  const handleDeleteUser = () => {
    axios
      .post('https://feedle.in/fursaahr/api/deleteuser.php', {
        userid: currentUserId,
      })
      .then((response) => {
        if (response.data.success) {
          setSnackbarMessage('User deleted successfully.');
          setUsers(users.filter((user) => user.id !== currentUserId));
        } else {
          setSnackbarMessage('Error deleting user.');
        }
        setOpenSnackbar(true);
        setOpenDeleteDialog(false);
      })
      .catch(() => {
        setSnackbarMessage('Error deleting user.');
        setOpenSnackbar(true);
      });
  };

  const handleAddUser = () => {
    axios
      .post('https://feedle.in/fursaahr/api/create_user.php', {
        ...newUser,
        branchid: branchId,
      })
      .then((response) => {
        if (response.data.success) {
          setUsers((prev) => [...prev, response.data.newUser]);
          setSnackbarMessage('User created successfully');
        } else {
          setSnackbarMessage('Error creating user');
        }
        setOpenSnackbar(true);
        setOpenUserDialog(false);
      })
      .catch(() => {
        setSnackbarMessage('Error creating user.');
        setOpenSnackbar(true);
      });
  };

  const handleOpenCountDialog = (userId, count) => {
    if (!userId) return;
    setCurrentUserId(userId);
    setPendingCount(count || 0);
    setOpenCountDialog(true);
  };

  const handleCloseCountDialog = () => {
    setOpenCountDialog(false);
  };

  const handleAddCount = () => {
    if (currentUserId === null || pendingCount === undefined) {
      setSnackbarMessage('Invalid data.');
      setOpenSnackbar(true);
      return;
    }

    axios
      .post('https://feedle.in/fursaahr/api/addcount.php', {
        userid: currentUserId,
        count: pendingCount,
      })
      .then((response) => {
        if (response.data.success) {
          setSnackbarMessage('Count added successfully.');
          setUsers(
            users.map((user) =>
              user.id === currentUserId
                ? { ...user, pendingcount: pendingCount }
                : user
            )
          );
        } else {
          setSnackbarMessage('Failed to add count.');
        }
        setOpenSnackbar(true);
      })
      .catch(() => {
        setSnackbarMessage('Error adding count.');
        setOpenSnackbar(true);
      })
      .finally(() => {
        setOpenCountDialog(false);
      });
  };

  const columns = [
    { id: 'username', label: 'Name', minWidth: 100 },
    { id: 'mobile_number', label: 'Mobile', minWidth: 100 },
    { id: 'whatsapp', label: 'WhatsApp', minWidth: 100 },
    { id: 'email', label: 'Email', minWidth: 150 },
    { id: 'pendingcount', label: 'Pending Count', minWidth: 120 },
    {
      id: 'view_invoices',
      label: 'View Invoices',
      minWidth: 150,
      align: 'center',
      renderCell: (params) => (
        <IconButton onClick={() => handleViewInvoices(params.id)}>
          <VisibilityIcon />
        </IconButton>
      ),
    },
    {
      id: 'add_count',
      label: 'Add Count',
      minWidth: 100,
      align: 'center',
      renderCell: (params) => {
        const pendingCount = params.row?.pendingcount || 0;
        return (
          <IconButton
            onClick={() => handleOpenCountDialog(params.id, pendingCount)}
          >
            <AddIcon />
          </IconButton>
        );
      },
    },
    {
      id: 'delete',
      label: 'Delete',
      minWidth: 100,
      align: 'center',
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            setCurrentUserId(params.id);
            setOpenDeleteDialog(true);
          }}
        >
          <DeleteIcon style={{ color: 'red' }} />
        </IconButton>
      ),
    },
  ];

  if (loading) return <CircularProgress />;

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidenav />
        <div style={{ flexGrow: 1, padding: '20px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenUserDialog(true)}
            style={{ marginBottom: '20px' }}
          >
            Add User+
          </Button>
          <DataTable
            rows={users.filter((user) => user && user.username)}
            columns={columns}
            title="User List"
          />
        </div>
      </div>

      <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)}>
        <DialogTitle>Create User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="User Name"
            id="username"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Mobile Number"
            id="mobile_number"
            value={newUser.mobile_number}
            onChange={(e) =>
              setNewUser({ ...newUser, mobile_number: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="WhatsApp Number"
            id="whatsapp"
            value={newUser.whatsapp}
            onChange={(e) =>
              setNewUser({ ...newUser, whatsapp: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Email"
            id="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Password"
            id="password"
            type="password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserDialog(false)}>Close</Button>
          <Button onClick={handleAddUser} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCountDialog} onClose={handleCloseCountDialog}>
        <DialogTitle>Add Pending Count</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Pending Count"
            type="number"
            fullWidth
            value={pendingCount}
            onChange={(e) => {
              const value = Math.max(0, Number(e.target.value)); // Ensures count is non-negative
              setPendingCount(value);
            }}
            InputProps={{ inputProps: { min: 0 } }} // Enforces non-negative input
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCountDialog}>Close</Button>
          <Button onClick={handleAddCount} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this user?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
