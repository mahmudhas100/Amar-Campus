import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { AuthContext } from './AuthContextObject';
import Spinner from '../components/common/Spinner';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, 
      async (user) => {
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUser({ ...user, ...userDocSnap.data() });
          } else {
            setUser(user);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Firebase auth error:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    user,
    loading,
    logout,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sky-950 flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};