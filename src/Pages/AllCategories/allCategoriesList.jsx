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
  Box,
  Snackbar,
  Alert,
  DialogContentText,
} from '@mui/material';

const columns = [
  { id: 'image', label: 'Image', minWidth: 100, align: 'center' },
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'arabicName', label: 'Arabic Name', minWidth: 170 },
  { id: 'action', label: 'Action', minWidth: 100, align: 'center' },
];

function createData(category, handleEditClick, handleDeleteClick) {
  const imageURL = `https://feedle.in/fursaahr/uploads/${category.categoryImg}`;

  // Debugging: Log the image URL to check if it's correctly constructed
  console.log('Image URL:', imageURL);

  return {
    image: (
      <img
        src={imageURL}
        alt={category.category}
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
    name: category.category,
    arabicName: category.arabicName,
    action: (
      <>
        <IconButton onClick={() => handleEditClick(category)}>
          <EditIcon />
        </IconButton>
        <IconButton color="error" onClick={() => handleDeleteClick(category)}>
          <DeleteIcon />
        </IconButton>
      </>
    ),
  };
}

export default function AllCategoriesList() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    fetch('https://feedle.in/fursaahr/api/getcategory.php')
      .then((response) => response.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const formattedRows = data.data.map((category) =>
            createData(category, handleEditClick, handleDeleteClick)
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
    setSelectedCategoryId(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEditClick = (category) => {
    setEditMode(true);
    setSelectedCategoryId(category.categoryId);
    setOpen(true);
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!categoryToDelete) return;

    fetch('https://feedle.in/fursaahr/api/deletecategory.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: categoryToDelete.categoryId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSnackbarMessage('Category deleted successfully');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          setRows((prevRows) =>
            prevRows.filter((row) => row.name !== categoryToDelete.category)
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
        setCategoryToDelete(null);
      });
  };

  return (
    <div>
      <DataTable
        columns={columns}
        rows={rows}
        title="All Categories"
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
            Are you sure you want to delete this category?
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
