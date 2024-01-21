import { useEffect, useState } from 'react';
import axios from 'axios';

interface AuthData {
  isAuthenticated: boolean;
  jwtToken: string | null;
  login: (username: string, password: string) => void;
}

export default function useAuth(): AuthData {
  const [authData, setAuthData] = useState<AuthData>({
    isAuthenticated: false,
    jwtToken: null,
    login: async (username: string, password: string) => {
      try {
        
        const response = await axios.post<{ token: string }>('/api/login', {
          username,
          password,
        });

        
        const { token } = response.data;

        
        localStorage.setItem('jwtToken', token);

        
        setAuthData({
          isAuthenticated: true,
          jwtToken: token,
          login: authData.login, 
        });
      } catch (error) {
        console.error('Error during login', error);
        
      }
    },
  });

  useEffect(() => {
   

    
    const tokenFromStorage = localStorage.getItem('jwtToken');
    if (tokenFromStorage) {
      setAuthData({
        isAuthenticated: true,
        jwtToken: tokenFromStorage,
        login: authData.login,
      });
    }
  }, [authData.login]);

  return authData;
}
