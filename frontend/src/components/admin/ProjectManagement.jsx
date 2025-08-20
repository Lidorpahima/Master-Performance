import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Alert,
  CircularProgress
} from '@mui/material';
import { CloudUpload, CloudDownload } from '@mui/icons-material';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Selected project for details/upload
  const [selectedProject, setSelectedProject] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  
  // Project status update
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      // For development, use mock data
      setTimeout(() => {
        const mockProjects = [
          {
            _id: '1',
            vehicle: {
              make: 'BMW',
              model: 'M3',
              year: 2022,
              owner: {
                firstName: 'John',
                lastName: 'Doe'
              }
            },
            status: 'in_progress',
            targetStage: 'stage1',
            createdAt: new Date().toISOString(),
            notes: 'Performance tune for track days',
            adminNotes: 'Working on optimizing fuel maps'
          },
          {
            _id: '2',
            vehicle: {
              make: 'Audi',
              model: 'RS3',
              year: 2021,
              owner: {
                firstName: 'Jane',
                lastName: 'Smith'
              }
            },
            status: 'pending',
            targetStage: 'stage2',
            createdAt: new Date().toISOString(),
            notes: 'Increase torque for daily driving'
          },
          {
            _id: '3',
            vehicle: {
              make: 'Mercedes',
              model: 'C63 AMG',
              year: 2023,
              owner: {
                firstName: 'Mike',
                lastName: 'Johnson'
              }
            },
            status: 'completed',
            targetStage: 'stage3',
            createdAt: new Date().toISOString(),
            notes: 'Full performance package',
            adminNotes: 'Completed with excellent results'
          }
        ];
        
        setProjects(mockProjects);
        setLoading(false);
      }, 1000);
      
      // Uncomment for real API integration
      /*
      const response = await axios.get(`${API_BASE_URL}/tuning/admin/projects`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProjects(response.data);
      setLoading(false);
      */
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleOpenDetails = (project) => {
    setSelectedProject(project);
    setNewStatus(project.status);
    setAdminNotes(project.adminNotes || '');
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedProject(null);
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadStatus(null);
  };

  const handleStatusUpdate = async () => {
    try {
      // For development, mock the update
      const updatedProject = {
        ...selectedProject,
        status: newStatus,
        adminNotes: adminNotes
      };
      
      setProjects(projects.map(p => 
        p._id === selectedProject._id ? updatedProject : p
      ));
      
      setSelectedProject(updatedProject);
      
      // Uncomment for real API integration
      /*
      const response = await axios.patch(
        `${API_BASE_URL}/tuning/projects/${selectedProject._id}/status`,
        { 
          status: newStatus,
          adminNotes: adminNotes
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setProjects(projects.map(p => 
        p._id === selectedProject._id ? response.data : p
      ));
      
      setSelectedProject(response.data);
      */
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

    const handleUploadTunedFile = async () => {
      if (!selectedFile || !selectedProject) return;
  
      try {
        setUploadProgress(0);
        setUploadStatus('uploading');
    
        // eslint-disable-next-line no-undef
        const updatedProject = await uploadResultFile(
          selectedFile, 
          selectedProject._id, 
          (progress) => setUploadProgress(progress)
        );
    
        // Update the project in the list
        setProjects(projects.map(p => 
          p._id === selectedProject._id ? updatedProject : p
        ));
    
        // Update the selected project
        setSelectedProject(updatedProject);
    
        setUploadStatus('success');
      } catch (error) {
        console.error('Error uploading tuned file:', error);
        setUploadStatus('error');
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
    <Box>
      <Typography variant="h6" color="primary" gutterBottom>
        Tuning Projects
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vehicle</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project._id}>
                  <TableCell>
                    {project.vehicle ? `${project.vehicle.year} ${project.vehicle.make} ${project.vehicle.model}` : 'Unknown Vehicle'}
                  </TableCell>
                  <TableCell>
                    {project.vehicle && project.vehicle.owner ? project.vehicle.owner.firstName : 'Unknown Customer'}
                  </TableCell>
                  <TableCell>{project.notes || 'No description'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={project.status} 
                      color={getStatusColor(project.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => handleOpenDetails(project)}
                    >
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Project Details Dialog */}
      <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="md" fullWidth>
        {selectedProject && (
          <>
            <DialogTitle>
              Project Details
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Vehicle Information
                </Typography>
                <Typography variant="body1">
                  {selectedProject.vehicle ? 
                    `${selectedProject.vehicle.year} ${selectedProject.vehicle.make} ${selectedProject.vehicle.model}` : 
                    'Unknown Vehicle'}
                </Typography>
                {selectedProject.vehicle && (
                  <Typography variant="body2" color="text.secondary">
                    Current Stage: {selectedProject.vehicle.currentStage?.toUpperCase() || 'STOCK'}
                  </Typography>
                )}
              </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Project Information
                  </Typography>
                  <Typography variant="body2">
                    Created: {new Date(selectedProject.createdAt).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    Target Stage: {selectedProject.targetStage}
                  </Typography>
                  <Typography variant="body2">
                    Description: {selectedProject.notes || 'No description provided'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Original File
                  </Typography>
                  {selectedProject.originalFileUrl ? (
                    <Button
                      variant="outlined"
                      startIcon={<CloudDownload />}
                      href={selectedProject.originalFileUrl}
                      target="_blank"
                      sx={{ mt: 1 }}
                    >
                      Download Original File ({selectedProject.fileName})
                    </Button>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No original file available
                    </Typography>
                  )}
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Status Management
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Project Status</InputLabel>
                    <Select
                      value={newStatus}
                      label="Project Status"
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="in_progress">In Progress</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Admin Notes"
                    multiline
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes for the customer about this project"
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleStatusUpdate}
                    sx={{ mt: 2 }}
                  >
                    Update Status
                  </Button>
                </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Upload Tuned File
                </Typography>
                
                {uploadStatus === 'error' && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    Error uploading file. Please try again.
                  </Alert>
                )}
                
                {uploadStatus === 'success' && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    File uploaded successfully!
                  </Alert>
                )}
                
                <Box sx={{ mt: 2, mb: 2 }}>
                  <input
                    accept=".bin,.hex,.map,.tune"
                    style={{ display: 'none' }}
                    id="tuned-file-upload"
                    type="file"
                    onChange={handleFileChange}
                    disabled={uploadStatus === 'uploading'}
                  />
                  <label htmlFor="tuned-file-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUpload />}
                      disabled={uploadStatus === 'uploading'}
                    >
                      Select Tuned File
                    </Button>
                  </label>
                  
                  {selectedFile && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Selected file: {selectedFile.name}
                    </Typography>
                  )}
                </Box>
                
                {uploadStatus === 'uploading' && (
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <LinearProgress variant="determinate" value={uploadProgress} />
                    <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                      Uploading: {uploadProgress}%
                    </Typography>
                  </Box>
                )}
                
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUploadTunedFile}
                  disabled={!selectedFile || uploadStatus === 'uploading'}
                  sx={{ mt: 2 }}
                >
                  Upload Tuned File
                </Button>
                
                {selectedProject.resultFileUrl && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Current tuned file: {selectedProject.resultFileName}
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<CloudDownload />}
                      href={selectedProject.resultFileUrl}
                      target="_blank"
                    >
                      Download Current Tuned File
                    </Button>
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ProjectManagement;