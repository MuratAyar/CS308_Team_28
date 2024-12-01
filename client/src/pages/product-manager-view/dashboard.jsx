import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '@/components/product-manager-view/sidebar';
import Header from '@/components/product-manager-view/header';

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="dashboard-content">
          <h2>Product Manager Dashboard</h2>
          <div className="overview">
            <div className="overview-item">
              <h3>Pending Comments</h3>
              <p>5</p>
            </div>
            <div className="overview-item">
              <h3>Approved Comments</h3>
              <p>50</p>
            </div>
            <div className="overview-item">
              <h3>Total Products</h3>
              <p>120</p>
            </div>
          </div>
          <div className="action-buttons">
            <Link to="/manage-comments">
              <button>Manage Comments</button>
            </Link>
            <Link to="/manage-products">
              <button>Manage Products</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
