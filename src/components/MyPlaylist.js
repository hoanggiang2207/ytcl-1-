import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { removePlaylist } from "../utils/action";
import { Link } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";
import API_KEY from "../constants/yt-API";
import { CgPlayList } from "react-icons/cg";
import { HiDotsVertical } from "react-icons/hi";

const MyPlaylist = ({ playlists, removePlaylist }) => {
  const [channelAvatars, setChannelAvatars] = useState({});
  const [showDeleteButton, setShowDeleteButton] = useState({});
  const moreButtonRefs = useRef({});

  useEffect(() => {
    const fetchAvatars = async () => {
      const avatars = {};
      const promises = [];

      Object.values(playlists).forEach((playlist) => {
        playlist.forEach((video) => {
          if (!avatars[video.snippet.channelId]) {
            promises.push(
              axios
                .get(
                  `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=${video.snippet.channelId}&key=${API_KEY}`
                )
                .then((res) => {
                  avatars[video.snippet.channelId] =
                    res.data.items[0].snippet.thumbnails.high.url;
                })
                .catch((error) => {
                  console.error("Error fetching channel avatar:", error);
                  avatars[video.snippet.channelId] =
                    "https://via.placeholder.com/80"; // Fallback avatar
                })
            );
          }
        });
      });

      await Promise.all(promises);
      setChannelAvatars(avatars);
    };

    fetchAvatars();
  }, [playlists]);

  const handleRemovePlaylist = (playlistName) => {
    removePlaylist(playlistName);
  };

  const toggleDeleteButton = (playlistName) => {
    setShowDeleteButton((prev) => ({
      ...prev,
      [playlistName]: !prev[playlistName],
    }));
  };

  const handleClickOutside = (event) => {
    Object.keys(moreButtonRefs.current).forEach((playlist) => {
      if (
        moreButtonRefs.current[playlist] &&
        !moreButtonRefs.current[playlist].contains(event.target)
      ) {
        setShowDeleteButton((prev) => ({
          ...prev,
          [playlist]: false,
        }));
      }
    });
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="ml-4">
      <h1 className="text-[35px] font-bold mb-4">My Playlists</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.keys(playlists).length === 0 ? (
          <div className="flex justify-center items-center h-full col-span-6">
            <p className="text-lg text-gray-500">No playlists available</p>
          </div>
        ) : (
          Object.keys(playlists).map((playlist) => (
            <div key={playlist} className="relative">
              {playlists[playlist].length === 0 ? null : (
                <div>
                  <Link to={`/playlist/${playlist}`}>
                    <div className="relative">
                      <img
                        src={
                          playlists[playlist][0].snippet.thumbnails.medium.url
                        }
                        alt={playlists[playlist][0].snippet.title}
                        className="w-[258px] h-[154px] object-cover mb-2 rounded-lg gap-[18px]"
                      />

                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded-lg">
                        <div className="flex items-center">
                          <CgPlayList />
                          {`${playlists[playlist].length} videos`}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="flex justify-between ">
                    <div>
                      <h3 className="mb-1 font-bold text-md line-clamp-1">
                        {playlist}
                      </h3>
                      <Link
                        to={`/playlist/${playlist}`}
                        className="text-[13px] text-gray-600 font-[500] hover:text-black"
                      >
                        View full playlist
                      </Link>
                    </div>
                    <button
                      ref={(el) => (moreButtonRefs.current[playlist] = el)}
                      onClick={() => toggleDeleteButton(playlist)}
                      className="text-black focus:outline-none"
                    >
                      <HiDotsVertical className="h-4 w-4" />
                    </button>
                    {showDeleteButton[playlist] && (
                      <div className="absolute right-1 top-[14rem] z-50">
                        <button
                          onClick={() => handleRemovePlaylist(playlist)}
                          className="bg-white text-black rounded-lg px-10 py-2 flex items-center justify-start hover:bg-gray-700 hover:text-white"
                          style={{
                            boxShadow:
                              "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px -4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <RiDeleteBinLine className="h-6 w-6 mr-2" />
                          <p>Delete</p>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  playlists: state.playlistsReducer.playlists,
});

const mapDispatchToProps = {
  removePlaylist,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyPlaylist);
