import React, { useState } from "react";
import ManageOrders from "./orders-content";
import SearchOrders from "@/components/product-manager-view/searchOrders";

const AdminOrders = () => {
  const [currentView, setCurrentView] = useState("all");

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Manage Orders</h2>
      {/* Navigation Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setCurrentView("all")}
          className={`px-4 py-2 border rounded-md font-semibold transition-all ${
            currentView === "all"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All Orders
        </button>
        <button
          onClick={() => setCurrentView("search")}
          className={`px-4 py-2 border rounded-md font-semibold transition-all ${
            currentView === "search"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Search Orders
        </button>
      </div>

      {/* Dynamic Views */}
      <div className="min-h-screen">
        {currentView === "all" ? <ManageOrders /> : <SearchOrders />}
      </div>
    </div>
  );
};

export default AdminOrders;
