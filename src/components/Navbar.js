import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMagnifyingGlass, faVideo } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import Avatar from "react-avatar";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../utils/appSlice";
import ListBox from "./ListBox";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [listBoxVisible, setListBoxVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [formClicked, setFormClicked] = useState(false);
  const dispatch = useDispatch();
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setListBoxVisible(false);
        setFormClicked(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [formRef]);

  const toggleHandler = () => {
    dispatch(toggleSidebar());
  };

  const inputClickHandler = () => {
    setListBoxVisible(true);
    setFormClicked(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const inputChangeHandler = (event) => {
    setInputValue(event.target.value);
    setListBoxVisible(true);
    setFormClicked(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSearch();
  };

  const handleSearch = () => {
    if (inputValue.trim() !== "") {
      navigate(`/result/${inputValue}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setListBoxVisible(false);
    setFormClicked(false);
    navigate(`/result/${suggestion}`);
  };

  return (
    <div className="flex fixed top-0 justify-center items-center w-full z-10 bg-white h-[55px]">
      <div className="flex w-[96%] h-full justify-between items-center">
        <div className="flex items-center">
          <FontAwesomeIcon
            className="cursor-pointer select-none ml-[0.13rem]"
            onClick={toggleHandler}
            icon={faBars}
            style={{ fontSize: "24px" }}
          />
          <Link to="/">
            <img
              className="ml-2 px-4 select-none"
              width={"120px"}
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/YouTube_Logo_2017.svg/768px-YouTube_Logo_2017.svg.png"
              alt="logo"
            />
          </Link>
        </div>

        <div className="relative flex w-[40%] items-center" ref={formRef}>
          <form onSubmit={handleSubmit} className="flex w-full items-center">
            <div className="flex-grow px-4 py-2 border border-r-0 rounded-l-full">
              <input
                type="text"
                placeholder="Find Your Video"
                className="w-full outline-none select-none"
                ref={inputRef}
                onClick={inputClickHandler}
                onChange={inputChangeHandler}
                value={inputValue}
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 border border-grey-400 text-black rounded-r-full w-[65px]"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </form>

          {listBoxVisible && (
            <ListBox
              inputValue={inputValue}
              formClicked={formClicked}
              onSuggestionClick={handleSuggestionClick}
            />
          )}
        </div>

        <div className="flex w-[10%] justify-between items-center">
          <FontAwesomeIcon
            icon={faBell}
            style={{ fontSize: "24px" }}
            className="cursor-pointer"
          />
          <FontAwesomeIcon
            icon={faVideo}
            style={{ fontSize: "24px" }}
            className="cursor-pointer"
          />
          <Avatar
            src="https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?cs=srgb&dl=pexels-andrewpersonaltraining-697509.jpg&fm=jpg"
            size={35}
            round={true}
            className="cursor-pointer select-none"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
