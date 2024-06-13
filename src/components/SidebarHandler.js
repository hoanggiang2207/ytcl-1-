import React, { useEffect } from "react";

const SidebarHandler = ({ setDrawerVisible }) => {
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (e.clientX < window.innerWidth * 0.1) {
        document.body.classList.add('select-none'); // Add no-select class to body
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }
    };

    const handleMouseMove = (e) => {
      if (e.clientX > window.innerWidth * 0.08) {
        setDrawerVisible(true);
      }
    };

    const handleMouseUp = () => {
      document.body.classList.remove('select-none'); // Remove no-select class from body
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [setDrawerVisible]);

  return null;
};

export default SidebarHandler;
