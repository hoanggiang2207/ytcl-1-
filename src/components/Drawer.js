// Drawer.js

import React from "react";
import { MdHomeFilled, MdHistory, MdOutlineSmartDisplay } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Drawer = ({ isDrawerVisible }) => {
  const location = useLocation();

  const mainLinks = [
    {
      icon: <MdHomeFilled className="text-xl" />,
      name: "Home",
      url: "/",
    },
  ];

  const secondaryLinks = [
    {
      icon: <MdHistory className="text-xl" />,
      name: "History",
      url: "/history",
    },
    {
      icon: <MdOutlineSmartDisplay className="text-xl" />,
      name: "Your Videos",
      url: "/myplaylist",
    },
  ];

  const textLinks = [[], []];

  const drawerWidth = isDrawerVisible ? "w-[240px]" : "w-0";
  const shouldRenderExtraContent = isDrawerVisible ? (
    <>
      <ul className="flex gap-2 flex-wrap text-sm p-4 text-zinc-400">
        {textLinks[1].map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <span className="px-4 text-sm text-zinc-400 ml-2 select-none">&copy; 2024 Google</span>
      <br />
      <p className="px-4 pt-3 text-sm text-zinc-400 ml-2 select-none">
        This clone is for educational purpose only. 
      </p>
    </>
  ) : null;

  return (
    <div className={`${drawerWidth} fixed top-0 left-0 h-full transition-width duration-300 flex-shrink-0 overflow-auto pb-8 bg-white z-50 mt-[64px]`}>
      <ul className="flex flex-col border-b-2 border-gray-200">
        {mainLinks.map(({ icon, name, url }) => (
          <li
            key={name}
            className={`pl-6 py-3 hover:bg-zinc-400 ${
              location.pathname === url ? "bg-slate-200" : ""
            }`}
          >
            <Link to={url} className="flex items-center gap-5 ml-2">
              {icon}
              {isDrawerVisible && <span className="text-sm tracking-wider">{name}</span>}
            </Link>
          </li>
        ))}
      </ul>
      <ul className="flex flex-col border-b-2 border-gray-200">
        {secondaryLinks.map(({ icon, name, url }) => (
          <li
            key={name}
            className={`pl-6 py-3 hover:bg-zinc-400 ${
              location.pathname === url ? "bg-slate-200" : ""
            }`}
          >
            <Link to={url} className="flex items-center ml-2 gap-5">
              {icon}
              {isDrawerVisible && <span className="text-sm tracking-wider">{name}</span>}
            </Link>
          </li>
        ))}
      </ul>
      {shouldRenderExtraContent}
    </div>
  );
};

export default Drawer;
