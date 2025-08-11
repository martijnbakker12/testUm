import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

export default function AppView() {
  const isLoggedIn = useSelector(state => state.loginState.isLoggedIn);
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="container app-level">
      <h1>VPN Control</h1>
      <p>You are logged in.</p>
      <LogoutButton />
    </div>
  );
}
