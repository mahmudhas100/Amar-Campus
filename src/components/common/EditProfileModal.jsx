import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useAuth } from '../../hooks/useAuth';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebase';
import { updateProfile } from 'firebase/auth';
import Spinner from './Spinner';

// Helper function to get the current authenticated user
const getCurrentAuthUser = () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No authenticated user found');
  }
  return user;
};

const EditProfileModal = ({ isOpen, onClose }) => {
  useAuth(); // Keep the auth context subscription active
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    displayName: '',
    department: '',
    section: '',
    bio: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = getCurrentAuthUser();
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFormData({
            displayName: currentUser.displayName || `${userData.firstName} ${userData.lastName || ''}`.trim() || '',
            department: userData.department || '',
            section: userData.section || '',
            bio: userData.bio || ''
          });
        } else {
          setFormData({
            displayName: currentUser.displayName || '',
            department: '',
            section: '',
            bio: ''
          });
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load profile data');
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const currentUser = getCurrentAuthUser();

      // Update user profile in Firebase Auth
      await updateProfile(currentUser, {
        displayName: formData.displayName
      });

      // Update additional user data in Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      const userData = {
        displayName: formData.displayName,
        firstName: formData.displayName.split(' ')[0],
        lastName: formData.displayName.split(' ').slice(1).join(' '),
        department: formData.department,
        section: formData.section,
        bio: formData.bio,
        updatedAt: new Date()
      };

      if (userDoc.exists()) {
        // Update existing document
        await updateDoc(userRef, userData);
      } else {
        // Create new document if it doesn't exist
        await setDoc(userRef, {
          ...userData,
          email: currentUser.email,
          createdAt: new Date()
        });
      }

      // Force a refresh of the auth token to get the updated profile
      await currentUser.reload();

      onClose();
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-md p-4 bg-gradient-to-br from-white to-sky-50/30 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-sky-900">Edit Profile</h2>
            <p className="text-sky-600/80 text-xs">Update your information</p>
          </div>
          {error && (
            <div className="text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label htmlFor="displayName" className="block text-xs font-semibold text-sky-900 mb-1">
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className="w-full px-2 py-1.5 bg-white/50 border border-sky-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 hover:border-sky-300"
                required
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-xs font-semibold text-sky-900 mb-1">
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-2 py-1.5 bg-white/50 border border-sky-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 hover:border-sky-300"
                placeholder="e.g., CSE"
              />
            </div>

            <div>
              <label htmlFor="section" className="block text-xs font-semibold text-sky-900 mb-1">
                Section
              </label>
              <input
                type="text"
                id="section"
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                className="w-full px-2 py-1.5 bg-white/50 border border-sky-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 hover:border-sky-300"
                placeholder="e.g., A1"
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="bio" className="block text-xs font-semibold text-sky-900 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-2 py-1.5 bg-white/50 border border-sky-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 hover:border-sky-300"
                placeholder="Brief bio..."
              />
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-sky-100 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-sky-200 rounded text-xs font-semibold text-sky-700 bg-white hover:bg-sky-50 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1.5 border border-transparent rounded text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[70px] transition-colors duration-200"
            >
              {loading ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditProfileModal;