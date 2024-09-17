import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import DataTable from './../../Components/DataTable';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const columns = [
  { id: 'personalInfo', label: 'Personal Info', minWidth: 200 },
  { id: 'country', label: 'Country', minWidth: 150 },
  { id: 'category', label: 'Category', minWidth: 150 },
  { id: 'agent', label: 'Agent', minWidth: 150 },
  { id: 'changeAgent', label: 'Change Agent', minWidth: 150 },
  { id: 'action', label: 'Action', minWidth: 150, align: 'center' },
];

function createData(worker, openChangeAgentModal, openViewModal) {
  return {
    personalInfo: worker.name,
    country: worker.countryname,
    category: worker.category,
    agent: worker.agentname,
    changeAgent: (
      <Button variant="outlined" onClick={() => openChangeAgentModal(worker)}>
        Change Agent
      </Button>
    ),
    action: (
      <div>
        <IconButton aria-label="view" onClick={() => openViewModal(worker)}>
          <VisibilityIcon />
        </IconButton>
        <IconButton color="error" aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </div>
    ),
  };
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: '600px', // Adjust width as needed
    width: '100%',
    maxHeight: '80vh', // Adjust height as needed
    overflowY: 'auto',
  },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
}));

export default function AllWorkersList() {
  const [rows, setRows] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openChangeAgent, setOpenChangeAgent] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [workerDetails, setWorkerDetails] = useState(null);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch(
          'https://feedle.in/fursaahr/api/get_workers.php',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userid: 0 }),
          }
        );
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setRows(data.data);
        } else {
          console.error('Expected array but received:', data);
        }
      } catch (error) {
        console.error('Error fetching workers data:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          'https://feedle.in/fursaahr/api/getallusers.php'
        );
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setUserOptions(data.data);
        } else {
          console.error('Expected array but received:', data);
        }
      } catch (error) {
        console.error('Error fetching users data:', error);
      }
    };

    fetchWorkers();
    fetchUsers();
    setLoading(false);
  }, []);

  const handleOpenChangeAgent = (worker) => {
    setSelectedWorker(worker);
    setOpenChangeAgent(true);
  };

  const handleCloseChangeAgent = () => {
    setOpenChangeAgent(false);
  };

  const handleAssign = async () => {
    const agent = userOptions.find((user) => user.username === selectedAgent);
    if (!agent) {
      console.error('Selected agent not found');
      return;
    }

    const payload = {
      userid: agent.userid,
      workerid: selectedWorker.workerId,
    };

    try {
      const response = await fetch(
        'https://feedle.in/fursaahr/api/change_agent.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (result.success) {
        console.log(
          `Assigned agent ${selectedAgent} to worker ${selectedWorker.name}`
        );
        // Optionally update the UI after successful assignment
      } else {
        console.error('Failed to assign agent:', result.message);
      }
    } catch (error) {
      console.error('Error assigning agent:', error);
    } finally {
      setOpenChangeAgent(false);
    }
  };

  const handleOpenView = async (worker) => {
    setSelectedWorker(worker);
    try {
      const response = await fetch(
        'https://feedle.in/fursaahr/api/get_workers.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userid: 0 }), // Pass the correct payload if needed
        }
      );
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        const workerDetail = data.data.find(
          (item) => item.workerId === worker.workerId
        );
        setWorkerDetails(workerDetail);
        setOpenView(true);
      } else {
        console.error('Expected array but received:', data);
      }
    } catch (error) {
      console.error('Error fetching worker details:', error);
    }
  };

  const handleCloseView = () => {
    setOpenView(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const formattedRows = rows.map((worker) =>
    createData(worker, handleOpenChangeAgent, handleOpenView)
  );

  return (
    <div>
      <DataTable columns={columns} rows={formattedRows} title="Workers" />

      {/* Modal for Changing Agent */}
      <StyledDialog open={openChangeAgent} onClose={handleCloseChangeAgent}>
        <DialogTitle>Select Agent:</DialogTitle>
        <StyledDialogContent>
          <FormControl fullWidth>
            <InputLabel>Agent</InputLabel>
            <Select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              label="Agent"
            >
              {userOptions.map((user) => (
                <MenuItem key={user.userid} value={user.username}>
                  {user.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </StyledDialogContent>
        <DialogActions>
          <Button onClick={handleCloseChangeAgent} color="primary">
            Close
          </Button>
          <Button onClick={handleAssign} color="primary" variant="contained">
            Assign
          </Button>
        </DialogActions>
      </StyledDialog>

      {/* Modal for Viewing Worker Details */}
      <StyledDialog open={openView} onClose={handleCloseView}>
        <DialogTitle>Worker Details</DialogTitle>
        <StyledDialogContent>
          {workerDetails && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              <Typography variant="h6">Country Info:</Typography>
              <Typography>Country: {workerDetails.countryname}</Typography>
              <Typography>
                Arabic Country: {workerDetails.arabiccountryname}
              </Typography>
              <Typography variant="h6">Category Info:</Typography>
              <Typography>Category: {workerDetails.category}</Typography>
              <Typography>
                Arabic Category: {workerDetails.arabiccategoryname}
              </Typography>
              <img
                src={`https://feedle.in/fursaahr/images/${workerDetails.image}`}
                alt={workerDetails.name}
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          )}
        </StyledDialogContent>
        <DialogActions>
          <Button onClick={handleCloseView} color="primary">
            Close
          </Button>
        </DialogActions>
      </StyledDialog>
    </div>
  );
}
