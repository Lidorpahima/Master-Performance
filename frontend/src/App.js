import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Toolbar } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import theme from './theme';
import { initiateSocketConnection, disconnectSocket } from './services/socketService';

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
import ChatPage from './components/chat/ChatPage';
import ChatSupport from './components/chat/ChatSupport';
import { jwtDecode } from 'jwt-decode'; 
import { setUser } from './redux/authSlice'; 

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedUser = jwtDecode(token);
          if (decodedUser.exp * 1000 > Date.now()) {
            dispatch(setUser({ id: decodedUser.userId, role: decodedUser.role }));
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error("Failed to decode token:", error);
          localStorage.removeItem('token');
        }
      }
    }, [dispatch]);
    useEffect(() => {
      if (isAuthenticated && user) {
        initiateSocketConnection(user.id);
      }
  
      return () => {
        disconnectSocket();
      };
    }, [isAuthenticated, user]);
  
  
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Toolbar />
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
              {user?.role == 'admin' ? <AdminDashboard /> : <CustomerDashboard />}
            </ProtectedRoute>
          } />
          
          <Route path="/admin/*" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/chat" element={
            <ProtectedRoute requiredRole="admin">
              <ChatPage />
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