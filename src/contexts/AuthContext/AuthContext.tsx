import { createContext, useEffect, useCallback } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

interface AuthContextProps {
  login: ({ email, password }: { email: string, password: string }) => Promise<boolean>;
  logout: () => void;
  signup: ({ email, password }: { email: string, password: string }) => Promise<boolean>;
  isLoggedIn: boolean;
}

const OPEN_ROUTES = [
  '/',
  '/home',
  '/login',
  '/signup',
  '/map'
]

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const pathname = location.pathname;

  console.log("location", location);


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

  const logout = useCallback(async function () {
    const logoutUrl = 'http://localhost:8080/api/v1/auth/logout';
    try {
      await axios.post(logoutUrl);
      setAccessToken(null);
      localStorage.removeItem('accessToken');
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  }, [navigate])

  async function signup({ email, password }: { email: string, password: string }) {
    const signUpUrl = 'http://localhost:8080/api/v1/auth/signup';
    const body = { email, password };
    try {
      const response = await axios.post(signUpUrl, body);
      if (response.status !== 200) throw new Error("Sign up failed:\n" + response.statusText);
      console.log(response.data);

      localStorage.setItem('accessToken', response.data.accessToken)
      setAccessToken(response.data.accessToken);
      return true;
    } catch (error) {
      console.error(error);
      return false;
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
    console.log("pathname", pathname);

    if (!OPEN_ROUTES.includes(pathname) && !accessToken) {
      navigate('/login');
    }
    if (pathname === '/' && accessToken) {
      navigate('/dashboard');
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
  }, [navigate, logout])


  return (
    <AuthContext.Provider value={{ login, logout, signup, isLoggedIn: !!accessToken }}>
      {children}
    </AuthContext.Provider>
  );
}