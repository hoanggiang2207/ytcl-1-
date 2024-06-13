import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteVideoFromHistory, deleteAllHistory } from '../utils/action';
import { MdOutlineClose } from "react-icons/md";
import { CiMenuKebab } from "react-icons/ci";

const HistoryView = () => {
  const watchedVideos = useSelector((state) => state.playlistsReducer.watchedVideos);
  const dispatch = useDispatch();

  const handleDelete = (videoId) => {
    dispatch(deleteVideoFromHistory(videoId));
  };

  const handleClearHistory = () => {
    dispatch(deleteAllHistory());
  };

  return (
    <div className='history-view ml-[110px] flex flex-row'>
      <div className="watched-videos-column flex-grow max-w-4xl mr-4">
        <h2 className='text-[36px] font-bold mb-4'>Watched history</h2>
        {watchedVideos.length > 0 ? (
          watchedVideos.slice().reverse().map((video, index) => (
            <div key={index} className='flex items-start mb-5 mr-7 bg-white rounded-lg w-[600px]'>
              <Link to={`/watch?v=${typeof video.id === 'object' ? video.id.videoId : video.id}`} className='flex-shrink-0'>
                <img src={video.snippet.thumbnails.medium.url} alt="video thumbnail" className='w-[246px] h-[138px] object-cover rounded-lg' />
              </Link>
              <div className='ml-4 flex-grow'>
                <div className='flex  '>
                  <Link to={`/watch?v=${typeof video.id === 'object' ? video.id.videoId : video.id}`} className='flex-grow'>
                    <h3 data-tooltip-target="tooltip-bottom" data-tooltip-placement="bottom" className='text-[18px] font-semibold text-black line-clamp-2'>{video.snippet.title}</h3>
                    <div id="tooltip-bottom" role='tooltip' className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                      {video.snippet.title}
                    </div>
                  </Link>
                  <div className='flex items-center'>
                    <MdOutlineClose className='flex-shrink-0 text-2xl cursor-pointer ml-4' onClick={() => handleDelete(video.id)} />
                    <CiMenuKebab className='flex-shrink-0 text-base cursor-pointer ml-4'/>
                  </div>
                </div>
                <Link to={`/watch?v=${typeof video.id === 'object' ? video.id.videoId : video.id}`}>
                  <p className='text-gray-700 font-base text-[14px]'>{video.snippet.channelTitle}</p>
                  <p className='text-gray-500 text-[13px] line-clamp-2'>{video.snippet.description}</p>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className='text-gray-400'>No videos watched yet.</p>
        )}
      </div>
      {watchedVideos.length > 0 && (
        <div className="clear-history-column mt-40 ml-20" style={{ width: '420px' }}>
          <h2 className="text-2xl font-bold mb-4 ml-3">Clear History</h2>
          
          <button
            onClick={handleClearHistory}
            className="mt-4 px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition-colors duration-300"
          >
            Clear all watch history
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryView;
