import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  Container,
  Box,
  Alert,
} from '@mui/material';
import Logo from '../Assets/fursaaHrLogo.jpg';

const LoginForm = () => {
  const [mobileOrEmail, setMobileOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!mobileOrEmail) {
      return 'Number or Email is required';
    }

    // Basic email or mobile number validation regex
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
      console.log('Sending request with:', { mobile: mobileOrEmail, password });

      const response = await fetch('https://feedle.in/fursaahr/api/login.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: mobileOrEmail, // Ensure the key is 'mobile' as per API requirement
          password,
        }),
      });

      const result = await response.json();

      console.log('API Response:', result); // Log the full API response

      if (response.ok) {
        if (result.success) {
          // Handle successful login
          console.log('Login successful:', result);
          // Optionally redirect the user or perform another action
        } else {
          // Handle specific error messages
          setError(result.message || 'Login failed');
        }
      } else {
        // Handle network errors or unexpected response status
        setError('An unexpected error occurred');
      }
    } catch (err) {
      console.error('Error during login:', err); // Log the error for debugging
      setError('An error occurred while logging in');
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
          style={{ width: '150px', marginBottom: '20px' }}
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

          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
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
