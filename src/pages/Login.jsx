import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import MicrosoftIcon from '@mui/icons-material/Microsoft';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = '';

    if (name === 'email') {
      if (!value) {
        error = 'Email is required';
      } else if (!/^\S+@\S+\.\S+$/.test(value)) {
        error = 'Invalid email format';
      }
    }

    if (name === 'password') {
      if (!value) {
        error = 'Password is required';
      } else if (value.length > 13) {
        error = 'Password must be under 13 characters';
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    validateField('email', form?.email);
    validateField('password', form?.password);

    if (Object.values(errors).some((err) => err)) return;

    try {
      const res = await axios.post('https://quizzy-backend-7tnf.onrender.com//api/login', form);
      if (res?.data?.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/dashboard');
      } else {
        alert('No token received!');
      }
    } catch (err) {
      console.error('Login error:', err?.response?.data || err.message);
      alert(err?.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #7b1fa2, #9c27b0)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Typography
          variant="h4"
          sx={{
            color: 'white',
            textAlign: 'center',
            mb: 3,
            fontWeight: 'bold',
            fontFamily: 'cursive',
          }}
        >
          QUIZZY
        </Typography>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" align="center" gutterBottom sx={{ color: '#7b1fa2' }}>
            Welcome to Quiz App
          </Typography>

          <Box component="form" onSubmit={handleLogin} noValidate>
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              value={form?.email}
              onChange={handleChange}
              error={!!errors?.email}
              helperText={
                errors?.email && (
                  <>
                    <ErrorOutlineIcon fontSize="small" color="error" sx={{ mr: 0.5 }} />
                    {errors.email}
                  </>
                )
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
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
              value={form?.password}
              onChange={handleChange}
              error={!!errors?.password}
              helperText={
                errors?.password && (
                  <>
                    <ErrorOutlineIcon fontSize="small" color="error" sx={{ mr: 0.5 }} />
                    {errors.password}
                  </>
                )
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              fullWidth
              type="submit"
              sx={{ mt: 2, bgcolor: '#7b1fa2', '&:hover': { bgcolor: '#6a1b9a' } }}
            >
              Login
            </Button>
            <Typography align="center" mt={2}>
              Don’t have an account?{' '}
              <Button variant="text" onClick={() => navigate('/register')} sx={{ color: '#7b1fa2' }}>
                Register
              </Button>
            </Typography>
            <Box display="flex" justifyContent="center" gap={2} mt={3}>
              <IconButton aria-label="Google" sx={{ bgcolor: '#db4437', color: 'white' }}>
                <GoogleIcon />
              </IconButton>
              <IconButton aria-label="Microsoft" sx={{ bgcolor: '#2F2F2F', color: 'white' }}>
                <MicrosoftIcon />
              </IconButton>
              <IconButton aria-label="GitHub" sx={{ bgcolor: 'black', color: 'white' }}>
                <GitHubIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
