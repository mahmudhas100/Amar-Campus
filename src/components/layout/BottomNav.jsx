import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = ({ isVisible }) => {
  const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Home' },
    { path: '/dashboard/voice-box', icon: '🛡️', label: 'Voice Box' },
    { path: '/dashboard/profile', icon: '👤', label: 'Profile' },
  ];

  const activeStyle = {
    color: 'darkblue',
    transform: 'scale(1.1)',
  };

  return (
    <nav className={`fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-md h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl z-40 transition-all duration-300 shadow-2xl shadow-sky-900/30 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-around items-center h-full">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
              className="flex flex-col items-center justify-center text-blue-900 hover:text-black transition-transform duration-200 ease-in-out transform hover:-translate-y-1"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-medium tracking-wide">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
