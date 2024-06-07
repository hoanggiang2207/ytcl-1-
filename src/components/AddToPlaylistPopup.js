import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addPlaylist, addVideoToPlaylist } from '../utils/action';

const AddToPlaylistPopup = ({ video, playlists, addPlaylist, addVideoToPlaylist, closePopup }) => {
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);

  const handleCheckboxChange = (playlist) => {
    addVideoToPlaylist(playlist, video);
    closePopup();
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim() !== '') {
      addPlaylist(newPlaylistName);
      addVideoToPlaylist(newPlaylistName, video);
      setNewPlaylistName('');
      closePopup();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center"
      onClick={closePopup}
    >
      <div
        className="bg-white p-4 rounded shadow-lg w-60"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-base font-bold mb-4">Save video to...</h2>
        <div className="space-y-2">
          {Object.keys(playlists).map((playlist) => (
            <div key={playlist} className="flex items-center">
              <input
                type="checkbox"
                id={playlist}
                className="mr-2"
                onChange={() => handleCheckboxChange(playlist)}
              />
              <label htmlFor={playlist} className="flex-1">{playlist}</label>
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowCreatePlaylist(true)}
          className="bg-black text-white px-4 py-2 rounded w-full mt-4"
        >
          Create New Playlist
        </button>
        {showCreatePlaylist && (
          <div className="mt-4">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="border rounded p-2 mb-4 w-full"
              placeholder="Enter playlist title..."
            />
            <button
              onClick={handleCreatePlaylist}
              className="bg-green-600 text-white px-4 py-2 rounded w-full"
            >
              Create
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  playlists: state.playlistsReducer.playlists,
});

const mapDispatchToProps = {
  addPlaylist,
  addVideoToPlaylist,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddToPlaylistPopup);
