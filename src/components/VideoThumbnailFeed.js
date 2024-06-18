import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CiMenuKebab } from "react-icons/ci";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useSelector } from "react-redux";
import "react-lazy-load-image-component/src/effects/blur.css";
import SkeletonLoadingThumbnail from "./SkeletonLoadingThumbnail";

const VideoThumbnailFeed = ({
  item,
  showThumbnail,
  handleWatchVideo,
  handleAddToPlaylist,
  handleTooltip,
  hideTooltip,
  tooltipVisible,
  index,
  shortenNumber,
  formatDate,
  selectedVideo,
  setSelectedVideo,
  showButton,
  setShowButton,
  iconRef,
  buttonRef,
  buttonPosition,
  setButtonPosition,
}) => {
  const isSidebarVisible = useSelector((state) => state.app.sidebarVisible);

  const getThumbnailClassNames = () => {
    return isSidebarVisible
      ? "w-[312px] h-[176px] 2xl:w-[375px] 2xl:h-[212px]"
      : "w-[346px] h-[195px] 2xl:w-[320px] 2xl:h-[180px]";
  };

  const getThumbnailWidth = () => {
    return isSidebarVisible ? "w-full 2xl:w-[full]" : "w-full 2xl:w-[320px]";
  };

  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const handleIconClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setButtonPosition({ top: rect.bottom, left: rect.left });
    setSelectedVideo(item);
    setShowButton(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowButton(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [buttonRef, setShowButton]);

  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceRight = window.innerWidth - rect.left;
      const dropdownHeight = 200; // Adjust according to your needs
      const dropdownWidth = 200; // Adjust according to your needs

      let top = rect.bottom;
      let left = rect.left;

      if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
        top = rect.top - dropdownHeight;
      }

      if (spaceRight < dropdownWidth && rect.right > dropdownWidth) {
        left = rect.right - dropdownWidth;
      }

      setDropdownPosition({ top, left });
    }
  }, [buttonRef]);

  return (
    <div
      key={typeof item.id === "object" ? item.id.videoId : item.id}
      className={`bg-white overflow-hidden mb-[45px] relative ${getThumbnailWidth()}`}
    >
      <Link
        to={`/watch?v=${
          typeof item.id === "object" ? item.id.videoId : item.id
        }`}
        onClick={() => handleWatchVideo(item)}
      >
        {showThumbnail ? (
          <LazyLoadImage
            src={item.snippet.thumbnails.medium.url}
            alt={item.snippet.title}
            className={`object-cover rounded-xl ${getThumbnailClassNames()}`}
            effect="blur"
          />
        ) : (
          <SkeletonLoadingThumbnail />
        )}
      </Link>
      <div className="mt-3 flex items-start justify-between">
        <div className="flex items-start">
          <img
            src={item.channelAvatar}
            alt={item.snippet.channelTitle}
            className="w-9 h-9 rounded-full mr-4"
          />
          <div className="flex flex-col">
            <Link
              to={`/watch?v=${
                typeof item.id === "object" ? item.id.videoId : item.id
              }`}
              onClick={() => handleWatchVideo(item)}
            >
              <div
                className="line-clamp-2 text-[16px] font-[500] text-black"
                onMouseEnter={() => handleTooltip(index)}
                onMouseLeave={hideTooltip}
              >
                {item.snippet.title}
                {tooltipVisible === index && (
                  <div className="absolute z-50 top-[18rem] text-center right-2 px-1 text-[13px] text-white bg-gray-900 border-white">
                    {item.snippet.title}
                  </div>
                )}
              </div>
              <div className="text-[14px] text-[#929292] font-[500]">
                {item.snippet.channelTitle}
              </div>
              <div className="text-[14px] text-[#929292]">
                {shortenNumber(item.statistics.viewCount)} views • {formatDate(item.snippet.publishedAt)}
              </div>
            </Link>
          </div>
        </div>
        <div>
          <button
            ref={iconRef}
            onClick={handleIconClick}
            className="focus:outline-none text-gray-500 mt-1 "
          >
            <CiMenuKebab />
          </button>
          {showButton && selectedVideo === item && (
            <button
              ref={buttonRef}
              onClick={handleAddToPlaylist}
              style={{
                position: "absolute",
                top: dropdownPosition.top,
                left: dropdownPosition.left,
              }}
              className="flex items-center justify-center focus:outline-none text-white bg-black font-medium rounded-lg text-sm px-5 py-2.5 mt-2 z-50 "
            >
              Add to Playlist
              <span className="ml-2 text-xl">
                <MdOutlinePlaylistAdd />
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoThumbnailFeed;
