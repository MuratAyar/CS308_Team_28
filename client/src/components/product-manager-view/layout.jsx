import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const ProductManagerLayout = () => {
  return (
    <div>
      <Sidebar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default ProductManagerLayout;
