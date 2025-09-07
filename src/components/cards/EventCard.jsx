import React from 'react';
import { HiOutlineCalendar, HiOutlineLocationMarker } from 'react-icons/hi';
import formatTime12Hour from '../../utils/formatTime12Hour';

const EventCard = ({ event }) => {
  const { title, date, time, location, description } = event || {};

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-emerald-500 transition-shadow duration-300 hover:shadow-xl">
      <div className="p-4 sm:p-5">
        <div className="flex items-center mb-3">
          <div className="bg-emerald-100 p-2 rounded-full">
            <HiOutlineCalendar className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-bold text-slate-800">Upcoming Event</h2>
            <p className="text-sm text-slate-500">from Admin</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-sky-900 mb-2 leading-snug">{title}</h3>
          {date && (
            <div className="flex items-center text-sm text-slate-500 mb-1">
              <HiOutlineCalendar className="w-4 h-4 mr-2" />
              <span>{date} {formatTime12Hour(time)}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center text-sm text-slate-500 mb-2">
              <HiOutlineLocationMarker className="w-4 h-4 mr-2" />
              <span>{location}</span>
            </div>
          )}
          <p className="text-slate-700 text-base leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
