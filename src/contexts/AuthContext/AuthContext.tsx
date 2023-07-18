import { createContext } from 'react';
import { useState } from 'react';
import axios from 'axios';

interface AuthContextProps {
  login: ({ username, password }: { username: string, password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthorized: boolean;
  currentUser: any;
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
      setCurrentUser(null);
      setIsAuthorized(false);
      localStorage.removeItem('accessToken');
      console.log("Logout successful");
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <AuthContext.Provider value={{ login, logout, currentUser, isAuthorized }}>
      {children}
    </AuthContext.Provider>
  );
}