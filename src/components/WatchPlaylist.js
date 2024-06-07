import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Avatar from "react-avatar";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { PiShareFatLight } from "react-icons/pi";
import { GoDownload } from "react-icons/go";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { setMessage } from "../utils/chatSlice";
import Comment from "./Comment";
import CommentSection from "./CommentSection";
import PlaylistVideoThumbnail from "./PlaylistVideoThumbnail";
import { API_KEY } from "../constants/yt-API";

const WatchPlaylist = () => {
  const [playlistVideos, setPlaylistVideos] = useState([]);
  const [singleVideo, setSingleVideo] = useState(null);
  const [ytIcon, setYtIcon] = useState("");
  const [subscribers, setSubscribers] = useState(null);
  const [commentCount, setCommentCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("v");
  const playlistId = searchParams.get("list");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchVideoDetails = async (videoId) => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`
        );
        return response.data.items[0];
      } catch (error) {
        console.error("Error fetching video details:", error);
      }
    };

    const fetchChannelDetails = async (channelId) => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${API_KEY}`
        );
        return response.data.items[0];
      } catch (error) {
        console.error("Error fetching channel details:", error);
      }
    };

    const fetchPlaylistVideos = async (playlistId) => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=10&key=${API_KEY}`
        );
        return response.data.items;
      } catch (error) {
        console.error("Error fetching playlist videos:", error);
      }
    };

    const fetchPlaylistDetails = async (playlistId) => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${API_KEY}`
        );
        return response.data.items[0];
      } catch (error) {
        console.error("Error fetching playlist details:", error);
      }
    };

    const loadVideoData = async () => {
      if (videoId) {
        const videoData = await fetchVideoDetails(videoId);
        setSingleVideo(videoData);
        setYtIcon(videoData.snippet.thumbnails.high.url);
        setLikeCount(videoData.statistics.likeCount || 0);
        setCommentCount(videoData.statistics.commentCount || 0);

        const channelData = await fetchChannelDetails(videoData.snippet.channelId);
        setSubscribers(channelData.statistics.subscriberCount || 0);
      }

      if (playlistId) {
        const playlistDetails = await fetchPlaylistDetails(playlistId);
        const videos = await fetchPlaylistVideos(playlistId);
        setPlaylistVideos(videos);

        if (!videoId && videos.length > 0) {
          const firstVideoId = videos[0].snippet.resourceId.videoId;
          const firstVideoData = await fetchVideoDetails(firstVideoId);
          setSingleVideo(firstVideoData);
          setYtIcon(firstVideoData.snippet.thumbnails.high.url);
          setLikeCount(firstVideoData.statistics.likeCount || 0);
          setCommentCount(firstVideoData.statistics.commentCount || 0);

          const channelData = await fetchChannelDetails(firstVideoData.snippet.channelId);
          setSubscribers(channelData.statistics.subscriberCount || 0);
        }
      }
    };

    loadVideoData();
  }, [videoId, playlistId]);

  const handleShare = () => {
    const url = `https://www.youtube.com/watch?v=${videoId}&list=${playlistId}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000); // Hide the popup after 3 seconds
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleCommentSubmit = (comment) => {
    dispatch(setMessage({ name: "Patel", message: comment }));
  };

  return (
    <div className="flex flex-col ml-4 w-[100%] mt-2">
      <div className="flex w-[88%]">
        <div>
          <iframe
            width="900"
            height="500"
            src={`https://www.youtube.com/embed/${videoId}?&autoplay=0&list=${playlistId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
          <h1 className="font-bold mt-2 text-lg">
            {singleVideo?.snippet?.title || "Loading..."}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex justify-between w-[35%]">
              <div className="flex items-center">
                {ytIcon ? (
                  <Avatar src={ytIcon} size={40} round={true} />
                ) : (
                  <Avatar name="YT" size={40} round={true} />
                )}
                <div className="ml-2">
                  <h1 className="font-bold">
                    {singleVideo?.snippet?.channelTitle || "Loading..."}
                  </h1>
                  {subscribers !== null ? (
                    <p className="text-sm text-gray-500">
                      {subscribers.toLocaleString()} subscribers
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">Loading subscribers...</p>
                  )}
                </div>
              </div>
              <button className="px-4 py-1 font-medium bg-black text-white rounded-full">
                Subscribe
              </button>
            </div>
            <div className="flex items-center w-[40%] justify-between mt-2">
              <div className="flex items-center cursor-pointer bg-gray-200 px-4 py-2 rounded-full">
                <AiOutlineLike size="20px" className="mr-1" />
                <span>{likeCount ? likeCount.toLocaleString() : "Loading..."}</span>
                <div className="h-6 border-l border-gray-400 mx-2" />
                <AiOutlineDislike size="20px" className="ml-1" />
              </div>
              <div
                className="flex items-center cursor-pointer bg-gray-200 px-4 py-2 rounded-full"
                onClick={handleShare}
              >
                <PiShareFatLight size="20px" className="mr-2" />
                <span>Share</span>
              </div>
              <div className="flex items-center cursor-pointer bg-gray-200 px-4 py-2 rounded-full">
                <GoDownload />
                <span>Download</span>
              </div>
            </div>
          </div>
          {showPopup && (
            <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded">
              Your video has been shared!
            </div>
          )}
        </div>
        <div className="w-[100%] border border-gray-300 ml-8 rounded-lg h-fit p-4">
          <div className="flex justify-between items-center">
            <h1>
              {commentCount > 0 ? (
                <span className="font-bold">
                  {commentCount.toLocaleString()} Comments
                </span>
              ) : (
                "Loading comments..."
              )}
            </h1>
            <BsThreeDotsVertical />
          </div>
          <div className="overflow-y-auto h-[28rem] flex">
            <CommentSection videoId={videoId} />
          </div>
          <Comment onSubmit={handleCommentSubmit} />
        </div>
      </div>

      <div className="mt-8 w-[88%]">
        <h2 className="font-bold text-xl mb-4">Playlist Videos</h2>
        <div className="grid grid-cols-2 gap-4">
          {playlistVideos.length > 0 ? (
            playlistVideos.map((video) => (
              <div key={video.id}>
                <PlaylistVideoThumbnail video={video} />
              </div>
            ))
          ) : (
            <div>Loading playlist videos...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchPlaylist;
