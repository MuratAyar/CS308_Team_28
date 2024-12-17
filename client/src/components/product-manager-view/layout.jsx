import React from 'react';
import { Outlet } from 'react-router-dom';
import ManagerHeader from './header';

const ProductManagerLayout = () => {
  return (
    <div>
        <ManagerHeader></ManagerHeader>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default ProductManagerLayout;
