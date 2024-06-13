import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { removeVideoFromPlaylist } from '../utils/action';
import { MdSort } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import { RiDeleteBinLine } from "react-icons/ri";

// Mocked functions (Replace these with your actual utility functions)
const shortenNumber = (num) => num.toLocaleString();
const formatDate = (date) => new Date(date).toLocaleDateString();

const PlaylistPage = ({ playlists, removeVideoFromPlaylist, dispatch }) => {
  const { playlistName } = useParams();
  const [playlistVideos, setPlaylistVideos] = useState([]);
  const [showDeleteButton, setShowDeleteButton] = useState({});
  const moreButtonRefs = useRef({});
  const [tooltipVisible, setTooltipVisible] = useState(null);

  useEffect(() => {
    const playlist = playlists[playlistName];
    if (playlist) {
      setPlaylistVideos(playlist);
    }
  }, [playlistName, playlists]);

  const handleRemoveVideo = (video) => {
    removeVideoFromPlaylist(playlistName, video);
  };

  const toggleDeleteButton = (videoId) => {
    setShowDeleteButton((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }));
  };

  const handleClickOutside = (event) => {
    Object.keys(moreButtonRefs.current).forEach((videoId) => {
      if (
        moreButtonRefs.current[videoId] &&
        !moreButtonRefs.current[videoId].contains(event.target)
      ) {
        setShowDeleteButton((prev) => ({
          ...prev,
          [videoId]: false,
        }));
      }
    });
  };

  const handleTooltip = (index) => {
    setTooltipVisible(index);
  };

  const hideTooltip = () => {
    setTooltipVisible(null);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  if (playlistVideos.length === 0) {
    return <div>No videos found for this playlist.</div>;
  }

  const firstVideo = playlistVideos[0];

  return (
    <div className="flex gap-4 p-4">
      <div className="bg-gray-100 p-4 rounded-lg shadow-md sticky top-[80px]" style={{ width: '360px', height: '673px' }}>
        <img src={firstVideo.snippet.thumbnails.medium.url} alt={firstVideo.snippet.title} className="w-full h-auto rounded-lg mb-2" />
        <h2 className="font-bold text-2xl mb-2">{playlistName}</h2>
        <p className="text-gray-600 mb-4">Number of videos: {playlistVideos.length}</p>
      </div>
      <div className="flex-grow flex flex-col gap-4 mt-20" style={{ maxWidth: '860px' }}>
        <div className="flex items-center">
          <MdSort className="size-[25px] mr-2" />
          <p className="font-semibold">Sort</p>
        </div>
        {playlistVideos.map((video, index) => (
          <div key={video.id} className="mb-4 flex relative">
            <Link
              to={`/watch?v=${typeof video.id === "object" ? video.id.videoId : video.id}`}
            >
              <div className="flex">
                <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} className="w-[160px] h-[90px] rounded-lg mb-2 mr-2" />
                <div>
                  <div
                    className="line-clamp-2 text-[16px] font-[500] text-black"
                    onMouseEnter={() => handleTooltip(index)}
                    onMouseLeave={hideTooltip}
                  >
                    {video.snippet.title}
                    {tooltipVisible === index && (
                      <div className="absolute z-10 inline-block px-2 py-2 text-[14px] text-white bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700">
                        {video.snippet.title}
                      </div>
                    )}
                  </div>
                  <div className="text-[14px] text-[#929292] font-[500]">
                    {video.snippet.channelTitle}
                  </div>
                  <div className="text-[14px] text-[#929292]">
                    {shortenNumber(video.statistics.viewCount)} views • {formatDate(video.snippet.publishedAt)}
                  </div>
                </div>
              </div>
            </Link>
            <div className='ml-40'>
              <button
                ref={(el) => (moreButtonRefs.current[video.id] = el)}
                onClick={() => toggleDeleteButton(video.id)}
                className="text-black focus:outline-none absolute right-0 top-1/2 transform -translate-y-1/2"
              >
                <HiDotsVertical className="h-4 w-4" />
              </button>
              {showDeleteButton[video.id] && (
                <div className="absolute right-1 top-[4rem] z-50">
                  <button
                    onClick={() => handleRemoveVideo(video)}
                    className="bg-white text-black rounded-lg px-10 py-2 flex items-center justify-start hover:bg-gray-700 hover:text-white"
                    style={{
                      boxShadow: "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px -4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <RiDeleteBinLine className="h-6 w-6 mr-2" />
                    <p>Delete</p>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  playlists: state.playlistsReducer.playlists,
});

const mapDispatchToProps = {
  removeVideoFromPlaylist,
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistPage);
