import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { removeVideoFromPlaylist, removePlaylist } from '../utils/action';
import { Link } from 'react-router-dom';
import { RiCloseCircleLine, RiDeleteBinLine, RiMoreFill } from 'react-icons/ri';
import axios from 'axios';
import API_KEY from '../constants/yt-API';

const MyPlaylist = ({ playlists, removeVideoFromPlaylist, removePlaylist }) => {
  const [channelAvatars, setChannelAvatars] = useState({});
  const [showDeleteButton, setShowDeleteButton] = useState({});
  const [expandedPlaylists, setExpandedPlaylists] = useState({});
  const moreButtonRefs = useRef({});

  useEffect(() => {
    const fetchAvatars = async () => {
      const avatars = {};
      const promises = [];

      Object.values(playlists).forEach(playlist => {
        playlist.forEach(video => {
          if (!avatars[video.snippet.channelId]) {
            promises.push(
              axios.get(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=${video.snippet.channelId}&key=${API_KEY}`)
                .then(res => {
                  avatars[video.snippet.channelId] = res.data.items[0].snippet.thumbnails.high.url;
                })
                .catch(error => {
                  console.error("Error fetching channel avatar:", error);
                  avatars[video.snippet.channelId] = 'https://via.placeholder.com/80'; // Fallback avatar
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

  const handleRemoveVideo = (playlistName, video) => {
    removeVideoFromPlaylist(playlistName, video);
  };

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
    Object.keys(moreButtonRefs.current).forEach(playlist => {
      if (
        moreButtonRefs.current[playlist] &&
        !moreButtonRefs.current[playlist].contains(event.target)
      ) {
        setShowDeleteButton(prev => ({
          ...prev,
          [playlist]: false
        }));
      }
    });
  };

  const handlePlaylistClick = (playlistName) => {
    setExpandedPlaylists((prev) => ({
      ...prev,
      [playlistName]: !prev[playlistName],
    }));
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className=''>
      <h2 className="font-bold mt-4 text-xl">My Playlists</h2>
      {Object.keys(playlists).length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-lg text-gray-500">No playlists available</p>
        </div>
      ) : (
        Object.keys(playlists).map((playlist) => (
          <div key={playlist} className='mb-8'>
            <div className="flex justify-between items-center">
              <h3 className="mb-4 font-bold text-lg">{playlist}</h3>
              <div className="relative">
                <button
                  ref={el => moreButtonRefs.current[playlist] = el}
                  onClick={() => toggleDeleteButton(playlist)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <RiMoreFill className="h-6 w-6" />
                </button>
                {showDeleteButton[playlist] && (
                  <button
                    onClick={() => handleRemovePlaylist(playlist)}
                    className="absolute right-0 top-0 bg-red-700 text-white rounded-full px-3 py-1 flex items-center"
                  >
                    <RiDeleteBinLine className="h-6 w-6 mr-1" />
                    Delete
                  </button>
                )}
              </div>
            </div>
            <div>
              {expandedPlaylists[playlist] ? (
                <ul className="grid grid-cols-4 gap-5">
                  {playlists[playlist].map((video, index) => (
                    <li key={index} className="relative group">
                      <Link to={`/watch?v=${typeof video.id === 'object' ? video.id.videoId : video.id}`}>
                        {video.snippet && video.snippet.thumbnails && video.snippet.thumbnails.medium &&
                          <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} className="w-[295px] h-[175px]  mb-2 rounded-lg" />
                        }
                        <p className='font-bold text-lg line-clamp-1'>{video.snippet.title}</p>
                      </Link>
                      <div className="flex items-center mt-2">
                        <img
                          src={channelAvatars[video.snippet.channelId] || 'https://via.placeholder.com/80'}
                          alt={`${video.snippet.channelTitle} avatar`}
                          className="rounded-full w-9 h-9 mr-3"
                        />
                        <p>{video.snippet.channelTitle}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveVideo(playlist, video)}
                        className="absolute top-0 right-0 m-2 p-1 bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <RiCloseCircleLine className="h-6 w-6" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                
                  <img src={playlists[playlist][0].snippet.thumbnails.medium.url} alt={playlists[playlist][0].snippet.title} className="w-[295px] h-[175px] mb-2 rounded-lg cursor-pointer" onClick={() => handlePlaylistClick(playlist)}/>
                
              )}
              
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  playlists: state.playlistsReducer.playlists,
});

const mapDispatchToProps = {
  removeVideoFromPlaylist,
  removePlaylist,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyPlaylist);
