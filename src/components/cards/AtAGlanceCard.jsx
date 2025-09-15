import React from 'react';
import { Link } from 'react-router-dom';

const AtAGlanceCard = ({ title, value, icon, link }) => {
  const cardContent = (
    <div className="bg-background-secondary p-4 rounded-2xl shadow-md flex-1 text-center transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-sky-900/20 border border-border-primary h-full flex flex-col justify-center">
      <div className="text-4xl mb-2 text-accent">{icon}</div>
      <h3 className="text-text-secondary font-bold">{title}</h3>
      <p className="text-3xl font-bold text-text-primary">{value}</p>
    </div>
  );

  if (link) {
    return (
      <Link to={link} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default AtAGlanceCard;

