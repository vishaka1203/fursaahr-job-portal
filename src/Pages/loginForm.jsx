import axios from 'axios';
import React, { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Alert,
} from '@mui/material';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Logo from '../Assets/fursaaHrLogo.jpg';

const LoginForm = () => {
  const [mobileOrEmail, setMobileOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!mobileOrEmail) {
      return 'Number or Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mobileOrEmail) && !/^[0-9]{10}$/.test(mobileOrEmail)) {
      return 'Invalid email or mobile number';
    }
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      // Sending POST request with the credentials
      const response = await axios.post(
        'https://feedle.in/fursaahr/api/login.php',
        {
          mobile: mobileOrEmail,
          password: password,
        }
      );

      if (!response.data.success) {
        setError(response.data.message || 'Login failed');
      } else {
        Cookies.set('userId', response.data.data.userid);
        Cookies.set('userName', response.data.data.fullname);
        Cookies.set('token', response.data.data.jwtToken);
        Cookies.set('userType', response.data.data.usertype);
        Cookies.set('email', response.data.data.emailid);
        Cookies.set('branchId', response.data.data.branchid);

        // Redirect to Admin Dashboard if user is superadmin
        if (response.data.data.usertype === 'superadmin') {
          navigate('/admin');
        } else {
          navigate('/agent'); // Or another route based on user type
        }
      }
    } catch (error) {
      console.error('Request Error:', error); // Log the error
      setError('Request timed out or failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: 4,
          borderRadius: 2,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <img
          src={Logo}
          alt="Logo"
          width={150}
          height={50}
          style={{ marginBottom: '20px' }}
        />
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" sx={{ mt: 3 }} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="mobileOrEmail"
            label="Enter Number or Email"
            name="mobileOrEmail"
            autoComplete="tel email"
            autoFocus
            value={mobileOrEmail}
            onChange={(e) => setMobileOrEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Enter Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginForm;
