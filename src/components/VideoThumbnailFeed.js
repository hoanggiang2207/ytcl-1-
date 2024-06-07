// src/components/VideoThumbnailFeed.js
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { CiMenuKebab } from "react-icons/ci";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";
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
  const handleIconClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setButtonPosition({ top: rect.bottom, left: rect.left });
    setSelectedVideo(item);
    setShowButton(true);
  };

  return (
    <div
      key={typeof item.id === "object" ? item.id.videoId : item.id}
      className="bg-white overflow-hidden mb-[45px]"
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
            className="w-[390px] h-[225px] object-cover rounded-xl"
            effect="blur"
          />
        ) : (
          <SkeletonLoadingThumbnail />
        )}
        {/* {showThumbnail && (
          <div className="w-full overflow-hidden">
            <img
              src={item.snippet.thumbnails.medium.url}
              alt="img"
              width={390}
              height={225}
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
        )} */}
      </Link>
      <div className="mt-3 flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={item.channelAvatar}
            alt={item.snippet.channelTitle}
            className="w-9 h-9 rounded-full mr-4"
          />
          <div>
            <Link
              to={`/watch?v=${
                typeof item.id === "object" ? item.id.videoId : item.id
              }`}
              onClick={() => handleWatchVideo(item)}
              className="flex-grow"
            >
              <div
                className="flex-grow"
                onMouseEnter={() => handleTooltip(index)}
                onMouseLeave={hideTooltip}
              >
                <div className="text-[16px] font-[500] text-black line-clamp-1">
                  {item.snippet.title}
                </div>
                {tooltipVisible === index && (
                  <div className="absolute z-10 inline-block px-2 py-2 text-[14px] text-white bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700">
                    {item.snippet.title}
                  </div>
                )}
              </div>
              <div className="text-[14px] text-[#929292] font-[500]">
                {item.snippet.channelTitle}
              </div>
              <div className="text-[14px] text-[#929292]">
                {shortenNumber(item.statistics.viewCount)} views •{" "}
                {formatDate(item.snippet.publishedAt)}
              </div>
            </Link>
          </div>
        </div>
        <button
          ref={iconRef}
          onClick={handleIconClick}
          className="focus:outline-none text-gray-500"
        >
          <CiMenuKebab />
        </button>
      </div>
      {showButton && selectedVideo === item && (
        <button
          ref={buttonRef}
          onClick={handleAddToPlaylist}
          style={{
            position: "absolute",
            top: buttonPosition.top,
            left: buttonPosition.left,
          }}
          className="flex items-center justify-center focus:outline-none text-white bg-black font-medium rounded-lg text-sm px-5 py-2.5 mt-2 z-50"
        >
          Add to Playlist
          <span className="ml-2 text-xl">
            <MdOutlinePlaylistAdd />
          </span>
        </button>
      )}
    </div>
  );
};

export default VideoThumbnailFeed;
