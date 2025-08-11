import React from 'react';
import { useDispatch } from 'react-redux';

export default function LogoutButton() {
  const dispatch = useDispatch();
  const handleClick = async () => {
    try {
      await fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'logged out' }),
      });
    } catch (err) {
      // ignore logging errors
    }
    dispatch({ type: 'USER_LOGOUT' });
  };
  return (
    <button onClick={handleClick}>Log out</button>
  );
}
