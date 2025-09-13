import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Home from './pages/Home/Home.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import LandingPage from './pages/LandingPage.jsx';
import { useAuth } from './hooks/useAuth.jsx';
import Spinner from './components/common/Spinner';
import VoiceBox from './pages/VoiceBox.jsx';
import Profile from './pages/Profile.jsx';
import PostPage from './pages/PostPage.jsx';
import { adminRoutes } from './routes/adminRoutes';
import './index.css';


import RootLayout from './components/layout/RootLayout';

function App() {
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) {
      document.body.classList.add('bg-transparent');
    } else {
      document.body.classList.remove('bg-transparent');
    }
  }, [authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          
          <Route 
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard/*" element={<Home />} />
            <Route path="/dashboard/voice-box" element={<VoiceBox />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/post/:postId" element={<PostPage />} />
          </Route>

          {/* Admin Routes */}
          {adminRoutes}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
