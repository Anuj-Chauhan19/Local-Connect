import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/userSlice';

export default function Navbar() {
  const { token, userInfo } = useSelector((s) => s.user);
  const dispatch = useDispatch();
  return (
    <div>
    <nav className="bg-blue-600 text-white px-6 py-4 fixed w-full top-0 z-10 flex justify-between">
      <div className="flex space-x-4">
        <Link to="/">Home</Link>
        <div className="relative group">
          <span className="cursor-pointer">Events</span>
          <div className="absolute hidden group-hover:block bg-white text-black rounded shadow py-2">
            <Link className="block px-4 py-1" to="/events">All Events</Link>
            {token && <Link className="block px-4 py-1" to="/events/my">My Events</Link>}
          </div>
        </div>
        <Link to="/chats">Chats</Link>
        <Link to="/notifications">Notifications</Link>
        <Link to="/contact">Contact Us</Link>
        <Link to="/faq">FAQ</Link>
      </div>
      <div>
        {token ? (
          <>
            <span className="mr-4">Hello, {userInfo?.name}</span>
            <button onClick={() => dispatch(logout())} className="underline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
    </div>
  );
}
