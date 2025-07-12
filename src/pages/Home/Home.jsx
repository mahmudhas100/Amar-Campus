import React, { useState } from 'react';

const ClassFeed = () => <div className="p-4 bg-white rounded-lg shadow animate-pulse"><div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div><div className="h-4 bg-gray-200 rounded w-1/2"></div></div>;
const GrowthHub = () => <div className="p-4 bg-white rounded-lg shadow animate-pulse"><div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div><div className="h-4 bg-gray-200 rounded w-1/2"></div></div>;

const Home = () => {
  const [activeTab, setActiveTab] = useState('class-feed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="border-b border-gray-200 mb-4">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('class-feed')}
            className={`${
              activeTab === 'class-feed'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Class Feed
          </button>
          <button
            onClick={() => setActiveTab('growth-hub')}
            className={`${
              activeTab === 'growth-hub'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Growth Hub
          </button>
        </nav>
      </div>
      <div>
        {activeTab === 'class-feed' && <ClassFeed />}
        {activeTab === 'growth-hub' && <GrowthHub />}
      </div>
    </div>
  );
};

export default Home;
