import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DataTable from './../../Components/DataTable';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  DialogContentText,
} from '@mui/material';

const columns = [
  { id: 'image', label: 'Image', minWidth: 100, align: 'center' },
  { id: 'subCategory', label: 'Sub-Category', minWidth: 100, align: 'center' },
  { id: 'arabicName', label: 'Arabic Name', minWidth: 170 },
  { id: 'categoryname', label: 'Category', minWidth: 170 }, // Ensure this matches the field in the data
  { id: 'action', label: 'Action', minWidth: 100, align: 'center' },
];

function createData(subCategory, handleEditClick, handleDeleteClick) {
  const imageURL = `https://feedle.in/fursaahr/uploads/${subCategory.subCategoryImg}`;

  // Debugging: Log the image URL and subCategory object to check if it's correctly constructed
  console.log('Image URL:', imageURL);
  console.log('SubCategory:', subCategory);

  return {
    image: (
      <img
        src={imageURL}
        alt={subCategory.subCategory}
        onError={(e) => {
          // Error handling: Log if the image cannot load
          console.error(`Error loading image at ${imageURL}`);
          e.target.onerror = null; // Prevent infinite loop if fallback fails
          e.target.src = 'https://via.placeholder.com/50'; // Placeholder image if the actual image fails to load
        }}
        style={{
          height: '50px',
          width: '50px',
          objectFit: 'cover',
          borderRadius: '4px',
        }}
      />
    ),
    subCategory: subCategory.subCategory || 'N/A', // Default value if subCategory is missing
    name: subCategory.name || 'N/A', // Default value if name is missing
    arabicName: subCategory.arabicName || 'N/A', // Default value if arabicName is missing
    categoryname: subCategory.categoryname || 'N/A', // Ensure this field is properly mapped
    action: (
      <>
        <IconButton onClick={() => handleEditClick(subCategory)}>
          <EditIcon />
        </IconButton>
        <IconButton
          color="error"
          onClick={() => handleDeleteClick(subCategory)}
        >
          <DeleteIcon />
        </IconButton>
      </>
    ),
  };
}

export default function AllSubCategoriesList() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState(null);

  useEffect(() => {
    // Replace the URL with the correct API endpoint
    fetch('https://feedle.in/fursaahr/api/getsubcategory.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryid: 0 }), // Update the payload as needed
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('API Response:', data); // Log API response for debugging
        if (data.success && Array.isArray(data.data)) {
          const formattedRows = data.data.map((subCategory) =>
            createData(subCategory, handleEditClick, handleDeleteClick)
          );
          setRows(formattedRows);
        } else {
          console.error('Expected array but received:', data);
        }
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleAddCategoryClick = () => {
    setEditMode(false);
    setOpen(true);
    clearForm();
  };

  const handleClose = () => {
    setOpen(false);
    clearForm();
  };

  const clearForm = () => {
    setSelectedSubCategoryId(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEditClick = (subCategory) => {
    setEditMode(true);
    setSelectedSubCategoryId(subCategory.subCategoryId);
    setOpen(true);
  };

  const handleDeleteClick = (subCategory) => {
    setSubCategoryToDelete(subCategory);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!subCategoryToDelete) return;

    fetch('https://feedle.in/fursaahr/api/deletesubcategory.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: subCategoryToDelete.subCategoryId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSnackbarMessage('Sub-Category deleted successfully');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          setRows((prevRows) =>
            prevRows.filter(
              (row) => row.subCategory !== subCategoryToDelete.subCategory
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
        setSubCategoryToDelete(null);
      });
  };

  return (
    <div>
      <DataTable
        columns={columns}
        rows={rows}
        title="All Sub-Categories"
        button={{ text: '+' }}
        onButtonClick={handleAddCategoryClick}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this sub-category?
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
