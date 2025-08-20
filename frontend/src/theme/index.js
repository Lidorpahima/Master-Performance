import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF4D00',
      light: '#FF7A40',
      dark: '#CC3D00',
    },
    secondary: {
      main: '#1E1E1E',
      light: '#2C2C2C',
      dark: '#000000',
    },
    background: {
      default: '#0A0A0A',
      paper: '#1A1A1A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
  },
  typography: {
    fontFamily: '"Rajdhani", "Roboto", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      letterSpacing: '0.02em',
    },
    h2: {
      fontSize: '2.8rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h3: {
      fontSize: '2.2rem',
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.05em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '12px 30px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 5px 15px rgba(255, 77, 0, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #FF4D00 30%, #FF7A40 90%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A1A',
          borderRadius: 0,
          border: '1px solid rgba(255, 77, 0, 0.1)',
        },
      },
    },
  },
});

export default theme;
