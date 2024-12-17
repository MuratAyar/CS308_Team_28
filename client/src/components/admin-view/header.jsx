import React from "react";

const Header = () => {
  return (
    <div className="header bg-gray-900 text-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Left Section - Logo/Title */}
      <div className="flex items-center space-x-3">
        <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md">
          <span className="font-bold text-lg">A</span>
        </div>
        <h1 className="text-2xl font-bold tracking-wide">Admin</h1>
      </div>

      {/* Right Section - User Info */}
      <div className="flex items-center space-x-4">
        {/* User Greeting */}
        <p className="text-gray-300">Welcome, Admin!</p>

        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.removeItem("authToken");
            window.location.href = "/auth/login";
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold shadow-md transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
