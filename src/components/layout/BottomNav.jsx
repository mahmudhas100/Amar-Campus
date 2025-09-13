import React from 'react';
import { NavLink } from 'react-router-dom';
import { HiHome, HiShieldCheck, HiUser } from 'react-icons/hi';

const BottomNav = ({ isVisible }) => {
  const navItems = [
    { path: '/dashboard', icon: <HiHome />, label: 'Home' },
    { path: '/dashboard/voice-box', icon: <HiShieldCheck />, label: 'Voice Box' },
    { path: '/dashboard/profile', icon: <HiUser />, label: 'Profile' },
  ];

  return (
    <nav className={`fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-md h-16 bg-background-secondary/80 backdrop-blur-xl border border-border-primary rounded-2xl z-40 transition-all duration-300 shadow-2xl shadow-sky-900/30 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-around items-center h-full">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className="flex flex-col items-center justify-center text-text-secondary ui-active:text-accent ui-active:scale-110 hover:text-text-primary transition-all duration-200 ease-in-out transform hover:-translate-y-1"
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
