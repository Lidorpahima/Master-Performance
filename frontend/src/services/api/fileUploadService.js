import axios from 'axios';
import API_BASE_URL from './config';

// Upload a file for tuning
export const uploadTuningFile = async (file, vehicleId, description, progressCallback) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('vehicleId', vehicleId);
  formData.append('description', description);
  
  try {
    const response = await axios.post(
      `${API_BASE_URL}/tuning/upload-file`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        onUploadProgress: (progressEvent) => {
          if (progressCallback) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            progressCallback(percentCompleted);
          }
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Upload a result file (admin only)
export const uploadResultFile = async (file, projectId, progressCallback) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post(
      `${API_BASE_URL}/tuning/projects/${projectId}/result-file`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        onUploadProgress: (progressEvent) => {
          if (progressCallback) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            progressCallback(percentCompleted);
          }
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error uploading result file:', error);
    throw error;
  }
};

// Download a file
export const downloadFile = (fileUrl) => {
  window.open(fileUrl, '_blank');
};
