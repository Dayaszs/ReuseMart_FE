import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import api from './api';
import { PulseLoader } from 'react-spinners';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(`${api}/cekrole`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserRole(response.data.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return <PulseLoader size={8} color="#ffffff" />
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    window.alert(`Anda tidak memiliki izin untuk mengakses halaman ini!`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
