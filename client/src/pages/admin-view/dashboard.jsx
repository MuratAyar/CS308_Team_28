import React, { useState } from "react";
import Users from "./users";
import AdminProducts from "./products";
import AdminOrders from "./orders";

const AdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState("users");

  const renderContent = () => {
    switch (currentTab) {
      case "users":
        return <Users />;
      case "products":
        return <AdminProducts />;
      case "orders":
        return <AdminOrders />;
      default:
        return <Users />;
    }
  };

  return (
    <div className="main-content p-4">
      {/* Dynamic Content */}
      <div className="p-6">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
