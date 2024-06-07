import React, { useEffect, useState } from "react";
import axios from "axios";
import API_KEY from "../constants/yt-API";
import { useDispatch } from 'react-redux';
import { addWatchedVideo } from '../utils/action';

const VideoThumbnails = ({ item, showThumbnail = true, showTitle = true, showAvatar = true }) => {
  const [ytIcon, setYtIcon] = useState("");
  const [viewCount, setViewCount] = useState(0);
  const [publishDate, setPublishDate] = useState("");
  const dispatch = useDispatch();

  const axiosInstance = axios.create({
    baseURL: 'https://youtube.googleapis.com/youtube/v3',
    params: {
      key: API_KEY
    }
  });

  const getChannelAvatar = async () => {
    try {
      const res = await axiosInstance.get('/channels', {
        params: {
          part: 'snippet',
          id: item.snippet.channelId
        }
      });
      setYtIcon(res.data.items[0].snippet.thumbnails.high.url);
    } catch (error) {
      console.error("Error fetching channel avatar:", error);
    }
  };

  const getVideoDetails = async () => {
    try {
      const res = await axios.get(`https://youtube.googleapis.com/youtube/v3/videos?part=statistics%2Csnippet&id=${item.id.videoId}&key=${API_KEY}`);
      setViewCount(res.data.items[0].statistics.viewCount);
      setPublishDate(res.data.items[0].snippet.publishedAt);
    } catch (error) {
      console.error("Error fetching video details:", error);
    }
  };

  useEffect(() => {
    getChannelAvatar();
    getVideoDetails();
  }, [item.snippet.channelId, item.id.videoId]);

  const handleWatchVideo = () => {
    dispatch(addWatchedVideo(item));
  };

  const shortenNumber = (num) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toLocaleString(); // Use toLocaleString() to format the number with commas
  };

  const formatDate = (dateString) => {
    const today = new Date();
    const publishedDate = new Date(dateString);
    const diffTime = Math.abs(today - publishedDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffMonths < 12) {
      return `${diffMonths} months ago`;
    } else {
      return `${diffYears} years ago`;
    }
  };

  return (
    <div className='w-full cursor-pointer ' onClick={handleWatchVideo}>
      <div className="flex">
        {showThumbnail && (
          <img className='rounded-xl w-80 h-48' src={item.snippet.thumbnails.medium.url} alt="video" />
        )}
        <div className="ml-4 flex flex-col">
          {showTitle && (
            <h1 className="font-bold text-xl  line-clamp-1">
              {item.snippet.title}
            </h1>
          )}
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <p>{shortenNumber(viewCount)} views</p>
            <span className="mx-2">|</span>
            <p> {formatDate(publishDate)}</p>
          </div>
          <div className="flex items-center mt-2">
            {showAvatar && ytIcon && (
              <img
                src={ytIcon}
                alt={`${item.snippet.channelTitle} avatar`}
                className="rounded-full w-9 h-9"
              />
            )}
            <p className='text-sm text-gray-500 ml-2'>{item.snippet.channelTitle}</p>
          </div>
          <p className='text-gray-500 text-sm mt-2 line-clamp-3'>{item.snippet.description}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoThumbnails;
