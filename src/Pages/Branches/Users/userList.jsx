import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress, IconButton, Snackbar, Alert } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Sidenav from '../../../Components/Sidenav';
import Navbar from '../../../Components/Navbar';
import DataTable from '../../../Components/DataTable';

export default function UserList() {
  const { branchId } = useParams(); // Get branchid from URL
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    console.log(branchId);

    fetch('https://feedle.in/fursaahr/api/get_user_by_branchid.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ branchid: branchId }),
    })
      .then((response) => {
        const data = response.data;
        console.log(data);
        if (data?.success && data?.data) {
          setUsers(data.data);
        } else {
          console.error('Expected array but received:', data);
          setSnackbarMessage('Unexpected data format.');
          setOpenSnackbar(true);
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setSnackbarMessage('Error fetching users.');
        setOpenSnackbar(true);
      })
      .finally(() => setLoading(false));
  }, [branchId]);

  // Handle View Invoices action
  const handleViewInvoices = (userId) => {
    console.log(`Fetching invoices for userId: ${userId}`);
    axios
      .post('https://feedle.in/fursaahr/api/view_invoices.php', { userId })
      .then((response) => {
        const data = response.data;
        console.log('Invoices data:', data);
        if (data.success) {
          // Process and display the invoices data
          console.log('Invoices data:', data.data);
          // Further processing or state update can go here
        } else {
          setSnackbarMessage('No invoices found.');
          setOpenSnackbar(true);
        }
      })
      .catch((error) => {
        console.error('Error fetching invoices:', error);
        setSnackbarMessage('Error fetching invoices.');
        setOpenSnackbar(true);
      });
  };

  // Define columns for DataTable
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
        <IconButton onClick={() => handleViewInvoices(params.row.id)}>
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
      renderCell: () => (
        <IconButton>
          <span style={{ fontSize: '1.5rem', color: 'red' }}>🗑️</span>
        </IconButton>
      ),
    },
  ];

  if (loading) return <CircularProgress />;

  return (
    <div>
      {/* Add Navbar at the top */}
      <Navbar />

      {/* Container with Sidenav and Main Content */}
      <div style={{ display: 'flex' }}>
        {/* Add Sidenav on the left */}
        <Sidenav />

        {/* Main content on the right */}
        <div style={{ flexGrow: 1, padding: '20px' }}>
          <h2>Users {branchId}</h2>

          {/* Use DataTable */}
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

      {/* Snackbar for notifications */}
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
