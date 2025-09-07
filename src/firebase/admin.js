import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

// Make this function available globally for console use
window.makeUserAdmin = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isAdmin: true,
      role: 'admin',
      updatedAt: new Date(),
    });
    console.log('Successfully made user an admin!');
    return true;
  } catch (error) {
    console.error('Error making user admin:', error);
    return false;
  }
};

// Update user role
export const updateUserRole = async (userId, isAdmin) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isAdmin: isAdmin,
      role: isAdmin ? 'admin' : 'user',
      updatedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    return false;
  }
};

// Check if user has admin role
export const checkAdminRole = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData.isAdmin === true;
    }
    return false;
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
};
