"use client"
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthData } from '@/hooks/useAuth';

const authData: AuthData={
  
    userId: '',
    username: '',
    jwtToken: '',
    isAuthenticated:false
  
  
}

interface AuthContextProps extends AuthData {
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}



export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthContextProps>({
    isAuthenticated: false,
    userId: '',
    username: '',
    jwtToken: '',
    logout: () => {
      localStorage.removeItem('token');
      setAuthState((prevAuthState) => ({
        ...prevAuthState,
        isAuthenticated: false,
        userId: '',
        username: '',
        jwtToken: '',
      }));
    },
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const [signupResponse, loginResponse] = await Promise.all([
            fetch('/api/auth/signupRoute'),
            fetch('/api/auth/loginRoute'),
          ]);

          const [signupData, loginData] = await Promise.all([
            signupResponse.json().catch(() => ({})), // Ensure an empty object if parsing fails
            loginResponse.json().catch(() => ({})),
          ]);

          if (
            'userId' in signupData &&
            'username' in signupData &&
            'jwtToken' in signupData &&
            'userId' in loginData &&
            'username' in loginData &&
            'jwtToken' in loginData
          ) {
            setAuthState((prevAuthState) => ({
              ...prevAuthState,
              isAuthenticated: true,
              userId: signupData.userId || loginData.userId,
              username: signupData.username || loginData.username,
              jwtToken: signupData.jwtToken || loginData.jwtToken,
            }));
            
          } else {
            console.error('Error: Unexpected response format from server');
          }
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};