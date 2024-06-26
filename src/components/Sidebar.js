import React from "react";
import { MdHomeFilled, MdHistory, MdOutlineSmartDisplay } from "react-icons/md";

import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Sidebar() {
  const location = useLocation();
  const isSidebarVisible = useSelector((state) => state.app.sidebarVisible);

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

  const sidebarWidth = isSidebarVisible ? "w-[250px]" : "w-[100px]";
  const shouldRenderExtraContent = isSidebarVisible ? (
    <>
      <ul className="flex gap-2 flex-wrap text-sm p-4 text-zinc-400">
        {textLinks[1].map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <span className="px-4 text-sm text-zinc-400 ml-2 2xl:ml-0">&copy; 2024 Google</span>
      <br />
      <p className="px-4 pt-3 text-sm text-zinc-400 ml-2 2xl:ml-0">
        This clone is for educational purpose only.
      </p>
    </>
  ) : null;

  return (
    <div className={`${sidebarWidth} flex-shrink-0 pr-4 overflow-auto pb-8 sidebar sticky top-[55px] h-[720px] 2xl:pr-7`}>
      <ul className="flex flex-col border-b-2 border-[#E7E7E7]">
        {mainLinks.map(({ icon, name, url }) => (
          <li
            key={name}
            className={`pl-6 py-3 hover:bg-[#F2F2F2] ${
              location.pathname === url ? "bg-[#F2F2F2]" : ""
            }`}
          >
            <Link to={url} className="flex items-center gap-5 ml-2 2xl:ml-0">
              {icon}
              {isSidebarVisible && <span className="text-sm tracking-wider">{name}</span>}
            </Link>
          </li>
        ))}
      </ul>
      <ul className="flex flex-col border-b-2 border-[#E7E7E7]">
        {secondaryLinks.map(({ icon, name, url }) => (
          <li
            key={name}
            className={`pl-6 py-3 hover:bg-[#F2F2F2] ${
              location.pathname === url ? "bg-[#F2F2F2]" : ""
            }`}
          >
            <Link to={url} className="flex items-center ml-2 gap-5 2xl:ml-0">
              {icon}
              {isSidebarVisible && <span className="text-sm tracking-wider">{name}</span>}
            </Link>
          </li>
        ))}
      </ul>

      {shouldRenderExtraContent}
    </div>
  );
}
