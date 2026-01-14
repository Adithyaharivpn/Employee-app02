import React, { useState } from 'react';
import { 
  Container, Box, Typography, TextField, Button, Alert, Paper, Link as MuiLink, 
  FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !password) {
      setError('Please fill all fields');
      return;
    }

    try {
      if (isLogin) {
        const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
        localStorage.setItem('user', JSON.stringify(res.data.user));
        window.location.href = '/'; 
      } else {
        await axios.post('http://localhost:5000/api/auth/register', { username, password, role });
        setSuccess('Registration successful! Please login.');
        setIsLogin(true);
        setUsername('');
        setPassword('');
        setRole('user');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setUsername('');
    setPassword('');
    setRole('user');
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          {isLogin ? 'Sign In' : 'Sign Up'}
        </Typography>
        
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />

          {!isLogin && (
             <FormControl fullWidth margin="normal">
               <InputLabel id="role-label">Role</InputLabel>
               <Select
                 labelId="role-label"
                 value={role}
                 label="Role"
                 onChange={(e) => setRole(e.target.value)}
               >
                 <MenuItem value="user">User</MenuItem>
                 <MenuItem value="admin">Admin</MenuItem>
               </Select>
             </FormControl>
          )}

          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            size="large"
            sx={{ mt: 3, mb: 2 }}
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
          
          <Box display="flex" justifyContent="center" width="100%">
              <MuiLink component="button" variant="body2" onClick={toggleMode} type="button">
                  {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
