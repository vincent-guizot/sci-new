import React from "react";
import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Bagian atas: Logo */}
      <div className="bg-primary text-white p-4 text-2xl font-bold flex justify-center">
        <img width="50px" src="./logo.png" alt="Image Logo" />
      </div>

      {/* Bagian bawah: Navbar */}
      <div className="bg-base-200 p-2 shadow-md">
        <div className="flex justify-center space-x-4">
          <Link to="/" className="btn btn-ghost">
            Members
          </Link>
          <Link to="/matchmaking" className="btn btn-ghost">
            Matchmaking
          </Link>
          <Link to="/matches" className="btn btn-ghost">
            Matches
          </Link>
        </div>
      </div>

      {/* Konten utama */}
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
