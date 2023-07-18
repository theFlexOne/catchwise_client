import { createContext, useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

interface AuthContextProps {
  login: ({ username, password }: { username: string, password: string }) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));

  async function login({ username, password }: { username: string, password: string }): Promise<boolean> {
    const loginUrl = 'http://localhost:8080/api/v1/auth/login';
    const body = { username, password };
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


  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}