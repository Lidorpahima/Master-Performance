import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  LinearProgress,
  Alert
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import axios from 'axios';
import API_BASE_URL from '../../services/api/config';

const FileUploadDialog = ({ open, onClose, vehicle, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || !vehicle) return;
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('description', description);
    formData.append('vehicleId', vehicle._id);
    
    try {
      setUploadProgress(0);
      setUploadStatus('uploading');
      
      const response = await axios.post(`${API_BASE_URL}/tuning/upload-file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      
      setUploadStatus('success');
      
      // Call the success callback with the new project data
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }
      
      // Close the dialog after a short delay
      setTimeout(() => {
        handleClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('error');
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setDescription('');
    setUploadProgress(0);
    setUploadStatus(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Tune File</DialogTitle>
      <DialogContent>
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
        
        <Typography variant="subtitle1" gutterBottom>
          Vehicle: {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : ''}
        </Typography>
        
        <TextField
          fullWidth
          label="Description"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={uploadStatus === 'uploading' || uploadStatus === 'success'}
          margin="normal"
          placeholder="Describe what you want to achieve with this tune"
        />
        
        <Box sx={{ mt: 2, mb: 2 }}>
          <input
            accept=".bin,.hex,.map,.tune"
            style={{ display: 'none' }}
            id="tune-file-upload"
            type="file"
            onChange={handleFileChange}
            disabled={uploadStatus === 'uploading' || uploadStatus === 'success'}
          />
          <label htmlFor="tune-file-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUpload />}
              disabled={uploadStatus === 'uploading' || uploadStatus === 'success'}
            >
              Select File
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
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={handleClose} 
          disabled={uploadStatus === 'uploading'}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleUpload} 
          variant="contained" 
          color="primary"
          disabled={!selectedFile || uploadStatus === 'uploading' || uploadStatus === 'success'}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileUploadDialog;