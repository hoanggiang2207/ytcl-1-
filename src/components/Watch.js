import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Avatar from "react-avatar";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { PiShareFatLight } from "react-icons/pi";
import { GoDownload } from "react-icons/go";
import { useDispatch } from "react-redux";
import { setMessage } from "../utils/chatSlice";
import Comment from "./Comment";
import CommentSection from "./CommentSection";
import RelatedVideoThumbnail from "./RelatedVideoThumbnail";
import API_KEY from "../constants/yt-API";
import VideoDetails from "./VideoDetails";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";

const axiosInstance = axios.create({
  baseURL: "https://youtube.googleapis.com/youtube/v3",
  params: {
    key: API_KEY,
  },
});

const Watch = () => {
  const [singleVideo, setSingleVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("v");
  const dispatch = useDispatch();
  const [ytIcon, setYtIcon] = useState("");
  const [subscribers, setSubscribers] = useState(null);
  const [commentCount, setCommentCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const getChannelAvatar = async (channelId) => {
      try {
        const res = await axiosInstance.get("/channels", {
          params: {
            part: "snippet",
            id: channelId,
          },
        });
        setYtIcon(res.data.items[0].snippet.thumbnails.high.url);
      } catch (error) {
        console.error("Error fetching channel avatar:", error);
      }
    };

    const getSingleVideo = async () => {
      try {
        const res = await axiosInstance.get("/videos", {
          params: {
            part: "snippet,contentDetails,statistics",
            id: videoId,
          },
        });
        const videoData = res?.data?.items[0];
        setSingleVideo(videoData);

        const channelId = videoData.snippet.channelId;
        await getChannelAvatar(channelId);

        const channelRes = await axiosInstance.get("/channels", {
          params: {
            part: "statistics",
            id: channelId,
          },
        });
        const channelData = channelRes?.data?.items[0];
        setSubscribers(channelData?.statistics?.subscriberCount);
        setCommentCount(videoData?.statistics?.commentCount || 0);
        setLikeCount(videoData?.statistics?.likeCount || 0);

        getRelatedVideos(videoData.snippet.categoryId);
      } catch (error) {
        console.log(error);
      }
    };

    const getRelatedVideos = async (videoCategoryId) => {
      try {
        const res = await axiosInstance.get("/search", {
          params: {
            part: "snippet",
            videoCategoryId,
            type: "video",
            maxResults: 10,
          },
        });
        const relatedVideos = res.data.items.filter(
          (video) => video.id.videoId !== videoId // Filter out the watched video from related videos
        );
        setRelatedVideos(relatedVideos);
      } catch (error) {
        console.log(error);
      }
    };

    getSingleVideo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const handleCommentSubmit = (comment) => {
    dispatch(setMessage({ name: "Patel", message: comment }));
  };

  const handleRelatedVideoClick = async (clickedVideoId) => {
    try {
      // Fetch the category ID of the clicked video
      const res = await axiosInstance.get("/videos", {
        params: {
          part: "snippet",
          id: clickedVideoId,
        },
      });
      const clickedVideoData = res?.data?.items[0];
      const videoCategoryId = clickedVideoData.snippet.categoryId;

      // Fetch new related videos based on the category ID of the clicked video
      const newRelatedVideosRes = await axiosInstance.get("/search", {
        params: {
          part: "snippet",
          videoCategoryId,
          type: "video",
          maxResults: 10,
        },
      });
      const newRelatedVideos = newRelatedVideosRes.data.items;

      // Remove the clicked video from relatedVideos array
      const updatedRelatedVideos = relatedVideos.filter(
        (video) => video.id.videoId !== clickedVideoId
      );

      // Update the state with new related videos
      setRelatedVideos([...updatedRelatedVideos, ...newRelatedVideos]);
    } catch (error) {
      console.log(error);
    }
  };

  // Helper function to shorten subscriber count
  const shortenSubscriberCount = (count) => {
    if (count >= 1e9) {
      return `${(count / 1e9).toFixed(1)}B`;
    } else if (count >= 1e6) {
      return `${(count / 1e6).toFixed(1)}M`;
    } else if (count >= 1e3) {
      return `${(count / 1e3).toFixed(1)}K`;
    } else {
      return count.toString();
    }
  };
  

  return (
    
    <div className="flex flex-row ml-[48px]  mt-[70px] ">
      
      <div className="flex flex-col mr-[25px] mt-3 ">
        <div>
          <iframe
            width="995"
            height="560"
            src={`https://www.youtube.com/embed/${videoId}?&autoplay=0`}
            title="YouTube video player"
            className="rounded-lg flex-shrink-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
          <h1 className="font-bold text-xl mb-[10px] font-roboto mt-[10px]">
            {singleVideo?.snippet?.title}
          </h1>
          <div className="flex items-center justify-between w-[995px]">
            <div className="flex justify-between items-center w-[27%]">
              <div className="flex items-center">
                
                <Avatar src={ytIcon} size={40} round={true} className="flex-shrink-0"/>
                <div className="ml-2">
                  <h1 className="font-bold">
                    {singleVideo?.snippet?.channelTitle}
                  </h1>
                  {subscribers !== null && (
                    <p className="text-sm text-gray-500">
                      {shortenSubscriberCount(subscribers)} subscribers
                    </p>
                  )}
                </div>
              </div>
              <button className="px-4 h-[38px] font-medium text-sm items-center justify-center bg-black text-white rounded-full">
                Subscribe
              </button>
            </div>
            <div className="flex items-center w-[45%] justify-between mt-2">
              <div className="flex items-center cursor-pointer bg-gray-200 px-4 h-[38px] rounded-full ">
                <AiOutlineLike size="20px" className="mr-1" />
                <span>{shortenSubscriberCount(likeCount).toLocaleString()}</span>
                <div className="h-6 border-l border-gray-400 mx-2" />
                <AiOutlineDislike size="20px" className="ml-1" />
              </div>
              <div
                className="flex items-center cursor-pointer bg-gray-200 px-4 h-[38px] rounded-full"
              >
                <PiShareFatLight size="20px" className="mr-2" />
                <span>Share</span>
              </div>
              <div className="flex items-center cursor-pointer bg-gray-200 px-4 h-[38px] rounded-full">
                <GoDownload />
                <span>Download</span>
              </div>
              <div className="flex items-center cursor-pointer bg-gray-200 px-4 h-[38px] rounded-full">
                <IoEllipsisHorizontalSharp />
              </div>
            </div>
          </div>
        </div>
        <div>
          <VideoDetails
            video={singleVideo}
            channelIcon={ytIcon}
            subscriberCount={subscribers}
          />
        </div>
        {/* comment section */}
        <div className="w-[100%] h-fit  mt-4">
          <div className="flex justify-between items-center">
            <h1>
              {commentCount > 0 && (
                <span className="font-bold text-xl">
                  {commentCount.toLocaleString()} Comments
                </span>
              )}
            </h1>
          </div>
          <Comment onSubmit={handleCommentSubmit} />
          <div className=" h-[28rem] flex">
            <CommentSection videoId={videoId} />
          </div>
        </div>
      </div>
      {/* related videos */}
      <div className="w-[393px] ">
        <h2 className="font-bold text-xl mb-4">Related Videos</h2>
        <div className="grid grid-cols-1 gap-4 mb-10">
          {relatedVideos.map((video) => (
            <RelatedVideoThumbnail
              key={video.id.videoId}
              video={video}
              onClick={() => handleRelatedVideoClick(video.id.videoId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Watch;

