import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { YOUTUBE_VIDEO_API, YOUTUBE_CHANNEL_API } from "../constants/yt-API";
import { connect, useSelector } from "react-redux";
import { addVideoToPlaylist, addWatchedVideo } from "../utils/action";
import LoadingAnimation from "./LoadingAnimation"; // Import your loading animation component
import AddToPlaylistPopup from "./AddToPlaylistPopup";
import VideoThumbnailFeed from "./VideoThumbnailFeed";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const VideoContainer = ({
  addVideoToPlaylist,
  addWatchedVideo,
  selectedCategory,
  showThumbnail = true,
}) => {
  const [videos, setVideos] = useState([]);
  const [pageToken, setPageToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true); // Track if there's more content to load

  const containerRef = useRef();
  const iconRef = useRef();
  const buttonRef = useRef();
  const loaderRef = useRef(null); // Reference to the loader element

  const isSidebarVisible = useSelector((state) => state.app.sidebarVisible);

  const fetchChannelAvatar = async (channelId) => {
    try {
      const res = await axios.get(`${YOUTUBE_CHANNEL_API}`, {
        params: {
          id: channelId,
        },
      });
      return res.data.items[0].snippet.thumbnails.default.url;
    } catch (error) {
      console.error("Error fetching channel avatar:", error);
      return null;
    }
  };

  const fetchYoutubeVideos = async (token = "") => {
    try {
      setLoading(true);
      const res = await axios.get(`${YOUTUBE_VIDEO_API}`, {
        params: {
          pageToken: token,
          videoCategoryId: selectedCategory,
          maxResults: 15,
        },
      });

      if (res.data.items.length === 0) {
        // Handle empty response
        setHasMore(false);
        return;
      }

      const videoItems = await Promise.all(
        res.data.items.map(async (item) => {
          const channelId = item.snippet.channelId;
          const channelAvatar = await fetchChannelAvatar(channelId);
          return { ...item, channelAvatar };
        })
      );

      // Remove duplicates by using a Set for unique video IDs
      setVideos((prevVideos) => {
        const existingVideoIds = new Set(prevVideos.map(video => video.id.videoId || video.id));
        const newVideos = videoItems.filter(video => !existingVideoIds.has(video.id.videoId || video.id));
        return [...prevVideos, ...newVideos];
      });

      setPageToken(res.data.nextPageToken);
      setHasMore(!!res.data.nextPageToken);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Clear previous videos before fetching new ones
    setVideos([]);
    setHasMore(true);
    fetchYoutubeVideos();
  }, [selectedCategory]);

  const handleAddToPlaylist = () => {
    setShowPopup(true);
    setShowButton(false);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleWatchVideo = (video) => {
    addWatchedVideo(video);
  };

  const handleTooltip = (index) => {
    setTooltipVisible(index);
  };

  const hideTooltip = () => {
    setTooltipVisible(null);
  };

  const shortenNumber = (num) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return num.toLocaleString();
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
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    } else if (diffDays < 30) {
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    } else if (diffMonths < 12) {
      return `${diffMonths} ${diffMonths === 1 ? "month" : "months"} ago`;
    } else {
      return `${diffYears} ${diffYears === 1 ? "year" : "years"} ago`;
    }
  };

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      fetchYoutubeVideos(pageToken);
    }
  }, [pageToken]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading) {
        fetchYoutubeVideos(pageToken);
      }
    },
    [loading, pageToken, hasMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [handleObserver]);

  const VideoThumbnailSkeleton = () => (
    <div className="mt-3 mb-[45px] flex justify-between items-center">
      <Skeleton width={346} height={195} className="rounded-lg" />
    </div>
  );

  const gridClasses = isSidebarVisible ? "grid-cols-5 2xl:grid-cols-3 " : "grid-cols-5 2xl:grid-cols-4";

  return (
    <>
      <div
        className={`grid ${gridClasses}  gap-[17px] bg-white object-cover mt-5`}
        ref={containerRef}
      >
        {videos.length === 0 && loading
          ? Array.from({ length: 15 }).map((_, index) => (
              <VideoThumbnailSkeleton key={index} />
            ))
          : videos.map((item, index) => (
              <VideoThumbnailFeed
                key={typeof item.id === "object" ? item.id.videoId : item.id}
                item={item}
                showThumbnail={showThumbnail}
                handleWatchVideo={handleWatchVideo}
                handleAddToPlaylist={handleAddToPlaylist}
                handleTooltip={handleTooltip}
                hideTooltip={hideTooltip}
                tooltipVisible={tooltipVisible}
                index={index}
                shortenNumber={shortenNumber}
                formatDate={formatDate}
                selectedVideo={selectedVideo}
                setSelectedVideo={setSelectedVideo}
                showButton={showButton}
                setShowButton={setShowButton}
                iconRef={iconRef}
                buttonRef={buttonRef}
                buttonPosition={buttonPosition}
                setButtonPosition={setButtonPosition}
              />
            ))}
      </div>
      {loading && <LoadingAnimation />} {/* Show loading animation while loading */}
      <div ref={loaderRef} />
      {showPopup && (
        <AddToPlaylistPopup video={selectedVideo} closePopup={handleClosePopup} />
      )}
    </>
  );
};

const mapDispatchToProps = {
  addVideoToPlaylist,
  addWatchedVideo,
};

export default connect(null, mapDispatchToProps)(VideoContainer);
