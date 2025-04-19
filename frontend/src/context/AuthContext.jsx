import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const storedUser = localStorage.getItem('tb-hiv-user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          // Verify token with backend
          await axios.get(`${import.meta.env.VITE_API_URL}/verify`, {
            headers: { Authorization: `Bearer ${userData.token}` }
          });
          setUser(userData);
        } catch (err) {
          localStorage.removeItem('tb-hiv-user');
        }
      }
      setLoading(false);
    };
    verifyAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        credentials
      );
      const userData = res.data;
      localStorage.setItem('tb-hiv-user', JSON.stringify(userData));
      setUser(userData);
      navigate('/');
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('tb-hiv-user');
    setUser(null);
    navigate('/login');
  };

  const register = async (userData) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/register`, userData);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Registration failed'
      };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      register 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);