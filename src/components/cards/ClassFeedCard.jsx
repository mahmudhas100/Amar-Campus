import React, { useState } from 'react';
import { HiOutlineBell, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import formatTimestamp from '../../utils/formatTimestamp';

const ClassFeedCard = ({ post }) => {
  const { title = 'Official Announcement', snippet = '', content = '', timestamp = 'Just now', authorName = 'Admin' } = post || {};
  const [isExpanded, setIsExpanded] = useState(false);

  const displayContent = isExpanded ? content : snippet;

  return (
    <div 
      className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-amber-500 transition-shadow duration-300 hover:shadow-xl ${content && content !== snippet ? 'cursor-pointer' : ''}`}
      onClick={() => content && content !== snippet && setIsExpanded(!isExpanded)}
    >
      <div className="p-4 sm:p-5">
        {/* Card Header */}
        <div className="flex items-center mb-3">
          <div className="bg-amber-100 p-2 rounded-full">
            <HiOutlineBell className="w-6 h-6 text-amber-600" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-bold text-slate-800">Official Notice</h2>
            <p className="text-sm text-slate-500">from {authorName}</p>
          </div>
        </div>

        {/* Card Body */}
        <div>
          <h3 className="text-xl font-bold text-sky-900 mb-2 leading-snug">{title}</h3>
          <p className="text-slate-700 text-base leading-relaxed">{displayContent}</p>
        </div>

        {/* Card Footer */}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-slate-500">{formatTimestamp(timestamp)}</p>
          {content && content !== snippet && (
            <button className="text-sky-600 hover:text-sky-800 font-semibold text-sm flex items-center">
              {isExpanded ? 'Read less' : 'Read more'}
              {isExpanded ? <HiChevronUp className="w-5 h-5 ml-1" /> : <HiChevronDown className="w-5 h-5 ml-1" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassFeedCard;