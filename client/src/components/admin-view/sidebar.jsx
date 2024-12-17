import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      className="sidebar bg-gray-900 text-white h-screen w-64 p-6 shadow-lg overflow-y-auto sticky top-0"
    >
      {/* Sidebar Header */}
      <h1 className="text-2xl font-bold mb-8 text-center">Admin Dashboard</h1>

      {/* Menu Items */}
      <ul className="space-y-4">
        <li>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-blue-500 text-white shadow-md"
                  : "hover:bg-gray-700 hover:text-gray-200"
              }`
            }
          >
            Users
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-blue-500 text-white shadow-md"
                  : "hover:bg-gray-700 hover:text-gray-200"
              }`
            }
          >
            Products
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-blue-500 text-white shadow-md"
                  : "hover:bg-gray-700 hover:text-gray-200"
              }`
            }
          >
            Orders
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
