import React from 'react';

import Sidebar from '../../Components/AgentSidenav'; // Ensure the correct import path
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  IconButton,
  Divider,
} from '@mui/material'; // Material UI components
import {
  Dashboard,
  AttachMoney,
  RequestPage,
  Notifications,
} from '@mui/icons-material'; // Material UI icons
import { CircularProgress, Chip } from '@mui/material'; // Additional Material UI components
import AgentNavbar from '../../Components/AgentNavbar';

const AgentDashboard = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar component */}
      <Sidebar />

      {/* Main content area */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}
      >
        {/* Top Navbar */}
        <AgentNavbar />

        {/* Main content */}
        <Box
          sx={{
            flexGrow: 1,
            padding: 3,
            backgroundColor: '#f5f5f5', // Light gray background
          }}
        >
          <Container>
            {/* Main Content Header */}
            <Typography variant="h4" component="h1" gutterBottom>
              Dashboard
            </Typography>

            {/* Content Grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 3,
                marginBottom: 3,
              }}
            >
              {/* Card 1 */}
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  boxShadow: 3,
                  borderRadius: 2,
                  backgroundColor: '#e3f2fd', // Light blue background
                }}
              >
                <CardContent>
                  <IconButton sx={{ fontSize: 40, color: '#0288d1' }}>
                    <Dashboard />
                  </IconButton>
                  <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
                    Branches Overview
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 2 }}>
                    25
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Total Branches
                  </Typography>
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  boxShadow: 3,
                  borderRadius: 2,
                  backgroundColor: '#f1f8e9', // Light green background
                }}
              >
                <CardContent>
                  <IconButton sx={{ fontSize: 40, color: '#4caf50' }}>
                    <AttachMoney />
                  </IconButton>
                  <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
                    Invoices
                  </Typography>
                  <CircularProgress
                    variant="determinate"
                    value={75}
                    sx={{ alignSelf: 'center', mt: 2, color: '#4caf50' }}
                  />
                  <Typography sx={{ textAlign: 'center', mt: 1 }}>
                    75% Completed
                  </Typography>
                </CardContent>
              </Card>

              {/* Card 3 */}
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  boxShadow: 3,
                  borderRadius: 2,
                  backgroundColor: '#fff9c4', // Light yellow background
                }}
              >
                <CardContent>
                  <IconButton sx={{ fontSize: 40, color: '#fbc02d' }}>
                    <RequestPage />
                  </IconButton>
                  <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
                    All Requests
                  </Typography>
                  <Chip
                    label="10 New Requests"
                    color="primary"
                    sx={{ alignSelf: 'center', mt: 2 }}
                  />
                </CardContent>
              </Card>

              {/* New Card */}
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  boxShadow: 3,
                  borderRadius: 2,
                  backgroundColor: '#ffebee', // Light red background
                }}
              >
                <CardContent>
                  <IconButton sx={{ fontSize: 40, color: '#c62828' }}>
                    <Notifications />
                  </IconButton>
                  <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
                    Notifications
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography>No new notifications.</Typography>
                </CardContent>
              </Card>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default AgentDashboard;
