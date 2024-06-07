import React from "react";
import { Link } from "react-router-dom";

const PlaylistVideoThumbnail = ({ video }) => {
  const { snippet } = video;

  return (
    <Link to={`/playlist?v=${snippet.resourceId.videoId}&list=${snippet.playlistId}`} className="no-underline">
      <div className="w-full max-w-xs bg-white shadow-md rounded-lg overflow-hidden relative">
        <img
          src={snippet.thumbnails.default.url}
          alt={snippet.title}
          className="w-full"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {snippet.position} of {video.videoCount}
        </div>
        <div className="p-4">
          <div className="mt-2 text-lg font-bold">{snippet.title}</div>
          <div className="text-sm text-gray-600">{snippet.channelTitle}</div>
        </div>
      </div>
    </Link>
  );
};

export default PlaylistVideoThumbnail;
