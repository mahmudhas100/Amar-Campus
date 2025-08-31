import React from 'react';

const AtAGlanceCard = ({ title, value, icon }) => {
  return (
    <div className="bg-sky-100 p-4 rounded-lg shadow-md flex-1 text-center transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
      <div className="text-4xl mb-2 text-sky-600">{icon}</div>
      <h3 className="text-sky-800 font-bold">{title}</h3>
      <p className="text-3xl font-bold text-sky-900">{value}</p>
    </div>
  );
};

export default AtAGlanceCard;
