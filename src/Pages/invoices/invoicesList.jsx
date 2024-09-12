import React, { useEffect, useState } from 'react';
import { MenuItem, Select, InputLabel, FormControl, Box } from '@mui/material';
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

const createData = (invoice) => ({
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
    <IconButton color="error">
      <DeleteIcon />
    </IconButton>
  ),
});

export default function InvoiceList() {
  const [rows, setRows] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');

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
          `https://feedle.in/fursaahr/api/get_all_invoices_by_branchid.php?branchid=${selectedOption}`
        );
        const data = await response.json();

        if (data.success) {
          const formattedRows =
            Array.isArray(data.data) && data.data.length > 0
              ? data.data.map(createData)
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <FormControl
          variant="outlined"
          size="small"
          sx={{ width: '150px' }} // Adjust width as needed
        >
          <InputLabel>Select Branch</InputLabel>
          <Select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            label="Select Branch"
            sx={{ height: '35px' }} // Adjust height as needed
          >
            {dropdownOptions.map((option) => (
              <MenuItem key={option.branchid} value={option.branchid}>
                {option.branchname}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <DataTable columns={columns} rows={rows} title="Invoices" />
    </Box>
  );
}
