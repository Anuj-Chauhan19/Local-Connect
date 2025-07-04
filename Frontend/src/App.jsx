import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import AllEvents from './pages/AllEvents';
import MyEvents from './pages/MyEvents';
import EventForm from './pages/EventForm';
import EventDetails from './pages/EventDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';

export default function App() {
  return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<ProtectedRoute><AllEvents /></ProtectedRoute>} />
            <Route path="/events/my" element={<ProtectedRoute><MyEvents /></ProtectedRoute>} />
            <Route path="/events/new" element={<ProtectedRoute><EventForm /></ProtectedRoute>} />
            <Route path="/events/:id" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </main>
        <Footer />
      </div>
  
  );
}
