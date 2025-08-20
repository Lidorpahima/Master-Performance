import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux';
import theme from './theme';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Tuning from './pages/Tuning';
import Vehicles from './pages/Vehicles';
import Contact from './pages/Contact';
import Payment from './pages/Payment';
import Login from './components/auth/Login';
import CustomerDashboard from './components/customer/CustomerDashboard';
import AdminDashboard from './components/admin/Dashboard';
import ChatSupport from './components/chat/ChatSupport';

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/tuning" element={<Tuning />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              {user?.role === 'admin' ? <AdminDashboard /> : <CustomerDashboard />}
            </ProtectedRoute>
          } />
          
          <Route path="/admin/*" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
        <ChatSupport />
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;