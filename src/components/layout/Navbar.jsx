import React, { useState } from 'react';
import { HiFilter } from 'react-icons/hi';

const Navbar = ({ isVisible, onSearchChange, onCategoryChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // TODO: Fetch categories from Firestore
  const categories = ['all', 'Events', 'Notices', 'General', 'Skill Development', 'Internship and Job Opportunities', 'Academic', 'Campus Tips', 'Extracurriculars', 'Others'];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearchChange(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    onCategoryChange(e.target.value);
  };

  return (
    <header className={`bg-sky-900/70 backdrop-blur-lg sticky top-0 z-40 w-full border-b border-sky-800/60 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img src="/AClogo2-.png" alt="Amar Campus Logo" className="h-16 w-auto" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-background-secondary text-white placeholder-sky-300/70 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-sky-500/80 w-64 transition-all duration-300 group-hover:bg-background-secondary/80 focus:w-72"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-sky-300/70 group-hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="relative group">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="bg-background-secondary text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500/80 appearance-none transition-all duration-300 group-hover:bg-background-secondary/80"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiFilter className="h-5 w-5 text-sky-300/70 group-hover:text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
