import React from 'react';

const Card = ({ children, ...props }) => (
  <div {...props} className="p-4 rounded shadow bg-white">
    {children}
  </div>
);

export default Card;
