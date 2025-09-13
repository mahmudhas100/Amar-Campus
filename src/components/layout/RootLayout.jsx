import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const RootLayout = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdminPage) {
      document.body.classList.add('bg-teal-950');
      document.body.classList.remove('bg-background-primary');
    } else {
      document.body.classList.add('bg-background-primary');
      document.body.classList.remove('bg-teal-950');
    }
  }, [isAdminPage]);

  return <Outlet />;
};

export default RootLayout;
