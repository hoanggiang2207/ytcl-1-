export const API_KEY = "AIzaSyBXcusSZHOzrcJ-BJmEFfvyHL9b6PRg33s";
export const YOUTUBE_VIDEO_API = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&key=${API_KEY}`;
export const YOUTUBE_CHANNEL_API = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&key=${API_KEY}`;
export const BASE_URL = "https://www.googleapis.com/youtube/v3";

export default API_KEY;
