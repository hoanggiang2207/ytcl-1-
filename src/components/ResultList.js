import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { BASE_URL, API_KEY } from "../constants/yt-API";
import VideoThumbnails from "./VideoThumbnails";
import FilterBar from "./FilterBar";

const ResultList = () => {
  const { query } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({
    uploadDate: '',
    type: 'video',
    duration: '',
    order: 'relevance',
  });

  useEffect(() => {
    const fetchSearchResults = async () => {
      const uploadDateFilter = {
        lastHour: 'hour',
        today: 'day',
        thisWeek: 'week',
        thisMonth: 'month',
        thisYear: 'year',
      }[filters.uploadDate] || '';

      const durationFilter = {
        short: 'short',
        medium: 'medium',
        long: 'long',
      }[filters.duration] || '';

      const params = new URLSearchParams({
        part: 'snippet',
        maxResults: 10,
        q: query,
        type: filters.type,
        order: filters.order,
        key: API_KEY,
      });

      if (uploadDateFilter) {
        params.append('publishedAfter', new Date(new Date() - { 
          hour: 3600000,
          day: 86400000,
          week: 604800000,
          month: 2592000000,
          year: 31536000000
        }[uploadDateFilter]).toISOString());
      }

      if (durationFilter) {
        params.append('videoDuration', durationFilter);
      }

      try {
        const response = await fetch(`${BASE_URL}/search?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }
        const data = await response.json();
        if (filters.type === 'playlist') {
          const playlistDetails = await Promise.all(
            data.items.map(async item => {
              const playlistResponse = await fetch(`${BASE_URL}/playlists?part=contentDetails&id=${item.id.playlistId}&key=${API_KEY}`);
              const playlistData = await playlistResponse.json();
              const itemWithDetails = {
                ...item,
                videoCount: playlistData.items[0]?.contentDetails.itemCount || 0,
              };
              return itemWithDetails;
            })
          );
          setSearchResults(playlistDetails);
        } else {
          setSearchResults(data.items);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [query, filters]);

  return (
    <div>
      <FilterBar filters={filters} setFilters={setFilters} />

      <div className=" ml-3 mt-4 ">
        {searchResults.map(item => {
          switch (filters.type) {
            case 'video':
              return (
                <Link
                  to={`/watch?v=${item.id.videoId}`}
                  key={item.id.videoId}
                  className="m-1 no-underline"
                >
                  <div className="w-full max-w-1xl bg-white rounded-lg overflow-hidden">
                    <VideoThumbnails item={item} />
                  </div>
                </Link>
              );
            case 'channel':
              return (
                <div key={item.id.channelId} className="w-full max-w-xs bg-white shadow-md rounded-lg overflow-hidden p-4 grid grid-cols-1 gap-3 mb-4">
                  <div className="flex items-center">
                    <img
                      src={item.snippet.thumbnails.default.url}
                      alt={item.snippet.title}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <div>
                      <div className="text-lg font-bold">{item.snippet.title}</div>
                      <button className="mt-2 bg-red-600 text-white py-1 px-2 rounded">
                        Subscribe
                      </button>
                    </div>
                  </div>
                </div>
              );
            case 'playlist':
              return (
                <Link
                  to={`/playlist?list=${item.id.playlistId}`}
                  key={item.id.playlistId}
                  className="m-1 no-underline"
                >
                  <div className="w-full max-w-xs bg-white shadow-md rounded-lg overflow-hidden relative">
                    <img
                      src={item.snippet.thumbnails.default.url}
                      alt={item.snippet.title}
                      className="w-full"
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {item.videoCount} videos
                    </div>
                    <div className="p-4">
                      <div className="mt-2 text-lg font-bold">{item.snippet.title}</div>
                      <div className="text-sm text-gray-600">{item.snippet.channelTitle}</div>
                    </div>
                  </div>
                </Link>
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

export default ResultList;
