import React from 'react';
import { Outlet } from 'react-router-dom';

const ProductManagerLayout = () => {
  return (
    <div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default ProductManagerLayout;
