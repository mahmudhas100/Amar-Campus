import React, { useState } from 'react';
import { HiOutlineBell, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import formatTimestamp from '../../utils/formatTimestamp';

const ClassFeedCard = ({ post }) => {
  const { title = 'Official Announcement', snippet = '', content = '', timestamp, authorName = 'Admin', priority = 'Normal' } = post || {};
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityBorderClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'border-red-500';
      case 'Urgent':
        return 'border-yellow-500';
      case 'Normal':
        return 'border-sky-500';
      case 'Low':
        return 'border-green-500';
      default:
        return 'border-border-primary';
    }
  };

  const displayContent = isExpanded ? content : snippet;

  return (
    <div 
      className={`bg-background-secondary rounded-xl shadow-md overflow-hidden border-l-4 ${getPriorityBorderClass(priority)} transition-shadow duration-300 hover:shadow-xl hover:shadow-sky-900/20 ${content && content !== snippet ? 'cursor-pointer' : ''}`}
      onClick={() => content && content !== snippet && setIsExpanded(!isExpanded)}
    >
      <div className="p-4 sm:p-5">
        {/* Card Header */}
        <div className="flex items-center mb-3">
          <div className="bg-amber-500/10 p-2 rounded-full">
            <HiOutlineBell className="w-6 h-6 text-amber-400" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-bold text-text-primary">Official Notice</h2>
            <p className="text-sm text-text-secondary">from Admin</p>
          </div>
        </div>

        {/* Card Body */}
        <div>
          <h3 className="text-xl font-bold text-text-primary mb-2 leading-snug">{title}</h3>
          <p className="text-text-secondary text-base leading-relaxed">{displayContent}</p>
        </div>

        {/* Card Footer */}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-text-secondary">{formatTimestamp(timestamp)}</p>
          {content && content !== snippet && (
            <button className="text-accent hover:text-accent-hover font-semibold text-sm flex items-center">
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
