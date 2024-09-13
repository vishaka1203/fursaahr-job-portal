import React, { useEffect, useState } from 'react';
import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DownloadIcon from '@mui/icons-material/Download';
import DataTable from './../../Components/DataTable';

const columns = [
  { id: 'randomCode', label: 'Random Code', minWidth: 100 },
  { id: 'invoiceId', label: 'Invoice Id', minWidth: 100 },
  { id: 'invoiceDate', label: 'Invoice Date', minWidth: 120 },
  { id: 'customerName', label: 'Customer Name', minWidth: 150 },
  { id: 'total', label: 'Total', minWidth: 100 },
  { id: 'userName', label: 'User Name', minWidth: 120 },
  { id: 'viewInvoice', label: 'View Invoice', minWidth: 100, align: 'center' },
  { id: 'downloadQR', label: 'Download QR', minWidth: 120, align: 'center' },
  { id: 'delete', label: 'Delete', minWidth: 100, align: 'center' },
];

// Function to handle invoice deletion
const handleDelete = async (invoiceId, setRows, handleClose) => {
  try {
    const response = await fetch(
      'https://fursaaahr.com/api/deleteinvoice.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceid: invoiceId,
        }),
      }
    );
    const data = await response.json();

    if (data.success) {
      alert('Invoice deleted successfully');
      // Remove the deleted invoice from the state
      setRows((prevRows) =>
        prevRows.filter((row) => row.invoiceId !== invoiceId)
      );
    } else {
      console.error('Error deleting invoice:', data.message);
      alert('Failed to delete the invoice');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while deleting the invoice');
  }
  handleClose(); // Close the dialog
};

const createData = (invoice, setRows, openDialog) => ({
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
    <IconButton color="error" onClick={() => openDialog(invoice.invoiceid)}>
      <DeleteIcon />
    </IconButton>
  ),
});

export default function InvoiceList() {
  const [rows, setRows] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');

  // State for dialog
  const [open, setOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const openDialog = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setSelectedInvoiceId(null);
  };

  // Fetch branch options
  useEffect(() => {
    fetch('https://feedle.in/fursaahr/api/getbranches.php')
      .then((response) => response.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setDropdownOptions(data.data);
        } else {
          console.error('Unexpected data format:', data);
        }
      })
      .catch((error) => console.error('Error fetching branch options:', error));
  }, []);

  // Fetch invoices when branch is selected
  useEffect(() => {
    if (!selectedOption) return;

    const fetchInvoices = async () => {
      try {
        const response = await fetch(
          'https://feedle.in/fursaahr/api/get_all_invoices_by_branchid.php',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              branchid: selectedOption,
            }),
          }
        );
        const data = await response.json();

        if (data.success) {
          const formattedRows =
            Array.isArray(data.data) && data.data.length > 0
              ? data.data.map((invoice) =>
                  createData(invoice, setRows, openDialog)
                )
              : [];
          setRows(formattedRows);
        } else {
          console.error('Error:', data.message);
          setRows([]);
        }
      } catch (error) {
        console.error('Error fetching table data:', error);
        setRows([]);
      }
    };

    fetchInvoices();
  }, [selectedOption]);

  const dropdown = (
    <FormControl variant="outlined" size="small" sx={{ width: '150px' }}>
      <InputLabel>Select Branch</InputLabel>
      <Select
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        label="Select Branch"
        sx={{ height: '35px' }}
      >
        {dropdownOptions.map((option) => (
          <MenuItem key={option.branchid} value={option.branchid}>
            {option.branchname}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <DataTable
        columns={columns}
        rows={rows}
        title="Invoices"
        dropdown={dropdown}
      />

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>Delete Invoice</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this invoice?
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() =>
              handleDelete(selectedInvoiceId, setRows, closeDialog)
            }
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
