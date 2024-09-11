import React from 'react';
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  Container,
  Box,
} from '@mui/material';
import Logo from '../Assets/fursaaHrLogo.jpg'; // Ensure the path is correct

const loginForm = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white', // Ensure the background is visible against shadow
          padding: 4,
          borderRadius: 2,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Box shadow effect
        }}
      >
        {/* Custom Logo */}
        <img
          src={Logo} // Use the imported logo directly here
          alt="Logo"
          style={{ width: '150px', marginBottom: '20px' }} // Maximized logo size
        />

        {/* Login Heading */}
        <Typography component="h1" variant="h5">
          Login
        </Typography>

        {/* Login Form */}
        <Box component="form" sx={{ mt: 3 }}>
          {/* Mobile/Email Field */}
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
          />

          {/* Password Field */}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label=" Enter Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />

          {/* Remember Me Checkbox */}
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />

          {/* Login Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default loginForm;
