import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Home from './pages/Home/Home.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import LandingPage from './pages/LandingPage.jsx';
import './index.css';

const VoiceBox = () => <div className="p-8 text-center"><h1>Voice Box Page</h1></div>;
const Profile = () => <div className="p-8 text-center"><h1>Profile Page</h1></div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        
        <Route 
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Home />} />
          <Route path="/dashboard/voice-box" element={<VoiceBox />} />
          <Route path="/dashboard/profile" element={<Profile />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
