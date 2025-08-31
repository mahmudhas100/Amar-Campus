import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/common/Spinner';
import { HiOutlineLogout, HiOutlinePencil, HiOutlineCog } from 'react-icons/hi';
import EditProfileModal from '../components/common/EditProfileModal';
import LogoutConfirmModal from '../components/common/LogoutConfirmModal';

const Profile = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    department: '',
    section: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        email: user.email,
        department: user.department || '',
        section: user.section || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    } finally {
      setIsLogoutModalOpen(false);
    }
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return <div className="p-8 text-center text-slate-500">No user data found. Please try logging in again.</div>;
  }

  const profileImageUrl = user.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${profileData.displayName}`;

  return (
    <>
      <div className="bg-slate-50 flex items-center justify-center mt-0" style={{minHeight: 'calc(100vh - 64px)'}}>
        <div className="relative p-4 sm:p-6 w-full">
          <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-lg relative pt-20">
            <div className="absolute -top-14 left-1/2 -translate-x-1/2">
              <img
                src={profileImageUrl}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-white shadow-md"
              />
            </div>
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold text-sky-900">{profileData.displayName}</h2>
              <p className="text-slate-500 mt-1">{profileData.email}</p>
              {profileData.department && (
                <p className="text-slate-500 mt-1">Department: {profileData.department}</p>
              )}
              {profileData.section && (
                <p className="text-slate-500 mt-1">Section: {profileData.section}</p>
              )}
              {profileData.bio && (
                <p className="text-slate-600 mt-3 text-sm">{profileData.bio}</p>
              )}
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-center items-center gap-3">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors">
                <HiOutlinePencil className="mr-2 w-5 h-5" /> Edit Profile
              </button>
              <button className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors">
                <HiOutlineCog className="mr-2 w-5 h-5" /> Settings
              </button>
              <button
                onClick={handleLogoutClick}
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
              >
                <HiOutlineLogout className="mr-2 w-5 h-5" /> Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
      
            {isModalOpen && (
        <EditProfileModal isOpen={isModalOpen} onClose={() => {
          setIsModalOpen(false);
          // Refresh profile data
          if (user) {
            setProfileData({
              displayName: user.displayName || user.email?.split('@')[0] || 'User',
              email: user.email,
              department: user.department || '',
              section: user.section || '',
              bio: user.bio || ''
            });
          }
        }} />
      )}

      <LogoutConfirmModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};

export default Profile;