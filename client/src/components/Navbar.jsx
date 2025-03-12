import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Library, Present, Schedule } from "../assets";

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md border-t py-[2rem]">
      <div className="flex justify-around items-center">
        <Link to="/" className="text-gray-600 hover:text-black">
          <img
            src={Home}
            alt="home"
            className={`h-[6rem] w-[6rem] ${isActive("/") ? "" : "opacity-50"}`}
          />
        </Link>
        <Link to="/stats" className="text-gray-600 hover:text-black">
          <img
            src={Library}
            alt="stats"
            className={`h-[6rem] w-[6rem] ${isActive("/stats") ? "" : "opacity-50"}`}
          />
        </Link>
        <Link to="/timetable" className="text-gray-600 hover:text-black">
          <img
            src={Present}
            alt="timetable"
            className={`h-[6rem] w-[6rem] ${isActive("/timetable") ? "" : "opacity-50"}`}
          />
        </Link>
        <Link to="/schedule" className="text-gray-600 hover:text-black">
          <img
            src={Schedule}
            alt="schedule"
            className={`h-[6rem] w-[6rem] ${isActive("/schedule") ? "" : "opacity-50"}`}
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
