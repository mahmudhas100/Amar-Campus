import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Home' },
    { path: '/dashboard/voice-box', icon: '🛡️', label: 'Voice Box' },
    { path: '/dashboard/profile', icon: '👤', label: 'Profile' },
  ];

  const activeStyle = {
    color: '#7DD3FC',
    transform: 'scale(1.1)',
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-sky-900/80 backdrop-blur-sm border-t border-sky-800 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-around items-center h-full">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              style={({ isActive }) => (isActive ? activeStyle : undefined)}
              className="flex flex-col items-center justify-center text-sky-400 hover:text-white transition-transform duration-200"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
