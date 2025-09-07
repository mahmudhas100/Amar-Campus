import React from 'react';
import { formatTimeAgo } from '../../utils/formatTimestamp';
import { LuMessageSquare } from 'react-icons/lu';

const VoiceBoxPostCard = ({ post }) => {
  const { message, timestamp } = post || {};

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-purple-500 transition-shadow duration-300 hover:shadow-xl">
      <div className="p-4 sm:p-5">
        <div className="flex items-center mb-3">
          <div className="bg-purple-100 p-2 rounded-full">
            <LuMessageSquare className="w-6 h-6 text-purple-600" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-bold text-slate-800">Anonymous Post</h2>
          </div>
        </div>

        <div>
          <p className="text-slate-700 text-base leading-relaxed">{message}</p>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-slate-500">{formatTimeAgo(timestamp)}</p>
        </div>
      </div>
    </div>
  );
};

export default VoiceBoxPostCard;