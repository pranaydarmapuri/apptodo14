import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  async function handleLogin() {
    try {
      const response = await axios.post<{ token: string }>('/api/auth/login', {
        username,
        password,
      });

      
      localStorage.setItem('token', response.data.token);

      
      router.push('/todos');
    } catch (error: AxiosError | any) {
      console.error('Error logging in', error.response?.data || error.message);
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
