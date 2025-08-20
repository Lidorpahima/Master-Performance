import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel 
} from '@mui/material';
import axios from 'axios';

const AddUserDialog = ({ open, onClose, onUserAdded }) => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'customer',
    phone: ''
  });

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/admin/users', userData);
      onUserAdded(response.data);
      onClose();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#1A1A1A', color: 'white' }}>
        Add New User
      </DialogTitle>
      <DialogContent sx={{ bgcolor: '#1A1A1A', pt: 2 }}>
        <TextField
          fullWidth
          label="First Name"
          value={userData.firstName}
          onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Last Name"
          value={userData.lastName}
          onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={userData.password}
          onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Role</InputLabel>
          <Select
            value={userData.role}
            onChange={(e) => setUserData({ ...userData, role: e.target.value })}
          >
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="technician">Technician</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Phone"
          value={userData.phone}
          onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
        />
      </DialogContent>
      <DialogActions sx={{ bgcolor: '#1A1A1A' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;
