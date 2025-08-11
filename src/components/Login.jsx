import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

export default function Login() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.userId) {
        dispatch({ type: 'USER_LOGIN', payload: { userId: data.userId } });
      } else {
        alert('Login failed');
      }
    } catch (err) {
      alert('Login error');
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label>
        Username
        <input value={username} onChange={e => setUsername(e.target.value)} />
      </label>
      <label>
        Password
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <button type="submit">Sign In</button>
    </form>
  );
}
