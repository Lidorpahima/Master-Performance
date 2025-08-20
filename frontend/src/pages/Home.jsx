import React, { useState } from 'react';
import { Container, Grid, Typography, Button, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { motion } from 'framer-motion';
import ModelSelector3D from '../components/vehicles/ModelSelector3D';

const gains = {
  BMW: {
    M3: {
      stock: { horsepower: 473, torque: 550 },
      tuned: { horsepower: 580, torque: 680 }
    },
    M4: {
      stock: { horsepower: 503, torque: 650 },
      tuned: { horsepower: 610, torque: 780 }
    },
    '335i': {
      stock: { horsepower: 300, torque: 400 },
      tuned: { horsepower: 400, torque: 520 }
    }
  },
  Mercedes: {
    'C63 AMG': {
      stock: { horsepower: 503, torque: 700 },
      tuned: { horsepower: 620, torque: 850 }
    },
    'AMG GT': {
      stock: { horsepower: 523, torque: 680 },
      tuned: { horsepower: 650, torque: 800 }
    },
    'A45 AMG': {
      stock: { horsepower: 382, torque: 480 },
      tuned: { horsepower: 460, torque: 570 }
    }
  },
  Audi: {
    'RS3': {
      stock: { horsepower: 401, torque: 500 },
      tuned: { horsepower: 520, torque: 650 }
    },
    'RS6': {
      stock: { horsepower: 591, torque: 800 },
      tuned: { horsepower: 740, torque: 950 }
    },
    'S3': {
      stock: { horsepower: 306, torque: 400 },
      tuned: { horsepower: 380, torque: 520 }
    }
  },
  Volkswagen: {
    'Golf R': {
      stock: { horsepower: 315, torque: 400 },
      tuned: { horsepower: 400, torque: 520 }
    },
    'GTI': {
      stock: { horsepower: 241, torque: 370 },
      tuned: { horsepower: 320, torque: 460 }
    },
    'Arteon R': {
      stock: { horsepower: 315, torque: 420 },
      tuned: { horsepower: 400, torque: 530 }
    }
  }
};


const Home = () => {
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [showPerformance, setShowPerformance] = useState(false);
  const [performanceData, setPerformanceData] = useState(null);

  const getModels = (make) => {
    if (!make) return [];
    return Object.keys(gains[make]);
  };

  const calculateGains = () => {
    if (selectedMake && selectedModel) {
      setPerformanceData(gains[selectedMake][selectedModel]);
      setShowPerformance(true);
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          minHeight: '80vh',
          background: 'linear-gradient(45deg, #1A1A1A 30%, #2C2C2C 90%)',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography variant="h1" color="primary" gutterBottom>
                  MASTER PERFORMANCE
                </Typography>
                <Typography variant="h4" color="white" gutterBottom>
                  Unleash Your Vehicle's True Potential
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <ModelSelector3D />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Vehicle Selector */}
      <Container sx={{ my: 8 }}>
        <Typography variant="h3" gutterBottom color="primary">
          Calculate Your Performance Upgrade
        </Typography>
        <Box sx={{ p: 4, bgcolor: '#1A1A1A', borderRadius: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'white' }}>Make</InputLabel>
                <Select
                  value={selectedMake}
                  onChange={(e) => setSelectedMake(e.target.value)}
                  sx={{ color: 'white' }}
                >
                  <MenuItem value="BMW">BMW</MenuItem>
                  <MenuItem value="Mercedes">Mercedes</MenuItem>
                  <MenuItem value="Audi">Audi</MenuItem>
                  <MenuItem value="Volkswagen">Volkswagen</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'white' }}>Model</InputLabel>
                <Select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  sx={{ color: 'white' }}
                >
                  {getModels(selectedMake).map((model) => (
                    <MenuItem key={model} value={model}>{model}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'white' }}>Year</InputLabel>
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  sx={{ color: 'white' }}
                >
                  <MenuItem value="2023">2023</MenuItem>
                  <MenuItem value="2022">2022</MenuItem>
                  <MenuItem value="2021">2021</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Button 
            variant="contained" 
            color="primary"
            size="large"
            sx={{ mt: 3 }}
            onClick={calculateGains}
          >
            Calculate Performance Gains
          </Button>
        </Box>

        {showPerformance && performanceData && (
          <Box sx={{ mt: 4, p: 4, bgcolor: '#1A1A1A', borderRadius: 2 }}>
            <Typography variant="h4" color="primary" gutterBottom>
              Performance Results for {selectedMake} {selectedModel}
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" color="secondary" gutterBottom>
                  Stock Performance
                </Typography>
                <Typography variant="h6" color="white">
                  Horsepower: {performanceData.stock.horsepower} HP
                </Typography>
                <Typography variant="h6" color="white">
                  Torque: {performanceData.stock.torque} Nm
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" color="secondary" gutterBottom>
                  After Tuning
                </Typography>
                <Typography variant="h6" color="white">
                  Horsepower: {performanceData.tuned.horsepower} HP
                </Typography>
                <Typography variant="h6" color="white">
                  Torque: {performanceData.tuned.torque} Nm
                </Typography>
              </Grid>
            </Grid>
            <Button 
              variant="contained" 
              color="primary"
              size="large"
              sx={{ mt: 4 }}
              href="/contact"
            >
              Get This Upgrade
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Home;