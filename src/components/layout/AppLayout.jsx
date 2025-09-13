import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import BottomNav from './BottomNav.jsx';
import FloatingActionButton from '../common/FloatingActionButton.jsx';
import CreatePostModal from '../common/CreatePostModal.jsx';
import { addGrowthHubPost } from '../../firebase/firestore.js';

const AppLayout = () => {
  // Nav visibility logic
  const [isNavVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const location = useLocation();

  // Modal visibility logic
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePostSubmit = async (postData) => {
    try {
      await addGrowthHubPost(postData);
      // Optionally, trigger a feed refresh here later
    } catch (error) {
      console.error("Failed to submit post:", error);
      // Re-throw the error to be caught in the modal
      throw error;
    }
  };
  
  // Only show FAB on the home/dashboard page
  const showFab = location.pathname === '/dashboard';
  // Hide top navigation on profile and voicebox pages
  const hideTopNav = location.pathname === '/dashboard/profile' || location.pathname === '/dashboard/voice-box';
  

  return (
    <div className="flex flex-col min-h-screen">
      {!hideTopNav && (
        <Navbar 
          isVisible={isNavVisible} 
          onSearchChange={setSearchQuery} 
          onCategoryChange={setSelectedCategory} 
        />
      )}
      <main className="flex-grow pb-24">
        <Outlet context={{ searchQuery, selectedCategory }} />
      </main>
      <BottomNav isVisible={isNavVisible} />
      
      {showFab && <FloatingActionButton onClick={() => setIsModalOpen(true)} />}
      
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePostSubmit}
      />
    </div>
  );
};
export default AppLayout;
