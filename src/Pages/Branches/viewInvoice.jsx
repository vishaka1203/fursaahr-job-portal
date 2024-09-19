import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  Box,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DownloadIcon from '@mui/icons-material/Download';
import Sidenav from '../../Components/Sidenav';
import Navbar from '../../Components/Navbar';
import DataTable from '../../Components/DataTable';

const ViewInvoice = () => {
  const { branchId } = useParams();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(
          'https://feedle.in/fursaahr/api/get_all_invoices_by_branchid.php',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ branchid: branchId }),
          }
        );
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          const formattedInvoices = data.data.map((invoice) => ({
            randomCode: invoice.randomid,
            invoiceId: invoice.invoiceid,
            invoiceDate: invoice.createdate,
            customerName: invoice.customername,
            total: invoice.total,
            userName: invoice.username,
            viewInvoice: (
              <IconButton>
                <ReceiptIcon />
              </IconButton>
            ),
            downloadQR: (
              <IconButton>
                <DownloadIcon />
              </IconButton>
            ),
            delete: (
              <IconButton
                color="error"
                onClick={() => openDeleteDialog(invoice.invoiceid)}
              >
                <DeleteIcon />
              </IconButton>
            ),
          }));
          setInvoices(formattedInvoices);
        } else {
          setSnackbarMessage('Unexpected data format.');
          setOpenSnackbar(true);
        }
      } catch (error) {
        setSnackbarMessage('Error fetching invoices.');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [branchId]);

  const openDeleteDialog = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setOpenDialog(true);
  };

  const closeDeleteDialog = () => {
    setOpenDialog(false);
    setSelectedInvoiceId(null);
  };

  const handleDeleteInvoice = async () => {
    try {
      const response = await fetch(
        'https://fursaaahr.com/api/deleteinvoice.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invoiceid: selectedInvoiceId }),
        }
      );
      const data = await response.json();

      if (data.success) {
        setInvoices((prevRows) =>
          prevRows.filter((row) => row.invoiceId !== selectedInvoiceId)
        );
        setSnackbarMessage('Invoice deleted successfully.');
      } else {
        setSnackbarMessage('Failed to delete the invoice.');
      }
    } catch (error) {
      setSnackbarMessage('An error occurred while deleting the invoice.');
    } finally {
      closeDeleteDialog();
      setOpenSnackbar(true);
    }
  };

  const columns = [
    { id: 'randomCode', label: 'Random Code', minWidth: 100 },
    { id: 'invoiceId', label: 'Invoice Id', minWidth: 100 },
    { id: 'invoiceDate', label: 'Invoice Date', minWidth: 120 },
    { id: 'customerName', label: 'Customer Name', minWidth: 150 },
    { id: 'total', label: 'Total', minWidth: 100 },
    { id: 'userName', label: 'User Name', minWidth: 120 },
    {
      id: 'viewInvoice',
      label: 'View Invoice',
      minWidth: 100,
      align: 'center',
    },
    { id: 'downloadQR', label: 'Download QR', minWidth: 120, align: 'center' },
    { id: 'delete', label: 'Delete', minWidth: 100, align: 'center' },
  ];

  if (loading) return <CircularProgress />;

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidenav />
        <div style={{ flexGrow: 1, padding: '20px' }}>
          <DataTable
            rows={invoices}
            columns={columns}
            title="Invoice List"
            button={{
              text: 'Add Invoice+',
              onClick: () => console.log('Add Invoice clicked'),
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
      <Dialog open={openDialog} onClose={closeDeleteDialog}>
        <DialogTitle>Delete Invoice</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this invoice?
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteInvoice} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewInvoice;
