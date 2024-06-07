import React, { useState } from 'react';
import { RiSoundModuleLine } from 'react-icons/ri';

const FilterBar = ({ filters, setFilters }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="fixed top-11 right-0 mt-6 mr-4 z-1">
      <button onClick={togglePopup} className="border rounded p-2 mx-2 flex items-center">
        <RiSoundModuleLine className="mr-2" /> Filter
      </button>
      {showPopup && (
        <div className="absolute bg-white border border-black shadow-lg rounded-md p-4 top-10 right-0 z-10 flex">
          <select name="uploadDate" onChange={handleFilterChange} className="border rounded p-2 mx-2 flex-grow">
            <option value="">Upload Date</option>
            <option value="lastHour">Last hour</option>
            <option value="today">Today</option>
            <option value="thisWeek">This week</option>
            <option value="thisMonth">This month</option>
            <option value="thisYear">This year</option>
          </select>
          <select name="type" onChange={handleFilterChange} className="border rounded p-2 mx-2 flex-grow">
            <option value="video">Video</option>
            <option value="channel">Channel</option>
            <option value="playlist">Playlist</option>
          </select>
          <select name="duration" onChange={handleFilterChange} className="border rounded p-2 mx-2 flex-grow">
            <option value="">Duration</option>
            <option value="short">Under 4 minutes</option>
            <option value="medium">4 - 20 minutes</option>
            <option value="long">Over 20 minutes</option>
          </select>
          <select name="order" onChange={handleFilterChange} className="border rounded p-2 mx-2 flex-grow">
            <option value="relevance">Relevance</option>
            <option value="date">Upload date</option>
            <option value="viewCount">View count</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
