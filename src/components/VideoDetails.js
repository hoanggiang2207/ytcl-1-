import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';

const VideoDetails = ({ video, channelIcon, subscriberCount }) => {
  const [showMore, setShowMore] = useState(false);

  if (!video) return null;

  const { snippet, statistics } = video;

  const toggleShowMore = () => {
    setShowMore((prev) => !prev);
  };

  const truncatedDescription = snippet.description.slice(0, 100) + '...';

  const shortenNumber = (num) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toLocaleString(); // Ensure proper formatting with commas
  };
  

  const formatDate = (dateString) => {
    const today = new Date();
    const publishedDate = new Date(dateString);
    const diffTime = Math.abs(today - publishedDate);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 30) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else if (diffMonths < 12) {
      return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
    } else {
      return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
    }
  };

  const formatDateRe = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg mt-[16px] w-[995px]">
      <div className="font-semibold">
      <span>
    {showMore ? parseInt(statistics.viewCount).toLocaleString() : shortenNumber(statistics.viewCount)} views • 
  </span>
        <span>{showMore ? formatDateRe(snippet.publishedAt) : formatDate(snippet.publishedAt)}</span>
        {snippet.tags && (
          <span className="text-[#606060]"> #{snippet.tags.join(' #')}</span>
        )}
      </div>

      <div>
        <p>
          {showMore ? snippet.description : truncatedDescription}
          {!showMore && (
            <span onClick={toggleShowMore} className="text-black font-semibold cursor-pointer">
              Show more
            </span>
          )}
        </p>
        <div className="flex items-center">
          {showMore && (
            <Link to={`/channel?channelId=${snippet.channelId}`}>
              <Avatar src={channelIcon} size={50} round />
            </Link>
          )}
          <div className={showMore ? "ml-4" : ""}>
            {showMore && <h2 className="font-bold">{snippet.channelTitle}</h2>}
            {showMore && (
              <p className="text-sm text-gray-400">
                {subscriberCount ? parseInt(subscriberCount).toLocaleString() : 'N/A'} subscribers
              </p>
            )}
          </div>
        </div>
        {showMore && (
          <span onClick={toggleShowMore} className="text-black font-semibold cursor-pointer">
            Show less
          </span>
        )}
      </div>
    </div>
  );
};

export default VideoDetails;
