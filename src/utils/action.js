// Define action types

export const ADD_PLAYLIST = 'ADD_PLAYLIST';
export const REMOVE_PLAYLIST = 'REMOVE_PLAYLIST';
export const ADD_VIDEO_TO_PLAYLIST = 'ADD_VIDEO_TO_PLAYLIST';
export const REMOVE_VIDEO_FROM_PLAYLIST = 'REMOVE_VIDEO_FROM_PLAYLIST';

export const ADD_WATCHED_VIDEO = 'ADD_WATCHED_VIDEO';
export const DELETE_VIDEO_FROM_HISTORY = 'DELETE_VIDEO_FROM_HISTORY';
export const DELETE_ALL_HISTORY = 'DELETE_ALL_HISTORY';


// Action to add a playlist
export const addPlaylist = (playlistName) => {
  return {
    type: ADD_PLAYLIST,
    payload: playlistName,
  };
};

// Action to remove a playlist
export const removePlaylist = (playlistName) => {
  return {
    type: REMOVE_PLAYLIST,
    payload: playlistName,
  };
};

// Action to add a video to a specific playlist
export const addVideoToPlaylist = (playlistName, video) => {
  return {
    type: ADD_VIDEO_TO_PLAYLIST,
    payload: { playlistName, video },
  };
};

// Action to remove a video from a specific playlist
export const removeVideoFromPlaylist = (playlistName, video) => {
  return {
    type: REMOVE_VIDEO_FROM_PLAYLIST,
    payload: { playlistName, video },
  };
};

// Action to save History
export const addWatchedVideo = (video) => {
  return {
    type: ADD_WATCHED_VIDEO,
    payload: {video},
  
  };
};

export const deleteVideoFromHistory = (videoId) => ({
  type: DELETE_VIDEO_FROM_HISTORY,
  payload: videoId,
});
export const deleteAllHistory = () => ({
  type: DELETE_ALL_HISTORY,
});

