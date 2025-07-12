import React from 'react';

const Navbar = () => {
  const handleSearch = () => {
    console.log('Search clicked');
  };

  return (
    <header className="bg-sky-900/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b border-sky-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-black text-white">Amar Campus</span>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleSearch}
              className="p-2 rounded-full text-sky-300 hover:text-white hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
