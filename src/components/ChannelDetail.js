import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API_KEY from "../constants/yt-API";
import Avatar from "react-avatar";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";

const ChannelDetail = () => {
  const [channelName, setChannelName] = useState("");
  const [channelCustomUrl, setChannelCustomUrl] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [avatar, setAvatar] = useState("");
  const [channelDescription, setChannelDescription] = useState("");
  const [subscriberCount, setSubscriberCount] = useState(null);
  const [videos, setVideos] = useState([]);
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [videoCount, setVideoCount] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 12;

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const channelId = query.get("channelId");
  const formatSubscriberCount = (count) => {
    return count.toLocaleString();
  };
  useEffect(() => {
    const fetchChannelDetails = async () => {
      try {
        const channelResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet,brandingSettings,statistics&id=${channelId}&key=${API_KEY}`
        );
        const channelData = await channelResponse.json();
        if (channelData.items && channelData.items.length > 0) {
          const channelDetails = channelData.items[0];
          setChannelName(channelDetails.snippet.title);
          setChannelCustomUrl(channelDetails.snippet.customUrl || "N/A");
          setChannelDescription(channelDetails.snippet.description);
          setAvatar(channelDetails.snippet.thumbnails.high.url);
          setSubscriberCount(channelDetails.statistics.subscriberCount);
          setVideoCount(channelDetails.statistics.videoCount);
          if (
            channelDetails.brandingSettings &&
            channelDetails.brandingSettings.image
          ) {
            setBannerImageUrl(
              channelDetails.brandingSettings.image.bannerExternalUrl
            );
          } else {
            setBannerImageUrl("");
          }
        }
      } catch (error) {
        console.error("Error fetching channel details:", error);
      }
    };

    const fetchVideos = async () => {
      try {
        const videoResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=50&type=video&order=date&key=${API_KEY}`
        );
        const videoData = await videoResponse.json();
        if (videoData.items && videoData.items.length > 0) {
          setVideos(videoData.items);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    const fetchFeaturedVideo = async () => {
      try {
        const featuredResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=1&type=video&order=viewCount&key=${API_KEY}`
        );
        const featuredData = await featuredResponse.json();
        if (featuredData.items && featuredData.items.length > 0) {
          const videoId = featuredData.items[0].id.videoId;
          const videoDetailsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`
          );
          const videoDetailsData = await videoDetailsResponse.json();
          if (videoDetailsData.items && videoDetailsData.items.length > 0) {
            setFeaturedVideo(videoDetailsData.items[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching featured video:", error);
      }
    };

    if (channelId) {
      fetchChannelDetails();
      fetchVideos();
      fetchFeaturedVideo();
    }
  }, [channelId]);

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);

  if (!channelId) {
    return <div>Channel ID not found</div>;
  }

  return (
    <div className="w-[1070px] mt-0 mx-auto mb-4">
      {/* Row 1: Banner */}
      {bannerImageUrl && (
        <div className="row">
          <div className="w-[1070px] h-[173px] rounded-[14px] mb-4 overflow-hidden flex-shrink-0">
            <img
              src={bannerImageUrl}
              alt="Channel Banner"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Row 2: Channel details */}
      <div className="row  rounded-lg mb-4">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 mr-[17px]">
            <Avatar src={avatar} alt="Channel Avatar" size={150} round />
          </div>
          <div>
            <h1 className="font-bold text-[36px]">{channelName}</h1>
            <p className="text-[#606060] font-[550] text-[14px]">
              {channelCustomUrl} • {formatSubscriberCount(parseInt(subscriberCount))} subscribers • {videoCount}{" "}
              videos
            </p>
            <p className="text-[#606060] text-[14px] line-clamp-1">
              {channelDescription}
            </p>

            <button className="bg-[#F2F2F2] font-medium px-[50px] py-[8px] rounded-full hover:bg-black hover:text-white">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="row mb-4">
        <nav className="flex justify-between items-center text-gray-500 font-semibold text-base">
          <div className="flex space-x-4 items-center">
            <span className="hover:text-black cursor-pointer font-semibold">
              Home
            </span>
            <span className="hover:text-black cursor-pointer">Videos</span>
            <span className="hover:text-black cursor-pointer">Playlists</span>
            <CiSearch className="hover:text-black cursor-pointer" />
          </div>
        </nav>
        <hr className="border-t border-gray-300 mt-2" />
      </div>

      {/* Row 3: Featured video */}
      {featuredVideo && (
        <div className="row mb-4">
          <h2 className="text-xl font-bold mb-2">Featured Video</h2>
          <Link to={`/watch?v=${featuredVideo.id}`}>
            <div className="flex rounded-lg">
              <img
                src={featuredVideo.snippet.thumbnails.medium.url}
                alt={featuredVideo.snippet.title}
                className="w-[245px] h-[140px] rounded-lg"
              />
              <div className="ml-[18px]">
                <p className="text-black text-[18px]">
                  {featuredVideo.snippet.title}
                </p>
                <p className="text-gray-500 text-sm">
                  {parseInt(
                    featuredVideo.statistics.viewCount
                  ).toLocaleString()}{" "}
                  views •{" "}
                  {new Date(
                    featuredVideo.snippet.publishedAt
                  ).toLocaleDateString()}
                </p>
                <p className="text-gray-700 text-sm mt-2 line-clamp-2">
                  {featuredVideo.snippet.description}
                </p>
              </div>
            </div>
          </Link>
        </div>
      )}


      {/* Row 4: Latest videos */}
      <div className="row relative">
  <h2 className="text-xl font-bold mb-2">Latest Videos</h2>
  <div className="flex items-start gap-1 overflow-x-auto" style={{ overflowX: "hidden", position: "relative" }}>
    {currentVideos.map((video, index) => (
      <Link
      key={index}
      to={`/watch?v=${video.id.videoId}`}
      className="flex-shrink-0 w-[210px] relative"
    >
      <img
        src={video.snippet.thumbnails.medium.url}
        alt={video.snippet.title}
        className="w-full h-[120px] mb-2 rounded-lg"
      />
      <p className="text-black font-medium line-clamp-2">{video.snippet.title}</p>
    </Link>
    ))}
    {currentPage > 1 && (
      <div className="absolute top-0 bottom-0 flex items-center">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded-full shadow-md"
        >
          {"<"}
        </button>
      </div>
    )}
    {currentVideos.length >= videosPerPage && (
      <div className="absolute top-0 bottom-0 flex items-center right-0">
        <button
          onClick={nextPage}
          disabled={currentVideos.length < videosPerPage}
          className="px-4 py-2 bg-gray-300 rounded-full shadow-md"
        >
          {">"}
        </button>
      </div>
    )}
  </div>
</div>



    </div>
  );
};

export default ChannelDetail;
