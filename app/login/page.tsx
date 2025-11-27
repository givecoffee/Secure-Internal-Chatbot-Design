'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://oc.raemaffei.com/api';
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Login failed');
      
      const data = await response.json();
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user_id', email);  
      router.push('/chat');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <p>{error}</p>}
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required />
      <button type="submit">Sign in</button>
    </form>
  );
}