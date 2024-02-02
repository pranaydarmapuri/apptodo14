'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import useAuth from '@/hooks/useAuth';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, userState, jwtToken, login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post<{ jwtToken: string  }>('http://localhost:3000/api/auth/loginRoute', JSON.stringify({
        username,
        password,
      }), { headers: { "Content-Type": 'application/json' } });
  
      console.log('Server Response:', response);
  
      const token = response.data?.jwtToken;
      console.log('Token:', token);
  
      localStorage.setItem('token', token);
  
      router.push('/todos');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap items-center justify-center"> 
        <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 w-full">
          <h2 className="text-gray-900 text-lg font-medium title-font mb-5">Login</h2>
          <div className="relative mb-4">
            <label htmlFor="username" className="leading-7 text-sm text-gray-600">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="relative mb-4">
            <label htmlFor="password" className="leading-7 text-sm text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
            onClick={handleLogin}
          >
            Login 
          </button>
        </div>
      </div>
    </section>
  );
}
