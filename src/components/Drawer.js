import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { MdHomeFilled, MdHistory, MdOutlineSmartDisplay } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

const Drawer = ({ isDrawerVisible, toggleDrawer }) => {
  const location = useLocation();

  useEffect(() => {
    // Hide the drawer when the location changes
    if (isDrawerVisible) {
      toggleDrawer();
    }
  }, [location.pathname]);

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

  return (
    <div className={`fixed left-0 h-full bg-white text-black z-50 transition-transform duration-100 ${isDrawerVisible ? 'translate-x-0' : '-translate-x-full'} w-[240px]`}>
      <ul className="flex flex-col border-b-2 border-gray-700">
        <li className="pl-6 py-3 ml-2 flex items-center">
          <FontAwesomeIcon
            className="cursor-pointer"
            icon={faBars}
            style={{ fontSize: "24px" }}
            onClick={toggleDrawer} // Use toggleDrawer function here
          />
          <Link to="/">
            <img
              className="ml-4"
              width={"95px"}
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/YouTube_Logo_2017.svg/768px-YouTube_Logo_2017.svg.png"
              alt="logo"
            />
          </Link>
        </li>
        {mainLinks.map(({ icon, name, url }) => (
          <li
            key={name}
            className={`pl-6 py-3 hover:bg-zinc-400 ${location.pathname === url ? "bg-zinc-400" : ""}`}
          >
            <Link to={url} className="flex items-center gap-5 ml-2">
              {icon}
              {isDrawerVisible && <span className="text-sm tracking-wider">{name}</span>}
            </Link>
          </li>
        ))}
      </ul>
      <ul className="flex flex-col border-b-2 border-gray-700">
        {secondaryLinks.map(({ icon, name, url }) => (
          <li
            key={name}
            className={`pl-6 py-3 hover:bg-zinc-400 ${location.pathname === url ? "bg-zinc-400" : ""}`}
          >
            <Link to={url} className="flex items-center ml-2 gap-5">
              {icon}
              {isDrawerVisible && <span className="text-sm tracking-wider">{name}</span>}
            </Link>
          </li>
        ))}
      </ul>
      {isDrawerVisible && (
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
      )}
    </div>
  );
};

export default Drawer;
