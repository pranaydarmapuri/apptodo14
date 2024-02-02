import { useState, useEffect } from 'react';

import { User } from '../../node_modules/next-auth/index';
import axios, { AxiosError } from 'axios';

export interface AuthData {
  isAuthenticated: boolean;
  userId: string;
  username: string;
  jwtToken: string;
}

export interface UserModel {
  username: string;
  passwordHash: string;
}
 
interface AuthState extends AuthData {
  isAuthenticated: boolean;
  logout: () => void;
}

export default function useAuth() {
  
  

  const [userState, setUserState] = useState<UserModel | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [jwtToken, setJwtToken] = useState<string>('');


   const login = async (username: string, password: string) => {
    try {
      const response = await axios.post<{
        user: {
          passwordHash: string;
          username: string; token: string; 
};
        jwtToken: { token: string; }; token: string 
}>('http://localhost:3000/api/auth/loginRoute',  JSON.stringify({
        username,
        password,
      }),{headers:{"Content-Type":'application/json'}});
      console.log("useAuth login method response =>", response)
      
      
      setIsAuthenticated(true);
      if(response && response.data && response.data.jwtToken && response.data.user) {
        console.log("useAuth login inside defined method response =>", response)
        setUserState({
          username: response.data.user.username,
          passwordHash: response.data.user.passwordHash
        });
        setJwtToken(response.data.jwtToken.token)
        localStorage.setItem('token', response.data.jwtToken.token);
      }

      
    } catch (error: AxiosError | any) {
      setIsAuthenticated(false);
      console.error('Error logging in', error.response?.data || error.message);
      
    }
  }

   const signUp = () => {

  }

   const logout = () => {
    
  }


  return {
    isAuthenticated,
    login,
    userState,
    jwtToken
  };
}
