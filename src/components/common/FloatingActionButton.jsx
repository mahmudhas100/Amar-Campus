import React from 'react';
import { HiPlus } from 'react-icons/hi';

const FloatingActionButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 z-40 bg-sky-600 hover:bg-sky-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-110 active:scale-95"
      aria-label="Create new post"
    >
      <HiPlus className="w-8 h-8" />
    </button>
  );
};

export default FloatingActionButton;
