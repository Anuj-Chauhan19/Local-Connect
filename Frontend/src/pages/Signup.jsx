import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../features/userSlice';
import { Navigate } from 'react-router-dom';

export default function Signup() {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    birthdate: '',
    number: '',
    hometown: '',
    city: '',
    documentType: 'Aadhar Card',
    documentNumber: ''
  });

  const dispatch = useDispatch();
  const { token, error, status } = useSelector((s) => s.user);

  if (token) return <Navigate to="/" />;

  const handleChange = e => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(registerUser(data));
  };

 
  const formatLabel = (key) =>
    key
      .replace(/([A-Z])/g, ' $1')       // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter

  return (
    <form className="max-w-md mx-auto space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold">Sign Up</h2>

      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="space-y-1">
          <label htmlFor={key} className="block font-medium">
            {formatLabel(key)}
          </label>

          {key === 'documentType' ? (
            <select
              id={key}
              name={key}
              value={value}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option>Aadhar Card</option>
              <option>PAN Card</option>
              <option>Voter ID</option>
            </select>
          ) : (
            <input
              id={key}
              name={key}
              type={key === 'password' ? 'password' : key === 'birthdate' ? 'date' : key === 'number' ? 'number' : 'text'}
              value={value}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        {status === 'loading' ? 'Signing up...' : 'Sign Up'}
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
