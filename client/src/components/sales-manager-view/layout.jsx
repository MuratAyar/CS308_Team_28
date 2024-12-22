import React from 'react';
import { Outlet } from 'react-router-dom';
import ManagerHeader from './header';

const SalesManagerLayout = () => {
  return (
    <div>
        <ManagerHeader></ManagerHeader>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default SalesManagerLayout;
