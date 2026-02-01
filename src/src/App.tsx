import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Login, Register } from './pages/Auth';
import { Profile } from './pages/Profile';
import { Search } from './pages/Search';
import { Community } from './pages/Community';
import { Chat } from './pages/Chat';
import { Setup } from './pages/Setup'; // Import Setup page
import { Toaster } from 'sonner';

export default function App() {
  return (
    <>
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/community" element={<Community />} />
          <Route path="/chat/:userId" element={<Chat />} />
          <Route path="/setup" element={<Setup />} /> {/* Add Setup route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
    <Toaster position="top-right" />
    </>
  );
}
