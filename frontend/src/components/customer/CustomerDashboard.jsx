import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Tab, 
  Tabs, 
  TextField, 
  Button, 
  Alert,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  FormGroup,
  FormControlLabel,
  Switch
} from '@mui/material';
import api from '../../services/api';
import { motion } from 'framer-motion';
import ChatPage from '../chat/ChatPage';
import { Person, Speed, Settings, CloudUpload, DirectionsCar, Add, Chat } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import API_BASE_URL from '../../services/api/config';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}
const CustomerDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [vehicles, setVehicles] = useState([]);
  const [tuningProjects, setTuningProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // File upload state
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDescription, setFileDescription] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  
  // Add vehicle dialog state
  const [addVehicleDialogOpen, setAddVehicleDialogOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: '',
    engineType: '',
    currentStage: 'stock',
    performanceData: {
      horsepower: '',
      torque: ''
    }
  });

  const user = useSelector(state => state.auth?.user || {
    id: '1', // Default user for testing
    name: 'Guest User'
  });

  const [profile, setProfile] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phone: user.phone || '',
    email: user.email || '',
    address: '',
    carMake: '',
    carModel: '',
    carYear: '',
    vinNumber: '',
    preferredContactMethod: 'email'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch vehicles
        const vehiclesResponse = await api.get(`${API_BASE_URL}/vehicles/user-vehicles`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }).catch(() => {
          // Mock data for development
          return { 
            data: [
              {
                _id: 'v1',
                make: 'BMW',
                model: 'M3',
                year: 2022,
                currentStage: 'stock',
                performanceData: {
                  horsepower: 473,
                  torque: 550
                }
              }
            ] 
          };
        });
        
        setVehicles(vehiclesResponse.data);
        
        // Fetch tuning projects
        const projectsResponse = await api.get(`${API_BASE_URL}/tuning/user-projects`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }).catch(() => {
          // Mock data for development
          return { 
            data: [
              {
                _id: 'tp1',
                vehicle: 'v1',
                description: 'Stage 1 Performance Tune',
                status: 'in_progress',
                createdAt: new Date().toISOString(),
                adminNotes: 'Working on optimizing fuel maps for better throttle response'
              }
            ] 
          };
        });
        
        setTuningProjects(projectsResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileUpdate = async () => {
    try {
      await api.put(`${API_BASE_URL}/users/profile`, profile, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSaveStatus('success');
      setIsEditing(false);
    } catch (error) {
      setSaveStatus('error');
      console.error('Error updating profile:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // File upload handlers
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadDialogOpen = (vehicle) => {
    setSelectedVehicle(vehicle);
    setUploadDialogOpen(true);
  };

  const handleUploadDialogClose = () => {
    setUploadDialogOpen(false);
    setSelectedVehicle(null);
    setSelectedFile(null);
    setFileDescription('');
    setUploadProgress(0);
    setUploadStatus(null);
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !selectedVehicle) return;
  
    try {
      setUploadProgress(0);
      setUploadStatus('uploading');
    
      // Mock upload for development
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      const newProject = {
        _id: 'tp' + Math.random().toString(36).substr(2, 9),
        vehicle: selectedVehicle._id,
        description: fileDescription,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
    
      // Add the new project to the list
      setTuningProjects([...tuningProjects, newProject]);
      setUploadStatus('success');
    
      // Close the dialog after a short delay
      setTimeout(() => {
        handleUploadDialogClose();
      }, 1500);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('error');
    }
  };

  // Vehicle management handlers
  const handleAddVehicleDialogOpen = () => {
    setAddVehicleDialogOpen(true);
  };

  const handleAddVehicleDialogClose = () => {
    setAddVehicleDialogOpen(false);
    setNewVehicle({
      make: '',
      model: '',
      year: '',
      engineType: '',
      currentStage: 'stock',
      performanceData: {
        horsepower: '',
        torque: ''
      }
    });
  };

  const handleAddVehicle = async () => {
    try {
      setLoading(true);
      
      // Mock API call for development
      const newVehicleWithId = {
        ...newVehicle,
        _id: 'v' + Math.random().toString(36).substr(2, 9)
      };
      
      setVehicles([...vehicles, newVehicleWithId]);
      handleAddVehicleDialogClose();
      setLoading(false);
    } catch (error) {
      console.error('Error adding vehicle:', error);
      setLoading(false);
    }
  };

  // Get status color based on project status
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'warning';
      case 'approved': return 'info';
      case 'in_progress': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
            <Tab icon={<Speed />} label="Performance Hub" />
            <Tab icon={<Person />} label="Profile" />
            <Tab icon={<Settings />} label="Settings" />
            <Tab icon={<Chat />} label="Chat" /> 
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" color="primary">
                  Your Vehicles
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<Add />}
                  onClick={handleAddVehicleDialogOpen}
                >
                  Add Vehicle
                </Button>
              </Box>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : vehicles.length === 0 ? (
                <Box sx={{ bgcolor: '#1A1A1A', p: 3, borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="body1" gutterBottom>
                    You haven't added any vehicles yet.
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<Add />}
                    onClick={handleAddVehicleDialogOpen}
                    sx={{ mt: 2 }}
                  >
                    Add Your First Vehicle
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {vehicles.map((vehicle) => (
                    <Grid item xs={12} md={6} lg={4} key={vehicle._id}>
                      <Card sx={{ bgcolor: '#1A1A1A', height: '100%' }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Current Stage: {vehicle.currentStage?.toUpperCase() || 'STOCK'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Engine: {vehicle.engineType || 'Not specified'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Horsepower: {vehicle.performanceData?.horsepower || 'N/A'} HP
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Torque: {vehicle.performanceData?.torque || 'N/A'} Nm
                          </Typography>
                          
                          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Button 
                              variant="outlined" 
                              size="small"
                              onClick={() => handleUploadDialogOpen(vehicle)}
                            >
                              Request Tune
                            </Button>
                            <Button 
                              variant="outlined" 
                              size="small"
                              color="secondary"
                            >
                              Edit
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h5" color="primary" gutterBottom>
                Your Tuning Projects
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : tuningProjects.length === 0 ? (
                <Box sx={{ bgcolor: '#1A1A1A', p: 3, borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="body1">
                    You don't have any tuning projects yet.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ bgcolor: '#1A1A1A', p: 3, borderRadius: 1 }}>
                  <List>
                    {tuningProjects.map((project) => (
                      <ListItem key={project._id} sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', py: 2 }}>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1">
                              {project.description || `Tuning Project ${project._id}`}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" color="text.secondary">
                                Created: {new Date(project.createdAt).toLocaleDateString()}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Chip 
                                  label={project.status.replace('_', ' ').toUpperCase()} 
                                  color={getStatusColor(project.status)}
                                  size="small"
                                  sx={{ mr: 1 }}
                                />
                                {project.adminNotes && (
                                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                    Note: {project.adminNotes}
                                  </Typography>
                                )}
                              </Box>
                            </>
                          }
                        />
                        {project.resultFileUrl && (
                          <Button 
                            variant="contained" 
                            color="primary"
                            size="small"
                            href={project.resultFileUrl}
                            target="_blank"
                          >
                            Download Tune
                          </Button>
                        )}
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Grid>
          </Grid>
        )}

        {tabValue === 1 && (
          <Box sx={{ bgcolor: '#1A1A1A', p: 3, borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Profile Information
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </Box>

            {saveStatus && (
              <Alert 
                severity={saveStatus === 'success' ? 'success' : 'error'}
                sx={{ mb: 2 }}
                onClose={() => setSaveStatus(null)}
              >
                {saveStatus === 'success' ? 'Profile updated successfully!' : 'Failed to update profile'}
              </Alert>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={profile.firstName}
                  onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                  disabled={!isEditing}
                  sx={{ 
                    mb: 2,
                    '& .MuiInputLabel-root': { color: 'white' },
                    '& .MuiOutlinedInput-root': { 
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: 'white' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                    },
                    '& .MuiOutlinedInput-input': { color: 'white' }
                  }}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  value={profile.lastName}
                  onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                  disabled={!isEditing}
                  sx={{ 
                    mb: 2,
                    '& .MuiInputLabel-root': { color: 'white' },
                    '& .MuiOutlinedInput-root': { 
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: 'white' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                    },
                    '& .MuiOutlinedInput-input': { color: 'white' }
                  }}
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  disabled={!isEditing}
                  sx={{ 
                    mb: 2,
                    '& .MuiInputLabel-root': { color: 'white' },
                    '& .MuiOutlinedInput-root': { 
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: 'white' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                    },
                    '& .MuiOutlinedInput-input': { color: 'white' }
                  }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  disabled={!isEditing}
                  sx={{ 
                    mb: 2,
                    '& .MuiInputLabel-root': { color: 'white' },
                    '& .MuiOutlinedInput-root': { 
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: 'white' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                    },
                    '& .MuiOutlinedInput-input': { color: 'white' }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Address"
                  value={profile.address}
                  onChange={(e) => setProfile({...profile, address: e.target.value})}
                  disabled={!isEditing}
                  sx={{ 
                    mb: 2,
                    '& .MuiInputLabel-root': { color: 'white' },
                    '& .MuiOutlinedInput-root': { 
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: 'white' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                    },
                    '& .MuiOutlinedInput-input': { color: 'white' }
                  }}
                />
                <FormControl 
                  fullWidth 
                  sx={{ 
                    mb: 2,
                    '& .MuiInputLabel-root': { color: 'white' },
                    '& .MuiOutlinedInput-root': { 
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: 'white' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                    },
                    '& .MuiSelect-icon': { color: 'white' }
                  }}
                >
                  <InputLabel>Preferred Contact Method</InputLabel>
                  <Select
                    value={profile.preferredContactMethod}
                    onChange={(e) => setProfile({...profile, preferredContactMethod: e.target.value})}
                    disabled={!isEditing}
                  >
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="phone">Phone</MenuItem>
                    <MenuItem value="sms">SMS</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {isEditing && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleProfileUpdate}
                >
                  Save Changes
                </Button>
              </Box>
            )}
          </Box>
        )}

        {tabValue === 2 && (
          <Box sx={{ bgcolor: '#1A1A1A', p: 3, borderRadius: 1 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Account Settings
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" color="white" gutterBottom>
                  Notification Preferences
                </Typography>
                
                <FormGroup>
                  <FormControlLabel 
                    control={
                      <Switch 
                        checked={true} 
                        onChange={() => {}} 
                        color="primary" 
                      />
                    } 
                    label="Email Notifications" 
                    sx={{ color: 'white' }}
                  />
                  <FormControlLabel 
                    control={
                      <Switch 
                        checked={false} 
                        onChange={() => {}} 
                        color="primary" 
                      />
                    } 
                    label="SMS Notifications" 
                    sx={{ color: 'white' }}
                  />
                  <FormControlLabel 
                    control={
                      <Switch 
                        checked={true} 
                        onChange={() => {}} 
                        color="primary" 
                      />
                    } 
                    label="Project Updates" 
                    sx={{ color: 'white' }}
                  />
                </FormGroup>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" color="white" gutterBottom>
                  Security
                </Typography>
                
                <Button 
                  variant="outlined" 
                  color="primary" 
                  sx={{ mb: 2 }}
                >
                  Change Password
                </Button>
                
                <Typography variant="subtitle1" color="white" gutterBottom sx={{ mt: 2 }}>
                  Delete Account
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  This action cannot be undone. All your data will be permanently deleted.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="error" 
                  sx={{ mt: 1 }}
                >
                  Delete Account
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Chat Tab Content */}
        {tabValue === 3 && (
          <Box sx={{ bgcolor: '#1A1A1A', p: 3, borderRadius: 1 }}>
            <ChatPage />
          </Box>
        )}
      </motion.div>

      {/* File Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={handleUploadDialogClose}>
        <DialogTitle>Upload Tune File</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Vehicle: {selectedVehicle ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}` : ''}
          </Typography>
          
          <TextField
            fullWidth
            label="Description"
            value={fileDescription}
            onChange={(e) => setFileDescription(e.target.value)}
            margin="normal"
          />
          
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUpload />}
            sx={{ mt: 2 }}
          >
            Select File
            <input
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          
          {selectedFile && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected: {selectedFile.name}
            </Typography>
          )}
          
          {uploadStatus === 'uploading' && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Uploading: {uploadProgress}%
              </Typography>
            </Box>
          )}
          
          {uploadStatus === 'success' && (
            <Alert severity="success" sx={{ mt: 2 }}>
              File uploaded successfully!
            </Alert>
          )}
          
          {uploadStatus === 'error' && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Error uploading file. Please try again.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadDialogClose}>Cancel</Button>
          <Button 
            onClick={handleFileUpload} 
            variant="contained" 
            color="primary"
            disabled={!selectedFile || uploadStatus === 'uploading'}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Vehicle Dialog */}
      <Dialog open={addVehicleDialogOpen} onClose={handleAddVehicleDialogClose}>
        <DialogTitle>Add New Vehicle</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Make"
            value={newVehicle.make}
            onChange={(e) => setNewVehicle({...newVehicle, make: e.target.value})}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Model"
            value={newVehicle.model}
            onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Year"
            value={newVehicle.year}
            onChange={(e) => setNewVehicle({...newVehicle, year: e.target.value})}
            margin="normal"
            required
            type="number"
          />
          <TextField
            fullWidth
            label="Engine Type"
            value={newVehicle.engineType}
            onChange={(e) => setNewVehicle({...newVehicle, engineType: e.target.value})}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Current Stage</InputLabel>
            <Select
              value={newVehicle.currentStage}
              onChange={(e) => setNewVehicle({...newVehicle, currentStage: e.target.value})}
            >
              <MenuItem value="stock">Stock</MenuItem>
              <MenuItem value="stage1">Stage 1</MenuItem>
              <MenuItem value="stage2">Stage 2</MenuItem>
              <MenuItem value="stage3">Stage 3</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Horsepower"
            value={newVehicle.performanceData.horsepower}
            onChange={(e) => setNewVehicle({
              ...newVehicle, 
              performanceData: {
                ...newVehicle.performanceData,
                horsepower: e.target.value
              }
            })}
            margin="normal"
            type="number"
          />
          <TextField
            fullWidth
            label="Torque (Nm)"
            value={newVehicle.performanceData.torque}
            onChange={(e) => setNewVehicle({
              ...newVehicle, 
              performanceData: {
                ...newVehicle.performanceData,
                torque: e.target.value
              }
            })}
            margin="normal"
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddVehicleDialogClose}>Cancel</Button>
          <Button 
            onClick={handleAddVehicle} 
            variant="contained" 
            color="primary"
            disabled={!newVehicle.make || !newVehicle.model || !newVehicle.year}
          >
            Add Vehicle
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerDashboard;