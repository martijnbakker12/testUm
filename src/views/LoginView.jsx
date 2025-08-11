import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Login from '../components/Login';

export default function LoginView() {
  const isLoggedIn = useSelector(state => state.loginState.isLoggedIn);
  if (isLoggedIn) {
    return <Navigate to="/" />;
  }
  return (
    <div className="container">
      <Login />
    </div>
  );
}
