import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Logo */}
      <div className="bg-primary text-white p-4 text-2xl font-bold flex justify-center">
        <img width="50px" src="./logo.png" alt="Image Logo" />
      </div>

      {/* Navbar */}
      <div className="bg-base-200 p-2 shadow-md">
        <div className="flex justify-center space-x-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-4 py-2 rounded-md transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-300"
              }`
            }
          >
            Members
          </NavLink>

          <NavLink
            to="/matchmaking"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-300"
              }`
            }
          >
            Matchmaking
          </NavLink>

          <NavLink
            to="/matches"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-300"
              }`
            }
          >
            Matches
          </NavLink>

          {/* 🔥 MENU BARU */}
          <NavLink
            to="/participants-liked"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-300"
              }`
            }
          >
            Participants Liked
          </NavLink>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
