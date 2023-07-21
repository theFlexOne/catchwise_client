import { createContext, useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

interface AuthContextProps {
  login: ({ email, password }: { email: string, password: string }) => Promise<boolean>;
  logout: () => void;
  isLoggedIn: boolean;
}

const OPEN_ROUTES = [
  '/login',
  '/signup',
  '/map'
]

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [error, setError] = useState<string | null>(null);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  console.log(location);


  async function login({ email, password }: { email: string, password: string }): Promise<boolean> {
    const loginUrl = 'http://localhost:8080/api/v1/auth/login';
    const body = { email, password };
    try {
      const response = await axios.post(loginUrl, body);
      if (response.status !== 200) throw new Error("Login failed:\n" + response.statusText);
      localStorage.setItem('accessToken', response.data.accessToken)
      setAccessToken(response.data.accessToken);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async function logout() {
    const logoutUrl = 'http://localhost:8080/api/v1/auth/logout';
    try {
      await axios.post(logoutUrl);
      setAccessToken(null);
      localStorage.removeItem('accessToken');
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [accessToken]);

  useEffect(() => {
    if (!OPEN_ROUTES.includes(pathname) && !accessToken) {
      navigate('/login');
    }
  }, [pathname, accessToken, navigate]);

  useEffect(() => {
    const { fetch: originalFetch } = window;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (response.status === 401) {
          logout();
        }
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }, [navigate])


  return (
    <AuthContext.Provider value={{ login, logout, isLoggedIn: !!accessToken }}>
      {children}
    </AuthContext.Provider>
  );
}