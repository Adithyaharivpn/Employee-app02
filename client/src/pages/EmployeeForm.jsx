import React, { useEffect, useState } from 'react';
import { 
  Container, Box, Typography, TextField, Button, Alert, Paper, 
  MenuItem, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const designations = ['HR', 'Manager', 'Sales'];
const courses = ['MCA', 'BCA', 'BSC'];

const EmployeeForm = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        designation: '',
        gender: '',
        course: '',
        image: ''
    });

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role !== 'admin') {
            navigate('/');
            return;
        }

        if (isEdit) {
            fetchEmployee();
        }
    }, [id, navigate]);

    const fetchEmployee = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/employees/${id}`, {
              headers: { 'x-user-id': user?._id }
            });
            const emp = res.data;
            if(emp) {
                setFormData({
                    name: emp.name,
                    email: emp.email,
                    mobile: emp.mobile,
                    designation: emp.designation,
                    gender: emp.gender,
                    course: emp.course,
                    image: emp.image || ''
                });
            }
        } catch (err) {
            setError("Could not fetch employee data");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.name) tempErrors.name = "Name is required";
        if (!formData.email) tempErrors.email = "Email is required";
        
        if (!formData.mobile) tempErrors.mobile = "Mobile is required";

        if (!formData.designation) tempErrors.designation = "Designation is required";
        if (!formData.gender) tempErrors.gender = "Gender is required";
        if (!formData.course) tempErrors.course = "Course is required";

        setFormErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!validate()) return;

        const config = { headers: { 'x-user-id': user?._id } };

        try {
            if (isEdit) {
                await axios.put(`http://localhost:5000/api/employees/${id}`, formData, config);
            } else {
                await axios.post('http://localhost:5000/api/employees', formData, config);
            }
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed');
        }
    };

  if (!user || user.role !== 'admin') return null; 

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          {isEdit ? 'Edit Employee' : 'Create Employee'}
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            error={Boolean(formErrors.name)}
            helperText={formErrors.name}
            margin="normal"
          />
          <TextField
            fullWidth
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            error={Boolean(formErrors.email)}
            helperText={formErrors.email}
            margin="normal"
            disabled={isEdit}
          />
          <TextField
            fullWidth
            name="mobile"
            label="Mobile No"
            value={formData.mobile}
            onChange={handleChange}
            error={Boolean(formErrors.mobile)}
            helperText={formErrors.mobile}
            margin="normal"
          />
          
          <TextField
            fullWidth
            select
            name="designation"
            label="Designation"
            value={formData.designation}
            onChange={handleChange}
            error={Boolean(formErrors.designation)}
            helperText={formErrors.designation}
            margin="normal"
          >
            {designations.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <FormControl component="fieldset" margin="normal" error={Boolean(formErrors.gender)}>
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup row name="gender" value={formData.gender} onChange={handleChange}>
              <FormControlLabel value="M" control={<Radio />} label="Male" />
              <FormControlLabel value="F" control={<Radio />} label="Female" />
            </RadioGroup>
          </FormControl>

          <TextField
             fullWidth
             select
             name="course"
             label="Course"
             value={formData.course}
             onChange={handleChange}
             error={Boolean(formErrors.course)}
             helperText={formErrors.course}
             margin="normal"
          >
             {courses.map((c) => (
                 <MenuItem key={c} value={c}>{c}</MenuItem>
             ))}
          </TextField>

          <TextField
            fullWidth
            name="image"
            label="Image URL"
            value={formData.image}
            onChange={handleChange}
            margin="normal"
          />

          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            size="large"
            sx={{ mt: 3 }}
          >
            {isEdit ? 'Update' : 'Submit'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EmployeeForm;
