import React, { useEffect, useState } from 'react';
import { 
  Container, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, IconButton, Avatar, Stack, Box 
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchEmployees();
  }, [navigate]); 

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/employees', {
        headers: { 'x-user-id': user?._id }
      });
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
          navigate('/login');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:5000/api/employees/${id}`, {
          headers: { 'x-user-id': user?._id }
        });
        setEmployees(employees.filter(emp => emp._id !== id));
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  if (!user) return null; 

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Employees
        </Typography>
        {user.role === 'admin' && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/create-employee')}
          >
            Create Employee
          </Button>
        )}
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Image</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Mobile No</strong></TableCell>
              <TableCell><strong>Designation</strong></TableCell>
              <TableCell><strong>Gender</strong></TableCell>
              <TableCell><strong>Course</strong></TableCell>
              <TableCell><strong>Create Date</strong></TableCell>
              <TableCell align="center"><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row._id.slice(-4)}</TableCell>
                <TableCell>
                  <Avatar src={row.image} alt={row.name}>{row.name[0]}</Avatar>
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.mobile}</TableCell>
                <TableCell>{row.designation}</TableCell>
                <TableCell>{row.gender}</TableCell>
                <TableCell>{row.course}</TableCell>
                <TableCell>{new Date(row.createDate).toLocaleDateString()}</TableCell>
                <TableCell align="center">
                  {user.role === 'admin' ? (
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton color="primary" onClick={() => navigate(`/edit-employee/${row._id}`)} size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(row._id)} size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  ) : (
                    <Typography variant="caption" color="textSecondary">View Only</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default EmployeeList;
