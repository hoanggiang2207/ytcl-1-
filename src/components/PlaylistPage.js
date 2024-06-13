import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { MdSort } from "react-icons/md";

const PlaylistPage = ({ playlists }) => {
  const { playlistName } = useParams();
  const [playlistVideos, setPlaylistVideos] = useState([]);

  useEffect(() => {
    const playlist = playlists[playlistName];
    if (playlist) {
      setPlaylistVideos(playlist);
    }
  }, [playlistName, playlists]);

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
        <p className="font-bold text-lg">{firstVideo.snippet.title}</p>
      </div>
      <div className="flex-grow grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-4" style={{ maxWidth: '860px' }}>
        <div className='flex'>
          <MdSort className='size-[25px] mr-2' />
          <p className='font-semibold'>Sort</p>
        </div>
        {playlistVideos.map((video) => (
          <div key={video.id} className="mb-4 flex">
            <div>
              <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} className="w-[160px] h-[90px] rounded-lg mb-2 mr-2" />
            </div>
            <div>
              <p className="font-[700] text-[17px]">{video.snippet.title}</p>
              <p className='font-[500] text-[13px] text-gray-700'>{video.snippet.channelTitle}</p>
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

export default connect(mapStateToProps)(PlaylistPage);
