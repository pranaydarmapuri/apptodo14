
import error from 'next/error';
import { useState, useEffect } from 'react';

export interface AuthData {
  isAuthenticated: boolean;
  userId: string;
  username: string;
  jwtToken: string;
}

interface AuthState extends AuthData {
  isAuthenticated: boolean;
  logout: () => void;
}

export default function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userId: '',
    username: '',
    jwtToken: '',

    logout: () => {
      localStorage.removeItem('token');
      setAuthState({
        isAuthenticated: false,
        userId: '',
        username: '',
        jwtToken: '',
        logout: authState.logout,
      });
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
            signupResponse.json().catch((error) => {
              console.error('Error parsing signup response:', error);
              return null;
            }),
            loginResponse.json().catch((error) => {
              console.error('Error parsing login response:', error);
              return null;
            }),
          ]);
    
          console.log('Signup Data:', signupData);
          console.log('Login Data:', loginData);
    
          if (signupData || loginData) {
            setAuthState({
              isAuthenticated: true,
              userId: (signupData && signupData.userId) || (loginData && loginData.userId) || '',
              username: (signupData && signupData.username) || (loginData && loginData.username) || '',
              jwtToken: (signupData && signupData.jwtToken) || (loginData && loginData.jwtToken) || '',
              logout: authState.logout,
            });
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

  return authState;
}
