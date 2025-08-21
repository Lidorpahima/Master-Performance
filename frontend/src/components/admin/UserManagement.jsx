import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import { Edit, Delete, Add, Chat } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../services/api/config';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'customer',
    status: 'active',
    password: ''
  });
  
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }).catch(() => {
        // Mock data for development
        return { 
          data: [
            {
              _id: '1',
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com',
              role: 'customer',
              status: 'active'
            },
            {
              _id: '2',
              firstName: 'Admin',
              lastName: 'User',
              email: 'admin@master.com',
              role: 'admin',
              status: 'active'
            },
            {
              _id: '3',
              firstName: 'Jane',
              lastName: 'Smith',
              email: 'jane@example.com',
              role: 'customer',
              status: 'inactive'
            }
          ]
        };
      });
      
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
      setLoading(false);
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditUser(user);
      setNewUser({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || 'customer',
        status: user.status || 'active',
        password: '' // Don't populate password for security
      });
    } else {
      setEditUser(null);
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        role: 'customer',
        status: 'active',
        password: ''
      });
    }
    setSaveError(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSaveError(null);
  };

  const handleSaveUser = async () => {
    try {
      setSaveLoading(true);
      setSaveError(null);
      
      if (editUser) {
        // Update existing user
        const response = await axios.put(
          `${API_BASE_URL}/admin/users/${editUser._id}`, 
          newUser,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        ).catch(() => {
          // Mock update for development
          const updatedUser = {
            ...editUser,
            ...newUser
          };
          return { data: updatedUser };
        });
        
        setUsers(users.map(u => u._id === editUser._id ? response.data : u));
      } else {
        // Add new user
        const response = await axios.post(
          `${API_BASE_URL}/admin/users`, 
          newUser,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        ).catch(() => {
          // Mock creation for development
          const newUserWithId = {
            ...newUser,
            _id: Math.random().toString(36).substr(2, 9)
          };
          return { data: newUserWithId };
        });
        
        setUsers([...users, response.data]);
      }
      
      setSaveLoading(false);
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving user:', err);
      setSaveError('Failed to save user');
      setSaveLoading(false);
    }
  };

  const handleDeleteConfirm = (user) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/admin/users/${userToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }).catch(() => {
        // Mock deletion for development
      });
      
      setUsers(users.filter(user => user._id !== userToDelete._id));
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      setDeleteConfirmOpen(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" color="primary">
          User Management
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add User
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ bgcolor: '#252525' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Name</TableCell>
                <TableCell sx={{ color: 'white' }}>Email</TableCell>
                <TableCell sx={{ color: 'white' }}>Role</TableCell>
                <TableCell sx={{ color: 'white' }}>Status</TableCell>
                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell sx={{ color: 'white' }}>{user.firstName} {user.lastName}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role}
                      color={user.role == 'admin' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.status}
                      color={user.status === 'active' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleOpenDialog(user)}>
                      <Edit sx={{ color: 'white' }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteConfirm(user)}>
                      <Delete sx={{ color: 'white' }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => navigate(`/admin/chat?userId=${user._id}&name=${encodeURIComponent(user.firstName||'')}%20${encodeURIComponent(user.lastName||'')}`)}>
                      <Chat sx={{ color: 'white' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editUser ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          {saveError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {saveError}
            </Alert>
          )}
          
          <TextField
            fullWidth
            label="First Name"
            value={newUser.firstName}
            onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            value={newUser.lastName}
            onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            margin="normal"
            required
            type="email"
          />
          {!editUser && (
            <TextField
              fullWidth
              label="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              margin="normal"
              required
              type="password"
            />
          )}
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
            >
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={newUser.status}
              onChange={(e) => setNewUser({...newUser, status: e.target.value})}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveUser} 
            variant="contained" 
            color="primary"
            disabled={saveLoading || !newUser.firstName || !newUser.lastName || !newUser.email || (!editUser && !newUser.password)}
          >
            {saveLoading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user: {userToDelete?.firstName} {userToDelete?.lastName}?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteUser} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;