import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import Spinner from '../components/common/Spinner';
import { HiOutlineLogout, HiOutlinePencil, HiOutlineCog, HiOutlineShieldCheck, HiOutlineLockClosed } from 'react-icons/hi';
import EditProfileModal from '../components/common/EditProfileModal';
import LogoutConfirmModal from '../components/common/LogoutConfirmModal';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const Profile = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showAdminKeyInput, setShowAdminKeyInput] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [adminKeyError, setAdminKeyError] = useState('');
  const ADMIN_SECRET_KEY = 'amar-campus-admin-2025'; // You can change this to any secret key you want
  
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

  const handleAdminKeySubmit = async () => {
    setAdminKeyError('');
    if (adminKey === ADMIN_SECRET_KEY) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          isAdmin: true,
          role: 'admin',
          updatedAt: new Date()
        });
        // Update local user state
        user.isAdmin = true;
        user.role = 'admin';
        setShowAdminKeyInput(false);
        setAdminKey('');
        window.location.reload(); // Refresh to update UI
      } catch (error) {
        console.error('Error updating admin status:', error);
        setAdminKeyError('Failed to update admin status. Please try again.');
      }
    } else {
      setAdminKeyError('Invalid admin key');
    }
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
      <div className="flex items-center justify-center mt-0" style={{minHeight: 'calc(100vh - 64px)'}}>
        <div className="relative p-4 sm:p-6 w-full">
          <div className="max-w-xl mx-auto bg-background-secondary p-6 rounded-2xl shadow-lg relative pt-20 border border-border-primary">
            {/* Admin Panel Button - Top Right */}
            {user.isAdmin ? (
              <Link 
                to="/admin"
                className="absolute top-4 right-4 flex items-center px-3 py-1.5 bg-accent/10 hover:bg-accent/20 text-accent text-sm font-semibold rounded-lg transition-colors"
              >
                <HiOutlineShieldCheck className="w-4 h-4 mr-1" /> Admin Panel
              </Link>
            ) : (
              <button
                onClick={() => setShowAdminKeyInput(true)}
                className="absolute top-4 right-4 flex items-center px-3 py-1.5 bg-background-primary hover:bg-background-primary/50 text-text-secondary text-sm font-semibold rounded-lg transition-colors"
              >
                <HiOutlineLockClosed className="w-4 h-4 mr-1" /> Become Admin
              </button>
            )}
            <div className="absolute -top-14 left-1/2 -translate-x-1/2">
              <img
                src={profileImageUrl}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-background-secondary shadow-md"
              />
            </div>
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold text-text-primary">{profileData.displayName}</h2>
              <p className="text-text-secondary mt-1">{profileData.email}</p>
              {profileData.department && (
                <p className="text-text-secondary mt-1">Department: {profileData.department}</p>
              )}
              {profileData.section && (
                <p className="text-text-secondary mt-1">Section: {profileData.section}</p>
              )}
              {profileData.bio && (
                <p className="text-text-primary mt-3 text-sm">{profileData.bio}</p>
              )}
            </div>

            <div className="mt-8 border-t border-border-primary pt-6 flex flex-col sm:flex-row justify-center items-center gap-3">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-background-primary hover:bg-background-primary/50 text-text-secondary font-semibold rounded-lg transition-colors">
                <HiOutlinePencil className="mr-2 w-5 h-5" /> Edit Profile
              </button>
              <button
                onClick={handleLogoutClick}
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-lg transition-colors"
              >
                <HiOutlineLogout className="mr-2 w-5 h-5" /> Log Out
              </button>
            </div>

            {/* Admin Key Input Modal */}
            {showAdminKeyInput && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-background-secondary rounded-xl p-6 max-w-md w-full border border-border-primary">
                  <h3 className="text-lg font-bold text-text-primary mb-4">Enter Admin Key</h3>
                  <input
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="Enter the admin key"
                    className="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-text-primary placeholder-text-secondary mb-2"
                  />
                  {adminKeyError && (
                    <p className="text-red-400 text-sm mb-2">{adminKeyError}</p>
                  )}
                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      onClick={() => {
                        setShowAdminKeyInput(false);
                        setAdminKey('');
                        setAdminKeyError('');
                      }}
                      className="px-4 py-2 text-text-secondary hover:bg-background-primary rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAdminKeySubmit}
                      className="px-4 py-2 bg-accent text-background-primary rounded-lg hover:bg-accent-hover transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
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