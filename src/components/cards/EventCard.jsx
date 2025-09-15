import React from 'react';
import { HiOutlineCalendar, HiOutlineLocationMarker } from 'react-icons/hi';
import formatTime12Hour from '../../utils/formatTime12Hour';
import ReactMarkdown from 'react-markdown';

const EventCard = ({ event }) => {
  const { title, date, time, location, description } = event || {};

  return (
    <div className="bg-background-secondary rounded-xl shadow-md overflow-hidden border border-border-primary transition-shadow duration-300 hover:shadow-xl hover:shadow-sky-900/20">
      <div className="p-4 sm:p-5">
        <div className="flex items-center mb-3">
          <div className="bg-emerald-500/10 p-2 rounded-full">
            <HiOutlineCalendar className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-bold text-text-primary">Upcoming Event</h2>
            <p className="text-sm text-text-secondary">from Admin</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-text-primary mb-2 leading-snug">{title}</h3>
          {date && (
            <div className="flex items-center text-sm text-text-secondary mb-1">
              <HiOutlineCalendar className="w-4 h-4 mr-2" />
              <span>{date} {formatTime12Hour(time)}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center text-sm text-text-secondary mb-2">
              <HiOutlineLocationMarker className="w-4 h-4 mr-2" />
              <span>{location}</span>
            </div>
          )}
          <div className="prose prose-invert prose-sm max-w-none text-text-secondary leading-relaxed">
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
