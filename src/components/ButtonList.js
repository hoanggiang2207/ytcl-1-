import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ButtonList = ({ onCategorySelect }) => {
  const buttonList = ["All", "Gaming", "Music", "News", "Mixes", "Adventure Time", "Manga", "Live", "Computer Programming", "Playlists", "Rhythm&Blues"];
  const buttonsPerPage = 9; // Number of buttons to display per page
  const [currentPage, setCurrentPage] = useState(0);

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, Math.floor(buttonList.length / buttonsPerPage)));
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
  };

  const startIndex = currentPage * buttonsPerPage;
  const endIndex = Math.min(startIndex + buttonsPerPage, buttonList.length);

  return (
    <div className='my-1 relative flex flex-wrap items-center'>
      <button
        className={`bg-gray-200 px-4 py-1 rounded-lg mr-2 ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={handlePrevPage}
        disabled={currentPage === 0}
      >
        <FaChevronLeft />
      </button>
      <div className="flex flex-wrap">
        {buttonList.slice(startIndex, endIndex).map((buttonName, index) => (
          <button
            key={startIndex + index}
            className='bg-gray-200 font-medium mx-2 px-4 py-1 cursor-pointer rounded-lg'
            onClick={() => onCategorySelect(buttonName)}
          >
            {buttonName}
          </button>
        ))}
      </div>
      <button
        className={`bg-gray-200 px-4 py-1 rounded-lg ml-2 ${endIndex === buttonList.length ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={handleNextPage}
        disabled={endIndex === buttonList.length}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default ButtonList;
