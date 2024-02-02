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

interface Todo {
  id: string
  desc: string
  completed: boolean
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
          username: string;
          token: string;
        };
        jwtToken: { token: string };
      }>('http://localhost:3000/api/auth/loginRoute', JSON.stringify({
        username,
        password,
      }), { headers: { 'Content-Type': 'application/json' } });
  
      console.log('Login API response:', response);
  
      setIsAuthenticated(true);
  
      localStorage.setItem('token', response.data.user.token)
  
      if (response && response.data && response.data.user && response.data.jwtToken) {
        console.log('User data:', response.data.user);
        console.log('JWT Token from API:', response.data.jwtToken.token);
  
        setUserState({
          username: response.data.user.username,
          passwordHash: response.data.user.passwordHash,
        });
  
        setJwtToken(response.data.jwtToken.token);
  
        if (localStorage.getItem('token') !== response.data.jwtToken.token) {
          console.error('Token not saved in localStorage.');
        } else {
          console.log('Token saved in localStorage.');
  
          
          fetchUserTodos(response.data.jwtToken.token);
        }
      }
    } catch (error: AxiosError | any) {
      setIsAuthenticated(false);
      console.error('Error logging in', error.response?.data || error.message);
    }
  }
  
  const signUp = async (username: string, password: string) => {
    try {
      const response = await axios.post<{
        user: {
          passwordHash: string;
          username: string;
          token: string;
        };
        jwtToken: { token: string };
      }>('http://localhost:3000/api/auth/signupRoute', JSON.stringify({
        username,
        password,
      }), { headers: { 'Content-Type': 'application/json' } });

      console.log('Login API response:', response);

      setIsAuthenticated(true);

      localStorage.setItem('token', response.data.jwtToken.token)

      if (response && response.data && response.data.jwtToken && response.data.user) {
        console.log('User data:', response.data.user);
        console.log('JWT Token from API:', response.data.jwtToken.token);

        setUserState({
          username: response.data.user.username,
          passwordHash: response.data.user.passwordHash,
        });

        setJwtToken(response.data.jwtToken.token);


        if (localStorage.getItem('token') !== response.data.jwtToken.token) {
          console.error('Token not saved in localStorage.');
        } else {
          console.log('Token saved in localStorage.');
        }
      }
    } catch (error: AxiosError | any) {
      setIsAuthenticated(false);
      console.error('Error logging in', error.response?.data || error.message);
    }


  }

  const logout=()=>{
    localStorage.removeItem('token'); 
      setIsAuthenticated(false); 
      setUserState(null); 
      setJwtToken('');
  }

  const fetchUserTodos = async (token: string) => {
    try {
      const token = jwtToken || localStorage.getItem('token');

      if (!token) {
        console.error('Token not found.');
        return;
      }

      console.log('Fetching todos with token:', token);
      const response = await axios.get<{ todos: Todo[] }>('/api/todos', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('User Todos:', response.data.todos);
      setTodos(response.data.todos);
    } catch (error: any) {
      console.error('Error fetching user todos:', error.response?.data || error.message);
      
    }
  };


  return {
    isAuthenticated,
    login,
    userState,
    jwtToken,
    logout,
    signUp,
    fetchUserTodos
  };
}

function setTodos(todos: Todo[]) {
  throw new Error('Function not implemented.');
}
