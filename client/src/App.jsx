import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Nav from './components/Nav';
import PostsPage from './pages/PostsPage';
import SinglePostPage from './pages/SinglePostPage';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <div className="min-h-screen bg-gray-100 py-6">
          <Routes>
            <Route path="/" element={<PostsPage />} />
            <Route path="/posts/:id" element={<SinglePostPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
