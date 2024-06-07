import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteVideoFromHistory } from '../utils/action';
import { MdOutlineClose } from "react-icons/md";

const HistoryView = () => {
  const watchedVideos = useSelector((state) => state.playlistsReducer.watchedVideos);

  const dispatch = useDispatch();

  const handleDelete = (videoId) => {
    dispatch(deleteVideoFromHistory(videoId));
  };

  return (
    <div className='history-view p-4'>
      <h2 className='text-2xl font-bold mb-4'>Watched Videos</h2>
      {watchedVideos.length > 0 ? (
        watchedVideos.slice().reverse().map((video, index) => (
          <div key={index} className='flex items-center mb-4 bg-white p-4 rounded-lg max-w-full md:max-w-3xl'>
            <Link to={`/watch?v=${typeof video.id === 'object' ? video.id.videoId : video.id}`} className='flex-shrink-0'>
              <img src={video.snippet.thumbnails.medium.url} alt="video thumbnail" className='w-40 h-24 object-cover rounded-lg' />
            </Link>
            <div className='ml-4 flex-grow'>
              <div className='flex justify-between items-center'>
                <Link to={`/watch?v=${typeof video.id === 'object' ? video.id.videoId : video.id}`} className='flex-grow'>
                  <h3 data-tooltip-target="tooltip-bottom" data-tooltip-placement="bottom" className='text-lg font-bold text-black line-clamp-1'>{video.snippet.title}</h3>
                  <div id="tooltip-bottom" role='tooltip' class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                    {video.snippet.title}
                  </div>
                </Link>
                <MdOutlineClose className='flex-shrink-0 text-3xl cursor-pointer ml-4' onClick={() => handleDelete(video.id)} />
              </div>
              <Link to={`/watch?v=${typeof video.id === 'object' ? video.id.videoId : video.id}`}>
                <p className='text-gray-700 font-semibold'>{video.snippet.channelTitle}</p>
                <p className='text-gray-500 text-sm line-clamp-2'>{video.snippet.description}</p>
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p className='text-gray-400'>No videos watched yet.</p>
      )}
    </div>
  );
};

export default HistoryView;
