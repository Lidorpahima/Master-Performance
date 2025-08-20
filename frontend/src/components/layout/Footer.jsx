import React from 'react';
import { Box, Container, Grid, Typography, IconButton, Link } from '@mui/material';
import { Facebook, Instagram, YouTube, WhatsApp } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#1A1A1A', color: 'white', py: 6, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              MASTER PERFORMANCE
            </Typography>
            <Typography variant="body2" mb={2}>
              Professional Vehicle Tuning & Performance Upgrades
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="primary" href="https://facebook.com">
                <Facebook />
              </IconButton>
              <IconButton color="primary" href="https://instagram.com">
                <Instagram />
              </IconButton>
              <IconButton color="primary" href="https://youtube.com">
                <YouTube />
              </IconButton>
              <IconButton color="primary" href="https://wa.me/yourphone">
                <WhatsApp />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/services" color="inherit" display="block" mb={1}>Services</Link>
            <Link href="/tuning" color="inherit" display="block" mb={1}>Tuning Packages</Link>
            <Link href="/vehicles" color="inherit" display="block" mb={1}>Supported Vehicles</Link>
            <Link href="/contact" color="inherit" display="block" mb={1}>Contact Us</Link>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              Contact Info
            </Typography>
            <Typography variant="body2" mb={1}>
              Tel Aviv, Israel
            </Typography>
            <Typography variant="body2" mb={1}>
              Phone: +972 50-123-4567
            </Typography>
            <Typography variant="body2" mb={1}>
              Email: info@masterperformance.co.il
            </Typography>
            <Typography variant="body2">
              Hours: Sun-Thu 9:00-18:00
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} Master Performance. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
