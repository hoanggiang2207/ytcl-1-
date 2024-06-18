import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Body from "./components/Body";
import Navbar from "./components/Navbar";
import Watch from "./components/Watch";
import Feed from "./components/Feed";
import ResultList from "./components/ResultList";
import WatchPlaylist from "./components/WatchPlaylist";
import HistoryView from "./components/HistoryView";
import Playlist from "./components/MyPlaylist";
import ChannelDetail from "./components/ChannelDetail";
import Drawer from "./components/Drawer"; // Ensure the correct path
import SidebarHandler from "./components/SidebarHandler"; // Ensure the correct path
import PlaylistPage from "./components/PlaylistPage";
import LiveVideo from "./components/LiveVideo";
import NavbarWatch from "./components/NavbarWatch";

function App() {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const location = useLocation();

  const handleOverlayClick = () => {
    setDrawerVisible(false);
  };

  const toggleDrawer = () => {
    setDrawerVisible((prev) => !prev);
  };

  useEffect(() => {
    setDrawerVisible(false); // Hide drawer on route change
  }, [location]);

  const isWatchRoute = location.pathname === "/watch";

  return (
    <div className="relative">
      {isWatchRoute && <SidebarHandler setDrawerVisible={setDrawerVisible} />}
      {isWatchRoute && isDrawerVisible && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={handleOverlayClick}></div>
      )}
      {isWatchRoute && <Drawer isDrawerVisible={isDrawerVisible} toggleDrawer={toggleDrawer} />}
      <div className="flex flex-col h-screen">
        {!isWatchRoute && <Navbar />}
        {isWatchRoute && <NavbarWatch isDrawerVisible={isDrawerVisible} toggleDrawer={toggleDrawer} />}
        <div className="flex-1">
          <Routes>
            <Route path="/watch" element={<Watch />} />
            <Route path="/live" element={<LiveVideo />} />
            <Route path="/" element={<Body />}>
              <Route index element={<Feed />} />
              <Route path="/playlist" element={<WatchPlaylist />} />
              <Route path="/result/:query" element={<ResultList />} />
              <Route path="/history" element={<HistoryView />} />
              <Route path="/myplaylist" element={<Playlist />} />
              <Route path="/playlist/:playlistName" element={<PlaylistPage />} />
              <Route path="/channel" element={<ChannelDetail />} />
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}

function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWithRouter;
