import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import DataTable from './../../Components/DataTable';
import Button from '@mui/material/Button'; // Import Button

const columns = [
  { id: 'personalInfo', label: 'Personal Info', minWidth: 200 },
  { id: 'country', label: 'Country', minWidth: 150 },
  { id: 'category', label: 'Category', minWidth: 150 },
  { id: 'agent', label: 'Agent', minWidth: 150 },
  { id: 'changeAgent', label: 'Change Agent', minWidth: 150 },
  { id: 'action', label: 'Action', minWidth: 150, align: 'center' },
];

function createData(worker) {
  return {
    personalInfo: worker.name,
    country: worker.countryname,
    category: worker.category,
    agent: worker.agentname,
    changeAgent: <Button variant="outlined">Change Agent</Button>,
    action: (
      <div>
        <IconButton aria-label="view">
          <VisibilityIcon />
        </IconButton>
        <IconButton color="error" aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </div>
    ),
  };
}

export default function AllWorkersList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://feedle.in/fursaahr/api/get_workers.php'
        );
        const data = await response.json();
        console.log('API Response Data:', data); // Log API data to console
        if (data.success && Array.isArray(data.data)) {
          const formattedRows = data.data.map((worker) => createData(worker));
          setRows(formattedRows);
        } else {
          console.error('Expected array but received:', data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Render a loading state while fetching data
  }

  return (
    <div>
      <DataTable columns={columns} rows={rows} title="Workers" />
    </div>
  );
}
