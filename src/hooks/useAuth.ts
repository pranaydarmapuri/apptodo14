import { useState, useEffect } from 'react';


import axios, { AxiosError } from 'axios';
import User from '@/models/user';
import Todo from '@/models/todo';



export interface AuthData {
  isAuthenticated: boolean;
  userId: string;
  username: string;
  jwtToken: string;
}

export interface UserModel {
  username: string;
  passwordHash: string;
  _id?:string
}
interface LoginResponse {
  user: {
    passwordHash: string;
    username: string;
    token: string;
    _id: string;
    
  },jwtToken: string
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
        const response = await axios.post<LoginResponse>('http://localhost:3000/api/auth/loginRoute', JSON.stringify({
          username,
          password,
        }), { headers: { 'Content-Type': 'application/json' } });
    
        console.log('JWT Token from API:', response.data.jwtToken);
        
        setIsAuthenticated(true);
    
        localStorage.setItem('token', response.data.jwtToken);
    
        if (response && response.data && response.data.user && response.data.jwtToken) {
          console.log('User data:', response.data.user);
          console.log('JWT Token from API:', response.data.jwtToken);
    
          setUserState({
            username: response.data.user.username,
            passwordHash: response.data.user.passwordHash,
          });
    
          setJwtToken(response.data.jwtToken);
    
          if (localStorage.getItem('token') !== response.data.jwtToken) {
            console.error('Token not saved in localStorage.');
          } else {
            console.log('Token saved in localStorage.');
    
            fetchUserTodos(response.data.user._id);
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

  
  const fetchUserTodos = async (sessionId: string | undefined) => {
    try {
      if (sessionId === undefined) {
        console.error('sessionId is undefined');
        return;
      }

      const response = await axios.get<{ todos: Todo[] }>(`/api/users/todos`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'X-Session-ID': sessionId,
        },
      });

      console.log('User Todos:', response.data.todos);

      
      const user = await User.findOne({ sessionId }).exec();
      response.data.todos.forEach(async (todo) => {
        const newTodo = new Todo({
          desc: todo.desc,
          completed: todo.completed,
          user: user?._id,
        });
        await newTodo.save();
        user?.todos.push(newTodo._id);
        console.log('New Todo:', newTodo);
      });

      await user?.save();
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
    fetchUserTodos,
  };
}