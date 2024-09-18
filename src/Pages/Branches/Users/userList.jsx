import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress, IconButton, Snackbar, Alert } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import Sidenav from '../../../Components/Sidenav';
import Navbar from '../../../Components/Navbar';
import DataTable from '../../../Components/DataTable';

export default function UserList() {
  const { branchId } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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

  const handleDeleteUser = (userId) => {
    // Implement delete logic here
    console.log(`Deleting userId: ${userId}`);
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
      renderCell: () => (
        <IconButton>
          <span style={{ fontSize: '1.5rem' }}>+</span>
        </IconButton>
      ),
    },
    {
      id: 'delete',
      label: 'Delete',
      minWidth: 100,
      align: 'center',
      renderCell: (params) => (
        <IconButton onClick={() => handleDeleteUser(params.id)}>
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
          <h2>Users {branchId}</h2>
          <DataTable
            rows={users}
            columns={columns}
            title="User List"
            button={{
              text: 'Add User+',
              onClick: () => console.log('Add User clicked'),
            }}
          />
        </div>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
