import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/userSlice';
import { Navigate } from 'react-router-dom';

export default function Login() {
  const [creds, setCreds] = useState({ username:'', password:''});
  const dispatch = useDispatch();
  const { token, error, status } = useSelector((s) => s.user);

  if (token) return <Navigate to="/" />;

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(loginUser(creds));
  };

  return (
    <form className="max-w-md mx-auto space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold">Login</h2>
      <input name="username" placeholder="Email" onChange={e=>setCreds(prev=>({...prev, username:e.target.value}))}
        className="w-full border p-2 rounded" />
      <input name="password" type="password" placeholder="Password" onChange={e=>setCreds(prev=>({...prev, password:e.target.value}))}
        className="w-full border p-2 rounded" />
      <button disabled={status==='loading'} className="px-4 py-2 bg-blue-600 text-white rounded">
        {status==='loading' ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
