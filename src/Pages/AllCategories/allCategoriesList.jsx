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
  TextField,
  InputLabel,
  FormControl,
  Input,
} from '@mui/material';

const columns = [
  { id: 'image', label: 'Image', minWidth: 100, align: 'center' },
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'arabicName', label: 'Arabic Name', minWidth: 170 },
  { id: 'action', label: 'Action', minWidth: 100, align: 'center' },
];

function createData(category, handleEditClick, handleDeleteClick) {
  const imageURL = `https://feedle.in/fursaahr/uploads/${category.categoryImg}`;

  return {
    image: (
      <img
        src={imageURL}
        alt={category.category}
        onError={handleImageError}
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

const handleImageError = (e) => {
  e.target.onerror = null;
  e.target.src = 'https://via.placeholder.com/50'; // Fallback image
};

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
  const [formData, setFormData] = useState({
    name: '',
    arabicName: '',
    image: null,
  });

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
    setOpen(true);
    clearForm();
  };

  const handleClose = () => {
    setOpen(false);
    clearForm();
  };

  const clearForm = () => {
    setSelectedCategoryId(null);
    setFormData({
      name: '',
      arabicName: '',
      image: null,
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEditClick = (category) => {
    setEditMode(true);
    setSelectedCategoryId(category.categoryId);
    setFormData({
      name: category.category,
      arabicName: category.arabicName,
      image: null,
    });
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
      body: JSON.stringify({ id: categoryToDelete.categoryId }), // Send categoryId dynamically
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

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleFormSubmit = () => {
    const { name, arabicName, image } = formData;

    if (!name || !arabicName || !image) {
      setSnackbarMessage('All fields are required');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('category', name);
    formDataToSend.append('arabicName', arabicName);
    formDataToSend.append('categoryImg', image);

    const url = editMode
      ? 'https://feedle.in/fursaahr/api/updatecategory.php'
      : 'https://feedle.in/fursaahr/api/createcategory.php';

    fetch(url, {
      method: 'POST',
      body: formDataToSend,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSnackbarMessage(
            editMode
              ? 'Category updated successfully'
              : 'Category created successfully'
          );
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          handleClose();
          setRows((prevRows) => [
            ...prevRows,
            createData(data.data, handleEditClick, handleDeleteClick),
          ]);
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

  return (
    <div>
      <DataTable
        columns={columns}
        rows={rows}
        title="Category List"
        button={{ text: '+' }}
        onButtonClick={handleAddCategoryClick}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editMode ? 'Edit Category' : 'Create Category'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {editMode
              ? 'Update the category details'
              : 'Fill in the details to create a new category'}
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="image">Choose File *</InputLabel>
              <Input
                type="file"
                name="image"
                id="image"
                onChange={handleFormChange}
                required
              />
            </FormControl>
            <TextField
              name="name"
              label="Name *"
              value={formData.name}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="arabicName"
              label="Arabic Name *"
              value={formData.arabicName}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleFormSubmit}>
            {editMode ? 'Update' : 'Create'}
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

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this category?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
