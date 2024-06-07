import React, { useEffect, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { Link } from "react-router-dom";
import API_KEY from "../constants/yt-API"; // Ensure you import your API key


const RelatedVideoThumbnail = ({ video }) => {
  const videoId = video.id.videoId || video.id; // Ensure it handles both cases
  const [videoDetails, setVideoDetails] = useState(null);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`
        );
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          setVideoDetails(data.items[0]);
        }
      } catch (error) {
        console.error("Error fetching video details:", error);
      }
    };

    fetchVideoDetails();
  }, [videoId]);

  

  const shortenNumber = (num) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return num;
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

  return (
    <Link to={`/watch?v=${videoId}`} className="flex items-center no-underline space-x-4">
      <img
        src={video.snippet.thumbnails.medium.url}
        alt={video.snippet.title}
        className="w-[168px] h-[95px] object-cover rounded-lg"
      />
      <div className="flex-grow">
        <h className="text-sm font-bold line-clamp-2 ">{video.snippet.title}</h>
        <p className="text-xs text-gray-600">{video.snippet.channelTitle}</p>
        {videoDetails && (
          <>
            <p className="text-xs text-gray-600">
              {shortenNumber(videoDetails.statistics.viewCount)} views • {formatDate(videoDetails.snippet.publishedAt)}
            </p>
          </>
        )}
      </div>
      <CiMenuKebab className="flex-shrink-0" />
    </Link>
  );
};

export default RelatedVideoThumbnail;
