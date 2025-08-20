import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const UserForm = ({ open, handleClose, handleSubmit, initialData }) => {
  const [userData, setUserData] = useState(initialData || {
    name: '',
    email: '',
    role: 'customer',
    phone: ''
  });

  const onSubmit = () => {
    handleSubmit(userData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle color="primary">
        {initialData ? 'Edit User' : 'Add New User'}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Name"
          value={userData.name}
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Phone"
          value={userData.phone}
          onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select
            value={userData.role}
            onChange={(e) => setUserData({ ...userData, role: e.target.value })}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="technician">Technician</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          {initialData ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;
