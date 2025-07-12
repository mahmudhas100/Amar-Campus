import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import BottomNav from './BottomNav.jsx';

const AppLayout = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <main className="pb-20 pt-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default AppLayout;
