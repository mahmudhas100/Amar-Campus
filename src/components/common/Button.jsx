import React from 'react';

const Button = ({ children, ...props }) => (
  <button {...props} className="px-4 py-2 rounded bg-blue-600 text-white">
    {children}
  </button>
);

export default Button;