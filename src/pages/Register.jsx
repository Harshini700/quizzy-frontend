import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  InputAdornment,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const navigate = useNavigate();

  const validate = (field = null) => {
    const errs = { ...errors };

    if (!field || field === 'name') {
      if (!form.name?.trim()) {
        errs.name = 'Name is required';
      } else if (!isNaN(form.name)) {
        errs.name = 'Name must not be a number';
      } else {
        delete errs.name;
      }
    }

    if (!field || field === 'email') {
      if (!form.email) {
        errs.email = 'Email is required';
      } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
        errs.email = 'Invalid email format';
      } else {
        delete errs.email;
      }
    }

    if (!field || field === 'password') {
      if (!form.password) {
        errs.password = 'Password is required';
      } else if (form.password.length > 12) {
        errs.password = 'Password must be under 12 characters';
      } else {
        delete errs.password;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    validate(name);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post('https://quizzy-backend-7tnf.onrender.com/api/register', form);
      setSnackbar({ open: true, message: 'Registration successful! Redirecting to login...', severity: 'success' });

      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || 'Registration failed',
        severity: 'error'
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f3e5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ p: 4 }}>
          <Typography
            variant="h4"
            align="center"
            sx={{ color: '#6a1b9a', fontWeight: 'bold', mb: 2 }}
          >
             Register to Quizzy
          </Typography>

          <Box component="form" onSubmit={handleRegister}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              margin="normal"
              value={form?.name || ''}
              onChange={handleChange}
              error={!!errors?.name}
              helperText={errors?.name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Email"
              name="email"
              fullWidth
              margin="normal"
              value={form?.email || ''}
              onChange={handleChange}
              error={!!errors?.email}
              helperText={errors?.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              value={form?.password || ''}
              onChange={handleChange}
              error={!!errors?.password}
              helperText={errors?.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              fullWidth
              type="submit"
              sx={{
                mt: 2,
                bgcolor: '#8e24aa',
                '&:hover': { bgcolor: '#6a1b9a' },
              }}
            >
              Sign Up
            </Button>

            <Button fullWidth onClick={() => navigate('/login')} sx={{ mt: 1 }}>
              Already have an account? Login
            </Button>
          </Box>
        </Paper>

        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Register;
