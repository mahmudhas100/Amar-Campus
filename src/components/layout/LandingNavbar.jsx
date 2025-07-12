import React from 'react';
import { Link } from 'react-router-dom';

const LandingNavbar = () => {
  return (
    <header className="bg-sky-900/80 backdrop-blur-sm fixed top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-black text-white">Amar Campus</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="px-4 py-2 text-sm font-bold text-sky-200 bg-transparent hover:bg-sky-800 rounded-md transition">
              Login
            </Link>
            <Link to="/login" className="px-4 py-2 text-sm font-bold text-sky-900 bg-sky-300 hover:bg-sky-200 rounded-md transition">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingNavbar;
