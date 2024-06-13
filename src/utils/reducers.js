// reducers.js
import { combineReducers } from 'redux';
import { 
  ADD_WATCHED_VIDEO, 
  DELETE_VIDEO_FROM_HISTORY, 
  ADD_PLAYLIST, 
  REMOVE_PLAYLIST, 
  ADD_VIDEO_TO_PLAYLIST, 
  REMOVE_VIDEO_FROM_PLAYLIST,
  DELETE_ALL_HISTORY, 
} from '../utils/action';
import appReducer from '../utils/appSlice';

const initialState = {
  playlists: {}, 
  watchedVideos: [],
};

const playlistsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PLAYLIST:
      return {
        ...state,
        playlists: {
          ...state.playlists,
          [action.payload]: []
        }
      };

    case REMOVE_PLAYLIST: 
      const updatedPlaylists = { ...state.playlists };
      delete updatedPlaylists[action.payload];
      return {
        ...state,
        playlists: updatedPlaylists,
      };

    case ADD_VIDEO_TO_PLAYLIST:
      return {
        ...state,
        playlists: {
          ...state.playlists,
          [action.payload.playlistName]: [
            ...(state.playlists[action.payload.playlistName] || []),
            action.payload.video
          ]
        }
      };

    case REMOVE_VIDEO_FROM_PLAYLIST:
      return {
        ...state,
        playlists: {
          ...state.playlists,
          [action.payload.playlistName]: state.playlists[action.payload.playlistName].filter(
            video => video.id !== action.payload.video.id
          )
        }
      };

    case ADD_WATCHED_VIDEO:
      return {
        ...state,
        watchedVideos: [...state.watchedVideos, action.payload.video]
      };

    case DELETE_VIDEO_FROM_HISTORY:
      return {
        ...state,
        watchedVideos: state.watchedVideos.filter(
          (video) => video.id !== action.payload
        ),
      };
        
      case DELETE_ALL_HISTORY:
      return {
        ...state,
        watchedVideos: [],
      };
    
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  playlistsReducer,
  app: appReducer,
});

export default rootReducer;
