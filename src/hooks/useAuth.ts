

import { useState, useEffect } from 'react';

export interface AuthData {
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

          const response = await fetch('/api/auth');
          const data = await response.json();

          setAuthState({
            isAuthenticated: data.isAuthenticated,
            userId: data.userId,
            username: data.username,
            jwtToken: data.jwtToken,
            
            logout: authState.logout, 
          });
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
      }
    };

    checkAuthStatus();
  }, []); 

  

  return authState;
}
