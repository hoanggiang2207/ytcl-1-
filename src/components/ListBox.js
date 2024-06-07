import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { FaHistory } from "react-icons/fa";
import { BASE_URL, API_KEY } from "../constants/yt-API";

// Debounce function to delay the execution of the function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const ListBox = ({ inputValue, formClicked, onSuggestionClick }) => {
  const [searches, setSearches] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const listRef = useRef(null);

  const fetchTopSearches = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/search?part=snippet&maxResults=3&q=trend&regionCode=JP&type=video&order=rating&key=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch top searches");
      }
      const data = await response.json();
      setSearches(data.items);
    } catch (error) {
      console.error("Error fetching top searches:", error);
    }
  };

  const fetchSearchSuggestions = async (query) => {
    try {
      const response = await fetch(
        `${BASE_URL}/search?part=snippet&maxResults=10&q=${query}&type=video&order=relevance&key=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch search suggestions");
      }
      const data = await response.json();
      setSearches(data.items);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
    }
  };

  // Create a debounced version of the fetchSearchSuggestions function
  const debouncedFetchSearchSuggestions = useCallback(
    debounce((query) => fetchSearchSuggestions(query), 500),
    []
  );

  useEffect(() => {
    if (formClicked && !inputValue) {
      fetchTopSearches();
    } else if (inputValue) {
      debouncedFetchSearchSuggestions(inputValue);
    }
  }, [inputValue, formClicked, debouncedFetchSearchSuggestions]);

  // useMemo to filter items
  const filteredItems = useMemo(() => {
    return searches.filter(search => {
      return search.snippet.title.toLowerCase().includes(inputValue.toLowerCase());
    });
  }, [searches, inputValue]);

  const handleKeyDown = (event) => {
    if (!listRef.current) return;

    const listItems = listRef.current.querySelectorAll("li");
    if (listItems.length === 0) return;

    if (event.key === "ArrowDown") {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % listItems.length);
      event.preventDefault();
    } else if (event.key === "ArrowUp") {
      setSelectedIndex((prevIndex) =>
        prevIndex === 0 ? listItems.length - 1 : prevIndex - 1
      );
      event.preventDefault();
    } else if (event.key === "Enter" && selectedIndex >= 0) {
      onSuggestionClick(filteredItems[selectedIndex].snippet.title);
      setSelectedIndex(-1);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, filteredItems, onSuggestionClick]);

  return (
    <div className={`absolute top-full left-0 w-full bg-white border border-gray-300 shadow-lg rounded-lg mt-1 ${!formClicked ? "hidden" : ""}`}>
      <ul ref={listRef}>
        {filteredItems.length > 0 ? (
          filteredItems.map((search, index) => (
            <li
              key={index}
              className={`flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer ${selectedIndex === index ? "bg-gray-200" : ""}`}
              onClick={() => onSuggestionClick(search.snippet.title)}
            >
              <FaHistory className="flex-shrink-0 w-4 h-4 mr-4" />
              <div className="flex-1 line-clamp-1 text-sm font-semibold">{search.snippet.title}</div>
            </li>
          ))
        ) : (
          <li className="flex items-center px-4 py-2">
            <div className="flex-1 text-sm font-semibold">Wait for loading...</div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default ListBox;
