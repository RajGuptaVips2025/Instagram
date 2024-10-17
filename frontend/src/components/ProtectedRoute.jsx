import axios from 'axios';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/auth/isLoggedIn');
        if (res.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
        console.log('Error during authentication check:', error.message);
      }
    };

    checkAuth();
  }, []);

  // While waiting for authentication check
  if (isAuthenticated === null) return <div>Loading...</div>;

  // If authenticated, render the child components
  if (isAuthenticated) return children;

  // If not authenticated, redirect to login
  return <Navigate to="/login" />;
};

export default ProtectedRoute;
