import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineSpeakerphone, HiOutlineUserGroup, HiOutlineCalendar, HiOutlineCog } from 'react-icons/hi';

const AdminDashboard = () => {
  const adminModules = [
    {
      title: 'Notices & Announcements',
      description: 'Create and manage official class notices',
      icon: <HiOutlineSpeakerphone className="w-8 h-8" />,
      path: '/admin/notices',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      title: 'Event Calendar',
      description: 'Schedule and manage campus events',
      icon: <HiOutlineCalendar className="w-8 h-8" />,
      path: '/admin/events',
      color: 'bg-purple-100 text-purple-700',
    },
    {
      title: 'Voice Box Reports',
      description: 'View and manage anonymous reports',
      icon: <HiOutlineSpeakerphone className="w-8 h-8" />,
      path: '/admin/voicebox',
      color: 'bg-pink-100 text-pink-700',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-300 font-bold text-lg">Manage your campus platform efficiently</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {adminModules.map((module) => (
          <Link
            key={module.path}
            to={module.path}
            className="block p-8 rounded-2xl border border-teal-800 bg-teal-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className={`inline-block p-4 rounded-xl ${module.color} mb-5`}>
              {module.icon}
            </div>
            <h3 className="font-bold text-xl text-white mb-2">
              {module.title}
            </h3>
            <p className="text-gray-300 text-base">{module.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;