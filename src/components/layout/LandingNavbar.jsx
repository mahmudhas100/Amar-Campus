import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../common/Spinner';

const LandingNavbar = () => {
  const [loadingStates, setLoadingStates] = useState({
    login: false,
    signup: false
  });
  const navigate = useNavigate();

  const handleNavigation = (path, type) => {
    setLoadingStates(prev => ({ ...prev, [type]: true }));
    setTimeout(() => {
      navigate(path);
    }, 500);
  };

  return (
    <header className="bg-sky-900/80 backdrop-blur-sm fixed top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-black text-white">Amar Campus</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleNavigation('/login', 'login')}
              disabled={loadingStates.login}
              className="px-4 py-2 text-sm font-bold text-sky-200 bg-transparent hover:bg-sky-800 rounded-md transition inline-flex items-center disabled:opacity-75"
            >
              {loadingStates.login ? (
                <>
                  <Spinner size="sm" className="text-sky-300" />
                  <span className="ml-2">Loading...</span>
                </>
              ) : (
                'Login'
              )}
            </button>
            <button
              onClick={() => handleNavigation('/login?state=signup', 'signup')}
              disabled={loadingStates.signup}
              className="px-4 py-2 text-sm font-bold text-sky-900 bg-sky-300 hover:bg-sky-200 rounded-md transition inline-flex items-center disabled:opacity-75"
            >
              {loadingStates.signup ? (
                <>
                  <Spinner size="sm" className="text-sky-900" />
                  <span className="ml-2">Loading...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingNavbar;
