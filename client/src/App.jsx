import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Pages now protect themselves internally */}
            <Route path="/" element={<EmployeeList />} />
            <Route path="/create-employee" element={<EmployeeForm />} />
            <Route path="/edit-employee/:id" element={<EmployeeForm />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
    </ThemeProvider>
  );
}

export default App;
