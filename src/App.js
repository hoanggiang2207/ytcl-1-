import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import Navbar from "./components/Navbar";
import Watch from "./components/Watch";
import Feed from "./components/Feed";
import ResultList from "./components/ResultList";
import WatchPlaylist from "./components/WatchPlaylist";
import HistoryView from "./components/HistoryView";
import Playlist from "./components/MyPlaylist";
import ChannelDetail from "./components/ChannelDetail";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
        <Route path="/watch" element={<Watch />} />
          <Route path="/" element={<Body />}>
            <Route index element={<Feed />} />
            
            <Route path="/playlist" element={<WatchPlaylist/>} />
            <Route path="/result/:query" element={<ResultList />} />
            <Route path="/history" element={<HistoryView />} />
            <Route path="/myplaylist" element={<Playlist />} />
            <Route path="/channel" element={<ChannelDetail />}/>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
